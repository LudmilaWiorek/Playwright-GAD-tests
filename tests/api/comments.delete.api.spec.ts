import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api'
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { APIResponse, expect, test } from '@playwright/test'

test.describe('Verify comments DELETE operations @crud @article @api @delete', () => {
  let articleId: number
  let headers: Headers
  let responseComment: APIResponse

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)

    const responseArticle = await createArticleWithApi(request, headers)

    const article = await responseArticle.json()
    articleId = article.id
  })

  test.beforeEach('create a comment', async ({ request }) => {
    responseComment = await createCommentWithApi(request, headers, articleId)
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

    // wcześniej jako parametr przekazywalismy tez header,
    // teraz header sie okazal niepotrzebny bo dalismy funkcję expected status code z Getem!
    await expectGetResponseStatus(
      request,
      `${apiUrls.commentsUrl}/${comment.id}`,
      expectedStatusDeletedComment,
      headers,
    )
  })
  test('should not delete a comment with a non logged-in user @GAD-R08-06', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401
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

    await expectGetResponseStatus(
      request,
      `${apiUrls.commentsUrl}/${comment.id}`,
      expectedStatusNotDeletedComment,
      headers,
    )
  })
})
