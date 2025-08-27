import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api'
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { ArticlePayload } from '@_src/api/models/article.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { APIResponse, expect, test } from '@playwright/test'

test.describe('Verify articles CRUD operations @crud ', () => {
  test('should not create an article without a logged-in user @GAD-R08-03', async ({
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

  test.describe('crud operations', () => {
    let responseArticle: APIResponse
    let headers: Headers
    let articleData: ArticlePayload

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request)
    })

    test.beforeEach('create an article', async ({ request }) => {
      articleData = prepareArticlePayload()
      responseArticle = await createArticleWithApi(
        request,
        headers,
        articleData,
      )
    })

    // CREATE
    test('should create an article with logged-in user @GAD-R08-03', async () => {
      // verify if operation from beforeEach succeed
      //Arrange
      const expectedStatusCode = 201

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

    // DELETE

    test('should delete an article with logged-in user @GAD-R08-05', async ({
      request,
    }) => {
      // await new Promise((resolve) => setTimeout(resolve, 5000)) // huge technical debt!!! we will work on this in future :)
      //Arrange
      const expectedStatusCode = 200
      const articleJson = await responseArticle.json()
      const articleId = articleJson.id

      //Act
      const responseArticleDelete = await request.delete(
        `${apiUrls.articlesUrl}/${articleId}`,
        {
          headers,
        },
      )

      //Assert
      const actualResponseStatus = responseArticleDelete.status()
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      //Assert check deleted article
      const expectedDeletedArticleStatusCode = 404
      await expectGetResponseStatus(
        request,
        `${apiUrls.articlesUrl}/${articleId}`,
        expectedDeletedArticleStatusCode,
      )
    })

    test('should not delete an article with non logged-in user @GAD-R08-05', async ({
      request,
    }) => {
      //Arrange
      const expectedStatusCode = 401
      const articleJson = await responseArticle.json()
      const articleId = articleJson.id
      //Act
      const responseArticleDelete = await request.delete(
        `${apiUrls.articlesUrl}/${articleId}`,
      )
      //Assert
      const actualResponseStatus = responseArticleDelete.status()
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      //Assert check not deleted article
      const expectedNotDeletedArticleStatusCode = 200
      await expectGetResponseStatus(
        request,
        `${apiUrls.articlesUrl}/${articleId}`,
        expectedNotDeletedArticleStatusCode,
      )
    })
  })
})
