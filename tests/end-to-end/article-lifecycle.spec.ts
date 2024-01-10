import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { AddArticleModel } from '@_src/models/article.model'
import { ArticlePage } from '@_src/pages/article.page'
import { ArticlesPage } from '@_src/pages/articles.page'
import { AddArticleView } from '@_src/views/add-article.view'
import { expect, test } from '@playwright/test'

//test.describe.configure - serial -> makes tests launch first, then second
test.describe.configure({ mode: 'serial' })
test.describe('Create, verify and delete article', () => {
  let addArticleView: AddArticleView
  let articlesPage: ArticlesPage
  let articleData: AddArticleModel
  let articlePage: ArticlePage

  //must understand what's going on in beforeEach!
  test.beforeEach(async ({ page }) => {
    addArticleView = new AddArticleView(page)
    articlesPage = new ArticlesPage(page)
    articlePage = new ArticlePage(page)

    await articlesPage.goto()
  })

  test('create new article @GAD_R04_01 @logged', async () => {
    //Arrange
    articleData = prepareRandomNewArticle()

    // Act
    await articlesPage.addArticleButtonLogged.click()
    await expect.soft(addArticleView.addNewHeader).toBeVisible()
    await addArticleView.createArticle(articleData)

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true })
  })
  //below test requires data from previous test
  test('user can access single article @GAD_R04_03 @logged', async () => {
    //Act
    await articlesPage.gotoArticle(articleData.title)

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title)
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true })
  })

  test('user can delete his own article @GAD_R04_04 @logged', async () => {
    //Arrange
    const expectedArticlesTitle = 'Articles'
    const expectedNoResultText = 'No data'
    await articlesPage.gotoArticle(articleData.title)

    //Act
    await articlePage.deleteArticle()

    //Assert
    await articlesPage.waitForPageToLoadUrl()
    const title = await articlesPage.getTitle()
    expect(title).toContain(expectedArticlesTitle)

    await articlesPage.searchArticle(articleData.title)
    await expect(articlesPage.noResultText).toHaveText(expectedNoResultText)
  })
})
