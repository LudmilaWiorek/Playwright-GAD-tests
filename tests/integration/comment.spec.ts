import { RESPONSE_TIMEOUT } from '@_pw-config'
import { prepareRandomComment } from '@_src/factories/comment.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'

// here should be describe 'Verify comments'; imo its not necessary, maybe i add it in future :)
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
  const responsePromise = page.waitForResponse(
    (response) => {
      return (
        response.url().includes('api/comments') &&
        response.request().method() == 'GET'
      )
    },
    { timeout: RESPONSE_TIMEOUT },
  )
  const response = await responsePromise

  //Assert
  await expect
    .soft(articlePage.alertPopup)
    .toHaveText(expectedCommentCreatedPopup)

  expect(response.ok()).toBeTruthy()
})
