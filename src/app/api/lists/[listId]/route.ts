import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * GET - Fetch a specific list by ID
 * Params:
 *   - listId: string (from URL params)
 *
 * Returns a single list from AWS API Gateway (DynamoDB)
 */
export async function GET(request: NextRequest, { params }: { params: { listId: string } }) {
	try {
		const response = NextResponse.next()

		// Get authenticated user and session with tokens
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { listId } = params

		if (!listId) {
			return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
		}

		// Get Cognito tokens
		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('Fetching list:', listId, 'for User ID:', user.userId)

		// Get AWS API Gateway URL from environment variables
		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_LISTS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_LISTS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with list ID and user for security
		const url = `${apiGatewayUrl}/${listId}?user=${user.userId}`

		console.log('Fetching from AWS API Gateway:', url)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		// Add Authorization header - token without Bearer prefix for GET
		if (idToken) {
			headers['Authorization'] = idToken
			console.log('Including ID token (no Bearer prefix)')
		} else if (accessToken) {
			headers['Authorization'] = accessToken
			console.log('Including Access token (no Bearer prefix)')
		}

		// Send GET request to AWS API Gateway
		const apiResponse = await fetch(url, {
			method: 'GET',
			headers: headers
		})

		console.log('AWS Response Status:', apiResponse.status)

		// Get response text
		const responseText = await apiResponse.text()
		console.log('AWS Response Text:', responseText)

		if (!apiResponse.ok) {
			console.error('AWS API Gateway returned error status:', apiResponse.status)

			let errorData
			try {
				errorData = JSON.parse(responseText)
			} catch (e) {
				errorData = { rawResponse: responseText }
			}

			console.error('AWS API Gateway error data:', errorData)
			return NextResponse.json(
				{
					error: 'Failed to fetch list',
					details: errorData,
					status: apiResponse.status
				},
				{ status: apiResponse.status }
			)
		}

		// Parse successful response
		let responseData
		try {
			responseData = JSON.parse(responseText)
		} catch (e) {
			console.error('Failed to parse AWS response as JSON:', responseText)
			return NextResponse.json(
				{ error: 'Invalid response from AWS API Gateway', details: responseText },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{
				list: responseData.list || responseData
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching list:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
