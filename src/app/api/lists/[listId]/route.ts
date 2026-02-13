import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * GET - Fetch a specific list by ID
 * PATCH - Update a specific list (e.g., pin/unpin, update title, etc.)
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

/**
 * PATCH - Update a specific list (e.g., toggle pinned status)
 * Params:
 *   - listId: string (from URL params)
 * Body:
 *   - pinned: boolean (optional) - Pin/unpin the list
 *   - title: string (optional) - Update list title
 *   - description: string (optional) - Update description
 *   - category: string (optional) - Update category
 *   - archived: boolean (optional) - Archive/unarchive
 *   - tags: array (optional) - Update tags
 *
 * Validates:
 *   - Maximum 7 pinned lists
 *   - Cannot unpin system lists
 */
export async function PATCH(request: NextRequest, { params }: { params: { listId: string } }) {
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

		// Parse request body
		const body = await request.json()

		// Get Cognito tokens
		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('Updating list:', listId, 'for User ID:', user.userId)
		console.log('Update data:', body)

		// Get AWS API Gateway URL from environment variables
		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_LISTS_URL

		if (!apiGatewayUrl) {
			console.error('TASKS_API_GATEWAY_LISTS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with list ID and user for security
		const url = `${apiGatewayUrl}/${listId}?user=${user.userId}`

		console.log('Updating via AWS API Gateway:', url)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		// Add Authorization header
		if (idToken) {
			headers['Authorization'] = idToken
			console.log('Including ID token')
		} else if (accessToken) {
			headers['Authorization'] = accessToken
			console.log('Including Access token')
		}

		// Send PATCH request to AWS API Gateway
		const apiResponse = await fetch(url, {
			method: 'PATCH',
			headers: headers,
			body: JSON.stringify(body)
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
					error: errorData.error || 'Failed to update list',
					message: errorData.message,
					details: errorData
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
				message: responseData.message || 'List updated successfully',
				list: responseData.list
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error updating list:', error)
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

		// Get deleteMode from query params (default to 'cascade')
		const { searchParams } = new URL(request.url)
		const deleteMode = (searchParams.get('deleteMode') as 'cascade' | 'reassign') || 'cascade'

		console.log(`Delete mode: ${deleteMode}`)

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

		// PROTECTION: First check if this is a system list
		console.log('Checking if list is a system list:', listId)
		const listCheckUrl = `${apiGatewayUrl}/${listId}?user=${user.userId}`
		const listCheckResponse = await fetch(listCheckUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': idToken || accessToken || ''
			}
		})

		if (listCheckResponse.ok) {
			const listData = await listCheckResponse.json()
			const list = listData.list || listData

			// Prevent deletion of system lists
			if (list.isSystem === true) {
				console.error('Attempted to delete system list:', listId)
				return NextResponse.json(
					{ error: 'System lists cannot be deleted' },
					{ status: 403 }
				)
			}
		}

		// STEP 1: Fetch all items for this list
		console.log('Fetching items for list:', listId)
		const itemsUrl = `${itemsApiGatewayUrl}?user=${user.userId}&listId=${listId}`

		const itemsResponse = await fetch(itemsUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': idToken || accessToken || ''
			}
		})

		let itemsToProcess: any[] = []
		if (itemsResponse.ok) {
			const itemsData = await itemsResponse.json()
			itemsToProcess = itemsData.items || []
			console.log(`Found ${itemsToProcess.length} items for list ${listId}`)
		} else {
			console.warn('Failed to fetch items for list, proceeding with list deletion anyway')
		}

		// STEP 2: Process items based on deleteMode
		let processResults: any[] = []
		let failedOperations: any[] = []

		if (deleteMode === 'cascade') {
			// CASCADE MODE: Delete all items
			console.log('CASCADE MODE: Deleting all items')
			const deleteItemPromises = itemsToProcess.map(async (item) => {
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
					return { success: true, itemId: item.id, operation: 'delete' }
				} catch (error) {
					console.error(`Error deleting item ${item.id}:`, error)
					return { success: false, itemId: item.id, operation: 'delete', error }
				}
			})

			processResults = await Promise.all(deleteItemPromises)
			failedOperations = processResults.filter(result => !result.success)

			if (failedOperations.length > 0) {
				console.error(`Failed to delete ${failedOperations.length} items`)
			}

			console.log(`Deleted ${processResults.filter(r => r.success).length}/${itemsToProcess.length} items`)
		} else if (deleteMode === 'reassign') {
			// REASSIGN MODE: Move items to unassigned list
			console.log('REASSIGN MODE: Moving items to Unassigned Tasks')

			// Ensure unassigned list exists by calling the system endpoint
			const unassignedListUrl = `${request.nextUrl.origin}/api/lists/system/unassigned`
			const unassignedListResponse = await fetch(unassignedListUrl, {
				method: 'GET',
				headers: {
					'Cookie': request.headers.get('cookie') || '',
					'Content-Type': 'application/json'
				}
			})

			if (!unassignedListResponse.ok) {
				console.error('Failed to get/create unassigned list')
				return NextResponse.json(
					{ error: 'Failed to get unassigned list for reassignment' },
					{ status: 500 }
				)
			}

			const unassignedData = await unassignedListResponse.json()
			const unassignedList = unassignedData.list
			console.log(`Unassigned list ${unassignedData.created ? 'created' : 'exists'}:`, unassignedList.id)

			// Reassign all items to the unassigned list
			const reassignItemPromises = itemsToProcess.map(async (item) => {
				const itemUpdateUrl = `${itemsApiGatewayUrl}/${item.id}`
				console.log(`Reassigning item ${item.id} to unassigned list`)

				try {
					const itemUpdateResponse = await fetch(itemUpdateUrl, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': idToken || accessToken || ''
						},
						body: JSON.stringify({
							id: item.id,
							user: user.userId,
							listId: unassignedList.id,
							updatedAt: new Date().toISOString()
						})
					})

					if (!itemUpdateResponse.ok) {
						console.error(`Failed to reassign item ${item.id}:`, await itemUpdateResponse.text())
						throw new Error(`Failed to reassign item ${item.id}`)
					}

					console.log(`Successfully reassigned item ${item.id}`)
					return { success: true, itemId: item.id, operation: 'reassign' }
				} catch (error) {
					console.error(`Error reassigning item ${item.id}:`, error)
					return { success: false, itemId: item.id, operation: 'reassign', error }
				}
			})

			processResults = await Promise.all(reassignItemPromises)
			failedOperations = processResults.filter(result => !result.success)

			if (failedOperations.length > 0) {
				console.error(`Failed to reassign ${failedOperations.length} items`)
				// If reassignment fails, don't delete the list
				return NextResponse.json(
					{
						error: 'Failed to reassign some items',
						details: {
							failedCount: failedOperations.length,
							totalCount: itemsToProcess.length,
							failedItems: failedOperations
						}
					},
					{ status: 500 }
				)
			}

			console.log(`Reassigned ${processResults.filter(r => r.success).length}/${itemsToProcess.length} items`)
		}

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

		// Build response based on deleteMode
		const responsePayload: any = {
			message: 'List deleted successfully',
			data: responseData,
			deleteMode: deleteMode
		}

		if (deleteMode === 'cascade') {
			responsePayload.itemsDeleted = processResults.filter(r => r.success).length
			responsePayload.itemsFailed = failedOperations.length
		} else if (deleteMode === 'reassign') {
			responsePayload.itemsReassigned = processResults.filter(r => r.success).length
			responsePayload.itemsFailed = failedOperations.length
		}

		return NextResponse.json(responsePayload, { status: 200 })
	} catch (error) {
		console.error('Error deleting list:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
