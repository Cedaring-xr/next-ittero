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

      test('[LIST-API-002] should reject requests from unauthenticated users', async ({request}) => {
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
      test('[LIST-API-003] should be able to create a new list', async ({request}) => {
        
         const response = await request.post('/api/lists')
      })

      test('[LIST-API-004] should have required fields for new created lists', async ({request}) => {

      })

      test('[LIST-API-005] should reject list creation from unauthenticated users', async ({request}) => {

      })
   })

   test.describe('GET /api/lists/{id}', () => {
      test('[LIST-API-006] should return a single list by id', async ({request}) => {

      })

      test('[LIST-API-007] should reject request when using an invalid id', async ({request}) => {

      })

      test('[LIST-API-008] should reject request if provided multiple ids', async ({request}) => {

      })

      test('[LIST-API-009] should reject request for list id of other user', async ({request}) => {

      })
   })

   test.describe('POST /api/lists/{id}', () => {

   })

   test.describe('PATCH /api/lists/{id}', () => {

   })

   test.describe('DELETE /api/lists/{id}', () => {

   })
} )