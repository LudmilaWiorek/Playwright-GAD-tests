import { prepareRandomNewArticle } from '@_src/factories/article.factory'
import { pageObjectTest } from '@_src/fixtures/page-object.fixture'
import { AddArticleModel } from '@_src/models/article.model'
import { ArticlePage } from '@_src/pages/article.page'

interface ArticleCreationContext {
  articlePage: ArticlePage
  articleData: AddArticleModel
}

interface ArticleFixtures {
  createRandomArticle: ArticleCreationContext
}

export const articleTest = pageObjectTest.extend<ArticleFixtures>({
  createRandomArticle: async ({ addArticleView }, use) => {
    const articleData = prepareRandomNewArticle()
    const articlePage = await addArticleView.createArticle(articleData)
    await use({ articlePage, articleData })
  },
})
