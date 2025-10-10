import {
  CursorPage,
  GetPublicUsers,
  ResponsesPosts,
  UserItem,
  UserProfileResponse,
} from '@/features/publicUserApi/types'
import {baseApi} from '@/shared/api'
import {PAGINATION} from '@/shared/constants/pagination'
import {User} from "@/features/postView/api/types";
import { GeneralInformaitionValues } from '@/shared/api/types'

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
    followersUser: builder.query<CursorPage<UserItem>, { userName: string; cursor?: number | null; pageSize?: number; search?: string }
    >({
      query: ({ userName, ...params }) => ({
        url: `/users/${userName}/followers`,
        method: 'GET',
        params,
      }),
    }),

    followingsUser: builder.query<CursorPage<UserItem>, { userName: string; cursor?: number; pageSize?: number; search?: string }
    >({
      query: ({ userName, ...params }) => ({
        url: `/users/${userName}/following`,
        method: 'GET',
        params,
      }),
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
    fetchUser: builder.query<User, number>({
      query: (profileId) => `public-user/profile/${profileId}`,
    }),
    fetchMyProfile: builder.query<User, void>({
      query: () => `users/profile`,
    }),
    updateMyProfile: builder.mutation<void, GeneralInformaitionValues>({
      query: body => ({ url: `/users/profile`, method: 'PUT', body })
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
  useUpdateMyProfileMutation
} = publicUserApi
export const publicUserReducer = publicUserApi.reducer
