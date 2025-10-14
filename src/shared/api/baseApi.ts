import { baseQueryWithReAuth } from '@/shared/api/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'inctagramApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['UserPosts', 'User', 'UserProfile', 'Me', 'Posts', 'Comment', 'Profile', 'Payments'],
  endpoints: () => ({}),
})

export type baseApi = typeof baseApi
