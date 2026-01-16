import { test, expect } from '@playwright/test'

/**
 * Journal API Tests
 * Tests the journal API endpoints for correct response structure and data
 */

test.describe('Journal API', () => {
	test.describe('GET /api/journal', () => {
		test('[JOURNAL-API-001] should return journal entries for authenticated user', async ({
			request
		}) => {
			const response = await request.get('/api/journal?limit=10')

			expect(response.ok()).toBeTruthy()
			expect(response.status()).toBe(200)

			const data = await response.json()

			// Verify response structure
			expect(data).toHaveProperty('entries')
			expect(data).toHaveProperty('count')
			expect(Array.isArray(data.entries)).toBeTruthy()

			// Verify count matches entries length (or is less if paginated)
			expect(data.count).toBeLessThanOrEqual(10)
			expect(data.entries.length).toBe(data.count)
		})

		test('[JOURNAL-API-002] should return entries with correct structure', async ({ request }) => {
			const response = await request.get('/api/journal?limit=5')

			expect(response.ok()).toBeTruthy()

			const data = await response.json()

			// If there are entries, verify their structure
			if (data.entries.length > 0) {
				const entry = data.entries[0]

				// Required fields
				expect(entry).toHaveProperty('id')
				expect(entry).toHaveProperty('user')
				expect(entry).toHaveProperty('date')
				expect(entry).toHaveProperty('text')

				// Verify date format (YYYY-MM-DD)
				expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)

				// Verify id and user are strings
				expect(typeof entry.id).toBe('string')
				expect(typeof entry.user).toBe('string')
				expect(typeof entry.text).toBe('string')
			}
		})

		test('[JOURNAL-API-003] should respect limit parameter', async ({ request }) => {
			const response = await request.get('/api/journal?limit=3')

			expect(response.ok()).toBeTruthy()

			const data = await response.json()

			// Should not return more than the limit
			expect(data.entries.length).toBeLessThanOrEqual(3)
		})

		test('[JOURNAL-API-004] should support pagination with nextToken', async ({ request }) => {
			// First request
			const firstResponse = await request.get('/api/journal?limit=5')
			expect(firstResponse.ok()).toBeTruthy()

			const firstData = await firstResponse.json()

			// If there's a nextToken, we can paginate
			if (firstData.nextToken) {
				const secondResponse = await request.get(
					`/api/journal?limit=5&nextToken=${encodeURIComponent(firstData.nextToken)}`
				)

				expect(secondResponse.ok()).toBeTruthy()

				const secondData = await secondResponse.json()
				expect(Array.isArray(secondData.entries)).toBeTruthy()

				// Entries from second page should be different from first page
				if (secondData.entries.length > 0 && firstData.entries.length > 0) {
					const firstIds = firstData.entries.map((e: { id: string }) => e.id)
					const secondIds = secondData.entries.map((e: { id: string }) => e.id)

					// No overlap between pages
					const overlap = secondIds.filter((id: string) => firstIds.includes(id))
					expect(overlap.length).toBe(0)
				}
			}
		})
	})

	test.describe('GET /api/journal/count', () => {
		test('[JOURNAL-API-005] should return total journal entry count', async ({ request }) => {
			const response = await request.get('/api/journal/count')

			expect(response.ok()).toBeTruthy()
			expect(response.status()).toBe(200)

			const data = await response.json()

			// Verify response structure
			expect(data).toHaveProperty('count')
			expect(typeof data.count).toBe('number')
			expect(data.count).toBeGreaterThanOrEqual(0)
		})

		test('[JOURNAL-API-006] count should be consistent with entries', async ({ request }) => {
			// Get total count
			const countResponse = await request.get('/api/journal/count')
			const countData = await countResponse.json()

			// Get entries with high limit
			const entriesResponse = await request.get('/api/journal?limit=100')
			const entriesData = await entriesResponse.json()

			// If no pagination token, we got all entries
			if (!entriesData.nextToken) {
				expect(entriesData.entries.length).toBe(countData.count)
			} else {
				// If paginated, we have more entries than returned
				expect(countData.count).toBeGreaterThan(entriesData.entries.length)
			}
		})
	})

	test.describe('Unauthenticated requests', () => {
		test('[JOURNAL-API-007] should reject unauthenticated GET request', async ({ request }) => {
			// Create a new context without auth
			const response = await request.get('/api/journal', {
				headers: {
					// Clear any auth cookies by not including them
					Cookie: ''
				}
			})

			// Should return 401 Unauthorized
			// Note: This may vary based on how auth is implemented
			expect([401, 403]).toContain(response.status())
		})
	})
})
