import { testUser2 } from '@_src/test-data/user-data'
import { APIRequestContext } from '@playwright/test'

interface Headers {
  [key: string]: string
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
