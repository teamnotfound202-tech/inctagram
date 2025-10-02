import {baseApi} from '@/shared/api/'
import {Comment, CommentsResponse, From, LikeStatus, Post, User} from "@/features/postView/api/types";

export const postApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        fetchPost: builder.query<Post, number>({
            query: (postId) => `posts/id/${postId}`,
            providesTags: (result, error, postId) => [
                {type: 'Post', id: postId}
            ],
        }),
        fetchMyProfile: builder.query<User, void>({        //TODO: перенести в api User или взять чужой эндпоинт для запроса
            query: () => `users/profile`,
        }),
        fetchUser: builder.query<User, number>({        //TODO: перенести в api User или взять чужой эндпоинт для запроса
            query: (profileId) => `public-user/profile/${profileId}`,
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
                    postApi.util.updateQueryData('fetchPostComments', postId, (draft) => {
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
                    postApi.util.updateQueryData('fetchPostComments', postId, (draft) => {
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
        updatePostLikeStatus: builder.mutation<void, { postId: number; likeStatus: LikeStatus }>({
            query: ({postId, likeStatus}) => ({
                url: `posts/${postId}/like-status`,
                method: 'PUT',
                body: {likeStatus},
            }),
            // Автоматически обновляем кэш
            invalidatesTags: (result, error, {postId}) => [
                {type: 'Post', id: postId}
            ],
            // Оптимистичное обновление
            onQueryStarted: async ({postId, likeStatus}, {dispatch, queryFulfilled, getState}) => {
                const patchResult = dispatch(
                    postApi.util.updateQueryData('fetchPost', postId, (draft) => {
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
    useFetchPostQuery,
    useFetchPostCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentLikeStatusMutation,
    useUpdatePostLikeStatusMutation,
    useFetchMyProfileQuery,
    useFetchUserQuery
} = postApi
