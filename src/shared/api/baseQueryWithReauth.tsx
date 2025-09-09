import type {BaseQueryFn, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue} from '@reduxjs/toolkit/query';
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {toast} from 'sonner';
import {ACCESS_TOKEN} from "@/shared/lib";
import {ResponsesLogin} from "@/shared/api/types";
import {handleError} from "@/shared/lib/utils";


export const startBaseQuery = fetchBaseQuery({
    baseUrl: 'https://connectpix.site/api/v1/',
    prepareHeaders: (headers) => {
        const accessToken = sessionStorage.getItem(ACCESS_TOKEN)
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers
    }
})



export const baseQueryWithReAuth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await startBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
            const refreshResult = await startBaseQuery(
                {url: "/auth/update-tokens",method: "POST"},
                api,
                extraOptions
            )

            if (refreshResult.data) {
                const { accessToken } = refreshResult.data as ResponsesLogin
                sessionStorage.setItem(ACCESS_TOKEN, accessToken)

                // 🔄 повторяем исходный запрос
                result = await startBaseQuery(args, api, extraOptions)
            } else {
                // refresh не удался → разлогиниваем
                sessionStorage.removeItem(ACCESS_TOKEN)

                toast.error("Сессия истекла. Войдите снова.")
                if (typeof window !== "undefined") {
                    window.location.href = "/login"
                }
                return result
            }
    }
    // === глобальная обработка других ошибок ===
           handleError(result)
    return result
}

