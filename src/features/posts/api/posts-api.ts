import { baseApi } from '@/shared/api'
import { CreatePostInput, ImagesResponse, PostImage } from '@/shared/lib/sсhemas/posts'
import { Comment, CommentsResponse, From, LikeStatus, Post } from '@/features/publicUserApi/types'

type CreatePostWithUserId = CreatePostInput & { userId?: number }

export const postsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    uploadPostsImages: builder.mutation<ImagesResponse, File[]>({
      query: (images: File[]) => {
        const formData = new FormData()
        images.forEach(file => formData.append('file', file))
        return {
          url: 'proxy/posts/image',             // [CHANGED]
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Posts'],
    }),

    deletePostsImage: builder.mutation<void, { uploadId: string }>({
      query: ({ uploadId }) => ({
        url: `proxy/posts/image/${uploadId}`,  // [CHANGED]
        method: 'DELETE',
      }),
    }),

    createPost: builder.mutation<PostImage, CreatePostWithUserId>({
      query: ({ userId, ...postData }) => ({
        url: 'proxy/posts',                    // [CHANGED]
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: (_result, _error, arg) => {
        const tags = [
          { type: 'Posts' as const },
          { type: 'UserPosts' as const, id: 'LIST' },
          { type: 'UserProfile' as const },
        ]
        if (arg.userId) tags.push({ type: 'UserPosts' as const, id: arg.userId.toString() })
        return tags
      },
    }),

    fetchPost: builder.query<Post, number>({
      query: (postId) => `proxy/posts/id/${postId}`,     // [CHANGED]
      providesTags: (_result, _error, postId) => [{ type: 'Posts', id: postId }],
    }),

    fetchPostComments: builder.query<CommentsResponse, number>({
      query: (postId) => `proxy/posts/${postId}/comments`, // [CHANGED]
      providesTags: (_result, _error, postId) => [{ type: 'Comment', id: postId }],
    }),

    createComment: builder.mutation<CommentsResponse, { postId: number; user: From; content: string }>({
      query: ({ postId, content }) => ({
        url: `proxy/posts/${postId}/comments`, // [CHANGED]
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { postId }) => [{ type: 'Comment', id: postId }],
      onQueryStarted: async ({ postId, user, content }, { dispatch, queryFulfilled }) => {
        const currentUser = user
        const patchResult = dispatch(
          postsApi.util.updateQueryData('fetchPostComments', postId, draft => {
            const optimisticComment: Comment = {
              id: Date.now(),
              postId,
              content,
              from: currentUser
                ? { id: currentUser.id, username: currentUser.username, avatars: currentUser.avatars || [] }
                : { id: 3218, username: 'Anonymous', avatars: [] },
              createdAt: new Date().toISOString(),
              answerCount: 0,
              likeCount: 0,
              isLiked: false,
            }
            draft.items.unshift(optimisticComment)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    updateCommentLikeStatus: builder.mutation<void, { postId: number; commentId: number; likeStatus: LikeStatus }>({
      query: ({ postId, commentId, likeStatus }) => ({
        url: `proxy/posts/${postId}/comments/${commentId}/like-status`, // [CHANGED]
        method: 'PUT',
        body: { likeStatus },
      }),
      invalidatesTags: (_result, _error, { postId }) => [{ type: 'Comment', id: postId }],
      onQueryStarted: async ({ postId, commentId, likeStatus }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('fetchPostComments', postId, draft => {
            const isLiked = likeStatus === LikeStatus.LIKE
            draft.items = draft.items.map(c => (c.id === commentId ? { ...c, isLiked } : c))
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    updatePostLikeStatus: builder.mutation<void, { postId: number; likeStatus: LikeStatus }>({
      query: ({ postId, likeStatus }) => ({
        url: `proxy/posts/${postId}/like-status`, // [CHANGED]
        method: 'PUT',
        body: { likeStatus },
      }),
      invalidatesTags: (_result, _error, { postId }) => [{ type: 'Posts', id: postId }],
      onQueryStarted: async ({ postId, likeStatus }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('fetchPost', postId, draft => {
            draft.isLiked = likeStatus === LikeStatus.LIKE
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
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
} = postsApi