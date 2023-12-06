import { prepareRandomNewArticle } from '../../src/factories/article.factory'
import { AddArticleModel } from '../../src/models/article.model'
import { ArticlePage } from '../../src/pages/article.page'
import { ArticlesPage } from '../../src/pages/articles.page'
import { LoginPage } from '../../src/pages/login.page'
import { testUser2 } from '../../src/test-data/user-data'
import { AddArticleView } from '../../src/views/add-article.view'
import { AddCommentView } from '../../src/views/add-comment.view'
import { expect, test } from '@playwright/test'

//refactor names in all files: F2, changing name, press left shift + enter
test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage
  let addArticleView: AddArticleView
  let articlesPage: ArticlesPage
  let articleData: AddArticleModel
  let articlePage: ArticlePage
  let addCommentView: AddCommentView

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    addArticleView = new AddArticleView(page)
    articlesPage = new ArticlesPage(page)
    articlePage = new ArticlePage(page)
    addCommentView = new AddCommentView(page)

    articleData = prepareRandomNewArticle()

    await loginPage.goto()
    await loginPage.login(testUser2)
    await articlesPage.goto()
    await articlesPage.addArticleButtonLogged.click()
    await addArticleView.createArticle(articleData)
  })

  test('create new comment @GAD_R05_01', async () => {
    //Create new comment
    //Arrange
    const expectedCommentCreatedPopup = 'Comment was created'
    const commentBodyText = 'hello world'
    const expectedAddCommentHeader = 'Add New Comment'
    // Act
    await articlePage.addCommentButton.click()
    await expect(addCommentView.addNewHeader).toHaveText(
      expectedAddCommentHeader,
    )
    await addCommentView.bodyInputComment.fill(commentBodyText)
    await addCommentView.saveCommentButton.click()

    //Assert
    await expect(articlePage.commentPopUp).toHaveText(
      expectedCommentCreatedPopup,
    )
  })
})
