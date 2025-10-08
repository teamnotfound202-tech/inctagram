import {baseApi} from '@/shared/api'
import {CreatePostInput, ImagesResponse, PostImage} from '@/shared/lib/sсhemas/posts'
import { publicUserApi } from '@/features/publicUserApi/publicUserApi';
import { ResponsesPosts } from '@/features/publicUserApi/types'
import {Comment, CommentsResponse, From, LikeStatus, Post} from "@/features/publicUserApi/types";
import { ISOStringFormat } from 'date-fns'

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
                    method: 'DELETE'
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
                    {type: 'Posts' as const},  // Все теги как объекты
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
            query: (postId) => `posts/id/${postId}`
        }),
        fetchPostComments: builder.query<CommentsResponse, number>({
            query: (postId) => `posts/${postId}/comments`,
            providesTags: (result, error, postId) => [
                {type: 'Comment', id: postId}
            ],
        }),
        createComment: builder.mutation<CommentsResponse, { postId: number; user: From, content: string }>({
            query: ({postId, content}) => ({
                url: `posts/${postId}/comments`,
                method: 'POST',
                body: {content},
            }),
            invalidatesTags: (result, error, {postId}) => [
                {type: 'Comment', id: postId}
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, user, content}, {dispatch, queryFulfilled, getState}) => {
                const currentUser = user;

                const patchResult = dispatch(
                    postsApi.util.updateQueryData('fetchPostComments', postId, (draft) => {
                        const optimisticComment: Comment = {
                            id: Date.now(),
                            postId,
                            content,
                            from: currentUser ? {
                                id: currentUser.id,
                                username: currentUser.username,
                                avatars: currentUser.avatars || []
                            } : {
                                id: 3218,
                                username: "Anonymous",
                                avatars: []
                            },
                            createdAt: new Date().toISOString(),
                            answerCount: 0,
                            likeCount: 0,
                            isLiked: false,
                        };

                        draft.items.unshift(optimisticComment);
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),
        updateCommentLikeStatus: builder.mutation<void, { postId: number; commentId: number, likeStatus: LikeStatus }>({
            query: ({postId, commentId, likeStatus}) => ({
                url: `posts/${postId}/comments/${commentId}/like-status`,
                method: 'PUT',
                body: {likeStatus},
            }),
            // Автоматически обновляем кэш
            invalidatesTags: (result, error, {postId}) => [
                {type: 'Comment', id: postId}
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, commentId, likeStatus}, {dispatch, queryFulfilled, getState}) => {
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('fetchPostComments', postId, (draft) => {
                        const newLikeStatus: boolean = likeStatus === LikeStatus.LIKE ? true : false
                        draft.items = draft.items.map(comment => (comment.id === commentId ? {
                            ...comment,
                            isLiked: newLikeStatus
                        } : comment))
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),

        deletePost: builder.mutation<void, {postId:number, userId?: string }>({
            query: ({postId}) => ({
                url: `posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Posts', id: postId },
                { type: 'Posts', id: 'LIST' },
                { type: 'UserPosts', id: 'LIST' },
                'UserPosts', // Инвалидируем все посты пользователей
                'UserProfile' // Обновляем профиль пользователя (счетчик постов)
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({ postId, userId }, { dispatch, queryFulfilled }) => {
                const patchResults: any[] = [];

                // Обновляем кэш getPostsForUser если передан userId
                if (userId) {
                    const patchResult = dispatch(
                      publicUserApi.util.updateQueryData('getPostsForUser', { userId }, (draft) => {
                          if (draft.pages) {
                              draft.pages.forEach((page: ResponsesPosts) => {
                                  page.items = page.items.filter((post: any) => post.id !== postId);
                                  page.totalCount = Math.max(0, page.totalCount - 1);
                              });
                          }
                      })
                    );
                    patchResults.push(patchResult);
                }

                // Обновляем кэш fetchPost - помечаем как удаленный
                const postPatchResult = dispatch(
                  postsApi.util.updateQueryData('fetchPost', postId, (draft) => {
                      // Можно пометить пост как удаленный или очистить данные
                      Object.assign(draft, { deleted: true });
                  })
                );
                patchResults.push(postPatchResult);

                try {
                    await queryFulfilled;
                } catch (error: unknown) {
                    // Типизируем ошибку
                    const rtqError = error as {
                        error?: {
                            status?: number;
                            data?: {
                                statusCode?: number;
                            };
                        };
                    };

                    // Если пост не найден (404), считаем это успешным удалением
                    const isPostNotFound = rtqError?.error?.status === 404 ||
                      rtqError?.error?.data?.statusCode === 404;

                    if (!isPostNotFound) {
                        // Откатываем изменения только если это не 404 ошибка
                        patchResults.forEach(patchResult => patchResult.undo());
                        // Перебрасываем ошибку для обработки в UI
                        throw error;
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
            invalidatesTags: (result, error, {postId}) => [
                {type: 'Posts', id: postId}
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, description}, {dispatch, queryFulfilled, getState}) => {
                const patchResult = dispatch(
                  postsApi.util.updateQueryData('fetchPost', postId, (draft) => {
                      draft.description = description
                      draft.updatedAt = (new Date()).toISOString() as ISOStringFormat
                  })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),

        updatePostLikeStatus: builder.mutation<void, { postId: number; likeStatus: LikeStatus }>({
            query: ({postId, likeStatus}) => ({
                url: `posts/${postId}/like-status`,
                method: 'PUT',
                body: {likeStatus},
            }),
            // Автоматически обновляем кэш
            invalidatesTags: (result, error, {postId}) => [
                {type: 'Posts', id: postId}
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, likeStatus}, {dispatch, queryFulfilled, getState}) => {
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('fetchPost', postId, (draft) => {
                        draft.isLiked = likeStatus === LikeStatus.LIKE
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
        }),
    }),
})
export const {
    useUploadPostsImagesMutation,
    useDeletePostsImageMutation,
    useCreatePostMutation,
    useFetchPostQuery,
    useFetchPostCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentLikeStatusMutation,
    useUpdatePostLikeStatusMutation,
    useDeletePostMutation,
    useUpdatePostMutation
} = postsApi
