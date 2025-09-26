import {baseApi} from '@/shared/api/'
import {CommentsResponse, Post} from "@/features/postView/api/types";

export const postApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        fetchPost: builder.query<Post, string>({
            query: (postId) => `posts/id/${postId}`,
        }),
        fetchPostComments: builder.query<CommentsResponse, number>({
            query: (postId) => `posts/${postId}/comments`,
        }),
    }),
})

export const { useFetchPostQuery, useFetchPostCommentsQuery } = postApi
