import { baseApi } from '@/shared/api'
import { ImagesResponseSchema } from '@/shared/lib/sсhemas/posts'

export const postsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadPostsImages: builder.mutation({
      query: (images: File[]) => {
        const formData = new FormData()
        images.forEach(file => {
          formData.append(`files`, file)
        })

        debugger
        return {
          url: `/posts/image`,
          method: 'POST',
          body: formData,
        }
      },
      transformResponse: ImagesResponseSchema.parse,
    }),
  }),
})
export const { useUploadPostsImagesMutation } = postsApi
