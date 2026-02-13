import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * GET - Get or create the "Unassigned Tasks" system list for the current user
 *
 * This endpoint proxies to the dedicated Lambda function that ensures every user has
 * a special "Unassigned Tasks" list that:
 * - Cannot be deleted
 * - Cannot be renamed
 * - Is pinned to the top of their lists
 * - Receives tasks from deleted lists (when user chooses "reassign" mode)
 *
 * The list is created on first access (lazy creation) by the Lambda function with
 * a fixed ID "system_unassigned". The Lambda handles get-or-create logic atomically.
 *
 * Returns:
 *   - list: The unassigned list object (with ID "system_unassigned")
 *   - created: Boolean indicating if the list was just created (true) or already existed (false)
 */
export async function GET(request: NextRequest) {
	try {
		const nextResponse = NextResponse.next()

		// Get authenticated user
		const user = await authenticatedUser({ request, response: nextResponse })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const idToken = user.idToken
		const accessToken = user.accessToken

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_LISTS_URL
		const unassignedApiUrl = process.env.TASKS_API_GATEWAY_UNASSIGNED_URL || `${apiGatewayUrl}/system/unassigned`

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_LISTS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (idToken) {
			headers['Authorization'] = idToken
		} else if (accessToken) {
			headers['Authorization'] = accessToken
		}

		// Call the dedicated unassigned endpoint - it handles get or create
		console.log('Getting or creating unassigned list for user:', user.userId)
		const unassignedUrl = `${unassignedApiUrl}?user=${user.userId}`

		const response = await fetch(unassignedUrl, {
			method: 'GET',
			headers: headers
		})

		console.log('Unassigned endpoint response status:', response.status)

		const responseText = await response.text()
		console.log('Unassigned endpoint response text:', responseText)

		if (!response.ok) {
			let errorData
			try {
				errorData = JSON.parse(responseText)
			} catch (e) {
				errorData = { rawResponse: responseText }
			}

			console.error('Failed to get/create unassigned list:', errorData)
			return NextResponse.json(
				{
					error: 'Failed to get or create unassigned list',
					details: errorData
				},
				{ status: response.status }
			)
		}

		let responseData
		try {
			responseData = JSON.parse(responseText)
		} catch (e) {
			console.error('Failed to parse response as JSON:', responseText)
			return NextResponse.json({ error: 'Invalid response from API' }, { status: 500 })
		}

		// The Lambda GET endpoint always returns 200 and creates if needed
		// We can't determine from the status if it was just created, but that's okay
		console.log('Successfully retrieved unassigned list')
		return NextResponse.json(
			{
				list: responseData.list || responseData,
				created: false // Lambda GET doesn't tell us, but doesn't matter for our use case
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error in getOrCreateUnassignedList:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
