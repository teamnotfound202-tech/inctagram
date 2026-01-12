'use client'
import { useGetPostsByFollowersInfiniteQuery } from '@/features/publicUserApi/publicUserApi'
import { useMemo } from 'react'
import { FeedPost } from '@/features/feed/ui/FeedPost/FeedPost'
import s from './FeedOfPosts.module.scss'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages} from '@/shared/api/appSlice'


export const FeedOfPosts = () => {
  const messages = useAppSelector(selectCurrentMessages)
  const {data: dataPostsByFollowers, fetchNextPage, hasNextPage, isLoading, isFetching} = useGetPostsByFollowersInfiniteQuery()
  const {observerRef} = useInfiniteScroll({
    hasNextPage,
    enabled: true,
    isFetching,
    fetchNextPage
  })

  const posts = useMemo(() => dataPostsByFollowers?.pages.flatMap(item => item.items), [dataPostsByFollowers])
  return (
    <div className={s.feedPosts}>
      {posts && posts.map(post => (
        <FeedPost key={post.id} post={post}/>
      ))}
      {(isLoading || isFetching) && <Spinner type="secondary" size={16} label={messages.common.loading} fullWidth center />}
      {!isFetching && hasNextPage && <div ref={observerRef} />}
    </div>
  )
}
