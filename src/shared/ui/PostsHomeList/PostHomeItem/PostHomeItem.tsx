'use client'

import s from './PostHomeItem.module.scss'
import {Post} from '@/features/publicUserApi/types'
import 'swiper/css';
import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {LinkContent} from "@/views/ProfilePosts/PostItem/LinkContent/LinkContent";
import Avatar from '../../../../entities/user/ui/Avatar/Avatar'
import { getTimeDifference } from '@/shared/lib/utils/getTimeDifference'
import { Button } from '@/shared/ui'

type Props = {
  post: Post
}

export const PostHomeItem = ({post}: Props) => {
  const [path, setPath] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('postId', post.id.toString());
    setPath(`${pathname}?${currentSearchParams.toString()}`);
    console.log(currentSearchParams)
  }, [pathname, searchParams, post.id]);

  return (
    <li className={s.postItem}>
      <Link href={path} prefetch={false}>
        {/* Передаем управление дочернему компоненту */}
        <LinkContent post={post} />
      </Link>

      <div className={s.userInfo}>
        <Avatar src={post.avatarOwner} alt="Avatar Image" size="small" />
        <Link className={s.userName} href={`/profile/${post.ownerId}`} prefetch={true}>
          <span className={s.userName}>{post.userName}</span>
        </Link>
      </div>

      <span className={s.time}>{getTimeDifference(post.createdAt)}</span>

      <p className={s.description}>
        {post.description}
        <Button variant={'text'} className={s.showMoreButton}>
         Show more
        </Button>
      </p>
    </li>
  );
}