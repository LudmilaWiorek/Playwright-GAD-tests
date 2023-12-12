import { prepareRandomNewArticle } from '../../src/factories/article.factory'
import { prepareRandomComment } from '../../src/factories/comment.factory'
import { AddArticleModel } from '../../src/models/article.model'
import { AddCommentModel } from '../../src/models/comment.model'
import { ArticlePage } from '../../src/pages/article.page'
import { ArticlesPage } from '../../src/pages/articles.page'
import { CommentPage } from '../../src/pages/comment.page'
import { LoginPage } from '../../src/pages/login.page'
import { testUser2 } from '../../src/test-data/user-data'
import { AddArticleView } from '../../src/views/add-article.view'
import { AddCommentView } from '../../src/views/add-comment.view'
import { EditCommentView } from '../../src/views/edit-comment.view'
import { expect, test } from '@playwright/test'

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage
  let addArticleView: AddArticleView
  let articlesPage: ArticlesPage
  let articleData: AddArticleModel
  let articlePage: ArticlePage
  let addCommentView: AddCommentView
  let commentPage: CommentPage
  let editCommentView: EditCommentView

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    addArticleView = new AddArticleView(page)
    articlesPage = new ArticlesPage(page)
    articlePage = new ArticlePage(page)
    addCommentView = new AddCommentView(page)
    commentPage = new CommentPage(page)
    editCommentView = new EditCommentView(page)

    articleData = prepareRandomNewArticle()

    await loginPage.goto()
    await loginPage.login(testUser2)
    await articlesPage.goto()
    await articlesPage.addArticleButtonLogged.click()
    await addArticleView.createArticle(articleData)
  })

  test('operate on comments @GAD_R05_01, @GAD-R05-02, @GAD-R05-03', async () => {
    const expectedCommentCreatedPopup = 'Comment was created'

    const newCommentData = prepareRandomComment()

    //added 1. TEST STEP into test!!! test step is asynchronous, so must use "await"
    await test.step('create new comment', async () => {
      //Arrange
      const expectedAddCommentHeader = 'Add New Comment'
      //Act
      await articlePage.addCommentButton.click()
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentHeader)
      await addCommentView.createComment(newCommentData)
      //Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup)
    })

    //2. TEST STEP
    await test.step('verify comment', async () => {
      //Act
      const articleComment = articlePage.getArticleComment(newCommentData.body)
      await expect(articleComment.body).toHaveText(newCommentData.body)
      await articleComment.link.click()
      //Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body)
    })

    //Added let editCommentData, so it can be read in both steps below
    let editCommentData: AddCommentModel
    //3. TEST STEP
    await test.step('update comment', async () => {
      //Arrange
      const expectedCommentUpdatedPopup = 'Comment was updated'

      editCommentData = prepareRandomComment()
      //Act
      await commentPage.editButton.click()

      // grouping action in one function updateComment in editCommentView
      await editCommentView.updateComment(editCommentData)
      //Assert
      await expect(commentPage.alertPopup).toHaveText(
        expectedCommentUpdatedPopup,
      )
      await expect
        .soft(commentPage.commentBody)
        .toHaveText(editCommentData.body)
    })

    //4. TEST STEP
    await test.step('verify updated comment in article page', async () => {
      //Act
      await commentPage.returnLink.click()

      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      )
      //Assert
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body)
    })

    //5. TEST STEP for requirement: user can add more than one comment
    await test.step('create and verify second comment', async () => {
      const secondCommentData = prepareRandomComment()
      //Act
      await articlePage.addCommentButton.click()
      await addCommentView.createComment(secondCommentData)

      //Assert
      const articleComment = articlePage.getArticleComment(
        secondCommentData.body,
      )
      await expect(articleComment.body).toHaveText(secondCommentData.body)
      await articleComment.link.click()
      await expect(commentPage.commentBody).toHaveText(secondCommentData.body)
    })
  })
})
