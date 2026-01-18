import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * POST - Create a new todo item via AWS API Gateway
 * Body:
 *   - text: string (required) - Task title/name
 *   - listId: string (required) - ID of the list this item belongs to
 *   - priority: string (optional) - Priority level (urgent, high, medium, low, none)
 *   - dueDate: string (optional) - Due date for the task
 *   - completed: boolean (optional) - Completion status (defaults to false)
 *
 * Sends to AWS API Gateway with:
 *   - user: userId from authenticated user
 *   - text: task title
 *   - listId: parent list ID
 *   - priority: priority level
 *   - dueDate: due date
 *   - completed: boolean (defaults to false)
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 */
export async function POST(request: NextRequest) {
	try {
		const response = NextResponse.next()

		// Get authenticated user and session with tokens
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get Cognito tokens from the authenticated user session
		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('Creating todo item for User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)

		const body = await request.json()
		const { text, listId, priority, dueDate, completed } = body

		// Validation
		if (!text) {
			return NextResponse.json({ error: 'Task text is required' }, { status: 400 })
		}

		if (!listId) {
			return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
		}

		// Validate priority if provided
		const validPriorities = ['urgent', 'high', 'medium', 'low', 'none']
		if (priority && !validPriorities.includes(priority)) {
			return NextResponse.json(
				{ error: 'Priority must be one of: urgent, high, medium, low, none' },
				{ status: 400 }
			)
		}

		// Get current timestamp
		const currentDate = new Date().toISOString()

		// Prepare todo item data for AWS API Gateway
		const todoData = {
			user: user.userId,
			text: text.trim(),
			listId: listId,
			priority: priority || 'none',
			dueDate: dueDate || '',
			completed: completed || false,
			createdAt: currentDate,
			updatedAt: currentDate
		}

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_ITEMS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_ITEMS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Send POST request to AWS API Gateway
		console.log('Sending to AWS API Gateway:', apiGatewayUrl)
		console.log('Todo Item Data:', todoData)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		// Add Authorization header with ID token (no Bearer prefix for AWS API Gateway)
		if (idToken) {
			headers['Authorization'] = idToken
			console.log('Including ID token (no Bearer prefix)')
		} else if (accessToken) {
			headers['Authorization'] = accessToken
			console.log('Including Access token (no Bearer prefix)')
		} else {
			console.warn('No Cognito token found')
		}

		const apiResponse = await fetch(apiGatewayUrl, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(todoData)
		})

		console.log('AWS Response Status:', apiResponse.status)

		// Get response text first to see what we're dealing with
		const responseText = await apiResponse.text()
		console.log('AWS Response Text:', responseText)

		if (!apiResponse.ok) {
			console.error('AWS API Gateway returned error status:', apiResponse.status)

			// Try to parse as JSON, but if it fails, return the raw text
			let errorData
			try {
				errorData = JSON.parse(responseText)
			} catch (e) {
				errorData = { rawResponse: responseText }
			}

			console.error('AWS API Gateway error data:', errorData)
			return NextResponse.json(
				{
					error: 'Failed to create todo item',
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
				message: 'Todo item created successfully',
				data: responseData
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating todo item:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

/**
 * GET - Fetch todo items for the authenticated user
 * Query params:
 *   - listId: string (optional) - Filter by list ID
 *   - completed: boolean (optional) - Filter by completion status
 *
 * Returns array of todo items from AWS API Gateway
 */
export async function GET(request: NextRequest) {
	try {
		const response = NextResponse.next()

		// Get authenticated user and session with tokens
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get Cognito tokens
		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('Fetching todo items for User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)

		// Get AWS API Gateway URL from environment variables
		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_ITEMS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_ITEMS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with query parameters
		const queryParams = new URLSearchParams({
			user: user.userId
		})

		// Get query params from request
		const { searchParams } = new URL(request.url)

		// Optional filter by list ID
		const listIdFilter = searchParams.get('listId')
		if (listIdFilter) {
			queryParams.append('listId', listIdFilter)
		}

		// Optional filter by completed status
		const completedFilter = searchParams.get('completed')
		if (completedFilter !== null) {
			queryParams.append('completed', completedFilter)
		}

		const url = `${apiGatewayUrl}?${queryParams.toString()}`

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
					error: 'Failed to fetch todo items',
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
				items: responseData.items || responseData,
				count: responseData.count || (responseData.items ? responseData.items.length : 0)
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching todo items:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
