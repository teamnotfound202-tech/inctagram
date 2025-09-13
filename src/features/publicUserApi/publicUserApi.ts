import type { GetPublicUsers } from '@/features/publicUserApi/types'
import { baseApi } from '@/shared/api'

export const publicUserApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
      query: () => '/public-user',
    }),
  }),
})

export const { useGetTotalRegisteredUsersQuery } = publicUserApi
