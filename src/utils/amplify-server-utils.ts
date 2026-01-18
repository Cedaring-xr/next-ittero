import { NextServer, createServerRunner } from '@aws-amplify/adapter-nextjs'
import { fetchAuthSession, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth/server'
import { cookies } from 'next/headers'
import type { ResourcesConfig } from 'aws-amplify'

// Type for authenticated user data
export interface AuthUser {
	userId: string
	username: string
	name?: string
	isAdmin: boolean
	idToken?: string
	accessToken?: string
}

// Server-side auth config - uses environment variables directly
const serverAuthConfig: ResourcesConfig['Auth'] = {
	Cognito: {
		userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
		userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID)
	}
}

export const { runWithAmplifyServerContext } = createServerRunner({
	config: {
		Auth: serverAuthConfig
	}
})

export async function authenticatedUser(context: NextServer.Context) {
	return await runWithAmplifyServerContext({
		nextServerContext: context,
		operation: async (contextSpec) => {
			try {
				const session = await fetchAuthSession(contextSpec)
				if (!session.tokens) {
					return
				}
				const user = {
					...(await getCurrentUser(contextSpec)),
					isAdmin: false,
					idToken: session.tokens.idToken?.toString(),
					accessToken: session.tokens.accessToken?.toString()
				}
				const groups = session.tokens.accessToken.payload['cognito:groups']
				// @ts-ignore ???
				user.isAdmin = Boolean(groups && groups.includes('Admins'))

				return user
			} catch (error) {
				console.log(error)
			}
		}
	})
}

/**
 * Get authenticated user for Server Components
 * Uses cookies() from next/headers instead of request/response context
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
	const cookieStore = await cookies()

	return await runWithAmplifyServerContext({
		nextServerContext: { cookies: () => cookieStore },
		operation: async (contextSpec) => {
			try {
				const session = await fetchAuthSession(contextSpec)
				if (!session.tokens) {
					return null
				}

				const currentUser = await getCurrentUser(contextSpec)
				const userAttributes = await fetchUserAttributes(contextSpec)
				const groups = session.tokens.accessToken.payload['cognito:groups']

				const user: AuthUser = {
					userId: currentUser.userId,
					username: currentUser.username,
					name: userAttributes.name,
					isAdmin: Boolean(groups && Array.isArray(groups) && groups.includes('Admins')),
					idToken: session.tokens.idToken?.toString(),
					accessToken: session.tokens.accessToken?.toString()
				}

				return user
			} catch (error) {
				console.log('getAuthenticatedUser error:', error)
				return null
			}
		}
	})
}
