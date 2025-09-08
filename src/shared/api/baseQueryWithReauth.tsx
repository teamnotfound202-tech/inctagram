import {AlertsProvider, AlertToast} from '@/shared/ui/Alerts/Alerts';
import type {BaseQueryFn} from '@reduxjs/toolkit/query';
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';

export const startBaseQuery = fetchBaseQuery({
    baseUrl: 'https://connectpix.site/api/v1/',
    prepareHeaders: (headers) => {
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers
    }
})



export const baseQueryWithReAuth: BaseQueryFn = async (
    args,
    api,
    extraOptions
) => {
    let result = await startBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
            const refreshResult = await startBaseQuery(
                {
                    url: "/auth/update-tokens",
                    method: "POST",
                },
                api,
                extraOptions
            )

            if (refreshResult.data) {
                const { accessToken } = refreshResult.data as any
                sessionStorage.setItem("accessToken", accessToken)

                // 🔄 повторяем исходный запрос
                result = await startBaseQuery(args, api, extraOptions)
            } else {
                // refresh не удался → разлогиниваем
                sessionStorage.removeItem("accessToken")

                toast.error("Сессия истекла. Войдите снова.")
                if (typeof window !== "undefined") {
                    window.location.href = "/login"
                }
                return result
            }
    }

    // === глобальная обработка других ошибок ===
    if (result.error) {
        console.log('res errr' , result.error)
        const status = result.error.status

        switch (status) {
            case 400:
                toast.custom(() => (
                    <AlertsProvider position="bottom-left">
                        <AlertToast variant="error"
                                    title="Error!"
                                    description="Некорректный запрос"
                                    duration={800000000}
                        />
                    </AlertsProvider>
                ))
                // toast.error("Некорректный запрос")
                break
            case 403:
                toast.error("Нет доступа")
                break
            case 404:
                toast.custom(() =>(
                    <AlertsProvider position="bottom-left">
                        <AlertToast variant="error"
                                    title="Error!"
                                    description="Не найдено"
                                    duration={800000000}
                        />
                    </AlertsProvider>
                ))
                // toast.error("Не найдено")
                break
            case 500:
                toast.error("Ошибка сервера")
                break
            default:
                toast.error("Что-то пошло не так")
        }
    }

    return result
}