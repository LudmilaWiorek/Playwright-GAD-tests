import { AddCommentModel } from '@_src/models/comment.model'
import { ArticlePage } from '@_src/pages/article.page'
import { Page } from '@playwright/test'

export class AddCommentView {
  bodyInput = this.page.locator('#body')
  saveCommentButton = this.page.getByRole('button', { name: 'Save' })
  addNewHeader = this.page.locator('//h2[text()="Add New Comment"]')

  constructor(private page: Page) {}
  async createComment(commentData: AddCommentModel): Promise<ArticlePage> {
    await this.bodyInput.fill(commentData.body)
    await this.saveCommentButton.click()
    return new ArticlePage(this.page)
  }
}
