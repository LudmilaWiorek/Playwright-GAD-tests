import { prepareRandomComment } from '@_src/ui/factories/comment.factory'
import { testUser2 } from '@_src/ui/test-data/user-data'
import { APIRequestContext } from '@playwright/test'

export const apiLinks = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
}
export interface Headers {
  [key: string]: string
}
export interface ArticlePayload {
  title: string
  body: string
  date: string
  image: string
}
export interface CommentPayload {
  article_id: number
  body: string
  date: string
}

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginUrl = '/api/login'
  const userData = {
    email: testUser2.userEmail,
    password: testUser2.userPassword,
  }
  const responseLogin = await request.post(loginUrl, { data: userData })
  const responseLoginJSON = await responseLogin.json()

  return {
    Authorization: `Bearer ${responseLoginJSON.access_token}`,
  }
}

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment()
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2024-01-30T15:44:31Z',
  }
  return commentData
}
