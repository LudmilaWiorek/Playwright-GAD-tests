import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { prepareRandomComment } from '@_src/factories/comment.factory'
import { testUser2 } from '@_src/test-data/user-data'
import { expect, test } from '@playwright/test'

test.describe('Verify comments CRUD operations @api @GAD-R09-02', () => {
  let headers: { [key: string]: string }
  let articleId: number
  let articleData: {
    [key: string]: string
  }
  test.beforeAll('login and create article', async ({ request }) => {
    //login
    const loginUrl = '/api/login'
    const userData = {
      email: testUser2.userEmail,
      password: testUser2.userPassword,
    }
    const responseLogin = await request.post(loginUrl, { data: userData })
    const responseLoginJSON = await responseLogin.json()

    headers = {
      Authorization: `Bearer ${responseLoginJSON.access_token}`,
    }

    //create article
    const articlesUrl = '/api/articles'
    const randomArticleData = prepareRandomNewArticle()

    const date = new Date()
    articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      //special format of date so it's not hardcoded
      date: date.toISOString(),
      image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
    }
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    })

    const article = await responseArticle.json()
    // let's get article id, that we'll need to verify adding comment later to
    articleId = article.id
  })
  test('should not add comment without a logged-in user', async ({
    request,
  }) => {
    const expectedStatusCode = 401
    const commentsUrl = '/api/comments'

    const randomCommentData = prepareRandomComment()
    const commentData = {
      body: randomCommentData.body,
      date: articleData.date,
    }

    const response = await request.post(commentsUrl, { data: commentData })
    //Assert
    expect(response.status()).toBe(expectedStatusCode)
  })

  test('should add comment with logged-in user', async ({ request }) => {
    //Arrange
    const expectedStatusCode = 201

    //Act
    const commentsUrl = '/api/comments'
    const randomCommentData = prepareRandomComment()

    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: articleData.date,
    }
    const responseComment = await request.post(commentsUrl, {
      headers,
      data: commentData,
    })
    //Assert
    const actualResponseStatus = responseComment.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    const comment = await responseComment.json()
    expect.soft(comment.body).toEqual(commentData.body)
  })
})
