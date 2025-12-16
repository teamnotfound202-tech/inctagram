import {baseApi, type ResponsesMe} from '@/shared/api';
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

        fetchMessagesFromPartner: builder.infiniteQuery<MessagesFromPartnerResponse, MessagesFromPartnerRequest,
            number | undefined>({
            query: ({queryArg, pageParam}) => {
                const {dialoguePartnerId, pageSize, cursor, searchName} = queryArg
                return {
                    url: `/messenger/${dialoguePartnerId}`,
                    params: {
                        pageSize: pageSize ?? PAGINATION.DEFAULT_MESSAGES_PAGE_SIZE,
                        searchName: searchName || '',
                        cursor: pageParam,     //то значение, которое возвращается из getNextPageParam
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
            onCacheEntryAdded: async (arg, {
                cacheDataLoaded, updateCachedData,
                cacheEntryRemoved, dispatch, getState
            }) => {

                const {dialoguePartnerId} = arg;  // ← Получаем ID текущего чата

                await cacheDataLoaded

                //Коллбэк для передачи в SOCKET_EVENTS.RECEIVE_MESSAGE
                const handleMessage = (data: MessageViewModal) => {
                    // ✅ Фильтруем: обновляем ТОЛЬКО если сообщение для НАШЕГО чата

                    const currentState = getState();  // ← Полное состояние store
                    const apiState = currentState[baseApi.reducerPath];  // RTK Query состояние
                    const cacheKey = apiState.queries[`me(undefined)`]//`me(undefined)` - имя эндпоинта 'me'
                    const meData = cacheKey?.data
                    const myId = (meData as ResponsesMe).userId

                    //Если отправитель сообщения - Я, то Id партнера - data.receiverId
                    //Иначе сообщение отправлено мне, и Id партнера - data.ownerId
                    const partnerId = (data.ownerId === myId) ? data.receiverId : data.ownerId

                    //Фильтруем id для доступа к эндпоинта кэша
                    //если id кэша не равно dialoguePartnerId, то в этот эндпоинт не нужно добавлять пришедшее сообщение
                    if (partnerId !== dialoguePartnerId) return;

                    updateCachedData((state) => {
                        state.pages[0].items.unshift(data);
                    });

                    //TODO: подумать!!! тут можно инвалидировать так {type: 'MessagesFromPartner', id: dialoguePartnerId},
                    //но если пишешь человеку, с которым еще не было чата, то его еще нет в кэше,
                    //поэтому он не инвалидируется
                    dispatch(baseApi.util.invalidateTags(['MessagesFromPartner', 'LastMessages'],));
                };

                const unsubscribeRECEIVE_MESSAGE = subscribeToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, handleMessage)
                const unsubscribeMESSAGE_DELETED = subscribeToEvent(SOCKET_EVENTS.MESSAGE_DELETED,
                    (deletedId) => {
                        updateCachedData((state) => {
                            const casheState = state.pages.flatMap(page => page.items)
                            const deletedIndex = casheState.findIndex(item => item.id === deletedId)
                            if (deletedIndex !== -1) {
                                casheState.splice(deletedIndex, 1)
                            }
                        });
                        //dispatch(baseApi.util.invalidateTags(['LastMessages', 'GetUserBySearch']));
                        dispatch(baseApi.util.invalidateTags([
                                {type: 'MessagesFromPartner', id: dialoguePartnerId},
                                'LastMessages'],
                            //['LastMessages', 'GetUserBySearch']
                        ));
                    })

                //При удалении кэша отписываемся от SOCKET_EVENTS.RECEIVE_MESSAGE, SOCKET_EVENTS.MESSAGE_DELETED
                await cacheEntryRemoved
                unsubscribeRECEIVE_MESSAGE?.()
                unsubscribeMESSAGE_DELETED?.()
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
                        resolve({data: response});                  //TODO: Не понимаю, нужен ли callback здесь, тк он не отрабатывает
                    });

                    //Оптимистичное обновление
                    resolve({data: newMessageConstruction})
                })
            },
            invalidatesTags: ['LastMessages']
        }),

        fetchChats: builder.infiniteQuery<LastMessagesResponse, MessagesRequest, number | undefined>({
            query: ({queryArg, pageParam}) => {
                const {pageSize, cursor, searchName} = queryArg
                return {
                    url: `/messenger`,
                    params: {
                        pageSize: pageSize ?? 20,  //TODO: не работает курсорная пагинация на бэкэнде
                        searchName: searchName || '',
                        cursor: pageParam,     //то значение, которое возвращается из getNextPageParam
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
            serializeQueryArgs: ({endpointName, queryArgs: {searchName}}) => `${endpointName}-${searchName}`
        }),
        deleteMessage: builder.mutation<void, { deletedMessageId: number, activeUserIdChat: number }>({
            query: ({deletedMessageId, activeUserIdChat}) => ({
                method: "DELETE",
                url: `/messenger/${deletedMessageId}`
            }),
            onQueryStarted: async ({deletedMessageId, activeUserIdChat}, {dispatch, queryFulfilled}) => {
                // ← queryArgs для fetchMessagesFromPartner
                const queryArgs = {dialoguePartnerId: activeUserIdChat};

                const patchResult = dispatch(
                    messengerApi.util.updateQueryData(
                        'fetchMessagesFromPartner',
                        queryArgs,  // ✅ Объект queryArgs
                        draft => {
                            draft.pages.forEach(page => {
                                const idx = page.items.findIndex(item => item.id === deletedMessageId);
                                if (idx !== -1) {
                                    page.items.splice(idx, 1);
                                }
                            });
                        }));

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, {activeUserIdChat}) => [
                {type: 'MessagesFromPartner', id: activeUserIdChat},
                'LastMessages'
            ]
        })
    }),
})

export const {
    useFetchMessagesFromPartnerInfiniteQuery,
    useFetchChatsInfiniteQuery,
    useSendMessageMutation,
    useDeleteMessageMutation,
} = messengerApi