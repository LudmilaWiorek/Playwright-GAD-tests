import { ArticlesPage } from '../src/pages/articles.page'
import { CommentsPage } from '../src/pages/comments.page'
import { HomePage } from '../src/pages/home.page'
import { expect, test } from '@playwright/test'

test.describe('Verify service main pages', () => {
  test('home page title @GAD-R01-01', async ({ page }) => {
    // added tag bounded to requirements - run test using command: npx playwright test --grep @GAD-R01-01; tags are also visible on reports; if we want to run test with tag @GAD - we have to write: npx playwright test --grep "@GAD"
    //Arrange
    const homePage = new HomePage(page)

    //Act
    await homePage.goto()

    //Assert
    const title = await homePage.title()
    expect(title).toContain('GAD')
  })

  test('articles page title @GAD-R01-02', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page)

    //Act
    await articlesPage.goto()

    //Assert
    await expect(page).toHaveTitle(/Articles/)
    const title = await articlesPage.title()
    expect(title).toContain('Articles')
  })

  test('home page title simple', async ({ page }) => {
    // Act
    await page.goto('')

    // Assert
    await expect(page).toHaveTitle(/GAD/)
  })

  test('comments page title @GAD-R01-02', async ({ page }) => {
    //Arrange
    const commentsPage = new CommentsPage(page)

    //Act
    await commentsPage.goto()

    //Assert
    await expect(page).toHaveTitle(/Comments/)
    const title = await commentsPage.title()
    expect(title).toContain('Comments')
  })
})
