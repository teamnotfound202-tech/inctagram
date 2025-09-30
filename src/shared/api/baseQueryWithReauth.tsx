import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { ACCESS_TOKEN } from '@/shared/lib'
import { responseCodes } from '@/shared/config'
import { ResponsesLogin } from '@/shared/api/types'
import { handleError } from '@/shared/lib/utils'
import {Mutex} from 'async-mutex'
const mutex = new Mutex()
export const startBaseQuery  = () => fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem(ACCESS_TOKEN)
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }
    }
    return headers
  },
})

export const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  //  Создаем новый экземпляр при каждом вызове
  let baseQuery = startBaseQuery()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === responseCodes.Unauthorized) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          { url: '/auth/update-tokens', method: 'POST' },
          api,
          extraOptions
        )

        if (refreshResult?.data) {
          const { accessToken } = refreshResult.data as ResponsesLogin

          if (typeof window !== 'undefined') {
            localStorage.setItem(ACCESS_TOKEN, accessToken)
          }

          //  Создаем НОВЫЙ baseQuery с обновленным токеном
          baseQuery = startBaseQuery()
          result = await baseQuery(args, api, extraOptions)
        } else {
          handleLogout()
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      //  Создаем новый baseQuery после ожидания
      baseQuery = startBaseQuery()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  handleError(result)
  return result
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN)
    // Опционально: редирект на логин
    window.location.href = '/login'
  }
}