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