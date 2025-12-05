import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * POST - Create a new journal entry via AWS API Gateway
 * Body:
 *   - name: string (required) - Name/title of the journal entry
 *   - text: string (required) - Paragraph text of the journal entry
 *
 * Sends to AWS API Gateway with:
 *   - user: userId from authenticated user
 *   - name: entry name/title
 *   - date: current date (YYYY-MM-DD)
 *   - text: journal entry content
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

		console.log('User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)
		console.log('Access Token exists:', !!accessToken)

		const body = await request.json()
		const { name, text } = body

		// Validation
		if (!name || !text) {
			return NextResponse.json({ error: 'Name and text are required' }, { status: 400 })
		}

		// Get current date in YYYY-MM-DD format
		const currentDate = new Date().toISOString().split('T')[0]

		// Prepare journal entry data for AWS API Gateway
		const journalEntryData = {
			user: user.userId,
			name: name.trim(),
			date: currentDate,
			text: text.trim()
		}

		// Get AWS API Gateway URL from environment variables
		const apiGatewayUrl = process.env.AWS_API_GATEWAY_URL

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
