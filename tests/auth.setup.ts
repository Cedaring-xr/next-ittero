import { test as setup } from '@playwright/test'
import {
	CognitoIdentityProviderClient,
	InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'

const authFile = 'tests/.auth/user.json'

const test_email = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
const test_password = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string
const userPoolClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string
const region = process.env.NEXT_PUBLIC_USER_POOL_ID?.split('_')[0] || 'us-east-1'

setup('authenticate', async ({ page }) => {
	// Authenticate via Cognito API directly
	const client = new CognitoIdentityProviderClient({ region })

	const command = new InitiateAuthCommand({
		AuthFlow: 'USER_PASSWORD_AUTH',
		ClientId: userPoolClientId,
		AuthParameters: {
			USERNAME: test_email,
			PASSWORD: test_password
		}
	})

	const response = await client.send(command)

	if (!response.AuthenticationResult) {
		throw new Error('Authentication failed - no tokens returned')
	}

	const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult

	// Extract username from the access token payload
	const accessTokenPayload = JSON.parse(
		Buffer.from(AccessToken!.split('.')[1], 'base64').toString()
	)
	const username = accessTokenPayload.username || accessTokenPayload.sub

	// Build the storage key prefix used by Amplify
	const keyPrefix = `CognitoIdentityServiceProvider.${userPoolClientId}`

	// Navigate to the app first to set storage on the correct origin
	await page.goto('http://localhost:3000')

	// Set localStorage items that Amplify expects
	await page.evaluate(
		({ keyPrefix, username, idToken, accessToken, refreshToken }) => {
			localStorage.setItem(`${keyPrefix}.LastAuthUser`, username)
			localStorage.setItem(`${keyPrefix}.${username}.idToken`, idToken)
			localStorage.setItem(`${keyPrefix}.${username}.accessToken`, accessToken)
			localStorage.setItem(`${keyPrefix}.${username}.refreshToken`, refreshToken)
			localStorage.setItem(`${keyPrefix}.${username}.clockDrift`, '0')
		},
		{
			keyPrefix,
			username,
			idToken: IdToken!,
			accessToken: AccessToken!,
			refreshToken: RefreshToken!
		}
	)

	// Also set cookies for SSR authentication (Amplify adapter uses cookies)
	const cookieOptions = {
		domain: 'localhost',
		path: '/',
		httpOnly: false,
		secure: false,
		sameSite: 'Lax' as const
	}

	await page.context().addCookies([
		{
			name: `${keyPrefix}.LastAuthUser`,
			value: username,
			...cookieOptions
		},
		{
			name: `${keyPrefix}.${username}.idToken`,
			value: IdToken!,
			...cookieOptions
		},
		{
			name: `${keyPrefix}.${username}.accessToken`,
			value: AccessToken!,
			...cookieOptions
		},
		{
			name: `${keyPrefix}.${username}.refreshToken`,
			value: RefreshToken!,
			...cookieOptions
		},
		{
			name: `${keyPrefix}.${username}.clockDrift`,
			value: '0',
			...cookieOptions
		}
	])

	// Save authentication state (includes both cookies and localStorage)
	await page.context().storageState({ path: authFile })
})
