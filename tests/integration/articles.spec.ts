import { RESPONSE_TIMEOUT } from '@_pw-config'
import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'

test.describe('Verify articles', () => {
  test('reject creating new article without title @GAD_R04_01 @logged', async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    const articleData = prepareRandomNewArticle()
    articleData.title = ''

    //testing API here!!
    const responsePromise = page.waitForResponse('api/articles', {
      timeout: RESPONSE_TIMEOUT,
    }) //added timeout to cut timing of waiting (added also in pw.config)
    const expectedResponseCode = 422

    //Act
    await addArticleView.createArticle(articleData)
    const response = await responsePromise

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
    expect(response.status()).toBe(expectedResponseCode)
  })

  test('reject creating new article without body @GAD_R04_01  @logged', async ({
    addArticleView,
  }) => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    const articleData = prepareRandomNewArticle()
    articleData.body = ''

    //Act
    await addArticleView.createArticle(articleData)

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
  })

  //attention: nested describe IN describe!
  test.describe('Verify title length', () => {
    test('reject creating article with title exceeding 128 signs @GAD_R04_02  @logged', async ({
      addArticleView,
    }) => {
      //Arrange
      const expectedErrorMessage = 'Article was not created'
      const articleData = prepareRandomNewArticle(129)

      // Act
      await addArticleView.createArticle(articleData)

      //Assert
      await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
    })

    test('create article with title equals 128 signs @GAD_R04_02  @logged', async ({
      addArticleView,
    }) => {
      //Arrange
      const articleData = prepareRandomNewArticle(128)

      // Act
      const articlePage = await addArticleView.createArticle(articleData)

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    })
  })
})
