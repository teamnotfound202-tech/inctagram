import {baseApi} from '@/shared/api';
import {PAGINATION} from "@/features/notificationsApi/notificationsConstants";
import {
    LastMessagesResponse,
    MessageSendRequest,
    MessagesFromPartnerRequest,
    MessagesFromPartnerResponse,
    MessagesRequest,
    MessageViewModal
} from "@/features/messenger/api/types";
import {subscribeToEvent} from "@/shared/lib/socket/subscribeToEvent";
import {SOCKET_EVENTS} from "@/shared/lib/constants/constants";
import {emitEvent} from "@/shared/lib/socket/emitEvent";

export const messengerApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({

        fetchMessagesFromPartner: builder.infiniteQuery<
            MessagesFromPartnerResponse,
            MessagesFromPartnerRequest,
            number | undefined
        >({
            query: ({queryArg, pageParam}) => {
                const {dialoguePartnerId, pageSize, cursor, searchName} = queryArg
                return {
                    url: `/messenger/${dialoguePartnerId}/${pageParam || ''}`,
                    params: {
                        pageSize: pageSize ?? PAGINATION.DEFAULT_MESSAGES_PAGE_SIZE,
                        searchName: searchName || '',
                        cursor: cursor,     //то значение, которое возвращается из getNextPageParam
                    },
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

                subscribeToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: MessageViewModal) => {   //TODO: проверить, может подписку нужно делать при загрузке приложения???
                    // 1. Обновляем текущий кэш
                    updateCachedData((state) => {
                        state.pages[0].items.push(data)
                    })
                    //2. Инвалидируем кэш списка чатов, чтобы последний чат был сверху
                    dispatch(baseApi.util.invalidateTags(['LastMessages']));
                })

                subscribeToEvent(SOCKET_EVENTS.MESSAGE_SEND, (data: MessageViewModal) => {      //TODO: Нужна ли подписка на этот event?
                    updateCachedData((state) => {
                        state.pages[0].items.push(data)
                    })
                })
            },
            providesTags: (_result, _error, {dialoguePartnerId}) => [{
                type: 'MessagesFromPartner',
                id: dialoguePartnerId
            }],
            serializeQueryArgs: ({queryArgs: {dialoguePartnerId}}) => `MessagesFromPartner-${dialoguePartnerId}`,
        }),

        sendMessage: builder.mutation({
            queryFn: ({text, receiverId}) => {
                return new Promise((resolve, reject) => {

                        const newMessageConstruction: MessageSendRequest = {
                            message: text,
                            receiverId: receiverId
                        }

                        emitEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, newMessageConstruction, (response) => {
                            resolve({data: response});                  //TODO: Не понимаю, нужен ли callback здесь
                        });

                        //Оптимистичное обновление
                        resolve({data: newMessageConstruction})
                })
            },
            invalidatesTags: ['LastMessages']
        }),

        fetchChats: builder.infiniteQuery<
            LastMessagesResponse,
            MessagesRequest,
            number | undefined
        >({
            query: ({queryArg, pageParam}) => {
                const {pageSize, cursor, searchName} = queryArg
                return {
                    url: `/messenger/${pageParam || ''}`,
                    params: {
                        pageSize: pageSize ?? PAGINATION.DEFAULT_MESSAGES_PAGE_SIZE,
                        searchName: searchName || '',
                        cursor: cursor,     //то значение, которое возвращается из getNextPageParam
                    },
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
            providesTags: ['LastMessages'],
           /* serializeQueryArgs: ({endpointName, queryArgs}) => {
                return {endpointName, cursor: queryArgs.cursor};
            },*/
        }),
    })
})

export const {
    useFetchMessagesFromPartnerInfiniteQuery,
    useFetchChatsInfiniteQuery,
    useSendMessageMutation,
} = messengerApi