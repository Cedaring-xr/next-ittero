import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'

/**
 * POST - Create a new list via AWS API Gateway
 * Body:
 *   - title: string (required) - Title of the list
 *   - description: string (optional) - Description of the list
 *   - category: string (optional) - Category (max 100 chars) (only one category)
 *   - tags: array of strings (optional) - Tags for the list
 *
 * Sends to AWS API Gateway with:
 *   - user: userId from authenticated user
 *   - title: list name/title
 *   - description: list description
 *   - category: category string
 *   - tags: array of tags
 *   - archived: boolean (default false)
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

		console.log('Creating list for User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)
		console.log('Environment check:', {
			TASKS_API_GATEWAY_LISTS_URL: !!process.env.TASKS_API_GATEWAY_LISTS_URL,
			NODE_ENV: process.env.NODE_ENV,
			allEnvKeys: Object.keys(process.env).filter((key) => key.includes('API') || key.includes('TASKS'))
		})

		const body = await request.json()
		const { title, description, category, tags } = body

		// Validation
		if (!title) {
			return NextResponse.json({ error: 'List name is required' }, { status: 400 })
		}

		// Validate category length
		if (category && category.length > 100) {
			return NextResponse.json({ error: 'Category must be 100 characters or less' }, { status: 400 })
		}

		// Validate tags is an array
		if (tags && !Array.isArray(tags)) {
			return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 })
		}

		// Get current timestamp
		const currentDate = new Date().toISOString()

		// Prepare list data for AWS API Gateway
		// Note: Lambda will generate the 'list-id' partition key
		// Note: DynamoDB expects 'name' field, but we use 'title' in the frontend API
		const listData = {
			user: user.userId,
			name: title.trim(), // Required by DynamoDB
			title: title.trim(), // Frontend field name
			description: description?.trim() || '',
			category: category?.trim() || '',
			tags: tags || [],
			archived: false,
			createdAt: currentDate,
			updatedAt: currentDate
		}

		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_LISTS_URL

		if (!apiGatewayUrl) {
			console.error('AWS_API_GATEWAY_LISTS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Send POST request to AWS API Gateway
		console.log('Sending to AWS API Gateway:', apiGatewayUrl)
		console.log('List Data:', JSON.stringify(listData, null, 2))

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
			body: JSON.stringify(listData)
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
					error: 'Failed to create list',
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
				message: 'List created successfully',
				data: responseData
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating list:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}

/**
 * GET - Fetch all lists for the authenticated user
 * Query params:
 *   - user: string (automatically added from auth)
 *
 * Returns array of lists from AWS API Gateway (Aurora database)
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

		console.log('Fetching lists for User ID:', user.userId)
		console.log('ID Token exists:', !!idToken)

		// Get AWS API Gateway URL from environment variables
		const apiGatewayUrl = process.env.TASKS_API_GATEWAY_LISTS_URL

		if (!apiGatewayUrl) {
			console.error('AWS_API_GATEWAY_LISTS_URL is not configured')
			return NextResponse.json({ error: 'API Gateway URL not configured' }, { status: 500 })
		}

		// Build URL with query parameters
		const queryParams = new URLSearchParams({
			user: user.userId
		})

		const url = `${apiGatewayUrl}?${queryParams.toString()}`

		console.log('Fetching from AWS API Gateway:', url)

		// Build headers with Authorization token
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		// Add Authorization header - token without Bearer prefix for GET (matches journal API)
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
					error: 'Failed to fetch lists',
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
				lists: responseData.lists || responseData,
				count: responseData.count || (responseData.lists ? responseData.lists.length : 0)
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching lists:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
