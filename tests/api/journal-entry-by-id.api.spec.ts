import { test, expect } from '@playwright/test'

/**
 * Journal Entry by ID API Tests (/api/journal/{entryId})
 * Tests the /entries/{entryId} endpoint for getting, updating, and deleting individual entries
 */

test.describe('Journal Entry by ID API', () => {
	test.describe('GET /api/journal/{entryId}', () => {
		test('[JOURNAL-ENTRY-001] should get a single journal entry by ID', async ({ request }) => {
			// First create an entry to fetch
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Test entry for GET by ID test',
				tag: 'test-get'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			expect(createResponse.status()).toBe(201)
			const createData = await createResponse.json()
			const entryId = createData.data.id

			// Now fetch the entry by ID
			const getResponse = await request.get(`/api/journal/${entryId}`)
			expect(getResponse.ok()).toBeTruthy()
			expect(getResponse.status()).toBe(200)

			const getData = await getResponse.json()
			expect(getData).toHaveProperty('id')
			expect(getData.id).toBe(entryId)
			expect(getData).toHaveProperty('text')
			expect(getData.text).toBe(newEntry.text)
			expect(getData).toHaveProperty('date')
			expect(getData.date).toBe(newEntry.date)
			if (newEntry.tag) {
				expect(getData.tag).toBe(newEntry.tag)
			}

			// Cleanup
			await request.delete(`/api/journal/${entryId}`)
		})

		test('[JOURNAL-ENTRY-002] should return 404 for non-existent entry ID', async ({
			request
		}) => {
			const fakeId = 'non-existent-id-12345'
			const response = await request.get(`/api/journal/${fakeId}`)

			expect(response.status()).toBe(404)
		})

		test('[JOURNAL-ENTRY-003] should reject unauthenticated GET request', async ({ request }) => {
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
			const entryId = createData.data.id

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
		test('[JOURNAL-ENTRY-004] should update a journal entry', async ({ request }) => {
			// First create an entry to update
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Original text for PATCH test',
				tag: 'original'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			expect(createResponse.status()).toBe(201)
			const createData = await createResponse.json()
			const entryId = createData.data.id

			// Now update the entry
			const updatedEntry = {
				text: 'Updated text for PATCH test',
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
			expect(getData.text).toBe(updatedEntry.text)
			expect(getData.tag).toBe(updatedEntry.tag)

			// Cleanup
			await request.delete(`/api/journal/${entryId}`)
		})

		test('[JOURNAL-ENTRY-005] should partially update a journal entry', async ({ request }) => {
			// Create an entry
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Original text',
				tag: 'original-tag'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			const createData = await createResponse.json()
			const entryId = createData.data.id

			// Update only the text
			const partialUpdate = {
				text: 'Only text updated'
			}

			const patchResponse = await request.patch(`/api/journal/${entryId}`, {
				data: partialUpdate
			})

			expect(patchResponse.ok()).toBeTruthy()

			// Verify only text changed, tag remained the same
			const getResponse = await request.get(`/api/journal/${entryId}`)
			const getData = await getResponse.json()
			expect(getData.text).toBe(partialUpdate.text)
			expect(getData.tag).toBe(newEntry.tag) // Should remain unchanged

			// Cleanup
			await request.delete(`/api/journal/${entryId}`)
		})

		test('[JOURNAL-ENTRY-006] should reject PATCH with invalid date format', async ({
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
			const entryId = createData.data.id

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

		test('[JOURNAL-ENTRY-007] should return 404 when updating non-existent entry', async ({
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

		test('[JOURNAL-ENTRY-008] should reject unauthenticated PATCH request', async ({
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
			const entryId = createData.data.id

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
		test('[JOURNAL-ENTRY-009] should delete a journal entry', async ({ request }) => {
			// First create an entry to delete
			const newEntry = {
				date: new Date().toISOString().split('T')[0],
				text: 'Entry for DELETE test',
				tag: 'test-delete'
			}

			const createResponse = await request.post('/api/journal', {
				data: newEntry
			})

			expect(createResponse.status()).toBe(201)
			const createData = await createResponse.json()
			const entryId = createData.data.id

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

		test('[JOURNAL-ENTRY-010] should return 404 when deleting non-existent entry', async ({
			request
		}) => {
			const fakeId = 'non-existent-id-99999'
			const response = await request.delete(`/api/journal/${fakeId}`)

			expect(response.status()).toBe(404)
		})

		test('[JOURNAL-ENTRY-011] should reject unauthenticated DELETE request', async ({
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
			const entryId = createData.data.id

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
