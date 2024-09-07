import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'
import { waitForResponse } from '@_src/utils/wait.util'

test.describe('Verify articles', () => {
  test('reject creating new article without title @GAD_R04_01 @GAD_R07_03 @logged', async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    const articleData = prepareRandomNewArticle()
    articleData.title = ''

    //testing API here!!
    // const responsePromise = page.waitForResponse('api/articles', {
    //   timeout: RESPONSE_TIMEOUT,
    // }) //added timeout to cut timing of waiting (added also in pw.config)
    const responsePromise = waitForResponse({ page, url: '/api/articles' })
    const expectedResponseCode = 422

    //Act
    await addArticleView.createArticle(articleData)
    const response = await responsePromise

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
    expect(response.status()).toBe(expectedResponseCode)
  })

  test('reject creating new article without body @GAD_R04_01 @GAD_R07_03 @logged', async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    const articleData = prepareRandomNewArticle()
    articleData.body = ''
    const expectedResponseCode = 422

    //Act
    await addArticleView.createArticle(articleData)
    const responsePromise = waitForResponse({ page, url: '/api/articles' })
    const response = await responsePromise

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
    expect(response.status()).toBe(expectedResponseCode)
  })

  //attention: nested describe IN describe!
  test.describe('Verify title length', () => {
    test('reject creating article with title exceeding 128 signs @GAD_R04_02 @GAD_R07_03 @logged', async ({
      addArticleView,
      page,
    }) => {
      //Arrange
      const expectedErrorMessage = 'Article was not created'
      const expectedResponseCode = 422
      const articleData = prepareRandomNewArticle(129)

      // Act
      await addArticleView.createArticle(articleData)
      const responsePromise = waitForResponse({ page, url: '/api/articles' })
      const response = await responsePromise

      //Assert
      await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
      expect(response.status()).toBe(expectedResponseCode)
    })

    test('create article with title equals 128 signs @GAD_R04_02 @GAD_R07_03 @logged', async ({
      addArticleView,
      page,
    }) => {
      //Arrange
      const articleData = prepareRandomNewArticle(128)
      // Act
      const articlePage = await addArticleView.createArticle(articleData)
      const responsePromise = waitForResponse({ page, url: '/api/articles' })
      const response = await responsePromise

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
      // expect(response.status()).toBe(expectedResponseCode) // leaving comment in purpose! :)
      expect(response.ok()).toBeTruthy()
    })
  })

  test('should return created article from API  @GAD_R07_04 @logged', async ({
    addArticleView,
    page,
  }) => {
    //Arrange
    const articleData = prepareRandomNewArticle()

    const waitParams = {
      page,
      url: '/api/articles',
      method: 'GET',
      text: articleData.title,
    }

    const responsePromise = waitForResponse(waitParams)

    // Act
    const articlePage = await addArticleView.createArticle(articleData)
    const response = await responsePromise

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    expect(response.ok()).toBeTruthy()
  })
})
