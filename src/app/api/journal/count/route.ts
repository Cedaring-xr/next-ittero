import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/*
 * GET - Fetch total journal entry count for the authenticated user
 * Returns:
 *   - count: total number of journal entries
 */
export async function GET(request: NextRequest) {
	try {
		const response = NextResponse.next()

		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const idToken = user.idToken
		const accessToken = user.accessToken

		const apiGatewayUrl = process.env.JOURNAL_API_GATEWAY_URL

		if (!apiGatewayUrl) {
			console.error('JOURNAL_API_GATEWAY_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL for count request
		const url = `${apiGatewayUrl}/count?user=${user.userId}`

		console.log('=== Journal Count Debug ===')
		console.log('User ID:', user.userId)
		console.log('API Gateway Base URL:', apiGatewayUrl)
		console.log('Full URL:', url)

		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (idToken) {
			headers['Authorization'] = idToken
			console.log('Using ID token for auth')
		} else if (accessToken) {
			headers['Authorization'] = accessToken
			console.log('Using Access token for auth')
		} else {
			console.log('No auth token available')
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
					error: 'Failed to fetch journal count',
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
				count: responseData.totalCount ?? responseData.count ?? 0
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching journal count:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
