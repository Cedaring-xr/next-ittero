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
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

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
		const apiResponse = await fetch(apiGatewayUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(journalEntryData)
		})

		if (!apiResponse.ok) {
			const errorData = await apiResponse.json().catch(() => ({}))
			console.error('AWS API Gateway error:', errorData)
			return NextResponse.json(
				{ error: 'Failed to create journal entry', details: errorData },
				{ status: apiResponse.status }
			)
		}

		const responseData = await apiResponse.json()

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
