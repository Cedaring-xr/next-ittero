import { test, expect } from '@playwright/test'

// Tests the tasks related API endpoints


test.describe('GET /task', () => {
   test('[TASK-API-001] should retrieve all or specified amount of tasks', async () =>{

   })

   test('[TASK-API-002] should error with 401 for non users', async () => {

   })


   test.describe('GET /api/lists/{id}', () => {
      test('[LIST-API-007] should return a single list by id', async ({request}) => {

      })

      test('[LIST-API-007] should reject request when using an invalid id', async ({request}) => {

      })

      test('[LIST-API-008] should reject request if provided multiple ids', async ({request}) => {

      })

      test('[LIST-API-009] should reject request for list id of other user', async ({request}) => {

      })
   })


   test.describe('PATCH /api/lists/{id}', () => {

   })

   test.describe('DELETE /api/lists/{id}', () => {

   })
})