import { MainMenuComponent } from '../components/main-menu.component'
import { BasePage } from './base.page'
import { Page } from '@playwright/test'

export class CommentPage extends BasePage {
  url = '/comment.html'
  mainMenu = new MainMenuComponent(this.page)

  commentBody = this.page.getByTestId('comment-body')
  // commentPopUp = this.page.getByTestId('alert-popup')

  constructor(page: Page) {
    super(page)
  }
}
