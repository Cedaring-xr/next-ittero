import { test, expect } from '@playwright/test'

// Tests the Lists and lists/{id} API endpoints

test.describe('Lists API', () => {
   test.describe('GET /api/lists', () => {
      test('[LIST-API-001] should return lists for authenticated user', async ({request}) => {
         const response = await request.get('/api/lists')
         expect(response.ok()).toBeTruthy()
         expect(response.status()).toBe(200)

         const data = await response.json()
         // verify response structure
         expect(data).toHaveProperty('lists')
         expect(Array.isArray(data.lists)).toBeTruthy()
      })

      test('[LIST-API-002] should return lists with the correct structure', async ({request}) => {
         const response = await request.get('/api/lists')
			expect(response.ok()).toBeTruthy()
			const data = await response.json()

			// If there are lists, verify their structure
			if (data.lists.length > 0) {
				const task = data.lists[0]
				// Required fields
				expect(task).toHaveProperty('id')
				expect(task).toHaveProperty('user')
				expect(task).toHaveProperty('title')
				expect(task).toHaveProperty('description')
				expect(task).toHaveProperty('category')
				expect(task).toHaveProperty('archived')
				expect(task).toHaveProperty('tags')
				expect(task).toHaveProperty('createdAt')
				expect(task).toHaveProperty('updatedAt')
				// verify that tags is an array
            expect(Array.isArray(task.tags)).toBeTruthy()
			}
      })

      test('[LIST-API-003] should reject requests from unauthenticated users', async ({request}) => {
         const response = await request.get('/api/lists', {
				headers: {
					// Clear any auth cookies by not including them
					Cookie: ''
				}
			})
			expect([401, 403]).toContain(response.status())
      })
   })

   test.describe('POST /api/lists', () => {
      test('[LIST-API-004] should be able to create a new list', async ({request}) => {
         const newList = {
            user: '545824a8-d011-708d-51bb-99e6abf1a68a',
            title: 'testing list creation',
            description: 'this should create a list',
            archived: false,
            tags: [],
            createdAt: new Date().toISOString().split('T')[0]
         }

         const response = await request.post('/api/lists', {
            data: newList
         })

         expect(response.status()).toBe(201)
			const data = await response.json()

         // these tests are fucking stupid, needs to remove double nesting from AWS response
         expect(data.message).toBeDefined()
			expect(data.data).toBeDefined()
			expect(data.data.data).toBeDefined()
			expect(data.data.data.id).toBeDefined()
			expect(typeof data.data.data.id).toBe('string')
         expect(data.data.data['list-id']).toBeDefined()
         expect(data.data.data.title).toBeDefined()
         expect(data.data.data.tags).toBeDefined()

			// Cleanup: Delete the created list to not affect other tests
			if (data.data.data.id) {
				await request.delete(`/api/lists/${data.data.data.id}`)
			}
      })

      test('[LIST-API-005] should have required fields for new created lists', async ({request}) => {
         const malformedList = {
            user: '545824a8-d011-708d-51bb-99e6abf1a68a',
            description: 'this should create a list',
            archived: false,
            tags: [],
            createdAt: new Date().toISOString().split('T')[0]
         }

         const response = await request.post('/api/lists',  {
            data: malformedList
         })

         expect(response.status()).toBe(400)
         const data = await response.json()

         expect(data).toHaveProperty('error')
         expect(data.error).toBe('List name is required')

      })

      test('[LIST-API-006] should reject list creation from unauthenticated users', async ({request}) => {
         const newList = {
            user: '545824a8-d011-708d-51bb-99e6abf1a68a',
            title: 'testing list creation',
            description: 'this should create a list',
            archived: false,
            tags: [],
            createdAt: new Date().toISOString().split('T')[0]
         }

			const response = await request.post('/api/lists', {
				data: newList,
				headers: {
					Cookie: ''
				}
			})
			expect([401, 403]).toContain(response.status())
      })
   })
} )