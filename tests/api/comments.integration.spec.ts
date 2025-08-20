import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory'
import { CommentPayload } from '@_src/api/models/comment.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { APIResponse, expect, test } from '@playwright/test'

test.describe('Verify comments CRUD operations @crud', () => {
  let articleId: number
  let headers: Headers

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)

    const responseArticle = await createArticleWithApi(request, headers)

    const article = await responseArticle.json()
    articleId = article.id
  })

  test('should not create a comment without a logged-in user @GAD-R08-04', async ({
    request,
  }) => {
    const expectedStatusCode = 401
    const commentData = prepareCommentPayload(articleId)

    const response = await request.post(apiUrls.commentsUrl, {
      data: commentData,
    })
    //Assert
    expect(response.status()).toBe(expectedStatusCode)
  })

  test.describe('crud operations', () => {
    let responseComment: APIResponse
    let commentData: CommentPayload

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId)
      responseComment = await request.post(apiUrls.commentsUrl, {
        headers,
        data: commentData,
      })
      const commentJson = await responseComment.json()
      // await new Promise((resolve) => setTimeout(resolve, 5000))
      await expect(async () => {
        const responseCommentCreated = await request.get(
          `${apiUrls.commentsUrl}/${commentJson.id}`,
        )
        const expectedStatusCode = 200
        expect(
          responseCommentCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })
    })

    test('should create a comment with logged-in user @GAD-R08-04', async () => {
      //Arrange
      const expectedStatusCode = 201

      //Assert
      const actualResponseStatus = responseComment.status()
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      const comment = await responseComment.json()
      expect.soft(comment.body).toEqual(commentData.body)
    })

    test('should delete comment with a logged-in user @GAD-R08-06', async ({
      request,
    }) => {
      const expectedStatusCode = 200
      const comment = await responseComment.json()

      const responseCommentDeleted = await request.delete(
        `${apiUrls.commentsUrl}/${comment.id}`,
        { headers },
      )

      const actualResponseStatus = responseCommentDeleted.status()
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // assert deleted comment
      const expectedStatusDeletedComment = 404

      const responseCommentDeletedGet = await request.get(
        `${apiUrls.commentsUrl}/${comment.id}`,
        { headers },
      )
      expect(
        responseCommentDeletedGet.status(),
        `expect status code ${expectedStatusDeletedComment}, and received ${responseCommentDeletedGet.status()}`,
      ).toBe(expectedStatusDeletedComment)
    })
    test('should not delete a comment with a non logged-in user @GAD-R08-06', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401 //unauthorized
      const comment = await responseComment.json()
      // Act
      const responseCommentNotDeleted = await request.delete(
        `${apiUrls.commentsUrl}/${comment.id}`,
      )
      // Assert
      const actualResponseStatus = responseCommentNotDeleted.status()
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)
      // Assert non deleted comment
      const expectedStatusNotDeletedComment = 200

      const responseCommentNotDeletedGet = await request.get(
        `${apiUrls.commentsUrl}/${comment.id}`,
      )
      expect(
        responseCommentNotDeletedGet.status(),
        `expect status code ${expectedStatusNotDeletedComment}, and received ${responseCommentNotDeletedGet.status()}`,
      ).toBe(expectedStatusNotDeletedComment)
    })
  })
})
