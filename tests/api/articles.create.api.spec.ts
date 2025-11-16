import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@playwright/test'

test.describe('Verify articles create operations @crud @create @api @article', () => {
  test('should not create an article without a logged-in user @GAD-R09-01', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401

    const articleData = prepareArticlePayload()
    const response = await request.post(apiUrls.articlesUrl, {
      data: articleData,
    })
    //Assert
    expect(response.status()).toBe(expectedStatusCode)
  })

  test.describe('create operations', () => {
    let headers: Headers

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request)
    })

    // CREATE
    test('should create an article with logged-in user @GAD-R08-03', async ({
      request,
    }) => {
      // verify if operation from beforeEach succeed
      //Arrange
      const expectedStatusCode = 201
      //act
      const articleData = prepareArticlePayload()
      const responseArticle = await createArticleWithApi(
        request,
        headers,
        articleData,
      )

      //Assert
      const actualResponseStatus = responseArticle.status()
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      const articleJson = await responseArticle.json()
      expect.soft(articleJson.title).toEqual(articleData.title)
      expect.soft(articleJson.body).toEqual(articleData.body)
    })
  })
})
