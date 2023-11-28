import { randomNewArticle } from '../src/factories/article.factory'
import { AddArticleModel } from '../src/models/article.model'
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
  let articleData: AddArticleModel
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    addArticleView = new AddArticleView(page)
    articlesPage = new ArticlesPage(page)

    await loginPage.goto()
    await loginPage.login(testUser2)
    await articlesPage.goto()
    await articlesPage.addArticleButtonLogged.click()

    articleData = randomNewArticle()

    await expect.soft(addArticleView.header).toBeVisible()
  })

  test('create new article @GAD_R04_01', async ({ page }) => {
    //Arrange
    const articlePage = new ArticlePage(page)

    // Act
    await addArticleView.createArticle(articleData)

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true })
  })

  test('unsuccessful creating new article @GAD_R04_01 with empty title', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    articleData.title = ''

    //Act
    await addArticleView.createArticle(articleData)

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
  })

  test('unsuccessful creating new article @GAD_R04_01 with empty body', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created'
    articleData.body = ''

    //Act
    await addArticleView.createArticle(articleData)

    //Assert
    await expect(addArticleView.alertPopUp).toHaveText(expectedErrorMessage)
  })
})
