import { NextServer, createServerRunner } from '@aws-amplify/adapter-nextjs'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server'
import type { ResourcesConfig } from 'aws-amplify'

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
