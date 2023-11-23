import { LoginUser } from '../models/user.model'

export const testUser2: LoginUser = {
  userEmail: process.env.USER_EMAIL ?? '[NOT SET]',
  userPassword: process.env.USER_PASSWORD ?? '[NOT SET]',
}
