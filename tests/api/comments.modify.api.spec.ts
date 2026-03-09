import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory'
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory'
import { CommentPayload } from '@_src/api/models/comment.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { APIResponse, expect, test } from '@playwright/test'

test.describe('Verify comments modification operations @crud @comment @api', () => {
  let articleId: number
  let headers: Headers
  let responseComment: APIResponse
  let commentData: CommentPayload

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)
    const responseArticle = await createArticleWithApi(request, headers)

    const article = await responseArticle.json()
    articleId = article.id
  })

  test.beforeEach('create a comment', async ({ request }) => {
    responseComment = await createCommentWithApi(request, headers, articleId)
    commentData = await responseComment.json()
  })
  test('should modify a comment with logged-in user @GAD-R10-02', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 200
    const comment = await responseComment.json()
    const modifiedCommentData = prepareCommentPayload(articleId)
    // Act
    const responseCommentModified = await request.put(
      `${apiUrls.commentsUrl}/${comment.id}`,
      {
        headers,
        data: modifiedCommentData,
      },
    )
    // Assert
    const actualResponseStatus = responseCommentModified.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    // Assert modified comment
    const modifiedCommentGet = await request.get(
      `${apiUrls.commentsUrl}/${comment.id}`,
    )
    const modifiedCommentGetJson = await modifiedCommentGet.json()
    expect.soft(modifiedCommentGetJson.body).toEqual(modifiedCommentData.body)
    expect.soft(modifiedCommentGetJson.body).not.toEqual(commentData.body)
  })
  test('should not modify comment with non logged-in user @GAD-R10-02', async ({
    request,
  }) => {
    //Arrange
    const expectedStatusCode = 401
    const comment = await responseComment.json()
    const modifiedCommentData = prepareCommentPayload(articleId)
    // Act
    const responseCommentNotModified = await request.put(
      `${apiUrls.commentsUrl}/${comment.id}`,
      {
        data: modifiedCommentData,
      },
    )
    // Assert
    const actualResponseStatus = responseCommentNotModified.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)
    // Assert non modified comment
    const modifiedCommentGet = await request.get(
      `${apiUrls.commentsUrl}/${comment.id}`,
    )
    const modifiedCommentGetJson = await modifiedCommentGet.json()
    expect
      .soft(modifiedCommentGetJson.body)
      .not.toEqual(modifiedCommentData.body)
    expect.soft(modifiedCommentGetJson.body).toEqual(commentData.body)
  })

  test('should create a comment when modification on nonexisting id requested with logged-in user @GAD-R10-02', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 201
    const commentData = prepareCommentPayload(articleId)
    // Act
    const responseCommentPut = await request.put(
      `${apiUrls.commentsUrl}/${new Date().valueOf()}`,
      {
        headers,
        data: commentData,
      },
    )
    // Assert
    const actualResponseStatus = responseCommentPut.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)
    // Assert modified comment
    const responseCommentPutJson = await responseCommentPut.json()
    const commentGet = await request.get(
      `${apiUrls.commentsUrl}/${responseCommentPutJson.id}`,
    )
    const commentGetJson = await commentGet.json()
    expect.soft(commentGetJson.body).toEqual(commentData.body)
  })
})
