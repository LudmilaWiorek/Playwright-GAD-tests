import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { testUser2 } from '@_src/test-data/user-data'
import { expect, test } from '@playwright/test'

test.describe('Verify articles CRUD operations @crud @GAD-R08-03', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401

    const articlesUrl = '/api/articles'
    const randomArticleData = prepareRandomNewArticle()
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-06-30T15:44:31Z',
      image: '',
    }

    const response = await request.post(articlesUrl, { data: articleData })
    //Assert
    expect(response.status()).toBe(expectedStatusCode)
  })
  test('should create an article with logged-in user', async ({ request }) => {
    // LOGIN
    //Arrange
    const expectedStatusCode = 201
    const loginUrl = '/api/login'
    const userData = {
      email: testUser2.userEmail,
      password: testUser2.userPassword,
    }
    const responseLogin = await request.post(loginUrl, { data: userData })
    const responseLoginJSON = await responseLogin.json()

    //Authorization access token is taken from documentary Swagger!
    const headers = {
      Authorization: `Bearer ${responseLoginJSON.access_token}`,
    }
    // header below is temporary! it's prototype for this particular test.
    //   Authorization:
    //     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkRhbmlhbC5EaWNraUBkaWNraS50ZXN0IiwiZGF0YSI6IlRCRCIsImlhdCI6MTcyMjMzMzMxNSwiZXhwIjoxNzIyMzM2OTE1fQ.foaDPlXvrKZ_gi_kBvBXWmIuFzsXt38Di3wuMDzuNw8',

    //Act
    const articlesUrl = '/api/articles'
    const randomArticleData = prepareRandomNewArticle()
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-06-30T15:44:31Z',
      image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
    }

    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    })
    //Assert
    const actualResponseStatus = responseArticle.status()
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    const article = await responseArticle.json()
    expect.soft(article.title).toEqual(articleData.title)
    expect.soft(article.body).toEqual(articleData.body)
  })
})
