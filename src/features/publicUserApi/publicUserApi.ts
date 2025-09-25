import { GetPublicUsers, ResponsesPosts } from '@/features/publicUserApi/types'
import { baseApi } from '@/shared/api'
import { PAGINATION } from '@/shared/constants/pagination'

//
// export const publicUserApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
//       query: () => '/public-user',
//     }),
//     getPostsForUser: builder.query<ResponsesPosts, { userId: string; endCursorPostId: string }>({
//       query: ({ userId, endCursorPostId }) => ({
//         url: `/posts/user/${userId}/${endCursorPostId || ''}?pageSize=${PAGINATION.DEFAULT_PAGE_SIZE}`,
//       }),
//
//       providesTags: (_result, _error, { userId }) => [
//         { type: 'UserPosts', id: userId }
//       ],
//
//       serializeQueryArgs: ({queryArgs: {userId}}) => `userPosts-${userId}`,
//
//       merge: (currentCache: ResponsesPosts, newData: ResponsesPosts,
//       ) => {
//
//         currentCache.items.push(...newData.items)
//       },
//       forceRefetch({ currentArg, previousArg}) {
//         return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
//       },
//     }),
//   }),
// })


export const publicUserApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
      query: () => '/public-user',
    }),
    getPostsForUser: builder.infiniteQuery<
      ResponsesPosts,
      { userId: string },
      string | undefined
    >({
      query: ({ queryArg, pageParam }) => {
        return {
          url: `/posts/user/${queryArg.userId}/${pageParam || ''}`,
          params: { pageSize: PAGINATION.DEFAULT_PAGE_SIZE  + 1 },
        }
      },
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage, allPages) => {
          const totalCountPosts = allPages.flatMap(page => page.items).length
          if (totalCountPosts < lastPage.totalCount && lastPage.items[lastPage.items.length - 1]?.id) {
            return lastPage.items[lastPage.items.length - 1].id.toString()
          }

          return null
        },
      },
      providesTags: (_result, _error, { userId }) => [{ type: 'UserPosts', id: userId }],

      serializeQueryArgs: ({ queryArgs: { userId } }) => `userPosts-${userId}`,
    }),
  }),
})

export const { useGetTotalRegisteredUsersQuery, useGetPostsForUserInfiniteQuery } = publicUserApi
export const publicUserReducer = publicUserApi.reducer
