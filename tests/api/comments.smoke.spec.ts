import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'

test.describe('Verify comments API endpoints @GAD-R08-02 @smoke', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET comments returns status code 200 ', async ({ request }) => {
      // Arrange

      const expectedStatusCode = 200

      //Act
      const response = await request.get(apiUrls.commentsUrl)

      //Assert
      expect(response.status()).toBe(expectedStatusCode)
    })
    test('GET comments should return at least one comment @predefined_data', async ({
      request,
    }) => {
      // Arrange
      const expectedMinCommentsCount = 1

      //Act
      const response = await request.get(apiUrls.commentsUrl)
      const responseJson = await response.json()

      //Assert
      expect(responseJson.length).toBeGreaterThanOrEqual(
        expectedMinCommentsCount,
      )
    })

    test('GET comments should return comment object @predefined_data', async ({
      request,
    }) => {
      const expectedMinCommentsCount = 1

      // Act
      const response = await request.get(apiUrls.commentsUrl)
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
    const expectedResponseBodyFields = [
      'id',
      'article_id',
      'user_id',
      'body',
      'date',
    ]
    //Act
    const response = await request.get(apiUrls.commentsUrl)
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
