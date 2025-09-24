'use client';

import s from './ProfilePosts.module.scss'
import { ResponsesPosts } from '@/features/publicUserApi/types'
import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { publicUserApi } from '@/features'
import {
  useGetPostsForUserInfiniteQuery,
} from '@/features/publicUserApi/publicUserApi'
import { PostsList } from '@/views/ProfilePosts/PostsList/PostsList'
import { shallowEqual } from 'react-redux'

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
  const observerRef = useRef<HTMLDivElement>(null)

  const {data, hasNextPage, isFetching, fetchNextPage, isFetchingNextPage} = useGetPostsForUserInfiniteQuery({userId}, {
    skip: needHydrateStateRef.current,
  })

  const loadMoreHandler = useCallback(() => {
    if(hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  useEffect(() => {

      if (postsData && needHydrateStateRef.current) {
        needHydrateStateRef.current = false

        const infiniteData = {
          pages: [postsData],
          pageParams: [undefined]
        };
        const thunk = publicUserApi.util.upsertQueryData('getPostsForUser', {
          userId,
        }, infiniteData)
        dispatch(thunk)
      }
  }, [])


  useEffect(() => {
    // IntersectionObserver отслеживает элементы и сообщает, насколько они видны во viewport
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(
      entries => {
        // entries - наблюдаемый элемент
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        root: null, // Отслеживание относительно окна браузера (viewport). null = весь экран
        rootMargin: '100px', // Начинать загрузку до появления элемента
      }
    )

    const currentObserverRef = observerRef.current
    if (currentObserverRef) {
      // начинает наблюдение за элементом
      observer.observe(currentObserverRef)
    }

    // Функция очистки - прекращает наблюдение при размонтировании компонента
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [loadMoreHandler])

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
