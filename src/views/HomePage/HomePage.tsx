import { TotalRegisteredUsers } from '@/shared/ui/TotalRegisteredUsers/TotalRegisteredUsers'
import s from './HomePage.module.scss'
import { PostsHomeList } from '@/shared/ui/PostsHomeList/PostsHomeList'


export const HomePage = async () => {
  const [postsData, totalCountData] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/posts/all`).then(res => res.json()),
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/public-user`).then(res => res.json()),
  ])

  return (
      <div className={s.homePageContent}>
        <TotalRegisteredUsers totalCount={totalCountData.totalCount} />
        <PostsHomeList userPosts={postsData.items} />
      </div>
  )
}
