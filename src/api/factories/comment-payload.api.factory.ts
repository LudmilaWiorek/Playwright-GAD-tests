import { CommentPayload } from '../models/comment.api.model'
import { prepareRandomComment } from '@_src/ui/factories/comment.factory'

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment()
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2024-01-30T15:44:31Z',
  }
  return commentData
}
