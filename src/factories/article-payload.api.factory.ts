import { ArticlePayload } from '@_src/api/utils/api.util'
import { prepareRandomNewArticle } from '@_src/ui/factories/article.factory'

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomNewArticle()
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,

    date: '2024-01-30T15:44:31Z',
    image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
  }
  return articleData
}
