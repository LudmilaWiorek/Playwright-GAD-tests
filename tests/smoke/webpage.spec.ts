import { ArticlesPage } from '@_src/pages/articles.page'
import { CommentsPage } from '@_src/pages/comments.page'
import { HomePage } from '@_src/pages/home.page'
import { expect, test } from '@playwright/test'

test.describe('Verify service main pages', () => {
  test('home page title @GAD-R01-01', async ({ page }) => {
    // added tag bounded to requirements - run test using command: npx playwright test --grep @GAD-R01-01; tags are also visible on reports; if we want to run test with tag @GAD - we have to write: npx playwright test --grep "@GAD"
    //Arrange
    const expectedHomePageTitle = 'GAD'
    const homePage = new HomePage(page)

    //Act
    await homePage.goto()

    //Assert
    const title = await homePage.getTitle()
    expect(title).toContain(expectedHomePageTitle)
  })

  test('articles page title @GAD-R01-02', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page)

    //Act
    await articlesPage.goto()
    await page.waitForLoadState()
    //Assert
    const title = await articlesPage.getTitle()
    await expect(page).toHaveTitle(/Articles/)
    const expectedArticlesTitle = 'Articles'
    expect(title).toContain(expectedArticlesTitle)
  })

  test('home page title simple', async ({ page }) => {
    // Act
    await page.goto('')
    // Assert
    await expect(page).toHaveTitle(/GAD/)
  })

  test('comments page title @GAD-R01-02', async ({ page }) => {
    //Arrange
    const expectedCommentsTitle = 'Comments'
    const commentsPage = new CommentsPage(page)

    //Act
    await commentsPage.goto()

    //Assert
    const title = await commentsPage.getTitle()
    // await expect(page).toHaveTitle(/Comments/)
    expect(title).toContain(expectedCommentsTitle)
  })
})
