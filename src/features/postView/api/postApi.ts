import {baseApi} from '@/shared/api/'
import {Post} from "@/features/postView/api/types";

export const postApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        fetchPost: builder.query<Post, string>({
            query: (postId) => `posts/id/${postId}`,
        }),
    }),
})

export const { useFetchPostQuery } = postApi
