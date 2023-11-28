import { randomNewArticle } from '../src/factories/article.factory'
import { ArticlePage } from '../src/pages/article.page'
import { ArticlesPage } from '../src/pages/articles.page'
import { LoginPage } from '../src/pages/login.page'
import { testUser2 } from '../src/test-data/user-data'
import { AddArticleView } from '../src/views/add-article.view'
import { expect, test } from '@playwright/test'

test.describe('Verify articles', () => {
  test('create new article @GAD_R04_01', async ({ page }) => {
    //Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(testUser2)

    const articlesPage = new ArticlesPage(page)
    await articlesPage.goto()
    // Act
    await articlesPage.addArticleButtonLogged.click()
    const addArticleView = new AddArticleView(page)
    await expect.soft(addArticleView.header).toBeVisible()

    const articleData = randomNewArticle()
    await addArticleView.createArticle(articleData)

    //Assert
    const articlePage = new ArticlePage(page)
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true })
  })
  // two negative tests below - failed to create new article not filling title/body fields - are own work in the course
  test('unsuccessful creating new article @GAD_R04_01 with empty title', async ({
    page,
  }) => {
    //Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(testUser2)

    const articlesPage = new ArticlesPage(page)
    await articlesPage.goto()
    //Act
    await articlesPage.addArticleButtonLogged.click()

    //Assert
    const addArticleView = new AddArticleView(page)
    await expect.soft(addArticleView.header).toBeVisible()
    const articleData = randomNewArticle()
    articleData.title = ''
    await addArticleView.createArticle(articleData)
    await expect(addArticleView.messageCannotAddArticle).toBeVisible()
    await expect(addArticleView.messageCannotAddArticle).toHaveText(
      'Article was not created',
    )
  })
  test('unsuccessful creating new article @GAD_R04_01 with empty body', async ({
    page,
  }) => {
    //Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(testUser2)

    const articlesPage = new ArticlesPage(page)
    await articlesPage.goto()
    //Act
    await articlesPage.addArticleButtonLogged.click()

    //Assert
    const addArticleView = new AddArticleView(page)
    await expect.soft(addArticleView.header).toBeVisible()
    const articleData = randomNewArticle()
    articleData.body = ''
    await addArticleView.createArticle(articleData)

    await expect(addArticleView.messageCannotAddArticle).toBeVisible()
    await expect(addArticleView.messageCannotAddArticle).toHaveText(
      'Article was not created',
    )
  })
})
