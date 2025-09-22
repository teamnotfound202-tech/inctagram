import { ISOStringFormat } from 'date-fns'

export type GetPublicUsers = {
  totalCount: number
}


type ImagePost = {
  createdAt: ISOStringFormat
  fileSize: number
  height: number
  uploadId: string
  url: string
  width: number
}

export type Post = {
  avatarWhoLikes: string[]
  createdAt: ISOStringFormat
  description: string
  id: number
  images: ImagePost[]
  isLiked: boolean
  likesCount: number
  location: null
  owner: {
    firstName: string,
    lastName: string
  }
  ownerId: number
  updatedAt: ISOStringFormat
  userName: string
}


export type ResponsesPosts = {
  totalCount: number
  pageSize: number
  items: Post[]
  totalUsers: number
}
