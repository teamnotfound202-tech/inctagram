import {
  GetPublicUsers,
  ResponsesPosts,
  UserProfileResponse,
  UsersListResponse,
} from '@/features/publicUserApi/types'
import { baseApi } from '@/shared/api'

export const publicUserApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
      query: () => '/public-user',
    }),
    getUserFollowingAndFollowers: builder.query<UserProfileResponse, { userName: string }>({
      query: ({ userName }) => ({ url: `/users/${userName}`, method: 'GET' }),
      providesTags: (result, error, { userName }) =>
        result ? [{ type: 'UserProfile', id: userName }] : ['UserProfile'],
    }),

    followingUser: builder.mutation<void, { selectedUserId: number, userName: string }>({
      query: body => ({ url: `/users/following`, method: 'POST', body }),
      invalidatesTags: (result, error, { userName }) => [{ type: 'UserProfile', id: userName }],
    }),

    unFollowingUser: builder.mutation<void, { userId: number, userName:string }>({
      query: ({ userId }) => ({ url: `/users/follower/${userId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { userName }) => [{ type: 'UserProfile', id: userName }],
    }),
    followingsUser: builder.query<UsersListResponse, { userName: string }>({
      query: ({ userName }) => ({ url: `/users/${userName}/following`, method: 'GET' }),
    }),
    followersUser: builder.query<UsersListResponse, { userName: string }>({
      query: ({ userName }) => ({ url: `/users/${userName}/followers`, method: 'GET' }),
    }),
    getPostsForUser: builder.infiniteQuery<ResponsesPosts, string, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams, queryArg) => {
          debugger
          return '1'
        },
      },
      query: userId => `/api/v1/posts/user/${userId}`,
    }),
  }),
})

export const {
  useGetTotalRegisteredUsersQuery,
  useGetUserFollowingAndFollowersQuery,
  useFollowingUserMutation,
  useUnFollowingUserMutation,
  useLazyFollowingsUserQuery,
  useLazyFollowersUserQuery,
} = publicUserApi
