import { Page } from '@playwright/test'

export class ArticlesPage {
  articlesURL = '/articles.html'
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.articlesURL)
  }
  async title(): Promise<string> {
    await this.page.waitForLoadState()
    return await this.page.title()
  }
}
