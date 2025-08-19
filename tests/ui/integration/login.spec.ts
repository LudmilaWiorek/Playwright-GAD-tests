import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { LoginUserModel } from '@_src/ui/models/user.model'
import { testUser2 } from '@_src/ui/test-data/user-data'

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ loginPage }) => {
    //Arrange
    const expectedWelcomeTitle = 'Welcome'

    //Act
    await loginPage.goto()
    const welcomePage = await loginPage.login(testUser2)

    const title = await welcomePage.getTitle()

    //Assert
    expect(title).toContain(expectedWelcomeTitle)
  })
  test('reject login with incorrect password @GAD-R02-01', async ({
    loginPage,
  }) => {
    // Arrange
    const expectedLoginTitle = 'Login'

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
