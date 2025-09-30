import { baseApi } from '@/shared/api'
import { CreatePostInput, ImagesResponse, PostImage } from '@/shared/lib/sсhemas/posts'

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
    deletePostsImage: builder.mutation<void,{uploadId:string}>({
      query:({uploadId})=> {
        return {
          url: `/posts/image/${uploadId}`,
          method:'DELETE'
        }
      },
    }),
    createPost: builder.mutation<PostImage, CreatePostInput>({
      query: (postData) => {
        return {
          url: `/posts`,
          method: 'POST',
          body: postData,
        }
      },
      invalidatesTags: ['Posts'],
    }),
  }),
})
export const { useUploadPostsImagesMutation,useDeletePostsImageMutation, useCreatePostMutation } = postsApi
