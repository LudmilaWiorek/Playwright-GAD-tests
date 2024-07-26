import { expect, test } from '@playwright/test'

test.describe('Verify articles API endpoints @GAD-R08-01 @api', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET articles returns status code 200 ', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200
      const articlesUrl = '/api/articles'
      // Act
      const response = await request.get(articlesUrl)
      //Assert
      expect(response.status()).toBe(expectedStatusCode)
    })

    test('GET articles should return at least one article @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedMinArticleCount = 1
      // useful tip: check for numbers 1000 or on empty database [in our case: there is a bookmark in application that reset database]
      const articlesUrl = '/api/articles'
      // Act
      const response = await request.get(articlesUrl)
      const responseJSON = await response.json()
      // Assert
      expect([responseJSON].length).toBeGreaterThanOrEqual(
        expectedMinArticleCount,
      )
    })

    test('GET articles should return article object @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const articlesUrl = '/api/articles'
      const expectedRequiredFields = [
        'id',
        'user_id',
        'title',
        'body',
        'date',
        'image',
      ]
      // Act
      const response = await request.get(articlesUrl)
      const responseJSON = await response.json()
      const article = responseJSON[0]
      // Assert
      // properties can be easy checked in documentation -> schema
      // expect.soft(article).toHaveProperty('user_id')
      // expect.soft(article).toHaveProperty('title')
      // expect.soft(article).toHaveProperty('body')
      // expect.soft(article).toHaveProperty('date')
      // expect.soft(article).toHaveProperty('image')

      // instead of checking every field separately, we make nice forEach loop
      expectedRequiredFields.forEach((key) => {
        expect.soft(article).toHaveProperty(key)
      })
      // NOTE: careful with assertions - sometimes they don't prove everything went well!
    })
  })

  test('GET articles should return an object with required fields @predefined_data ', async ({
    request,
  }) => {
    const articlesUrl = '/api/articles'
    const response = await request.get(articlesUrl)
    //we remind the structure of test steps
    await test.step('GET articles returns status code 200', async () => {
      const expectedStatusCode = 200

      expect(response.status()).toBe(expectedStatusCode)
    })

    const responseJSON = await response.json()
    await test.step('GET articles should return at least one article', async () => {
      const expectedMinArticleCount = 1

      expect([responseJSON].length).toBeGreaterThanOrEqual(
        expectedMinArticleCount,
      )
    })

    const expectedRequiredFields = [
      'id',
      'user_id',
      'title',
      'body',
      'date',
      'image',
    ]
    const article = responseJSON[0]
    // we transfer some information to name of the test; Data Driven Testing. If something will go not well in the loop we gonna see what - in report.
    expectedRequiredFields.forEach(async (key) => {
      await test.step(`response object contains required field: ${key}`, async () => {
        expect.soft(article).toHaveProperty(key)
      })
    })
  })
})
