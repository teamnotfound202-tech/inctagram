import { baseApi } from '@/shared/api'
import {AllMessages, IncomingMessage, MessageItem, MessageSendRequest} from '@/features/messengerApi/types'

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
        fetchMessagesFromPartner: builder.infiniteQuery<
            AllMessages,
            { dialogPartnerId: number; ownerId: number },
            number | undefined
        >({
            query: ({queryArg, pageParam}) => {
                const {dialogPartnerId} = queryArg
                return {
                    url: `messenger/${dialogPartnerId}?cursor=${pageParam}`,

                }
            },
            infiniteQueryOptions: {
                initialPageParam: undefined,
                getNextPageParam: (lastPage, allPages) => {
                    const totalCountMessages = allPages.flatMap(page => page.items).length
                    if (
                        totalCountMessages < lastPage.totalCount &&
                        lastPage.items[lastPage.items.length - 1]?.id
                    ) {
                        return lastPage.items[lastPage.items.length - 1].id
                    }

                    return null
                },
            },
            onCacheEntryAdded: async (_arg, {cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch}) => {
                await cacheDataLoaded

                subscribeToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: MessageItem) => {   //TODO: проверить, может подписку нужно делать при загрузке приложения???
                    // 1. Обновляем текущий кэш
                    updateCachedData((state) => {
                        state.pages[0].items.push(data)
                    })
                    //2. Инвалидируем кэш списка чатов, чтобы последний чат был сверху
                    dispatch(baseApi.util.invalidateTags(['LastMessages']));
                })

                subscribeToEvent(SOCKET_EVENTS.MESSAGE_SEND, (data: MessageItem) => {      //TODO: Нужна ли подписка на этот event?
                    updateCachedData((state) => {
                        state.pages[0].items.push(data)
                    })
                })
            },
            providesTags: (_result, _error, {dialogPartnerId}) => [{
                type: 'MessagesFromPartner',
                id: dialogPartnerId
            }],
            serializeQueryArgs: ({queryArgs: {dialogPartnerId}}) => `MessagesFromPartner-${dialogPartnerId}`,
        }),
        // -----------------------------------------------------------
        // 3) Отправка сообщения ТОЛЬКО WebSocket + оптимистичное обновление
        // -----------------------------------------------------------
        sendMessageWithOptimistic: builder.mutation<
            IncomingMessage,
            { message: string; receiverId: number; ownerId: number }
        >({
            // 🔥 queryFn с правильной структурой
            queryFn: (args) => {
                return new Promise((resolve) => {
                    // 🔥 Создаем временное сообщение
                    const tempId = Date.now()
                    const tempMessage = {
                        ...args,
                        tempId, // Для отслеживания
                        timestamp: new Date().toISOString()
                    }

                    // 🔥 Отправляем через WebSocket с колбэком
                    emitEvent(SOCKET_EVENTS.MESSAGE_SEND, tempMessage, (response) => {
                        if (response) {

                            // 🔥 Сервер ответил
                            console.log('✅ Сервер подтвердил:', response)
                            resolve({ data: response })
                        } else {
                            // 🔥 Нет ответа от сервера, но оптимистичное обновление уже есть
                            console.log('⚠️ Нет ответа сервера, используем временные данные')

                        }
                    })

                    // 🔥 Оптимистичное обновление сразу
                    resolve({ data:{
                        id: tempId,
                        messageText: args.message,
                        receiverId: args.receiverId,
                        ownerId: args.ownerId,
                        status: 'SENT', // Статус отправки
                        messageType: 'TEXT',
                        createdAt: new Date().toISOString() as ISOStringFormat,
                        updatedAt: new Date().toISOString() as ISOStringFormat,

                    }})
                })
            },

            // 🔥 Оптимистичное обновление кэша
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const tempId = Date.now()

                const patchResult = dispatch(
                    messengerApi.util.updateQueryData(
                        'getMessagesByDialogPartner',
                        { dialogPartnerId: args.receiverId, ownerId: args.ownerId },
                        draft => {
                            if (!draft.pages || draft.pages.length === 0) {
                                draft.pages = [{
                                    items: [],
                                    totalCount: 0,
                                    pageSize: 20,
                                    notReadCount: 0,
                                }]
                                draft.pageParams = [0]
                            }

                            const firstPage = draft.pages[0]
                            const optimisticMessage: MessageItem = {
                                id: tempId,
                                messageText: args.message,
                                receiverId: args.receiverId,
                                ownerId: args.ownerId,
                                status: 'SENT', // Статус отправки
                                messageType: 'TEXT',
                                createdAt: new Date().toISOString() as ISOStringFormat,
                                updatedAt: new Date().toISOString() as ISOStringFormat,
                                userName: 'Вы',
                                avatars: [] as Avatar[],
                                notReadCount: 0,
                            }

                            firstPage.items.unshift(optimisticMessage)
                            firstPage.totalCount += 1
                        }
                    )
                )

                try {
                    // 🔥 Ждем ответ от сервера
                    const result = await queryFulfilled
                    const serverMessage = result.data

                    // 🔥 Обновляем временное сообщение серверными данными
                    dispatch(
                        messengerApi.util.updateQueryData(
                            'getMessagesByDialogPartner',
                            { dialogPartnerId: args.receiverId, ownerId: args.ownerId },
                            draft => {
                                const firstPage = draft.pages?.[0]
                                if (!firstPage) return

                                // 🔥 Находим временное сообщение
                                const tempIndex = firstPage.items.findIndex(item =>
                                    item.id === tempId ||
                                    (item as any).tempId === tempId
                                )

                                if (tempIndex !== -1) {
                                    // 🔥 Заменяем временное сообщение серверным
                                    firstPage.items[tempIndex] = {
                                        ...serverMessage,
                                        status: 'SENT', // Меняем статус
                                        userName: 'Вы',
                                        avatars: [] as Avatar[],
                                        notReadCount: 0,
                                    }
                                }
                            }
                        )
                    )

                } catch (error) {
                    console.error('❌ Ошибка отправки:', error)
                    patchResult.undo() // 🔥 Откатываем при ошибке
                }
            },

            invalidatesTags: (_result, _error, args) => [
                { type: 'Messages', id: args.receiverId }
            ],
        }),
        sendMessage: builder.mutation({
            queryFn: ({text, receiverId}) => {

                return new Promise((resolve, reject) => {

                    const newMessageConstruction: MessageSendRequest = {
                        message: text,
                        receiverId: receiverId
                    }

                    emitEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, newMessageConstruction, (response) => {
                        resolve({data: response});

                    });

                    //Оптимистичное обновление
                    resolve({data: newMessageConstruction})
                })
            },
            invalidatesTags: ['Messages']
        }),
       }),

    overrideExisting: true,
})

export const {
    useGetAllMessagesInfiniteQuery,
    useGetMessagesByDialogPartnerInfiniteQuery,
    useSendMessageWithOptimisticMutation,
    useFetchMessagesFromPartnerInfiniteQuery,
    useSendMessageMutation
} = messengerApi