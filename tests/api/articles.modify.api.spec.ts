import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { ArticlePayload } from '@_src/api/models/article.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { APIResponse, expect, test } from '@playwright/test'

test.describe('Verify articles modification operations @crud @article @api', () => {
  let responseArticle: APIResponse
  let headers: Headers
  let articleData: ArticlePayload

  test.beforeAll('should login', async ({ request }) => {
    headers = await getAuthorizationHeader(request)
  })

  test.beforeEach('create an article', async ({ request }) => {
    articleData = prepareArticlePayload()
    responseArticle = await createArticleWithApi(request, headers, articleData)
  })
  test('should modify and replace content for an article with logged-in user @GAD-R10-01', async ({
    request,
  }) => {
    //Arrange
    const expectedStatusCode = 200
    const articleJson = await responseArticle.json()
    const articleId = articleJson.id
    const modifiedArticleData = prepareArticlePayload()
    //Act
    const responseArticlePut = await request.put(
      `${apiUrls.articlesUrl}/${articleId}`,
      {
        headers,
        data: modifiedArticleData,
      },
    )

    //Assert
    const actualResponseStatus = responseArticlePut.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    const modifiedArticleJson = await responseArticlePut.json()

    expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title)
    expect.soft(modifiedArticleJson.body).toEqual(modifiedArticleData.body)
    expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title)
    expect.soft(modifiedArticleJson.body).not.toEqual(articleData.body)
  })

  test('should not modify and replace content for an article with non logged-in user @GAD-R10-01', async ({
    request,
  }) => {
    //Arrange
    const expectedStatusCode = 401
    const articleJson = await responseArticle.json()
    const articleId = articleJson.id
    const modifiedArticleData = prepareArticlePayload()
    //Act
    const responseArticlePut = await request.put(
      `${apiUrls.articlesUrl}/${articleId}`,
      {
        data: modifiedArticleData,
      },
    )

    //Assert
    const actualResponseStatus = responseArticlePut.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    const nonModifiedArticle = await request.get(
      `${apiUrls.articlesUrl}/${articleId}`,
      {
        data: modifiedArticleData,
      },
    )
    const nonModifiedArticleJson = await nonModifiedArticle.json()
    expect
      .soft(nonModifiedArticleJson.title)
      .not.toEqual(modifiedArticleData.title)
    expect
      .soft(nonModifiedArticleJson.title)
      .not.toEqual(modifiedArticleData.title)
    expect
      .soft(nonModifiedArticleJson.body)
      .not.toEqual(modifiedArticleData.body)
    expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title)
    expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body)
  })
})
