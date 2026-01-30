import { test, expect } from '@playwright/test'
import { request } from 'http'

/**
 * Journal Entries API Tests (/api/journal)
 * Tests the /entries endpoint for listing and creating journal entries
 * Uses /api/journal because that is what is exposed to the frontend, actual endpoints are obscured for added security
 */

test.describe('Journal Entries API', () => {
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
			expect(data).toHaveProperty('nextToken')
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
				expect(entry).toHaveProperty('entry_id')
				expect(entry).toHaveProperty('date')
				expect(entry).toHaveProperty('text')
				// Verify date format (YYYY-MM-DD)
				expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
				expect(typeof entry.entry_id).toBe('string')
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

			// If no pagination token, count should be very close to entries length
			// Allow for minor variance (±2) due to potential race conditions with other tests
			if (!entriesData.nextToken) {
				const difference = Math.abs(entriesData.entries.length - countData.count)
				expect(difference).toBeLessThanOrEqual(1)
			} else {
				// If paginated, we have more entries than returned
				expect(countData.count).toBeGreaterThan(entriesData.entries.length)
			}
		})
	})

	test.describe('POST /api/journal', () => {
		test('[JOURNAL-API-008] should be able to create a new journal entry', async ({
			request
		}) => {
			const journalEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'This is a test journal entry created by automated test',
				tag: 'test'
			}

			const response = await request.post('/api/journal', {
				data: journalEntry
			})

			expect(response.status()).toBe(201)
			const data = await response.json()

			expect(data).toHaveProperty('message')
			expect(data.message).toBe('Journal entry created successfully')
			expect(data).toHaveProperty('data')
			expect(data.data).toHaveProperty('entry_id')
			expect(typeof data.data.entry_id).toBe('string')

			// Cleanup: Delete the created entry to not affect other tests
			if (data.data.entry_id) {
				await request.delete(`/api/journal/${data.data.entry_id}`)
			}
		})

		test('[JOURNAL-API-009] should reject creation if required fields are not present', async ({
			request
		}) => {
			// Test missing 'text' field
			const missingText = {
				date: new Date().toISOString().split('T')[0]
			}

			const response1 = await request.post('/api/journal', {
				data: missingText
			})

			expect(response1.status()).toBe(400)
			const data1 = await response1.json()
			expect(data1).toHaveProperty('error')
			expect(data1.error).toBe('Date and text are required')

			// Test missing 'date' field
			const missingDate = {
				text: 'Journal entry without date'
			}

			const response2 = await request.post('/api/journal', {
				data: missingDate
			})

			expect(response2.status()).toBe(400)
			const data2 = await response2.json()
			expect(data2).toHaveProperty('error')
			expect(data2.error).toBe('Date and text are required')

			// Test invalid date format
			const invalidDate = {
				date: '12/31/2024', // Wrong format
				text: 'Journal entry with invalid date'
			}

			const response3 = await request.post('/api/journal', {
				data: invalidDate
			})

			expect(response3.status()).toBe(400)
			const data3 = await response3.json()
			expect(data3).toHaveProperty('error')
			expect(data3.error).toBe('Invalid date format. Expected YYYY-MM-DD')
		})
	})

	test.describe('Unauthenticated requests', () => {
		test('[JOURNAL-API-007] should reject unauthenticated GET request', async ({ request }) => {
			const response = await request.get('/api/journal', {
				headers: {
					// Clear any auth cookies by not including them
					Cookie: ''
				}
			})
			expect([401, 403]).toContain(response.status())
		})

		test('[JOURNAL-API-010] should reject unauthenticated POST request', async ({ request }) => {
			const journalEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Unauthorized test entry',
				tag: 'test'
			}

			const response = await request.post('/api/journal', {
				data: journalEntry,
				headers: {
					Cookie: ''
				}
			})
			expect([401, 403]).toContain(response.status())
		})
	})

	test.describe('POST /api/journal', () => {
		test.skip('[JOURNAL-API-008] should be able to create a new journal entry', async ({ request }) => {
			const journalEntry = {                                                                                                                 
          date: new Date().toISOString().split('T')[0],                                                                                      
          text: 'This is a test journal entry created by automated test',                                                                    
          tag: 'test'                                                                                                                        
      }                                                                                                                                      
                                                                                                                                             
      const response = await request.post('/api/journal', {                                                                                  
          data: journalEntry                                                                                                                 
      })                                                                                                                                     
                                                                                                                                             
      expect(response.status()).toBe(201)                                                                                                    
      const data = await response.json()                                                                                                     
                                                                                                                                             
      expect(data).toHaveProperty('message')                                                                                                 
      expect(data.message).toBe('Journal entry created successfully')                                                                        
      expect(data).toHaveProperty('data')                                                                                                    
      expect(data.data).toHaveProperty('id')                                                                                                 
                                                                                                                                             
      // Cleanup: Delete the created entry to not affect other tests                                                                         
      // (If you have a DELETE endpoint)                                                                                                     
      // await request.delete(`/api/journal/${data.data.id}`)  
		})

		test('[JOURNAL-API-009] should reject creation if required fields are not present', async ({
			request
		}) => {
			// Test missing 'text' field
			const missingText = {
				date: new Date().toISOString().split('T')[0]
			}

			const response1 = await request.post('/api/journal', {
				data: missingText
			})

			expect(response1.status()).toBe(400)
			const data1 = await response1.json()
			expect(data1).toHaveProperty('error')
			expect(data1.error).toBe('Date and text are required')

			// Test missing 'date' field
			const missingDate = {
				text: 'Journal entry without date'
			}

			const response2 = await request.post('/api/journal', {
				data: missingDate
			})

			expect(response2.status()).toBe(400)
			const data2 = await response2.json()
			expect(data2).toHaveProperty('error')
			expect(data2.error).toBe('Date and text are required')

			// Test invalid date format
			const invalidDate = {
				date: '12/31/2024', // Wrong format
				text: 'Journal entry with invalid date'
			}

			const response3 = await request.post('/api/journal', {
				data: invalidDate
			})

			expect(response3.status()).toBe(400)
			const data3 = await response3.json()
			expect(data3).toHaveProperty('error')
			expect(data3.error).toBe('Invalid date format. Expected YYYY-MM-DD')
		})
	})
})
