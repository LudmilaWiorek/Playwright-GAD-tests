import { Page } from '@playwright/test'

export class AddCommentView {
  bodyInputComment = this.page.locator('#body')
  saveCommentButton = this.page.getByRole('button', { name: 'Save' })
  addNewHeader = this.page.locator('//h2[text()="Add New Comment"]')

  constructor(private page: Page) {}
}
