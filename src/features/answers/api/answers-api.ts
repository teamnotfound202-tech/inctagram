import {baseApi} from '@/shared/api'
import {Answer, From, InfinityAnswerRequest, InfinityAnswerResponse, LikeStatus} from '@/features/publicUserApi/types'
import {PAGINATION} from "@/features/notificationsApi/notificationsConstants";

export const answersApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({

        fetchInfinityAnswersForComment: builder.infiniteQuery<
            InfinityAnswerResponse,
            InfinityAnswerRequest,
            number | undefined
        >({
            query: ({queryArg, pageParam}) => {
                const {postId, commentId, pageSize, sortDirection, sortBy} = queryArg
                return {
                    url: `posts/${postId}/comments/${commentId}/answers`,
                    params: {
                        pageSize: pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE, //TODO: добавить pageSize вместо харкода
                        sortDirection: sortDirection ?? 'desc',
                        pageNumber: pageParam ?? 1,     //то значение, которое возвращается из getNextPageParam
                        sortBy: sortBy ?? ''
                    },
                }
            },

            infiniteQueryOptions: {
                initialPageParam: undefined,
                getNextPageParam: (lastPage, allPages) => {
                    if ((allPages.length * lastPage.pageSize + 1) > lastPage.totalCount) return undefined; // больше страниц нет
                    const nextPage = allPages.length + 1; // следующая страница = количество уже загруженных + 1
                    return nextPage;
                },
            },
            providesTags: (result, error, {commentId}) => [
                {type: 'Answer', id: commentId}
            ],
            //принудительно устанавливаем ключи в кэш
            serializeQueryArgs: ({queryArgs: {commentId}}) => `Answer-${commentId}`,
        }),

        createAnswer: builder.mutation<
            Answer,
            { postId: number, commentId: number, user: From, content: string }
        >({
            query: ({postId, commentId, content}) => ({
                url: `posts/${postId}/comments/${commentId}/answers`,
                method: 'POST',
                body: {content},
            }),
            invalidatesTags: (_result, _error, {commentId}) => [
                {type: 'Answer' as const, id: commentId},
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, commentId, user, content}, {dispatch, queryFulfilled}) => {
                const currentUser = user
                const patchResult = dispatch(
                    answersApi.util.updateQueryData(
                        'fetchInfinityAnswersForComment',
                        {postId, commentId,},
                        draft => {
                            const optimisticAnswer: Answer = {
                                id: Date.now(),
                                commentId,
                                from: currentUser
                                    ? {
                                        id: currentUser.id,
                                        username: currentUser.username,
                                        avatars: currentUser.avatars || [],
                                    }
                                    : {
                                        id: 9999,
                                        username: 'Anonymous',
                                        avatars: [],
                                    },
                                content,
                                createdAt: new Date().toISOString(),
                                likeCount: 0,
                                isLiked: false,
                            }

                            draft.pages[0].items.unshift(optimisticAnswer);
                        })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),

        updateAnswerLikeStatus: builder.mutation<
            void,
            { postId: number, commentId: number, answerId: number, likeStatus: LikeStatus }
        >({
            query: ({postId, commentId, answerId, likeStatus}) => ({
                url: `posts/${postId}/comments/${commentId}/answers/${answerId}/like-status`,
                method: 'PUT',
                body: {likeStatus},
            }),
            // Автоматически обновляем кэш
            invalidatesTags: (_result, _error, {commentId}) => [
                {type: 'Answer' as const, id: commentId},
            ],
            // Оптимистичное обновление
            async onQueryStarted({postId, commentId, answerId, likeStatus,}, {dispatch, queryFulfilled, getState}) {
                const newLike = likeStatus === LikeStatus.LIKE;

                //Значение для optimistic update - если ставим like, то количество лайков увеличивается на 1, и наборот
                const likesCountDifference = likeStatus === LikeStatus.LIKE ? 1 : -1

                const patchResult = dispatch(
                    answersApi.util.updateQueryData(
                        'fetchInfinityAnswersForComment',
                        {commentId, postId},
                        (draft) => {
                            const answerItems = draft.pages.flatMap(item => item.items)
                            const answer = answerItems.find(answer => answer.id === answerId)
                            if (answer) {
                                answer.isLiked = newLike
                                answer.likeCount = answer.likeCount + likesCountDifference
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    })
})

export const {
    useFetchInfinityAnswersForCommentInfiniteQuery,
    useCreateAnswerMutation,
    useUpdateAnswerLikeStatusMutation
} = answersApi
