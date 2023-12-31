import { prepareRandomUser } from '../../src/factories/user.factory'
import { RegisterUserModel } from '../../src/models/user.model'
import { LoginPage } from '../../src/pages/login.page'
import { RegisterPage } from '../../src/pages/register.page'
import { WelcomePage } from '../../src/pages/welcome.page'
//faker-js/faker/locale/en - users english speaking; pl - polish etc
import { expect, test } from '@playwright/test'

test.describe('Verify register', () => {
  let registerPage: RegisterPage
  let registerUserData: RegisterUserModel

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page)
    registerUserData = prepareRandomUser()
    await registerPage.goto()
  })
  test('register with correct data and login @GAD_R03_01, @GAD_R03_02, @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const expectedAlertPopUpText = 'User created'
    const loginPage = new LoginPage(page)
    const welcomePage = new WelcomePage(page)

    //Act
    await registerPage.register(registerUserData)

    //Assert
    const expectedLoginTitle = 'Login'
    const expectedWelcomeTitle = 'Welcome'
    await expect(registerPage.alertPopUp).toHaveText(expectedAlertPopUpText)
    await loginPage.waitForPageToLoadUrl()
    const titleLogin = await loginPage.getTitle()
    expect.soft(titleLogin).toContain(expectedLoginTitle)

    // Assert test login
    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    })

    const titleWelcome = await welcomePage.getTitle()
    expect(titleWelcome).toContain(expectedWelcomeTitle)
  })

  test('not register with incorrect email @GAD_R03_04', async () => {
    //Arrange
    const expectedErrorText = 'Please provide a valid email address'
    registerUserData.userEmail = 'dfhsh#'

    //Act
    await registerPage.register(registerUserData)

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText)
  })

  test('not register with not touching empty email input @GAD_R03_04', async () => {
    //Arrange
    const expectedErrorText = 'This field is required'

    //Act
    await registerPage.userFirstNameInput.fill(registerUserData.userFirstName)
    await registerPage.userLastNameInput.fill(registerUserData.userLastName)
    await registerPage.userPasswordInput.fill(registerUserData.userPassword)
    await registerPage.registerButton.click()

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText)
  })
})
