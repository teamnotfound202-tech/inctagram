import { GetPublicUsers, ResponsesPosts } from '@/features/publicUserApi/types'
import { baseApi } from '@/shared/api'
import { PAGINATION } from '@/shared/constants/pagination'


export const publicUserApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
      query: () => '/public-user',
    }),
    getPostsForUser: builder.query<ResponsesPosts, { userId: string; endCursorPostId: string }>({
      query: ({ userId, endCursorPostId }) => ({
        url: `/posts/user/${userId}/${endCursorPostId || ''}?pageSize=${PAGINATION.DEFAULT_PAGE_SIZE}`,
      }),

      providesTags: (_result, _error, { userId }) => [
        { type: 'UserPosts', id: userId }
      ],

      serializeQueryArgs: ({queryArgs: {userId}}) => `userPosts-${userId}`,

      merge: (currentCache: ResponsesPosts, newData: ResponsesPosts,
      ) => {
        if (newData.items.length > 0) {
          currentCache.items.push(...newData.items)
        }
      },
      forceRefetch({ currentArg, previousArg}) {
        return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
      },
    }),
  }),
})

export const { useGetTotalRegisteredUsersQuery, useGetPostsForUserQuery } = publicUserApi
export const publicUserReducer = publicUserApi.reducer
