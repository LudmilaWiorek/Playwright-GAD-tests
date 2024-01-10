import { USER_EMAIL, USER_PASSWORD } from '../env.config'
import { LoginUserModel } from '@_src/models/user.model'

export const testUser2: LoginUserModel = {
  userEmail: USER_EMAIL,
  userPassword: USER_PASSWORD,
}
