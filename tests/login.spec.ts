import { LoginPage } from '../src/pages/login.page'
import { WelcomePage } from '../src/pages/welcome.page'
import { testUser2 } from '../src/test-data/user-data'
import { expect, test } from '@playwright/test'

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    //Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    const userEmail = testUser2.userEmail
    const userPassword = testUser2.userPassword
    //Act
    await loginPage.goto()
    await loginPage.login(userEmail, userPassword)

    const welcomePage = new WelcomePage(page)
    const title = await welcomePage.title()

    //Assert
    expect(title).toContain('Welcome')
  })
})
