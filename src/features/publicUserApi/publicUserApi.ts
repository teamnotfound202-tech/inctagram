import {
  CursorPage,
  GetPublicUsers,
  ResponsesPosts,
  UserItem,
  UserProfileResponse,
} from '@/features/publicUserApi/types'
import { baseApi } from '@/shared/api'
import { PAGINATION } from '@/shared/constants/pagination'
import { User } from '@/features/postView/api/types'

export const publicUserApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTotalRegisteredUsers: builder.query<GetPublicUsers, void>({
      query: () => 'proxy/public-user', // [CHANGED]
    }),

    getUserFollowingAndFollowers: builder.query<
      UserProfileResponse,
      { userName: string }
    >({
      query: ({ userName }) => ({ url: `proxy/users/${userName}`, method: 'GET' }), // [CHANGED]
      providesTags: (result, error, { userName }) =>
        result ? [{ type: 'UserProfile', id: userName }] : ['UserProfile'],
    }),

    followingUser: builder.mutation<void, { selectedUserId: number; userName: string }>({
      query: body => ({ url: 'proxy/users/following', method: 'POST', body }), // [CHANGED]
      invalidatesTags: (result, error, { userName }) => [{ type: 'UserProfile', id: userName }],
    }),

    unFollowingUser: builder.mutation<void, { userId: number; userName: string }>({
      query: ({ userId }) => ({ url: `proxy/users/follower/${userId}`, method: 'DELETE' }), // [CHANGED]
      invalidatesTags: (result, error, { userName }) => [{ type: 'UserProfile', id: userName }],
    }),

    followersUser: builder.query<
      CursorPage<UserItem>,
      { userName: string; cursor?: number | null; pageSize?: number; search?: string }
    >({
      query: ({ userName, ...params }) => ({
        url: `proxy/users/${userName}/followers`, // [CHANGED]
        method: 'GET',
        params,
      }),
    }),

    followingsUser: builder.query<
      CursorPage<UserItem>,
      { userName: string; cursor?: number; pageSize?: number; search?: string }
    >({
      query: ({ userName, ...params }) => ({
        url: `proxy/users/${userName}/following`, // [CHANGED]
        method: 'GET',
        params,
      }),
    }),

    getPostsForUser: builder.infiniteQuery<
      ResponsesPosts,
      { userId: string },
      string | undefined
    >({
      query: ({ queryArg, pageParam }) => ({
        url: `proxy/posts/user/${queryArg.userId}/${pageParam || ''}`, // [CHANGED]
        params: { pageSize: PAGINATION.DEFAULT_PAGE_SIZE + 1 },
      }),
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

    fetchUser: builder.query<User, number>({
      query: (profileId) => `proxy/public-user/profile/${profileId}`, // [CHANGED]
    }),

    fetchMyProfile: builder.query<User, void>({
      query: () => 'proxy/users/profile', // [CHANGED]
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
  useGetPostsForUserInfiniteQuery,
  useFetchUserQuery,
  useFetchMyProfileQuery,
} = publicUserApi

export const publicUserReducer = publicUserApi.reducer