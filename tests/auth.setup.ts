import { test as setup, Page } from '@playwright/test'
import {
	CognitoIdentityProviderClient,
	InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'

const adminAuthFile = 'tests/.auth/admin.json'
const userAuthFile = 'tests/.auth/user.json'

const userPoolClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string
const region = process.env.NEXT_PUBLIC_USER_POOL_ID?.split('_')[0] || 'us-east-1'
const url = process.env.BASE_URL || 'localhost:3000'

async function authenticateUser(
	page: Page,
	email: string,
	password: string,
	authFile: string
) {
	const client = new CognitoIdentityProviderClient({ region })

	const command = new InitiateAuthCommand({
		AuthFlow: 'USER_PASSWORD_AUTH',
		ClientId: userPoolClientId,
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password
		}
	})

	const response = await client.send(command)

	if (!response.AuthenticationResult) {
		throw new Error(`Authentication failed for ${email} - no tokens returned`)
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
	await page.goto(url)

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
		domain: url,
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

	// Save authentication state
	await page.context().storageState({ path: authFile })
}

setup('authenticate as admin', async ({ page }) => {
	const email = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
	const password = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string
	await authenticateUser(page, email, password, adminAuthFile)
})

setup('authenticate as user', async ({ page }) => {
	const email = process.env.PLAYWRIGHT_TEST_USER_EMAIL as string
	const password = process.env.PLAYWRIGHT_TEST_USER_PASSWORD as string
	await authenticateUser(page, email, password, userAuthFile)
})
