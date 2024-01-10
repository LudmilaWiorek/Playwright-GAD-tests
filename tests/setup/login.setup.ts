import { STORAGE_STATE } from '@_pw-config'
import { LoginPage } from '@_src/pages/login.page'
import { WelcomePage } from '@_src/pages/welcome.page'
import { testUser2 } from '@_src/test-data/user-data'
import { expect, test as setup } from '@playwright/test'

//setup, not test, coz it's not typical test, but preparing to sth

setup('login and save session', async ({ page }) => {
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
  await page.context().storageState({ path: STORAGE_STATE })
})
