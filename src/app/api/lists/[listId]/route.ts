import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * GET - Fetch a specific list by ID
 * DELETE - Delete a specific list by ID
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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { listId: string } }
) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { listId } = params

		if (!listId) {
			return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
		}

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_LISTS_URL
		const itemsApiGatewayUrl = process.env.TASKS_API_GATEWAY_ITEMS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_LISTS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		if (!itemsApiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_ITEMS_URL is not configured')
			return NextResponse.json({ error: 'Items API Gateway URL not configured' }, { status: 500 })
		}

		const idToken = user.idToken
		const accessToken = user.accessToken

		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (idToken) {
			headers['Authorization'] = `Bearer ${idToken}`
		} else if (accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`
		}

		// STEP 1: Fetch all items for this list (cascade delete)
		console.log('Fetching items for list:', listId)
		const itemsUrl = `${itemsApiGatewayUrl}?user=${user.userId}&listId=${listId}`

		const itemsResponse = await fetch(itemsUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': idToken || accessToken || ''
			}
		})

		let itemsToDelete: any[] = []
		if (itemsResponse.ok) {
			const itemsData = await itemsResponse.json()
			itemsToDelete = itemsData.items || []
			console.log(`Found ${itemsToDelete.length} items to delete for list ${listId}`)
		} else {
			console.warn('Failed to fetch items for list, proceeding with list deletion anyway')
		}

		// STEP 2: Delete all items associated with this list
		const deleteItemPromises = itemsToDelete.map(async (item) => {
			const itemDeleteUrl = `${itemsApiGatewayUrl}/${item.id}?user=${user.userId}`
			console.log(`Deleting item ${item.id} from list ${listId}`)

			try {
				const itemDeleteResponse = await fetch(itemDeleteUrl, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': idToken || accessToken || ''
					}
				})

				if (!itemDeleteResponse.ok) {
					console.error(`Failed to delete item ${item.id}:`, await itemDeleteResponse.text())
					throw new Error(`Failed to delete item ${item.id}`)
				}

				console.log(`Successfully deleted item ${item.id}`)
				return { success: true, itemId: item.id }
			} catch (error) {
				console.error(`Error deleting item ${item.id}:`, error)
				return { success: false, itemId: item.id, error }
			}
		})

		// Wait for all item deletions to complete
		const deleteResults = await Promise.all(deleteItemPromises)
		const failedDeletions = deleteResults.filter(result => !result.success)

		if (failedDeletions.length > 0) {
			console.error(`Failed to delete ${failedDeletions.length} items`)
			// We'll still proceed with list deletion, but log the failures
		}

		console.log(`Deleted ${deleteResults.filter(r => r.success).length}/${itemsToDelete.length} items`)

		// STEP 3: Delete the list itself
		const url = `${apiGatewayUrl}/${listId}?user=${user.userId}`
		console.log('Deleting list:', url)

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

			return NextResponse.json(
				{
					error: 'Failed to delete list',
					details: errorData,
					status: apiResponse.status
				},
				{ status: apiResponse.status }
			)
		}

		// DELETE might return empty response
		let responseData = {}
		if (responseText) {
			try {
				responseData = JSON.parse(responseText)
			} catch (e) {
				console.log('No JSON response body, which is acceptable for DELETE')
			}
		}

		return NextResponse.json(
			{
				message: 'List deleted successfully',
				data: responseData,
				itemsDeleted: deleteResults.filter(r => r.success).length,
				itemsFailed: failedDeletions.length
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error deleting list:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
