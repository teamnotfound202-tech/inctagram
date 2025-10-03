import { PostItem } from '@/views/ProfilePosts/PostItem/PostItem'
import { Post } from '@/features/publicUserApi/types'
import s from './PostsList.module.scss'

type Props = {
  userPosts: Post[]
}

export const PostsList = ({userPosts}: Props) => {
  return (
    <ul className={s.userPostsList}>
      {
        userPosts.map(post => (
          <PostItem key={post.id} post={post} />
        ))
      }
    </ul>
  )
}