import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { getAuthorizationHeader } from '@_src/utils/api.util'
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
    //Arrange
    const expectedStatusCode = 201
    const headers = await getAuthorizationHeader(request)
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
