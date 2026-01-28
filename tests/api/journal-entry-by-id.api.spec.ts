import { test, expect } from '@playwright/test'

/**
 * Journal Entry by ID API Tests (/api/journal/{entryId})
 * Tests the /entries/{entryId} endpoint for getting, updating, and deleting individual entries
 */

test.describe('Journal Entry by ID API', () => {
	test.describe('GET /api/journal/{entryId}', () => {
		test('[JOURNAL-API-011] should get a single journal entry by ID', async ({ request }) => {
			// First fetch all entries to get an existing entry ID
			const listResponse = await request.get('/api/journal?limit=10')
			const listData = await listResponse.json()
			const entryId = listData.entries[0].entry_id

			// Now fetch that specific entry by ID
			const getResponse = await request.get(`/api/journal/${entryId}`)
			expect(getResponse.ok()).toBeTruthy()
			expect(getResponse.status()).toBe(200)

			const getData = await getResponse.json()
			expect(getData).toHaveProperty('entry')
			expect(getData.entry).toHaveProperty('entry_id')
			expect(getData.entry.entry_id).toBe(entryId)
			expect(getData.entry).toHaveProperty('text')
			expect(getData.entry).toHaveProperty('date')
			expect(getData.entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
		})

		test('[JOURNAL-API-012] should return 404 for incorrect entry ID', async ({
			request
		}) => {
			const fakeId = '12345'
			const response = await request.get(`/api/journal/${fakeId}`)

			expect(response.status()).toBe(404)
		})

		test('[JOURNAL-API-013] should reject unauthenticated GET request', async ({ request }) => {
			// Create an entry first
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Entry for auth test',
				tag: 'test'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			const createData = await createResponse.json()
			const entryId = createData.data.entry_id

			// Try to get without auth
			const response = await request.get(`/api/journal/${entryId}`, {
				headers: {
					Cookie: ''
				}
			})

			expect([401, 403]).toContain(response.status())

			// Cleanup
			await request.delete(`/api/journal/${entryId}`)
		})
	})

	test.describe('PATCH /api/journal/{entryId}', () => {
		test('[JOURNAL-API-014] should update a journal entry', async ({ request }) => {
			// Grab an already created entry
			const listResponse = await request.get('/api/journal?limit=10')
			const listData = await listResponse.json()
			const entryId = listData.entries[0].entry_id

			const append = Date.now()
			// Now update the entry
			const updatedEntry = {
				text: `Updated text for PATCH test ${append}`,
				tag: 'updated'
			}

			const patchResponse = await request.patch(`/api/journal/${entryId}`, {
				data: updatedEntry
			})

			expect(patchResponse.ok()).toBeTruthy()
			expect(patchResponse.status()).toBe(200)

			const patchData = await patchResponse.json()
			expect(patchData).toHaveProperty('message')
			expect(patchData.message).toBe('Journal entry updated successfully')

			// Verify the update by fetching
			const getResponse = await request.get(`/api/journal/${entryId}`)
			const getData = await getResponse.json()
			expect(getData.entry.text).toBe(updatedEntry.text)
			expect(getData.entry.tag).toBe(updatedEntry.tag)
		})

		test('[JOURNAL-API-015] should partially update a journal entry', async ({ request }) => {
			// Grab an already created entry
			const listResponse = await request.get('/api/journal?limit=10')
			const listData = await listResponse.json()
			const existingEntry = listData.entries[1]
			const entryId = existingEntry.entry_id

			const append = Date.now()
			// Update only the text
			const partialUpdate = {
				text: `Only text updated ${append}`
			}

			const patchResponse = await request.patch(`/api/journal/${entryId}`, {
				data: partialUpdate
			})

			expect(patchResponse.ok()).toBeTruthy()

			// Verify only text changed, tag remained the same
			const getResponse = await request.get(`/api/journal/${entryId}`)
			const getData = await getResponse.json()
			expect(getData.entry.text).toBe(partialUpdate.text)
			expect(getData.entry.tag).toBe(existingEntry.tag) // Should remain unchanged
		})

		test('[JOURNAL-API-016] should reject PATCH with invalid date format', async ({
			request
		}) => {
			// First create an entry
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Entry for invalid date PATCH test',
				tag: 'test'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			const createData = await createResponse.json()
			const entryId = createData.data.entry_id

			// Try to update with invalid date
			const invalidUpdate = {
				date: '12/31/2024', // Wrong format
				text: 'Updated text'
			}

			const patchResponse = await request.patch(`/api/journal/${entryId}`, {
				data: invalidUpdate
			})

			expect(patchResponse.status()).toBe(400)
			const patchData = await patchResponse.json()
			expect(patchData).toHaveProperty('error')
			expect(patchData.error).toBe('Invalid date format. Expected YYYY-MM-DD')

			// Cleanup
			await request.delete(`/api/journal/${entryId}`)
		})

		test('[JOURNAL-API-017] should return 404 when updating non-existent entry', async ({
			request
		}) => {
			const fakeId = 'non-existent-id-67890'
			const updateData = {
				text: 'Trying to update non-existent entry'
			}

			const response = await request.patch(`/api/journal/${fakeId}`, {
				data: updateData
			})

			expect(response.status()).toBe(404)
		})

		test('[JOURNAL-API-018] should reject unauthenticated PATCH request', async ({
			request
		}) => {
			// Create an entry first
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Entry for auth test',
				tag: 'test'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			const createData = await createResponse.json()
			const entryId = createData.data.entry_id

			// Try to update without auth
			const updateData = {
				text: 'Unauthorized update'
			}

			const response = await request.patch(`/api/journal/${entryId}`, {
				data: updateData,
				headers: {
					Cookie: ''
				}
			})

			expect([401, 403]).toContain(response.status())

			// Cleanup
			await request.delete(`/api/journal/${entryId}`)
		})
	})

	test.describe('DELETE /api/journal/{entryId}', () => {
		test('[JOURNAL-API-019] should delete a journal entry', async ({ request }) => {
			// First create an entry to delete
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Entry for auth test',
				tag: 'test'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			const createData = await createResponse.json()
			const entryId = createData.data.entry_id

			// Delete the entry
			const deleteResponse = await request.delete(`/api/journal/${entryId}`)
			expect(deleteResponse.ok()).toBeTruthy()
			expect(deleteResponse.status()).toBe(200)

			const deleteData = await deleteResponse.json()
			expect(deleteData).toHaveProperty('message')
			expect(deleteData.message).toBe('Journal entry deleted successfully')

			// Verify deletion by trying to fetch
			const getResponse = await request.get(`/api/journal/${entryId}`)
			expect(getResponse.status()).toBe(404)
		})

		test('[JOURNAL-API-020] should return 404 when deleting non-existent entry', async ({
			request
		}) => {
			const fakeId = 'non-existent-id-99999'
			const response = await request.delete(`/api/journal/${fakeId}`)

			expect(response.status()).toBe(404)
		})

		test('[JOURNAL-API-021] should reject unauthenticated DELETE request', async ({
			request
		}) => {
			// Create an entry first
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Entry for auth test',
				tag: 'test'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			const createData = await createResponse.json()
			const entryId = createData.data.entry_id

			// Try to delete without auth
			const response = await request.delete(`/api/journal/${entryId}`, {
				headers: {
					Cookie: ''
				}
			})

			expect([401, 403]).toContain(response.status())

			// Cleanup (with auth)
			await request.delete(`/api/journal/${entryId}`)
		})
	})
})
