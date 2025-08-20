import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { ArticlePayload } from '@_src/api/models/article.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect } from '@_src/ui/fixtures/merge.fixture'
import { APIRequestContext, APIResponse } from '@playwright/test'

export async function createArticleWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  const articleDataFinal = articleData || prepareArticlePayload()
  const responseArticle = await request.post(apiUrls.articlesUrl, {
    headers,
    data: articleDataFinal,
  })

  //assert article exists
  const articleJson = await responseArticle.json()

  await expect(async () => {
    const responseArticleCreated = await request.get(
      `${apiUrls.articlesUrl}/${articleJson.id}`,
    )
    const expectedStatusCode = 200
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode) // if that assert will fail, function will repeat all steps
  }).toPass({ timeout: 2_000 }) //  add steps in function, and assert, and we want it to end successfully;
  //  timeout 2s says playwright has 2 sec to finish operations here, not 60, like we have in playwrightconfig.
  return responseArticle
}
