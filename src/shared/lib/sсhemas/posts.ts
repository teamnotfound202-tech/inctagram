import { z } from 'zod'

// Схема для отдельного изображения
export const ImageSchema = z.object({
  url: z.url('Invalid URL format'),
  width: z.number().int().positive('Width must be a positive integer'),
  height: z.number().int().positive('Height must be a positive integer'),
  fileSize: z.number().int().positive('File size must be a positive integer'),
  createdAt: z.iso.datetime('Invalid ISO date format'),
  uploadId: z.string().min(1, 'Upload ID cannot be empty'),
})

// Схема для объекта владельца
const OwnerSchema = z.object({
  firstName: z.string(),
  lastName: z.string()
});

// схема для поста при паблише
export const PostImageSchema = z.object({
  id: z.number().int().positive(),
  userName: z.string(),
  description: z.string(),
  location: z.string(),
  images: z.array(ImageSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  ownerId: z.number().int().positive(),
  avatarOwner: z.url(),
  owner: OwnerSchema,
  likesCount: z.number().int().nonnegative(),
  isLiked: z.boolean(),
  avatarWhoLikes: z.boolean()
})

// Схема для массива изображений
export const ImagesResponseSchema = z.object({
  images: z.array(ImageSchema).max(10, 'Maximum 10 images allowed'), // если есть ограничение
})

export const CreatePostSchema = z.object({
  description: z.string().min(1, 'Description cannot be empty'),
  location: z.string().min(1, 'Location cannot be empty'),
  childrenMetadata: z.array(z.object({
    uploadId: z.string().min(1, 'Upload ID cannot be empty'),
  })).min(1, 'At least one image is required'),
})

// Типы TypeScript
export type Images = z.infer<typeof ImageSchema>
export type ImagesResponse = z.infer<typeof ImagesResponseSchema>
export type PostImage = z.infer<typeof PostImageSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;