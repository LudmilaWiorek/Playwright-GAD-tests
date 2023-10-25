import { Page } from '@playwright/test'

export class HomePage {
  homeURL = '/'
  constructor(private page: Page) {}
  async goto(): Promise<void> {
    await this.page.goto(this.homeURL)
  }
  async title(): Promise<string> {
    return await this.page.title()
  }
}
