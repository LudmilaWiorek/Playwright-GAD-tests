import { expect, test } from '@_src/fixtures/merge.fixture'

test.describe('Verify service main pages', () => {
  test('home page title @GAD-R01-01', async ({ homePage }) => {
    // added tag bounded to requirements - run test using command: npx playwright test --grep @GAD-R01-01;
    // tags are also visible on reports; if we want to run test with tag @GAD - we have to write: npx playwright test --grep "@GAD"
    //Arrange
    const expectedHomePageTitle = 'GAD'
    //Assert
    const title = await homePage.getTitle()
    expect(title).toContain(expectedHomePageTitle)
  })

  test('articles page title @GAD-R01-02', async ({ articlesPage }) => {
    // Arrange
    const expectedArticlesTitle = 'Articles'
    //Assert
    const title = await articlesPage.getTitle()
    expect(title).toContain(expectedArticlesTitle)
  })

  test('comments page title @GAD-R01-02', async ({ commentsPage }) => {
    //Arrange
    const expectedCommentsTitle = 'Comments'
    const title = await commentsPage.getTitle()
    //Assert
    expect(title).toContain(expectedCommentsTitle)
  })

  test('home page title simple', async ({ page }) => {
    // Act
    await page.goto('')
    // Assert
    await expect(page).toHaveTitle(/GAD/)
  })
})
