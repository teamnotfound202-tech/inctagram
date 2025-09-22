'use client';


import { Post } from '@/features/publicUserApi/types'

type Props = {
  posts: Post[]
}

export const ProfilePosts =  ({posts}: Props) => {
  console.log('posts:', posts)
  return (
    <div>
      Hello, this is your profile page!
    </div>
  )
}
