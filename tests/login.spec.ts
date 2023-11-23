import { LoginUser } from '../src/models/user.model'
import { LoginPage } from '../src/pages/login.page'
import { WelcomePage } from '../src/pages/welcome.page'
import { testUser2 } from '../src/test-data/user-data'
import { expect, test } from '@playwright/test'

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    //Arrange

    const loginPage = new LoginPage(page)
    //Act
    await loginPage.goto()
    await loginPage.login(testUser2)

    const welcomePage = new WelcomePage(page)
    const title = await welcomePage.title()

    //Assert
    expect(title).toContain('Welcome')
  })
  test('reject login with incorrect password', async ({ page }) => {
    //Arrange
    const loginUserData: LoginUser = {
      userEmail: testUser2.userEmail,
      userPassword: 'incorrectPassword',
    }
    const loginPage = new LoginPage(page)

    //Act
    await loginPage.goto()
    await loginPage.login(loginUserData)

    //Assert
    await expect
      .soft(loginPage.loginError)
      .toHaveText('Invalid username or password')
    const title = await loginPage.title()
    expect(title).toContain('Login')
  })
})
