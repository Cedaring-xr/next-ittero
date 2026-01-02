import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/*
 * POST - Create a new journal entry via AWS API Gateway
 * Body:
 *   - date: string (required) - Date of the journal entry (YYYY-MM-DD)
 *   - text: string (required) - Paragraph text of the journal entry
 * GET - fetch all journal entries related to user_id
 * Body:
 * 	- name: string
 * 	- text: string
 * 	- date: string
 *
 * Sends to AWS API Gateway with:
 *   - user: userId from authenticated user
 *   - name: generated from date
 *   - date: date from request body (YYYY-MM-DD)
 *   - text: journal entry content
 */
export async function POST(request: NextRequest) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const idToken = user.idToken
		const accessToken = user.accessToken

		console.log('User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)
		console.log('Access Token exists:', !!accessToken)

		const body = await request.json()
		const { date, text } = body

		// Validation
		if (!date || !text) {
			return NextResponse.json({ error: 'Date and text are required' }, { status: 400 })
		}

		// Validate date format (YYYY-MM-DD)
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/
		if (!dateRegex.test(date)) {
			return NextResponse.json({ error: 'Invalid date format. Expected YYYY-MM-DD' }, { status: 400 })
		}

		// Prepare journal entry data for AWS API Gateway
		const journalEntryData = {
			user: user.userId,
			name: `Journal Entry - ${date}`,
			date: date.trim(),
			text: text.trim()
		}

		const apiGatewayUrl = process.env.JOURNAL_API_GATEWAY_URL

		if (!apiGatewayUrl) {
			console.error('AWS_API_GATEWAY_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Send POST request to AWS API Gateway
		console.log('Sending to AWS API Gateway:', apiGatewayUrl)
		console.log('Journal Entry Data:', journalEntryData)

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
			body: JSON.stringify(journalEntryData)
		})

		console.log('AWS Response Status:', apiResponse.status)
		console.log('AWS Response Headers:', Object.fromEntries(apiResponse.headers.entries()))

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
					error: 'Failed to create journal entry',
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
				message: 'Journal entry created successfully',
				data: responseData
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating journal entry:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

/**
 * GET - Fetch all journal entries for the authenticated user
 * Query params:
 *   - user: string (optional) - Filter by user ID (automatically added from auth)
 *
 * Returns array of journal entries from AWS API Gateway
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

		console.log('Fetching entries for User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)

		// Get AWS API Gateway URL from environment variables
		const apiGatewayUrl = process.env.JOURNAL_API_GATEWAY_URL

		if (!apiGatewayUrl) {
			console.error('AWS_API_GATEWAY_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with user query parameter
		const url = `${apiGatewayUrl}?user=${user.userId}`

		console.log('Fetching from AWS API Gateway:', url)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		// Add Authorization header - try just the token without Bearer prefix for GET
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
					error: 'Failed to fetch journal entries',
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
				entries: responseData.entries || responseData,
				count: responseData.count || (responseData.entries ? responseData.entries.length : 0)
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching journal entries:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
