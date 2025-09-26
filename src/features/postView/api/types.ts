export type Images = {
    url: string;
    width: number;
    height: number;
    fileSize: number;
    createdAt: string;
    uploadId: string;
}

export type Owner = {
    firstName: string;
    lastName: string;
}

export type Post = {
    id: number;
    userName: string;
    description: string;
    location: string;
    images: Images[];
    createdAt: string;
    updatedAt: string;
    ownerId: number;
    avatarOwner: string;
    owner: Owner;
    likesCount: number;
    isLiked: boolean;
    avatarWhoLikes: boolean;
}

export type Avatars = {
    createdAt: string
    fileSize: number
    height: number
    url: string
    width: number
}


export type From = {
    id: number;
    username: string;
    avatars: Avatars[];
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

export type CommentsResponse = {
    pageSize: number;
    totalCount: number;
    notReadCount: number;
    items: Comment[];
}