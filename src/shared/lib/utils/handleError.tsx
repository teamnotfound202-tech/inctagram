import { isErrorWithMessage } from '@/shared/lib/utils/isErrorWithMessage'
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import {ACCESS_TOKEN} from "@/shared/lib";

export const handleError = (
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {
  if (result.error) {
    const status = result.error.status

    switch (status) {
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'CUSTOM_ERROR':
        const errMsg = 'error' in result.error ? result.error.error : JSON.stringify(result.error)
        toast.custom(() => (
          <AlertToast variant="error" title={`${result.error.status}`} description={errMsg} />
        ))
        break
      case 401:
        const oldToken = localStorage.getItem(ACCESS_TOKEN)
        if (oldToken) {
          toast.custom(() => (
              <AlertToast variant="error" title={'Ошибка авторизации. Войдите в систему.'} />
          ))
        }
        break
      case 400:
      case 403:
      case 404:
      case 500:
        if (isErrorWithMessage(result.error.data)) {
          const errorMessage = result.error.data.messages[0].message
          toast.custom(() => (
            <AlertToast
              variant="error"
              title={`Error ${result.error.status}`}
              description={errorMessage}
            />
          ))
        } else {
          const errormessage = JSON.stringify(result.error)
          toast.custom(() => (
            <AlertToast variant="error" title="Error!" description={errormessage} />
          ))
        }
        break
      default:
        toast.custom(() => (
          <AlertToast variant="error" title="Error!" description={JSON.stringify(result.error)} />
        ))
    }
  }
}
