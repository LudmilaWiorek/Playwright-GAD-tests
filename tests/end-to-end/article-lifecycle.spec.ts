import { randomNewArticle } from '../../src/factories/article.factory'
import { AddArticleModel } from '../../src/models/article.model'
import { ArticlePage } from '../../src/pages/article.page'
import { ArticlesPage } from '../../src/pages/articles.page'
import { LoginPage } from '../../src/pages/login.page'
import { testUser2 } from '../../src/test-data/user-data'
import { AddArticleView } from '../../src/views/add-article.view'
import { expect, test } from '@playwright/test'

//test.describe.configure - serial -> makes tests launch first, then second
test.describe.configure({ mode: 'serial' })
test.describe('Create and verify article', () => {
  let loginPage: LoginPage
  let addArticleView: AddArticleView
  let articlesPage: ArticlesPage
  let articleData: AddArticleModel
  let articlePage: ArticlePage

  //must understand what's going on in beforeEach!
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    addArticleView = new AddArticleView(page)
    articlesPage = new ArticlesPage(page)
    articlePage = new ArticlePage(page)
    await loginPage.goto()
    await loginPage.login(testUser2)
    await articlesPage.goto()
  })

  test('create new article @GAD_R04_01', async () => {
    //Arrange
    articleData = randomNewArticle()

    // Act
    await articlesPage.addArticleButtonLogged.click()
    await expect.soft(addArticleView.header).toBeVisible()
    await addArticleView.createArticle(articleData)

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true })
  })
  //below test requires data from previous test
  test('user can access single article @GAD_R04_03', async () => {
    //Act
    await articlesPage.gotoArticle(articleData.title)

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true })
  })
})
