import { randomUserData } from '../src/factories/user.factory'
import { LoginPage } from '../src/pages/login.page'
import { RegisterPage } from '../src/pages/register.page'
import { WelcomePage } from '../src/pages/welcome.page'
//faker-js/faker/locale/en - users english speaking; pl - polish etc
import { expect, test } from '@playwright/test'

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01, @GAD_R03_02, @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const registerUserData = randomUserData()
    const registerPage = new RegisterPage(page)
    //Act
    await registerPage.goto()
    await registerPage.register(registerUserData)

    const expectedAlertPopUpText = 'User created'

    //Assert
    await expect(registerPage.alertPopUp).toHaveText(expectedAlertPopUpText)
    const loginPage = new LoginPage(page)
    await loginPage.waitForPageToLoadUrl()
    const titleLogin = await loginPage.title()
    expect.soft(titleLogin).toContain('Login')

    //Assert2
    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    })

    const welcomePage = new WelcomePage(page)
    const titleWelcome = await welcomePage.title()
    expect(titleWelcome).toContain('Welcome')
  })

  test('not register with incorrect email @GAD_R03_04', async ({ page }) => {
    //Arrange
    const registerUserData = randomUserData()
    registerUserData.userEmail = 'dfhsh#'
    const expectedErrorText = 'Please provide a valid email address'

    const registerPage = new RegisterPage(page)
    //Act
    await registerPage.goto()
    await registerPage.register(registerUserData)

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText)
  })
  test('not register with not touching empty email input @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange
    const registerPage = new RegisterPage(page)
    const registerUserData = randomUserData()
    const expectedErrorText = 'This field is required'

    //Act
    await registerPage.goto()
    await registerPage.userFirstNameInput.fill(registerUserData.userFirstName)
    await registerPage.userLastNameInput.fill(registerUserData.userLastName)
    await registerPage.userPasswordInput.fill(registerUserData.userPassword)
    await registerPage.registerButton.click()

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText)
  })
})
