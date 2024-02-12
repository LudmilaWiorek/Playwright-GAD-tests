import { STORAGE_STATE } from '@_pw-config'
import { expect, test as setup } from '@_src/fixtures/merge.fixture'
import { testUser2 } from '@_src/test-data/user-data'

//setup, not test, coz it's not typical test, but preparing to sth

setup('login and save session', async ({ loginPage, page }) => {
  //Arrange
  const expectedWelcomeTitle = 'Welcome'

  //Act
  const welcomePage = await loginPage.login(testUser2)

  const title = await welcomePage.getTitle()

  //Assert
  expect(title).toContain(expectedWelcomeTitle)
  await page.context().storageState({ path: STORAGE_STATE })
})
