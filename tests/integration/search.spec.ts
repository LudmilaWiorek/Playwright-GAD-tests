import { expect, test } from '@_src/fixtures/merge.fixture'
import { waitForResponse } from '@_src/utils/wait.util'

test.describe('Verify search component for articles', () => {
  test('go button should fetch articles @GAD-R07-01', async ({
    articlesPage,
    page,
  }) => {
    // Arrange
    await expect(articlesPage.goSearchButton).toBeInViewport()
    const responsePromise = waitForResponse(page, '/api/articles')
    const expectDefaultArticleNumber = 6
    // Act
    await articlesPage.goSearchButton.click()
    const response = await responsePromise
    const body = await response.json()
    // Assert
    expect(response.ok()).toBeTruthy() //method ok - check if response code is between 200-299
    expect(body).toHaveLength(expectDefaultArticleNumber)
  })
})
