import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * POST - Create a new todo item via AWS API Gateway
 * Body:
 *   - text: string (required) - Task title/name
 *   - description: string (optional) - Detailed description
 *   - category: string (optional) - Category for organization
 *   - priority: string (optional) - Priority level (urgent, high, medium, low, none)
 *   - tags: array of strings (optional) - Tags for the item
 *
 * Sends to AWS API Gateway with:
 *   - user: userId from authenticated user
 *   - text: task title
 *   - description: task description
 *   - category: category string
 *   - priority: priority level
 *   - tags: array of tags
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
		const { text, description, category, priority, tags, completed } = body

		// Validation
		if (!text) {
			return NextResponse.json({ error: 'Task text is required' }, { status: 400 })
		}

		// Validate priority if provided
		const validPriorities = ['urgent', 'high', 'medium', 'low', 'none']
		if (priority && !validPriorities.includes(priority)) {
			return NextResponse.json(
				{ error: 'Priority must be one of: urgent, high, medium, low, none' },
				{ status: 400 }
			)
		}

		// Validate tags is an array if provided
		if (tags && !Array.isArray(tags)) {
			return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 })
		}

		// Get current timestamp
		const currentDate = new Date().toISOString()

		// Prepare todo item data for AWS API Gateway
		const todoData = {
			user: user.userId,
			text: text.trim(),
			description: description?.trim() || '',
			category: category?.trim() || '',
			priority: priority || 'none',
			tags: tags || [],
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

		// Add Authorization header with ID token (Bearer format for AWS API Gateway)
		if (idToken) {
			headers['Authorization'] = `Bearer ${idToken}`
			console.log('Including ID token in Authorization header')
		} else if (accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`
			console.log('Including Access token in Authorization header')
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
 * GET - Fetch all todo items for the authenticated user
 * Query params:
 *   - user: string (automatically added from auth)
 *   - completed: boolean (optional) - filter by completion status
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

		// Optional filter by completed status
		const { searchParams } = new URL(request.url)
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

		// Add Authorization header with Bearer prefix
		if (idToken) {
			headers['Authorization'] = `Bearer ${idToken}`
			console.log('Including ID token with Bearer prefix')
		} else if (accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`
			console.log('Including Access token with Bearer prefix')
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

/**
 * PATCH - Update a todo item (mark complete, edit fields, etc.)
 * Body:
 *   - id: string (required) - Todo item ID
 *   - text: string (optional) - Updated task title
 *   - description: string (optional) - Updated description
 *   - category: string (optional) - Updated category
 *   - priority: string (optional) - Updated priority
 *   - tags: array of strings (optional) - Updated tags
 *   - completed: boolean (optional) - Updated completion status
 *
 * Sends to AWS API Gateway to update the todo item
 */
export async function PATCH(request: NextRequest) {
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

		console.log('Updating todo item for User ID:', user.userId)

		const body = await request.json()
		const { id, text, description, category, priority, tags, completed } = body

		// Validation
		if (!id) {
			return NextResponse.json({ error: 'Todo item ID is required' }, { status: 400 })
		}

		// Validate priority if provided
		const validPriorities = ['urgent', 'high', 'medium', 'low', 'none']
		if (priority && !validPriorities.includes(priority)) {
			return NextResponse.json(
				{ error: 'Priority must be one of: urgent, high, medium, low, none' },
				{ status: 400 }
			)
		}

		// Validate tags is an array if provided
		if (tags && !Array.isArray(tags)) {
			return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 })
		}

		// Prepare update data (only include fields that were provided)
		const updateData: any = {
			id: id,
			user: user.userId,
			updatedAt: new Date().toISOString()
		}

		if (text !== undefined) updateData.text = text.trim()
		if (description !== undefined) updateData.description = description.trim()
		if (category !== undefined) updateData.category = category.trim()
		if (priority !== undefined) updateData.priority = priority
		if (tags !== undefined) updateData.tags = tags
		if (completed !== undefined) updateData.completed = completed

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_ITEMS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_ITEMS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		console.log('Updating todo item at AWS API Gateway:', apiGatewayUrl)
		console.log('Update Data:', updateData)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (idToken) {
			headers['Authorization'] = `Bearer ${idToken}`
		} else if (accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`
		}

		const apiResponse = await fetch(apiGatewayUrl, {
			method: 'PATCH',
			headers: headers,
			body: JSON.stringify(updateData)
		})

		console.log('AWS Response Status:', apiResponse.status)

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
					error: 'Failed to update todo item',
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
				message: 'Todo item updated successfully',
				data: responseData
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error updating todo item:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

/**
 * DELETE - Delete a todo item
 * Query params:
 *   - id: string (required) - Todo item ID to delete
 *
 * Sends DELETE request to AWS API Gateway
 */
export async function DELETE(request: NextRequest) {
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

		console.log('Deleting todo item for User ID:', user.userId)

		// Get todo item ID from query params
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')

		if (!id) {
			return NextResponse.json({ error: 'Todo item ID is required' }, { status: 400 })
		}

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_ITEMS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_ITEMS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with query parameters
		const url = `${apiGatewayUrl}?id=${id}&user=${user.userId}`

		console.log('Deleting from AWS API Gateway:', url)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (idToken) {
			headers['Authorization'] = `Bearer ${idToken}`
		} else if (accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`
		}

		const apiResponse = await fetch(url, {
			method: 'DELETE',
			headers: headers
		})

		console.log('AWS Response Status:', apiResponse.status)

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
					error: 'Failed to delete todo item',
					details: errorData,
					status: apiResponse.status
				},
				{ status: apiResponse.status }
			)
		}

		// Parse successful response
		let responseData
		try {
			responseData = responseText ? JSON.parse(responseText) : {}
		} catch (e) {
			console.error('Failed to parse AWS response as JSON:', responseText)
			return NextResponse.json(
				{ error: 'Invalid response from AWS API Gateway', details: responseText },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{
				message: 'Todo item deleted successfully',
				data: responseData
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error deleting todo item:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
