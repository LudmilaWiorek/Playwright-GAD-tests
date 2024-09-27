import {
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util'
import { expect, test } from '@playwright/test'

test.describe('Verify comments CRUD operations @crud @GAD-R09-02', () => {
  let headers: { [key: string]: string }
  let articleId: number

  test.beforeAll('login and create article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)

    const articlesUrl = '/api/articles'
    const articleData = prepareArticlePayload() // import function from api.utils

    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    })

    const article = await responseArticle.json()
    // let's get article id, that we'll need to verify adding comment later to
    articleId = article.id
  })
  test('should not add comment without a logged-in user', async ({
    request,
  }) => {
    const expectedStatusCode = 401
    const commentsUrl = '/api/comments'

    const commentData = prepareCommentPayload(articleId)

    const response = await request.post(commentsUrl, { data: commentData })
    //Assert
    expect(response.status()).toBe(expectedStatusCode)
  })

  test('should add comment with logged-in user', async ({ request }) => {
    //Arrange
    const expectedStatusCode = 201

    //Act
    const commentsUrl = '/api/comments'
    const commentData = prepareCommentPayload(articleId)
    const responseComment = await request.post(commentsUrl, {
      headers,
      data: commentData,
    })
    //Assert
    const actualResponseStatus = responseComment.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    const comment = await responseComment.json()
    expect.soft(comment.body).toEqual(commentData.body)
  })
})
