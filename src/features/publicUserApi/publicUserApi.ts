import { GetPublicUsers, ResponsesPosts } from '@/features/publicUserApi/types'
import { baseApi } from '@/shared/api'

export const publicUserApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
      query: () => '/public-user',
    }),
    getPostsForUser: builder.infiniteQuery<ResponsesPosts, string, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams, queryArg) => {
          debugger
          return '1'
        }
      },
      query: userId => `/api/v1/posts/user/${userId}`,
    })
  }),
})

export const { useGetTotalRegisteredUsersQuery, useGetPostsForUserInfiniteQuery } = publicUserApi
