import { prepareRandomComment } from '@_src/factories/comment.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'
import { waitForResponse } from '@_src/utils/wait.util'

test.describe('Verify comment', () => {
  test('should return created comment - API validation @GAD_R07_06 @logged', async ({
    createRandomArticle,
    page,
  }) => {
    //Arrange
    const expectedCommentCreatedPopup = 'Comment was created'

    const newCommentData = prepareRandomComment()
    let articlePage = createRandomArticle.articlePage
    const addCommentView = await articlePage.clickAddCommentButton()

    //Act
    articlePage = await addCommentView.createComment(newCommentData)
    const responsePromise = waitForResponse(page, '/api/comments', 'GET')

    const response = await responsePromise

    //Assert
    await expect
      .soft(articlePage.alertPopup)
      .toHaveText(expectedCommentCreatedPopup)

    expect(response.ok()).toBeTruthy()
  })
})
