import {baseApi} from '@/shared/api'
import {CreatePostInput, ImagesResponse, PostImage} from '@/shared/lib/sсhemas/posts'
import {publicUserApi} from '@/features/publicUserApi/publicUserApi';
import {
    Answer,
    Comment,
    CommentsResponse,
    From,
    InfinityAnswerRequest,
    InfinityAnswerResponse,
    InfinityPostRequest,
    LikeStatus,
    Post,
    ResponsesPosts
} from '@/features/publicUserApi/types'
import {ISOStringFormat} from 'date-fns'
import {PAGINATION} from "@/features/notificationsApi/notificationsConstants";

type CreatePostWithUserId = CreatePostInput & { userId?: number }

export const postsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        uploadPostsImages: builder.mutation<ImagesResponse, File[]>({
            query: (images: File[]) => {
                const formData = new FormData()
                images.forEach(file => {
                    formData.append(`file`, file)
                })
                return {
                    url: `/posts/image`,
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ['Posts'],
        }),
        deletePostsImage: builder.mutation<void, { uploadId: string }>({
            query: ({uploadId}) => {
                return {
                    url: `/posts/image/${uploadId}`,
                    method: 'DELETE',
                }
            },
        }),
        createPost: builder.mutation<PostImage, CreatePostWithUserId>({
            query: ({userId, ...postData}) => ({
                url: `/posts`,
                method: 'POST',
                body: postData,
            }),
            invalidatesTags: (_result, _error, arg) => {
                const tags = [
                    {type: 'Posts' as const}, // Все теги как объекты
                    {type: 'UserPosts' as const, id: 'LIST'},
                    {type: 'UserProfile' as const},
                ]

                if (arg.userId) {
                    tags.push({type: 'UserPosts' as const, id: arg.userId.toString()})
                }

                return tags
            },
        }),
        fetchPost: builder.query<Post, number>({
            query: postId => `posts/id/${postId}`,
        }),

/*        fetchInfinityPostComments: builder.infiniteQuery<
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
            providesTags: (result, error, {postId}) => [
                {type: 'Comment', id: postId}
            ],
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
                    postsApi.util.updateQueryData(
                        'fetchInfinityPostComments',
                        {
                            postId,
                            pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
                            sortDirection: 'desc',
                        },
                        draft => {
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
                                        id: 3218,
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

            // По желанию: можно убрать, чтобы не затирать оптимистику рефетчем
            invalidatesTags: (_result, _error, {postId}) => [
                {type: 'Comment' as const, id: postId},
            ],

            async onQueryStarted({postId, commentId, likeStatus,}, {dispatch, queryFulfilled, getState}) {
                const newLike = likeStatus === LikeStatus.LIKE;

                //Значение для optimistic update - если ставим like, то количество лайков увеличивается на 1, и наборот
                const likesCountDifference = likeStatus === LikeStatus.LIKE ? 1 : -1

                // baseArg ДОЛЖНО совпадать с queryArg у infiniteQuery в UI
                const s = getState() /!*as RootState*!/;
                const queries = s.inctagramApi.queries;
                const match = Object.values(queries).find(
                    (q: any) =>                                         //TODO: не знаю, как пофиксить any
                        q?.endpointName === 'fetchInfinityPostComments' &&
                        q?.originalArgs?.postId === postId                         // при необходимости сравнить и sortDirection/sortBy/pageSize
                );
                const originalArgs = match?.originalArgs;                   //аргументы, с которыми запрашивается infinity endpoint
                const baseArg = originalArgs as InfinityPostRequest                 //это идет как ключ для кэша

                const patchResult = dispatch(
                    postsApi.util.updateQueryData(
                        'fetchInfinityPostComments',
                        baseArg,
                        (draft) => {
                            // draft здесь: { pages: CommentsResponse[]; pageParams: any[] }
                            for (const page of draft.pages) {
                                const idx = page.items.findIndex(c => c.id === commentId);
                                if (idx !== -1) {
                                    page.items[idx] = {
                                        ...page.items[idx],
                                        isLiked: newLike,
                                        likeCount: page.items[idx].likeCount + likesCountDifference,
                                    };
                                    break;
                                }
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
        }),*/

        deletePost: builder.mutation<void, { postId: number; userId?: string }>({
            query: ({postId}) => ({
                url: `posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, {postId}) => [
                {type: 'Posts', id: postId},
                {type: 'Posts', id: 'LIST'},
                {type: 'UserPosts', id: 'LIST'},
                'UserPosts', // Инвалидируем все посты пользователей
                'UserProfile', // Обновляем профиль пользователя (счетчик постов)
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, userId}, {dispatch, queryFulfilled}) => {
                const patchResults = []

                // Обновляем кэш getPostsForUser если передан userId
                if (userId) {
                    const patchResult = dispatch(
                        publicUserApi.util.updateQueryData('getPostsForUser', {userId}, draft => {
                            if (draft.pages) {
                                draft.pages.forEach((page: ResponsesPosts) => {
                                    page.items = page.items.filter(post => post.id !== postId)
                                    page.totalCount = Math.max(0, page.totalCount - 1)
                                })
                            }
                        })
                    )
                    patchResults.push(patchResult)
                }

                // Обновляем кэш fetchPost - помечаем как удаленный
                const postPatchResult = dispatch(
                    postsApi.util.updateQueryData('fetchPost', postId, draft => {
                        // Можно пометить пост как удаленный или очистить данные
                        Object.assign(draft, {deleted: true})
                    })
                )
                patchResults.push(postPatchResult)

                try {
                    await queryFulfilled
                } catch (error: unknown) {
                    // Типизируем ошибку
                    const rtqError = error as {
                        error?: {
                            status?: number
                            data?: {
                                statusCode?: number
                            }
                        }
                    }

                    // Если пост не найден (404), считаем это успешным удалением
                    const isPostNotFound =
                        rtqError?.error?.status === 404 || rtqError?.error?.data?.statusCode === 404

                    if (!isPostNotFound) {
                        // Откатываем изменения только если это не 404 ошибка
                        patchResults.forEach(patchResult => patchResult.undo())
                        // Перебрасываем ошибку для обработки в UI
                        throw error
                    }
                    // Если 404 - не откатываем изменения, пост уже удален
                }
            },
        }),

        updatePost: builder.mutation<Post, { postId: number; description: string }>({
            query: ({postId, description}) => ({
                url: `posts/${postId}`,
                method: 'PUT',
                body: {description},
            }),
            invalidatesTags: (result, error, {postId}) => [{type: 'Posts', id: postId}],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, description}, {dispatch, queryFulfilled, getState}) => {
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('fetchPost', postId, draft => {
                        draft.description = description
                        draft.updatedAt = new Date().toISOString() as ISOStringFormat
                    })
                )

                try {
                    await queryFulfilled
                } catch (error) {
                    patchResult.undo()
                }
            },
        }),

        updatePostLikeStatus: builder.mutation<
            void,
            { postId: number; likeStatus: LikeStatus; url: string }
        >({
            query: ({postId, likeStatus}) => ({
                url: `posts/${postId}/like-status`,
                method: 'PUT',
                body: {likeStatus},
            }),
            // Автоматически обновляем кэш
            invalidatesTags: (result, error, {postId}) => [{type: 'Posts', id: postId}],
            // Оптимистичное обновление
            onQueryStarted: async (
                {postId, likeStatus, url},
                {dispatch, queryFulfilled, getState}
            ) => {
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('fetchPost', postId, draft => {
                        draft.isLiked = likeStatus === LikeStatus.LIKE
                        if (likeStatus === LikeStatus.LIKE) {
                            draft.likesCount += 1
                            draft.avatarWhoLikes.push(url)
                        } else {
                            draft.likesCount -= 1
                            const imageId = draft.avatarWhoLikes.findIndex(item => item === url)
                            draft.avatarWhoLikes.splice(imageId, 1)
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch (error) {
                    patchResult.undo()
                }
            },
        }),

       /* fetchInfinityAnswersForComment: builder.infiniteQuery<
            InfinityAnswerResponse,
            InfinityAnswerRequest,
            number | undefined
        >({
            query: ({queryArg, pageParam}) => {
                const {postId, commentId, pageSize, sortDirection, sortBy} = queryArg
                return {
                    url: `posts/${postId}/comments/${commentId}/answers`,
                    params: {
                        pageSize: PAGINATION.DEFAULT_PAGE_SIZE, //TODO: добавить pageSize вместо харкода
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
            //invalidatesTags: ['Answer'],
            invalidatesTags: (result, error, {commentId}) => [
                {type: 'Answer' as const, id: commentId},
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, commentId, user, content}, {dispatch, queryFulfilled}) => {
                const currentUser = user
                const patchResult = dispatch(
                    postsApi.util.updateQueryData(
                        'fetchInfinityAnswersForComment',
                        {
                            postId,
                            commentId,
                            pageSize: PAGINATION.DEFAULT_PAGE_SIZE, //TODO: добавить pageSize вместо харкода
                            sortDirection: 'desc',
                        },
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
                                        id: 3218,
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

                // baseArg ДОЛЖНО совпадать с queryArg у infiniteQuery в UI
                const s = getState() /!*as RootState*!/;
                const queries = s.inctagramApi.queries;
                const match = Object.values(queries).find(
                    (q: any) =>                                         //TODO: не знаю, как пофиксить any
                        q?.endpointName === 'fetchInfinityAnswersForComment' &&
                        q?.originalArgs?.commentId === commentId                         // при необходимости сравнить и sortDirection/sortBy/pageSize
                );
                const originalArgs = match?.originalArgs;                   //аргументы, с которыми запрашивается infinity endpoint
                const baseArg = originalArgs as InfinityAnswerRequest                 //это идет как ключ для кэша

                const patchResult = dispatch(
                    postsApi.util.updateQueryData(
                        'fetchInfinityAnswersForComment',
                        baseArg,
                        (draft) => {
                            // draft здесь: { pages: CommentsResponse[]; pageParams: any[] }
                            for (const page of draft.pages) {
                                const idx = page.items.findIndex(c => c.id === answerId);
                                if (idx !== -1) {
                                    page.items[idx] = {
                                        ...page.items[idx],
                                        isLiked: newLike,
                                        likeCount: page.items[idx].likeCount + likesCountDifference,
                                    };
                                    break;
                                }
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
        }),*/
    }),
})

export const {
    useUploadPostsImagesMutation,
    useDeletePostsImageMutation,
    useCreatePostMutation,
    useFetchPostQuery,
    useUpdatePostLikeStatusMutation,
    useDeletePostMutation,
    useUpdatePostMutation,
    /*useFetchInfinityAnswersForCommentInfiniteQuery,
    useCreateAnswerMutation,
    useUpdateAnswerLikeStatusMutation*/
} = postsApi
