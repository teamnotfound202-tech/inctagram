'use client';

import s from './ProfilePosts.module.scss'
import { ResponsesPosts } from '@/features/publicUserApi/types'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { publicUserApi } from '@/features'
import {
  useGetPostsForUserInfiniteQuery,
} from '@/features/publicUserApi/publicUserApi'
import { PostsList } from '@/views/ProfilePosts/PostsList/PostsList'
import { shallowEqual } from 'react-redux'
import { useInfiniteScroll } from '@/shared/lib/hooks'

type Props = {
  postsData: ResponsesPosts | undefined,
  userId: string
}

export const ProfilePosts =  ({postsData, userId}: Props) => {
  const dataFromCache = useAppSelector((state) => {
    const endpoint = publicUserApi.endpoints.getPostsForUser;

    const selector = endpoint.select({ userId });
    const cachedData = selector(state);

    return {
      ...cachedData,
      items: cachedData?.data?.pages.flatMap(post => post.items),
    }
  }, shallowEqual);

  const dispatch = useAppDispatch()
  const needHydrateStateRef = useRef(!!postsData?.items.length && !dataFromCache?.items?.length)
  const {data, hasNextPage, isFetching, fetchNextPage, isFetchingNextPage} = useGetPostsForUserInfiniteQuery({userId}, {
    skip: needHydrateStateRef.current,
  })
  const {observerRef} = useInfiniteScroll({hasNextPage, isFetching, fetchNextPage})

  useEffect(() => {
      if (postsData && needHydrateStateRef.current) {
        needHydrateStateRef.current = false

        const infiniteData = {
          pages: [postsData],
          pageParams: [undefined],
        };
        const thunk = publicUserApi.util.upsertQueryData('getPostsForUser', {
          userId,
        }, infiniteData)
        dispatch(thunk)
      }
  }, [])

  const userPostData = data?.pages.flatMap((page) => page.items) || postsData?.items

  return (
    <div className={s.profilePostsWrapper}>
      {userPostData && userPostData.length > 0 && (
        <PostsList userPosts={userPostData}/>
      )}
      {
        userPostData && userPostData.length === 0 && (
          <p className={s.postsText}>The user has no posts</p>
        )
      }
      {hasNextPage && (
          <div ref={observerRef}>
            {isFetchingNextPage ? <div>Loading more posts...</div> : <div style={{ height: '20px' }}/>}
          </div>
        )
      }
      {!hasNextPage && <p>Nothing more to load</p>}
    </div>
  )
}
