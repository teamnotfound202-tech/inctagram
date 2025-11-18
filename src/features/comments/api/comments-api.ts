import {baseApi} from '@/shared/api'
import {Comment, CommentsResponse, From, InfinityPostRequest, LikeStatus} from '@/features/publicUserApi/types'
import {PAGINATION} from "@/features/notificationsApi/notificationsConstants";

export const commentsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({

        fetchInfinityPostComments: builder.infiniteQuery<
            CommentsResponse,
            InfinityPostRequest,
            number | undefined
        >({
            query: ({queryArg, pageParam}) => {
                const {postId, pageSize, sortDirection, sortBy} = queryArg
                return {
                    url: `posts/${postId}/comments`,
                    params: {
                        pageSize: pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
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
            providesTags: (_result, _error, {postId}) => [
                {type: 'Comment', id: postId}
            ],
            //принудительно устанавливаем ключи в кэш
            serializeQueryArgs: ({queryArgs: {postId}}) => `Comment-${postId}`,
        }),

        createComment: builder.mutation<
            CommentsResponse,
            { postId: number; user: From; content: string }
        >({
            query: ({postId, content}) => ({
                url: `posts/${postId}/comments`,
                method: 'POST',
                body: {content},
            }),
            invalidatesTags: ['Comment'],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, user, content}, {dispatch, queryFulfilled}) => {
                const currentUser = user

                const patchResult = dispatch(
                    commentsApi.util.updateQueryData(
                        'fetchInfinityPostComments',
                        {postId},
                        (draft) => {
                            const optimisticComment: Comment = {
                                id: Date.now(),
                                postId,
                                content,
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
                                createdAt: new Date().toISOString(),
                                answerCount: 0,
                                likeCount: 0,
                                isLiked: false,
                            }

                            draft.pages[0].items.unshift(optimisticComment);
                        })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),

        updateCommentLikeStatus: builder.mutation<
            void,
            { postId: number; commentId: number; likeStatus: LikeStatus, }
        >({
            query: ({postId, commentId, likeStatus}) => ({
                url: `posts/${postId}/comments/${commentId}/like-status`,
                method: 'PUT',
                body: {likeStatus},
            }),

            invalidatesTags: (_result, _error, {postId}) => [
                {type: 'Comment' as const, id: postId},
            ],

            async onQueryStarted({postId, commentId, likeStatus,}, {dispatch, queryFulfilled, getState}) {
                const newLike = likeStatus === LikeStatus.LIKE;

                //Значение для optimistic update - если ставим like, то количество лайков увеличивается на 1, и наборот
                const likesCountDifference = likeStatus === LikeStatus.LIKE ? 1 : -1

                const patchResult = dispatch(
                    commentsApi.util.updateQueryData(
                        'fetchInfinityPostComments',
                        {postId},
                        (draft) => {
                            const commentsItems = draft.pages.flatMap(item => item.items)
                            const comment = commentsItems.find(comment => comment.id === commentId)
                            if (comment) {
                                comment.isLiked = newLike
                                comment.likeCount = comment.likeCount + likesCountDifference
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
    useCreateCommentMutation,
    useUpdateCommentLikeStatusMutation,
    useFetchInfinityPostCommentsInfiniteQuery,
} = commentsApi
