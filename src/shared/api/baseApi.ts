import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReAuth } from '@/shared/api/baseQueryWithReauth' // [CHANGED]

export const baseApi = createApi({
  reducerPath: 'inctagramApi',
  baseQuery: baseQueryWithReAuth, // [CHANGED] — единый базовый запрос
  tagTypes: ['UserPosts', 'User', 'UserProfile', 'Me', 'Posts', 'Comment'],
  endpoints: () => ({}),
})

export type baseApi = typeof baseApi