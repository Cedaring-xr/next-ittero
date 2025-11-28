import { NextRequest, NextResponse } from 'next/server'
import { authenticatedUser } from '@/utils/amplify-server-utils'
import { v4 as uuidv4 } from 'uuid'

// Journal Entry Type Definition
export interface JournalEntry {
	id: string
	userId: string
	title: string
	content: string
	date: string
	mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible'
	tags?: string[]
	isTemplate: boolean
	createdAt: string
	updatedAt: string
}

// In-memory storage (replace with database in production)
// TODO: Replace with database queries (e.g., DynamoDB, PostgreSQL, MongoDB)
let journalEntries: JournalEntry[] = []

/**
 * GET - Fetch all journal entries for the authenticated user
 * Query params:
 *   - id: string (optional) - Fetch a specific journal entry by ID
 *   - date: string (optional) - Filter by date (YYYY-MM-DD)
 *   - limit: number (optional) - Limit number of results
 */
export async function GET(request: NextRequest) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const date = searchParams.get('date')
		const limit = searchParams.get('limit')

		// Fetch specific journal entry by ID
		if (id) {
			// TODO: Replace with database query
			const entry = journalEntries.find((entry) => entry.id === id && entry.userId === user.userId)

			if (!entry) {
				return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
			}

			return NextResponse.json({ entry }, { status: 200 })
		}

		// Fetch all entries for user with optional filters
		// TODO: Replace with database query
		let userEntries = journalEntries.filter((entry) => entry.userId === user.userId)

		// Filter by date if provided
		if (date) {
			userEntries = userEntries.filter((entry) => entry.date === date)
		}

		// Apply limit if provided
		if (limit) {
			userEntries = userEntries.slice(0, parseInt(limit))
		}

		// Sort by date (most recent first)
		userEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

		return NextResponse.json(
			{
				entries: userEntries,
				count: userEntries.length
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching journal entries:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

/**
 * POST - Create a new journal entry
 * Body:
 *   - title: string (required)
 *   - content: string (required)
 *   - date: string (required) - YYYY-MM-DD format
 *   - mood: string (optional)
 *   - tags: string[] (optional)
 *   - isTemplate: boolean (optional)
 */
export async function POST(request: NextRequest) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { title, content, date, mood, tags, isTemplate } = body

		// Validation
		if (!title || !content || !date) {
			return NextResponse.json({ error: 'Title, content, and date are required' }, { status: 400 })
		}

		// Validate date format
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return NextResponse.json({ error: 'Date must be in YYYY-MM-DD format' }, { status: 400 })
		}

		// Create new journal entry
		const newEntry: JournalEntry = {
			id: uuidv4(),
			userId: user.userId,
			title: title.trim(),
			content: content.trim(),
			date,
			mood: mood || undefined,
			tags: tags || [],
			isTemplate: isTemplate || false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}

		// TODO: Replace with database insert
		journalEntries.push(newEntry)

		return NextResponse.json(
			{
				message: 'Journal entry created successfully',
				entry: newEntry
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating journal entry:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

/**
 * PUT - Update an existing journal entry
 * Body:
 *   - id: string (required)
 *   - title: string (optional)
 *   - content: string (optional)
 *   - date: string (optional)
 *   - mood: string (optional)
 *   - tags: string[] (optional)
 *   - isTemplate: boolean (optional)
 */
export async function PUT(request: NextRequest) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { id, title, content, date, mood, tags, isTemplate } = body

		if (!id) {
			return NextResponse.json({ error: 'Journal entry ID is required' }, { status: 400 })
		}

		// TODO: Replace with database query
		const entryIndex = journalEntries.findIndex((entry) => entry.id === id && entry.userId === user.userId)

		if (entryIndex === -1) {
			return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
		}

		// Validate date format if provided
		if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return NextResponse.json({ error: 'Date must be in YYYY-MM-DD format' }, { status: 400 })
		}

		// Update entry
		const updatedEntry: JournalEntry = {
			...journalEntries[entryIndex],
			...(title && { title: title.trim() }),
			...(content && { content: content.trim() }),
			...(date && { date }),
			...(mood !== undefined && { mood }),
			...(tags !== undefined && { tags }),
			...(isTemplate !== undefined && { isTemplate }),
			updatedAt: new Date().toISOString()
		}

		// TODO: Replace with database update
		journalEntries[entryIndex] = updatedEntry

		return NextResponse.json(
			{
				message: 'Journal entry updated successfully',
				entry: updatedEntry
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error updating journal entry:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

/**
 * DELETE - Delete a journal entry
 * Query params:
 *   - id: string (required) - ID of the journal entry to delete
 */
export async function DELETE(request: NextRequest) {
	try {
		const response = NextResponse.next()
		const user = await authenticatedUser({ request, response })

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')

		if (!id) {
			return NextResponse.json({ error: 'Journal entry ID is required' }, { status: 400 })
		}

		// TODO: Replace with database query
		const entryIndex = journalEntries.findIndex((entry) => entry.id === id && entry.userId === user.userId)

		if (entryIndex === -1) {
			return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
		}

		// TODO: Replace with database delete
		const deletedEntry = journalEntries.splice(entryIndex, 1)[0]

		return NextResponse.json(
			{
				message: 'Journal entry deleted successfully',
				entry: deletedEntry
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error deleting journal entry:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

