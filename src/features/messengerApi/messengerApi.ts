import { baseApi } from '@/shared/api'
import {
  AllMessages,
  MessageItem,
  MessagesByUserName,
  MessageSendRequest,
} from '@/features/messengerApi/types'

import { emitEvent, subscribeToEvent } from '@/shared/lib/socket/subscribeToEvent'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'

export const messengerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // -----------------------------------------------------------
    // 1) Все сообщения (пагинация) - БЕЗ ИЗМЕНЕНИЙ
    // -----------------------------------------------------------
    getAllMessages: builder.infiniteQuery<AllMessages, void, number | undefined>({
      query: ({ pageParam }) => ({
        url: `messenger?cursor=${pageParam}`,
      }),

      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const total = allPages.flatMap(p => p.items).length
          if (total < lastPage.totalCount && lastPage.items.at(-1)?.receiverId) {
            return lastPage.items.at(-1)!.receiverId
          }
          return null
        },
      },

      //serializeQueryArgs: () => 'getMessages',
      providesTags: ['Messages'],
    }),
    // -----------------------------------------------------------
    // 2) Сообщения по диалогу + WebSocket обновления
    // -----------------------------------------------------------
    getMessagesByDialogPartner: builder.infiniteQuery<
      MessagesByUserName,
      { dialogPartnerId: number; ownerId: number },
      number | undefined
    >({
      query: ({ queryArg, pageParam }) => ({
        url: `messenger/${queryArg.dialogPartnerId}?cursor=${pageParam}`,
      }),

      onCacheEntryAdded: async (
        _arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch }
      ) => {
        await cacheDataLoaded

        subscribeToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: MessageItem) => {

          updateCachedData(state => {
            state.pages[0].items.push(data)
          })
          //2. Инвалидируем кэш списка чатов, чтобы последний чат был сверху
          dispatch(baseApi.util.invalidateTags(['Messages']))
        })

        subscribeToEvent(SOCKET_EVENTS.MESSAGE_SEND, (data: MessageItem) => {

          updateCachedData(state => {
            state.pages[0].items.push(data)
          })
        })
      },

      serializeQueryArgs: ({ queryArgs: { dialogPartnerId } }) =>
        `MessagesFromPartner-${dialogPartnerId}`,

      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const total = allPages.flatMap(p => p.items).length
          if (total < lastPage.totalCount && lastPage.items.at(-1)?.id) {
            return lastPage.items.at(-1)!.id
          }
          return null
        },
      },
    }),
    // -----------------------------------------------------------
    // 3) Отправка сообщения ТОЛЬКО WebSocket + оптимистичное обновление
    // -----------------------------------------------------------
    sendMessageWithOptimistic: builder.mutation({
      queryFn: ({ message, receiverId }) => {
        return new Promise((resolve, reject) => {
          const newMessageConstruction: MessageSendRequest = {
            message: message,
            receiverId: receiverId,
          }
          emitEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, newMessageConstruction, response => {
            resolve({ data: response })
          })

          //Оптимистичное обновление
          resolve({ data: newMessageConstruction })
        })
      },
      invalidatesTags: ['Messages'],
    }),
  }),

  overrideExisting: true,
})

export const {
    useGetAllMessagesInfiniteQuery,
  useGetMessagesByDialogPartnerInfiniteQuery,
  useSendMessageWithOptimisticMutation,
} = messengerApi

