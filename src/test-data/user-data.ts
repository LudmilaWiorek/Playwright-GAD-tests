import { LoginUserModel } from '@_src/models/user.model'
import { USER_EMAIL, USER_PASSWORD } from 'config/env.config'

export const testUser2: LoginUserModel = {
  userEmail: USER_EMAIL,
  userPassword: USER_PASSWORD,
}
