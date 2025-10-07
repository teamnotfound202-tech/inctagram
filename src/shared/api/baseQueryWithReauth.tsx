// src/shared/api/baseQueryWithReauth.ts
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { handleError } from '@/shared/lib/utils'

// Базовый запрос идёт на наш Next.js BFF
export const startBaseQuery = fetchBaseQuery({
  baseUrl: '/api/bff',       // весь трафик через BFF
  credentials: 'include',    // HttpOnly-куки уезжают сами
  // ВАЖНО: НЕ добавляем Authorization — токен подставит BFF
})

// Единая обёртка для централизованной обработки ошибок
export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const res = await startBaseQuery(args, api, extraOptions)
  handleError(res) // ← тут твоя единая обработка
  return res
}