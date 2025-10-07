import {responseCodes} from '@/shared/config'
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query'
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {Mutex} from 'async-mutex'
import {ACCESS_TOKEN} from '@/shared/lib'
import {ResponsesLogin} from '@/shared/api/types'
import {handleError} from '@/shared/lib/utils'
import {useAppDispatch} from '@/shared/lib/hooks/hooks'
import {baseApi} from '@/shared/api/baseApi'

const mutex = new Mutex()

export const startBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: 'include',
    prepareHeaders: headers => {
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

    let result = await startBaseQuery(args, api, extraOptions)
    if (result.error && result.error.status === responseCodes.Unauthorized) {
        // если токен никто не обновляет → пробуем сами
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await startBaseQuery(
                    {url: '/auth/update-tokens', method: 'POST'}, api, extraOptions
                )

                if (refreshResult?.data) {
                    const {accessToken} = refreshResult.data as ResponsesLogin
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(ACCESS_TOKEN, accessToken)
                    }
                    // повторяем исходный запрос
                    result = await startBaseQuery(args, api, extraOptions)
                } else {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(ACCESS_TOKEN)
                    }
                }
            } finally {
                release()
            }
        } else {
            // если токен уже обновляется другим запросом → ждём
            await mutex.waitForUnlock()
            // и пробуем запрос заново
            result = await startBaseQuery(args, api, extraOptions)
        }
    }

    handleError(result)
    return result
}