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

export type UserProfileResponse = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string
  aboutMe: string
  avatars: Avatar[]
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
}

export type UserDataResponse = {
  id: number
  userName: string
  aboutMe: string
  avatars: Avatar[]
  userMetadata: UserMetadata
  hasPaymentSubscription: boolean
}
export type UserMetadata = {
  following: number
  followers: number
  publications: number
}

export type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type UserItem = {
  id: number;
  userId: number;
  userName: string;
  createdAt: string;
  avatars: Avatar[];
  isFollowing: boolean;
  isFollowedBy: boolean;
};

export type UsersListResponse = {
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
  prevCursor: number;
  nextCursor: number;
  items: UserItem[];
};