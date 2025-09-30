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

// Схема для массива изображений
export const ImagesResponseSchema = z.object({
  images: z.array(ImageSchema).max(10, 'Maximum 10 images allowed'), // если есть ограничение
})

// Типы TypeScript
export type Images = z.infer<typeof ImageSchema>
export type ImagesResponse = z.infer<typeof ImagesResponseSchema>
