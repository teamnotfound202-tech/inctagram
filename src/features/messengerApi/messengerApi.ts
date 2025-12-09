import { baseApi } from '@/shared/api'
import { AllMessages, IncomingMessage, MessageItem } from '@/features/messengerApi/types'

import { subscribeToEvent,emitEvent } from '@/shared/lib/socket/subscribeToEvent'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'
import { ISOStringFormat } from 'date-fns'
import { Avatar } from '@/features/publicUserApi/types'

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
                    if (total < lastPage.totalCount && lastPage.items.at(-1)?.id) {
                        return lastPage.items.at(-1)!.id
                    }
                    return null
                },
            },

            serializeQueryArgs: () => 'getMessages',
            providesTags: ['Messages'],
        }),

        // -----------------------------------------------------------
        // 2) Сообщения по диалогу + WebSocket обновления
        // -----------------------------------------------------------
        getMessagesByDialogPartner: builder.infiniteQuery<
            AllMessages,
            { dialogPartnerId: number; ownerId: number },
            number | undefined
        >({
            query: ({ queryArg, pageParam }) => ({
                url: `messenger/${queryArg.dialogPartnerId}?cursor=${pageParam}`,
            }),
            keepUnusedDataFor: 300, // Держим 5 мин

            onCacheEntryAdded: async (arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
                try {
                    await cacheDataLoaded
                    console.log('🔥 WebSocket для диалога:', arg.dialogPartnerId)

                    // ---------------------------
                    // RECEIVE_MESSAGE
                    // ---------------------------
                    const unsubscribeReceive = subscribeToEvent<MessageItem>(
                        SOCKET_EVENTS.RECEIVE_MESSAGE,
                        data => {
                            const isForThisDialog =
                                data.receiverId === arg.dialogPartnerId || data.ownerId === arg.dialogPartnerId
                            if (!isForThisDialog) return

                            updateCachedData(draft => {
                                const firstPage = draft.pages?.[0]
                                if (!firstPage) return
                                firstPage.items.unshift(data)
                                firstPage.totalCount += 1
                                if (data.ownerId !== arg.ownerId) {
                                    firstPage.notReadCount = (firstPage.notReadCount || 0) + 1
                                }
                            })
                        }
                    )

                    // ---------------------------
                    // MESSAGE_SEND - замена optimistic
                    // ---------------------------
                    const unsubscribeSent = subscribeToEvent<MessageItem>(
                        SOCKET_EVENTS.MESSAGE_SEND,
                        data => {
                            const isForThisDialog =
                                data.receiverId === arg.dialogPartnerId || data.ownerId === arg.dialogPartnerId
                            if (!isForThisDialog) return

                            updateCachedData(draft => {
                                const firstPage = draft.pages?.[0]
                                if (!firstPage) return

                                // 🔥 Ищем optimistic сообщение (созданное за последние 15 сек)
                                const optimisticIndex = firstPage.items.findIndex(
                                    item =>
                                        typeof item.id === 'number' &&
                                        item.id > Date.now() - 15000 &&
                                        item.status === 'SENT'
                                )

                                if (optimisticIndex !== -1) {
                                    // ✅ Заменяем optimistic на серверное
                                    firstPage.items[optimisticIndex] = data
                                } else {
                                    // Новое сообщение
                                    firstPage.items.unshift(data)
                                    firstPage.totalCount += 1
                                }

                                if (data.ownerId === arg.ownerId && firstPage.notReadCount > 0) {
                                    firstPage.notReadCount -= 1
                                }
                            })
                        }
                    )

                    await cacheEntryRemoved
                    unsubscribeReceive?.()
                    unsubscribeSent?.()
                } catch (err) {
                    console.error('WebSocket ошибка:', err)
                }
            },

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
        sendMessageWithOptimistic: builder.mutation<
            IncomingMessage,
            { message: string; receiverId: number; ownerId: number }
        >({
            queryFn: async args => {
                const optimistic: IncomingMessage = {
                    id: 0,
                    messageText: args.message,
                    receiverId: args.receiverId,
                    ownerId: args.ownerId,
                    status: 'SENT',
                    messageType: 'TEXT',
                    createdAt: new Date().toISOString() as ISOStringFormat,
                    updatedAt: new Date().toISOString() as ISOStringFormat,
                }
                return { data: optimistic }
            },

            async onQueryStarted(args, { dispatch }) {
                // 🔥 Уникальный числовой ID для React keys + optimistic
                const tempNumericId = Date.now()

                const optimistic: MessageItem = {
                    id: tempNumericId, // ✅ Уникальный числовой ID
                    messageText: args.message,
                    receiverId: args.receiverId,
                    ownerId: args.ownerId,
                    status: 'SENT', // ✅ Маркер для поиска optimistic
                    messageType: 'TEXT',
                    createdAt: new Date().toISOString() as ISOStringFormat,
                    updatedAt: new Date().toISOString() as ISOStringFormat,
                    userName: 'Me',
                    avatars: [] as Avatar[],
                    notReadCount: 0,
                }

                // ---------- Optimistic update ----------
                const patchResult = dispatch(
                    messengerApi.util.updateQueryData(
                        'getMessagesByDialogPartner',
                        { dialogPartnerId: args.receiverId, ownerId: args.ownerId },
                        draft => {
                            const firstPage = draft.pages?.[0]

                            if (!firstPage) {
                                draft.pages = [
                                    {
                                        items: [optimistic],
                                        totalCount: 1,
                                        pageSize: 20,
                                        notReadCount: 0,
                                    },
                                ]
                                draft.pageParams = [0]
                                return
                            }

                            firstPage.items.unshift(optimistic)
                            firstPage.totalCount += 1
                        }
                    )
                )

                emitEvent(SOCKET_EVENTS.MESSAGE_SEND, {
                    message: args.message,
                    receiverId: args.receiverId,
                })
            },
        }),
    }),

    overrideExisting: true,
})

export const {
    useGetAllMessagesInfiniteQuery,
    useGetMessagesByDialogPartnerInfiniteQuery,
    useSendMessageWithOptimisticMutation,
} = messengerApi