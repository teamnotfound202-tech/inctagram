import { baseApi } from '@/shared/api'

import {
  newNotification,
  NotificationsMarkAsRead,
  NotificationsResponse,
} from '@/features/notificationsApi/notificationsTypes'
import { PAGINATION } from '@/features/notificationsApi/notificationsConstants'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'
import { subscribeToEvent } from '@/shared/lib/socket/subscribeToEvent'


export const notificationsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.infiniteQuery<
      NotificationsResponse,
      { isRead?: boolean; pageSize?: number; sortDirection?: 'asc' | 'desc' },
      string | undefined
    >({
      query: ({ queryArg, pageParam }) => {
        return {
          url: `/notifications/${pageParam ?? ''}`,
          params: {
            isRead: queryArg.isRead,
            pageSize: queryArg.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
            sortDirection: queryArg.sortDirection ?? 'desc',
          },
        }
      },
      keepUnusedDataFor:0,
      onCacheEntryAdded: async (_arg,{cacheDataLoaded,updateCachedData,cacheEntryRemoved})=>{
        await cacheDataLoaded
        subscribeToEvent(SOCKET_EVENTS.NOTIFICATIONS,(data:newNotification)=>{
          updateCachedData((state)=>{
          state.pages[0].items.unshift(data)

          })
        })
      },
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage, allPages) => {
          const totalNotificationsCount = allPages.flatMap(page => page.items).length
          if (
            totalNotificationsCount < lastPage.totalCount &&
            lastPage.items[lastPage.items.length - 1]?.id != null
          ) {
            return lastPage.items[lastPage.items.length - 1].id.toString()
          }

          return null
        },
      },
      providesTags: () => ['Notifications'],
    }),
    markAsReadNotifications: builder.mutation<void, NotificationsMarkAsRead>({
      query: body => ({ url: '/notifications/mark-as-read', method: 'PUT', body }),
      invalidatesTags:['Notifications'],
    }),
  }),
})
export const { useGetNotificationsInfiniteQuery, useMarkAsReadNotificationsMutation } = notificationsApi
