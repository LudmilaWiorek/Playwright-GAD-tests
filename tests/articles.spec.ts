import { prepareRandomNewArticle } from '../src/factories/article.factory'
import { ArticlePage } from '../src/pages/article.page'
import { ArticlesPage } from '../src/pages/articles.page'
import { LoginPage } from '../src/pages/login.page'
import { testUser2 } from '../src/test-data/user-data'
import { AddArticleView } from '../src/views/add-article.view'
import { expect, test } from '@playwright/test'

test.describe('Verify articles', () => {
  let loginPage: LoginPage
  let addArticleView: AddArticleView
  let articlesPage: ArticlesPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    addArticleView = new AddArticleView(page)
    articlesPage = new ArticlesPage(page)

    await loginPage.goto()
    await loginPage.login(testUser2)
    await articlesPage.goto()
    await articlesPage.addArticleButtonLogged.click()

    await expect.soft(addArticleView.addNewHeader).toBeVisible()
  })

  test('reject creating new article without title @GAD_R04_01 @logged', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    const articleData = prepareRandomNewArticle()
    articleData.title = ''
    //Act
    await addArticleView.createArticle(articleData)

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
  })

  test('reject creating new article without body @GAD_R04_01', async () => {
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
    test('reject creating article with title exceeding 128 signs @GAD_R04_02', async () => {
      const expectedErrorMessage = 'Article was not created'
      const articleData = prepareRandomNewArticle(129)

      // Act
      await addArticleView.createArticle(articleData)

      //Assert
      await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
    })

    test('create article with title equals 128 signs @GAD_R04_02', async ({
      page,
    }) => {
      const articlePage = new ArticlePage(page)
      const articleData = prepareRandomNewArticle(128)

      // Act
      await addArticleView.createArticle(articleData)

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    })
  })
})
