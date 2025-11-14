import {ISOStringFormat} from 'date-fns'

export type GetPublicUsers = {
    totalCount: number
}

export type ImagePost = {
    createdAt: ISOStringFormat
    fileSize: number
    height: number
    uploadId: string
    url: string
    width: number
}

export type Owner = {
    firstName: string;
    lastName: string;
}

export type Post = {
    avatarOwner: string
    avatarWhoLikes: string[]
    createdAt: ISOStringFormat
    description: string
    id: number
    images: ImagePost[]
    isLiked: boolean
    likesCount: number
    location: null    //TODO: может что-то сюда будет приходить?
    owner: Owner
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
export type CursorPage<T> = {
    totalCount: number
    pagesCount: number
    page: number
    pageSize: number
    prevCursor: number | null
    nextCursor: number | null
    items: T[]
}

//Для feature - Comments
export type From = {
    id: number;
    username: string;
    avatars: Avatar[];
}

export type Comment = {
    id: number;
    postId: number;
    from: From;
    content: string;
    createdAt: string;
    answerCount: number;
    likeCount: number;
    isLiked: boolean;
}

export type Answer = {
    id: number;
    commentId: number;
    from: From;
    content: string;
    createdAt: string;
    likeCount: number;
    isLiked: boolean;
}

export type BaseResponse<T> = {
    pageSize: number;
    totalCount: number;
    notReadCount: number;
    items: T[];
}

type Direction =  'asc' | 'desc'

type InfinityPaging = {
    pageSize?: number;
    pageNumber?: number;
    sortDirection?: Direction;
    sortBy?: string;
};

export type InfinityAnswerRequest = {
    postId: number;
    commentId: number;
} & InfinityPaging;

export type InfinityPostRequest = {
    postId: number;
} & InfinityPaging;

export enum LikeStatus {
    NONE = 'NONE',
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE'
}

export type CommentsResponse = BaseResponse<Comment>
export type InfinityAnswerResponse = BaseResponse<Answer>