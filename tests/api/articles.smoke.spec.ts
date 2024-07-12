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
})
