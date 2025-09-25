import { baseApi } from '@/shared/api'
import { ImagesResponse, ImagesResponseSchema } from '@/shared/lib/sсhemas/posts'

export const postsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    uploadPostsImages: builder.mutation<ImagesResponse,File[]>({
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

    }),
  }),
})
export const { useUploadPostsImagesMutation } = postsApi
