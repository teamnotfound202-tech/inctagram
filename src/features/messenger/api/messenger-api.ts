import { baseApi } from '@/shared/api'
import { GetMessages, GetMessengerData, MessageItemType } from '@/features/messenger/api/type'
import { subscribeToEvent } from '@/shared/lib/socket/subscribeToEvent'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'
import { RootState } from '@/shared/lib/store/store'
import { authApi } from '@/features'
import { appSlice, selectCurrentDialogId } from '@/shared/api/appSlice'


export function isMessageType(msg: unknown): msg is MessageItemType {
  return (
      typeof msg === "object" &&
      msg !== null &&
     'id' in msg &&
     typeof msg.id === "number" &&
      'ownerId' in msg &&
      typeof msg.ownerId === "number" &&
      'receiverId' in msg &&
      typeof msg.receiverId === "number" &&
      'messageText' in msg &&
      typeof msg.messageText === "string" &&
      'createAt' in msg &&
      typeof msg.createAt === "string" &&
      'updatedAt' in msg &&
      typeof msg.updatedAt === "string" &&
      'messageType' in msg &&
      typeof msg.messageType === 'string' &&
      'status' in msg &&
      typeof msg.status === 'string'
  )
}
const PAGE_SIZE = 12
const PAGE_SIZE_MESSAGES = 8
export const messengerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUsersMessenger: builder.infiniteQuery<GetMessengerData, { search: string }, number>({
      query: ({ queryArg, pageParam }) => ({
        url: `messenger?cursor=${pageParam}&pageSize=${PAGE_SIZE_MESSAGES}&searchName=${queryArg.search}`,
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
      providesTags: ['GetUsersMessenger'],
    }),
    getMessages: builder.infiniteQuery<GetMessages, { dialoguePartnerId: number }, number>({
      query: ({ queryArg, pageParam }) => ({
        url: `messenger/${queryArg.dialoguePartnerId}?cursor=${pageParam}&pageSize=${PAGE_SIZE}`,
      }),
      // добавлено для получения сообщений по websocket
      onCacheEntryAdded: async (
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch, getState }
      ) => {
        await cacheDataLoaded
        const { dialoguePartnerId } = arg
        // функция которая определяет наше ли это сообщение и если нвше то берем id отправившего если не наше то
        const resolvePeerId = (m: MessageItemType, meId: number) =>
          m.ownerId === meId ? m.receiverId : m.ownerId

        // из state достаем данные о нас как о владельце аккаунта
        const state = getState() as RootState
        const meSel = authApi.endpoints.me.select()(state)
        const me = meSel.data
        const meId = me?.userId ?? 0

        // фунция которая закидывет пришедшее сообщение либо в текущий кеш либо в кеш конкретного пользователя если прищло сообщение не в текущще диалоговое окрно
        const handle = (msg: MessageItemType | MessageItemType[]) => {

          if (Array.isArray(msg)) {
            return dispatch(baseApi.util.invalidateTags(['GetUsersMessenger', 'UserMessages']))
          }

          const peerId = resolvePeerId(msg, meId)
          if (peerId === dialoguePartnerId) {
            // 1) Обновляем ТЕКУЩУЮ переписку — updateCachedData уже scoped по этому ключу
            updateCachedData(draft => {
              const firstPage = draft.pages?.[0]
              if (!firstPage) return
              // дедупликация по id, чтобы не дублировать одно и то же сообщение
              if (!firstPage.items.some(i => i.id === msg.id)) {
                firstPage.items.unshift(msg)
                if (typeof firstPage.totalCount === 'number') firstPage.totalCount += 1
              }
            })
          } else {
            // 2) Обновляем ДРУГУЮ переписку — по её args
            dispatch(
              messengerApi.util.updateQueryData(
                'getMessages',
                { dialoguePartnerId: peerId }, // важен тот же shape, что в serializeQueryArgs
                draft => {
                  const firstPage = draft.pages?.[0]
                  if (!firstPage) return
                  const isIdMessageHasPage = firstPage.items.some(i => i.id === msg.id)
                  if (!isIdMessageHasPage) {
                    firstPage.items.unshift(msg)
                    if (typeof firstPage.totalCount === 'number') firstPage.totalCount += 1
                  }
                }
              )
            )
          }

          dispatch(baseApi.util.invalidateTags(['GetUsersMessenger']))
        }

        const unsub1 = subscribeToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, handle)
        const unsub2 = subscribeToEvent(SOCKET_EVENTS.MESSAGE_SEND, handle)
        // корректная отписка
        await cacheEntryRemoved
        unsub1?.()
        unsub2?.()
      },
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
    changeStatusMessage: builder.mutation<void, { ids: number[]; dialoguePartnerId: number }>({
      query: ({ ids }) => ({
        url: 'messenger',
        method: 'PUT',
        body: { ids },
      }),

      invalidatesTags: ['GetUsersMessenger'],
    }),
    deleteMessage: builder.mutation<void, { messageId: number; dialogId: number }>({
      query: ({ messageId }) => ({
        url: `messenger/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { dialogId }) => [
        'GetUsersMessenger',
        { type: 'UserMessages', dialoguePartnerId: dialogId },
      ],
    }),
  }),
})

export const {
  useGetUsersMessengerInfiniteQuery,
  useGetMessagesInfiniteQuery,
  useChangeStatusMessageMutation,
  useDeleteMessageMutation
} =messengerApi


// добавлено для получения сообщений по websocket
// onCacheEntryAdded: async (
//   arg,
//   { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch, getState }
// ) => {
//   await cacheDataLoaded
//   const { dialoguePartnerId } = arg
//   // функция которая определяет наше ли это сообщение и если наше то берем id отправившего если не наше то
//   const resolvePeerId = (m: MessageItemType | MessageItemType[], meId: number) => {
//     if (Array.isArray(m)) return m[0].receiverId
//     return m.ownerId === meId ? m.receiverId : m.ownerId
//   }
//
//   // из state достаем данные о нас как о владельце аккаунта
//   const state = getState() as RootState
//   const meSel = authApi.endpoints.me.select()(state)
//   const me = meSel.data
//   const meId = me?.userId ?? 0
//
//   // фунция которая закидывет пришедшее сообщение либо в текущий кеш либо в кеш конкретного пользователя если прищло сообщение не в текущще диалоговое окрно
//   const handle = (msg: MessageItemType | MessageItemType[]) => {
//     const peerId = resolvePeerId(msg, meId)
//
//     debugger
//     if (peerId === dialoguePartnerId) {
//       debugger
//       if (Array.isArray(msg)) {
//         const idsArr = msg.map(m => m.id)
//         updateCachedData(draft => {
//           const allMessages = draft.pages?.flatMap(item => item.items)
//           if (allMessages && allMessages.length) {
//             allMessages.forEach(message => {
//               if (idsArr.includes(message.id)) {
//                 message.status = 'READ'
//               }
//             })
//           }
//         })
//       } else {
//         // 1) Обновляем ТЕКУЩУЮ переписку — updateCachedData уже scoped по этому ключу
//         updateCachedData(draft => {
//           const firstPage = draft.pages?.[0]
//           if (!firstPage) return
//           // дедупликация по id, чтобы не дублировать одно и то же сообщение
//           if (!firstPage.items.some(i => i.id === msg.id)) {
//             firstPage.items.unshift(msg)
//             if (typeof firstPage.totalCount === 'number') firstPage.totalCount += 1
//           }
//         })
//       }
//     } else {
//       // 2) Обновляем ДРУГУЮ переписку — по её args
//       dispatch(
//         messengerApi.util.updateQueryData(
//           'getMessages',
//           { dialoguePartnerId: peerId }, // важен тот же shape, что в serializeQueryArgs
//           draft => {
//             const firstPage = draft.pages?.[0]
//             if (!firstPage) return
//             const isIdMessageHasPage = firstPage.items.some(i => i.id === msg.id)
//             if (!isIdMessageHasPage) {
//               firstPage.items.unshift(msg)
//               if (typeof firstPage.totalCount === 'number') firstPage.totalCount += 1
//             }
//           }
//         )
//       )
//     }
//     dispatch(baseApi.util.invalidateTags(['GetUsersMessenger']))
//   }
//
//   const unsub1 = subscribeToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, handle)
//   const unsub2 = subscribeToEvent(SOCKET_EVENTS.MESSAGE_SEND, handle)
//   // корректная отписка
//   await cacheEntryRemoved
//   unsub1?.()
//   unsub2?.()
// },