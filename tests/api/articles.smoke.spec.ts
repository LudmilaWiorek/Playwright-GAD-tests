import { expect, test } from '@playwright/test'

test.describe('Verify articles API endpoints @GAD-R08-01 @api', () => {
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
