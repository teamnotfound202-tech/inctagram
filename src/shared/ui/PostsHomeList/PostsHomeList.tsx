import { Post } from '@/features/publicUserApi/types'
import s from './PostsHomeList.module.scss'
import { PostHomeItem } from '@/shared/ui/PostsHomeList/PostHomeItem/PostHomeItem'

type Props = {
  userPosts: Post[]
}

export const PostsHomeList = ({userPosts}: Props) => {
  return (
    <ul className={s.userPostsList}>
      {
        userPosts.slice(0,4).map(post => (
          <PostHomeItem key={post.id} post={post} />
        ))
      }
    </ul>
  )
}