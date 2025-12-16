import { baseApi } from '@/shared/api'
import { GetMessages, GetMessengerData } from '@/features/messenger/api/type'

const PAGE_SIZE = 12
export const messengerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUsersMessenger: builder.infiniteQuery<GetMessengerData, { search: string }, number>({
      query: ({ queryArg }) => ({
        url: `messenger?pageSize=${PAGE_SIZE}&searchName=${queryArg.search}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const totalCountUsersMessengers = allPages.flatMap(page => page.items).length
          if (
            totalCountUsersMessengers < lastPage.totalCount &&
            lastPage.items[lastPage.items.length - 1].id
          ) {
            return lastPage.items[lastPage.items.length - 1].id
          }
          return null
        },
      },
    }),
    getMessages: builder.infiniteQuery<GetMessages, { dialoguePartnerId: number }, number>({
      query: ({ queryArg, pageParam }) => ({
        url: `messenger/${queryArg.dialoguePartnerId}?cursor=${pageParam}&&pageSize=${PAGE_SIZE}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const totalCountUsersMessengers = allPages.flatMap(page => page.items).length
          if (
            totalCountUsersMessengers < lastPage.totalCount &&
            lastPage.items[lastPage.items.length - 1].id
          ) {
            return lastPage.items[lastPage.items.length - 1].id
          }
          return null
        },
      },
      providesTags: (_result, _error, { dialoguePartnerId }) => [
        { type: 'UserMessages', dialoguePartnerId: dialoguePartnerId },
      ],

      serializeQueryArgs: ({ queryArgs: { dialoguePartnerId } }) =>
        `userMessages-${dialoguePartnerId}`,
    }),
  }),
})

export const {useGetUsersMessengerInfiniteQuery, useGetMessagesInfiniteQuery} =messengerApi