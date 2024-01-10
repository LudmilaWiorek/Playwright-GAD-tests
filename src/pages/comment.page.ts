import { MainMenuComponent } from '@_src/components/main-menu.component'
import { BasePage } from '@_src/pages/base.page'
import { Page } from '@playwright/test'

export class CommentPage extends BasePage {
  url = '/comment.html'
  mainMenu = new MainMenuComponent(this.page)

  commentBody = this.page.getByTestId('comment-body')
  alertPopup = this.page.getByTestId('alert-popup')
  editButton = this.page.getByTestId('edit')
  returnLink = this.page.getByTestId('return')
  constructor(page: Page) {
    super(page)
  }
}
