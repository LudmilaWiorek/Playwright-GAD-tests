import { Page } from '@playwright/test'

export class CommentsPage {
  commentsURL = '/comments.html'
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.commentsURL)
  }
  async title(): Promise<string> {
    await this.page.waitForLoadState()
    return await this.page.title()
  }
}
