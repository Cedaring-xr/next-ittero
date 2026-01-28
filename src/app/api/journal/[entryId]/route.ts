import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/*
 * GET /api/journal/[entryId] - Get a single journal entry by ID
 * PATCH /api/journal/[entryId] - Update a journal entry by ID
 * DELETE /api/journal/[entryId] - Delete a journal entry by ID
 */

export async function GET(
	request: NextRequest,
	{ params }: { params: { entryId: string } }
) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { entryId } = params

		if (!entryId) {
			return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
		}

		const apiGatewayUrl = process.env.API_GATEWAY_URL

		if (!apiGatewayUrl) {
			console.error('API_GATEWAY_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL for single entry
		const url = `${apiGatewayUrl}/entries/${entryId}`

		console.log('Fetching journal entry:', url)

		const idToken = user.idToken
		const accessToken = user.accessToken

		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (idToken) {
			headers['Authorization'] = idToken
		} else if (accessToken) {
			headers['Authorization'] = accessToken
		}

		const apiResponse = await fetch(url, {
			method: 'GET',
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
					error: 'Failed to fetch journal entry',
					details: errorData,
					status: apiResponse.status
				},
				{ status: apiResponse.status }
			)
		}

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

		return NextResponse.json(responseData, { status: 200 })
	} catch (error) {
		console.error('Error fetching journal entry:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { entryId: string } }
) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { entryId } = params

		if (!entryId) {
			return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
		}

		const body = await request.json()
		const { date, text, tag } = body

		// Validate date format if provided (YYYY-MM-DD)
		if (date) {
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/
			if (!dateRegex.test(date)) {
				return NextResponse.json({ error: 'Invalid date format. Expected YYYY-MM-DD' }, { status: 400 })
			}
		}

		// Validate tag if provided (max 30 characters)
		if (tag && tag.length > 30) {
			return NextResponse.json({ error: 'Tag must be 30 characters or less' }, { status: 400 })
		}

		const apiGatewayUrl = process.env.API_GATEWAY_URL

		if (!apiGatewayUrl) {
			console.error('API_GATEWAY_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL for updating entry
		const url = `${apiGatewayUrl}/entries/${entryId}`

		console.log('Updating journal entry:', url)
		console.log('Update data:', body)

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

		const apiResponse = await fetch(url, {
			method: 'PATCH',
			headers: headers,
			body: JSON.stringify(body)
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
					error: 'Failed to update journal entry',
					details: errorData,
					status: apiResponse.status
				},
				{ status: apiResponse.status }
			)
		}

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
				message: 'Journal entry updated successfully',
				data: responseData
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error updating journal entry:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { entryId: string } }
) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { entryId } = params

		if (!entryId) {
			return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
		}

		const apiGatewayUrl = process.env.API_GATEWAY_URL

		if (!apiGatewayUrl) {
			console.error('API_GATEWAY_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL for deleting entry
		const url = `${apiGatewayUrl}/entries/${entryId}`

		console.log('Deleting journal entry:', url)

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
					error: 'Failed to delete journal entry',
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
				message: 'Journal entry deleted successfully',
				data: responseData
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error deleting journal entry:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
