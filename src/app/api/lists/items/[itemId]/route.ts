import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * PATCH - Update a todo item (mark complete, edit fields, etc.)
 * Params:
 *   - itemId: string (from URL params) - Todo item ID
 * Body:
 *   - text: string (optional) - Updated task title
 *   - priority: string (optional) - Updated priority
 *   - dueDate: string (optional) - Updated due date
 *   - completed: boolean (optional) - Updated completion status
 *
 * Sends to AWS API Gateway to update the todo item
 */
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { itemId: string } }
) {
	try {
		const response = NextResponse.next()

		// Get authenticated user and session with tokens
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { itemId } = params

		if (!itemId) {
			return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
		}

		// Get Cognito tokens
		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('Updating todo item:', itemId, 'for User ID:', user.userId)

		const body = await request.json()
		const { text, priority, dueDate, completed } = body

		// Validate priority if provided
		const validPriorities = ['urgent', 'high', 'medium', 'low', 'none']
		if (priority && !validPriorities.includes(priority)) {
			return NextResponse.json(
				{ error: 'Priority must be one of: urgent, high, medium, low, none' },
				{ status: 400 }
			)
		}

		// Prepare update data (only include fields that were provided)
		const updateData: any = {
			id: itemId,
			user: user.userId,
			updatedAt: new Date().toISOString()
		}

		if (text !== undefined) updateData.text = text.trim()
		if (priority !== undefined) updateData.priority = priority
		if (dueDate !== undefined) updateData.dueDate = dueDate
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
 * Params:
 *   - itemId: string (from URL params) - Todo item ID to delete
 *
 * Sends DELETE request to AWS API Gateway
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { itemId: string } }
) {
	try {
		const response = NextResponse.next()

		// Get authenticated user and session with tokens
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { itemId } = params

		if (!itemId) {
			return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
		}

		// Get Cognito tokens
		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('Deleting todo item:', itemId, 'for User ID:', user.userId)

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_ITEMS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_ITEMS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with query parameters
		const url = `${apiGatewayUrl}?id=${itemId}&user=${user.userId}`

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
