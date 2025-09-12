import { ResponsesLogin, ResponsesTypeError } from '@/shared/api'

export function isSuccessResponse(
  response: ResponsesLogin | ResponsesTypeError
): response is ResponsesLogin {
  return 'accessToken' in response
}
