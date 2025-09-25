'use client';

import s from './ProfilePosts.module.scss'
import { ResponsesPosts } from '@/features/publicUserApi/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { publicUserApi } from '@/features'
import { useGetPostsForUserQuery } from '@/features/publicUserApi/publicUserApi'
import { PostsList } from '@/views/ProfilePosts/PostsList/PostsList'

type Props = {
  postsData: ResponsesPosts,
  userId: string
}

export const ProfilePosts =  ({postsData, userId}: Props) => {
  const dataFromCache = useAppSelector((state) =>
  publicUserApi.endpoints.getPostsForUser
    .select({userId, endCursorPostId: ''})(state).data
  )

  const [endCursorPostId, setEndCursorPostId] = useState('')
  const dispatch = useAppDispatch()
  const needHydrateStateRef = useRef(!!postsData.items.length && !dataFromCache?.items.length)
  const observerRef = useRef<HTMLDivElement>(null)
  const {data} = useGetPostsForUserQuery({userId, endCursorPostId: endCursorPostId.toString()}, {
    skip: needHydrateStateRef.current
  })

  const handleLoadMorePosts = useCallback(() => {
    if (dataFromCache && dataFromCache.items.length < dataFromCache.totalCount){
      setEndCursorPostId((dataFromCache?.items[dataFromCache?.items.length - 1].id).toString())
    }
  }, [dataFromCache])

  useEffect(() => {
      if (needHydrateStateRef.current) {
        needHydrateStateRef.current = false
        const thunk = publicUserApi.util.upsertQueryData('getPostsForUser', {
          userId,
          endCursorPostId: '',
        }, {
          totalCount: postsData.totalCount,
          pageSize: postsData.pageSize,
          items: postsData.items,
          totalUsers: postsData.totalUsers,
        })
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
          handleLoadMorePosts()
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
  }, [handleLoadMorePosts])

  const userPosts = data?.items || postsData.items

  return (
    <div className={s.profilePostsWrapper}>
      <div style={{ height: '252px' }}></div>
      {userPosts.length > 0 ? (
        <PostsList userPosts={userPosts}/>
      ) : (
        <p className={s.postsText}>The user has no posts</p>
      )}
      {dataFromCache && dataFromCache.items.length < dataFromCache.totalCount ?
        <div ref={observerRef}>Loading more posts...</div> : <div style={{ height: '20px' }}/>
      }
      {dataFromCache && dataFromCache.items.length === dataFromCache.totalCount && <p>Nothing more to load</p>}
    </div>
  )
}
