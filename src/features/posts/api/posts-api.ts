import { baseApi } from '@/shared/api'
import { CreatePostInput, ImagesResponse, PostImage } from '@/shared/lib/sсhemas/posts'

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
    deletePostsImage: builder.mutation<void,{uploadId:string}>({
      query:({uploadId})=> {
        return {
          url: `/posts/image/${uploadId}`,
          method:'DELETE'
        }
      },
    }),
    createPost: builder.mutation<PostImage, CreatePostWithUserId>({
      query: ({ userId, ...postData }) => {
        return {
          url: `/posts`,
          method: 'POST',
          body: postData,
        }
      },
      invalidatesTags: (result, error, arg) => {
        const tags = [
          'Posts',
          { type: 'UserPosts', id: 'LIST' }, // Инвалидируем все списки постов пользователей
          'UserProfile', // Обновляем счетчик публикаций в профиле
        ]
        
        // Если есть userId, инвалидируем конкретный список постов пользователя
        if (arg.userId) {
          tags.push({ type: 'UserPosts', id: arg.userId.toString() })
        }
        
        return tags
      },
    }),
  }),
})
export const { useUploadPostsImagesMutation,useDeletePostsImageMutation, useCreatePostMutation } = postsApi
