import { LoginUserModel } from '../../src/models/user.model'
import { LoginPage } from '../../src/pages/login.page'
import { WelcomePage } from '../../src/pages/welcome.page'
import { testUser2 } from '../../src/test-data/user-data'
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
  test('reject login with incorrect password @GAD-R02-01', async ({ page }) => {
    // Arrange
    const expectedLoginTitle = 'Login'
    const loginPage = new LoginPage(page)

    const loginUserData: LoginUserModel = {
      userEmail: testUser2.userEmail,
      userPassword: 'incorrectPassword',
    }

    // Act
    await loginPage.goto()
    await loginPage.login(loginUserData)

    // Assert
    await expect
      .soft(loginPage.loginError)
      .toHaveText('Invalid username or password')
    const title = await loginPage.getTitle()
    expect.soft(title).toContain(expectedLoginTitle)
  })
})
