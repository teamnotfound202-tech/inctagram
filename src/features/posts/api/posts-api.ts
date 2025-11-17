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
                {dispatch, queryFulfilled}
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
                            if (imageId !== -1) {
                              draft.avatarWhoLikes.splice(imageId, 1)
                            }
                        }
                    })
                )
              const patchResultFeed = dispatch(
                publicUserApi.util.updateQueryData('getPostsByFollowers',undefined, draft => {
                  const postsItems = draft.pages.flatMap(item => item.items)
                  const post = postsItems.find(post => post.id === postId)
                  if (post) {
                    post.isLiked = !post.isLiked
                    if (post.isLiked) {
                        post.avatarWhoLikes.push(url)
                        post.likesCount += 1
                    } else {
                      const index = post.avatarWhoLikes.findLastIndex(item => item === url)

                      if (index !== -1) {
                        post.avatarWhoLikes.splice(index,1)
                        post.likesCount -= 1
                      }
                    }
                  }
                })
              )
                try {
                    await queryFulfilled
                } catch (error) {
                    patchResult.undo()
                    patchResultFeed.undo()
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
    useUpdatePostLikeStatusMutation,
    useDeletePostMutation,
    useUpdatePostMutation,
} = postsApi
