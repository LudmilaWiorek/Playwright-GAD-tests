import { RegisterUser } from '../src/models/user.model'
import { LoginPage } from '../src/pages/login.page'
import { RegisterPage } from '../src/pages/register.page'
import { WelcomePage } from '../src/pages/welcome.page'
import { faker } from '@faker-js/faker'
//faker-js/faker/locale/en - users english speaking; pl - polish etc
import { expect, test } from '@playwright/test'

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01, @GAD_R03_02, @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const registerUserData: RegisterUser = {
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: '',
      userPassword: faker.internet.password(),
    }

    registerUserData.userEmail = faker.internet.email({
      firstName: registerUserData.userFirstName,
      lastName: registerUserData.userLastName,
    })

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
    await loginPage.login(
      registerUserData.userEmail,
      registerUserData.userPassword,
    )

    const welcomePage = new WelcomePage(page)
    const titleWelcome = await welcomePage.title()
    expect(titleWelcome).toContain('Welcome')
  })
})
