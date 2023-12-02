import { LoginPage } from '../src/pages/login.page'
import { WelcomePage } from '../src/pages/welcome.page'
import { testUser2 } from '../src/test-data/user-data'
import { expect, test } from '@playwright/test'

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    //Arrange
    const expectedWelcomeTitle = 'Welcome'

    const loginPage = new LoginPage(page)
    const welcomePage = new WelcomePage(page)
    //Act
    await loginPage.goto()
    await loginPage.login(testUser2)

    const title = await welcomePage.getTitle()

    //Assert
    expect(title).toContain(expectedWelcomeTitle)
  })
})
