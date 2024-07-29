import { expect, test } from '@playwright/test'

test.describe('Verify comments API endpoints @GAD-R08-02 @api', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET comments returns status code 200 ', async ({ request }) => {
      const expectedStatusCode = 200
      const commentsUrl = 'api/comments'
      //Act
      const response = await request.get(commentsUrl)
      //Assert
      expect(response.status()).toBe(expectedStatusCode)
    })

    test('GET comments should return comment object @predefined_data', async ({
      request,
    }) => {
      const expectedMinCommentsCount = 1
      const commentsUrl = '/api/comments'
      // Act
      const response = await request.get(commentsUrl)
      const responseJSON = await response.json()
      // Assert
      expect([responseJSON].length).toBeGreaterThanOrEqual(
        expectedMinCommentsCount,
      )
    })
  })
  test('GET comments should return an object with required fields @predefined_data', async ({
    request,
  }) => {
    //Arrange
    const commentsUrl = '/api/comments'
    const expectedResponseBodyFields = [
      'id',
      'article_id',
      'user_id',
      'body',
      'date',
    ]
    //Act
    const response = await request.get(commentsUrl)
    const responseJSON = await response.json()
    const comment = responseJSON[0]
    //Assert
    expectedResponseBodyFields.forEach(async (key) => {
      expect
        .soft(comment, `Key "${key}" should be in object`)
        .toHaveProperty(key)
      expect(comment).toHaveProperty(key)
    })
  })
})
