'use client'

import s from './PostHomeItem.module.scss'
import {Post} from '@/features/publicUserApi/types'
import 'swiper/css';
import {useState} from 'react'
import Link from 'next/link'
import {LinkContent} from "@/views/ProfilePosts/PostItem/LinkContent/LinkContent";
import Avatar from '../../../../entities/user/ui/Avatar/Avatar'
import { getTimeDifference } from '@/shared/lib/utils/getTimeDifference'
import { Button } from '@/shared/ui'

type Props = {
  post: Post
}

const countLetter = 40
const maxLetters = 150

export const PostHomeItem = ({post}: Props) => {
  // const [path, setPath] = useState('');
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [text, setText] = useState('Show more')
  const postDescriptionLength =
    post && post.description &&
    post.description.length > countLetter ?
      post.description.slice(0, maxLetters) + '...' :
      post.description
  const [textDescription, setTextDescription] = useState(postDescriptionLength)
  // TODO нужен ли этот useEffect?
  // useEffect(() => {
  //   const currentSearchParams = new URLSearchParams(searchParams.toString());
  //   currentSearchParams.set('postId', post.id.toString());
  //   setPath(`${pathname}?${currentSearchParams.toString()}`);
  // }, [pathname, searchParams, post.id]);

  const handleChangeHeightText = (value?: number) => {
    if (value){
      setTextDescription(post.description.slice(0, value) + '...')
    } else {
      setTextDescription(post.description.slice(0, maxLetters) + '...')
    }
  }

  return (
    <li className={s.postItem}>
      <Link href={`/profile/${post.ownerId}/post/${post.id}`} prefetch={false}>
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
        {textDescription}
        {textDescription.length > countLetter && (
          <Button
            variant={'text'}
            className={s.showMoreButton}
            onClick={() => {
              if (text === 'Show less') {
                handleChangeHeightText(countLetter)
                setText('Show more')
              } else {
                handleChangeHeightText()
                setText('Show less')
              }
            }}
          >
            {text}
          </Button>
        )}
      </p>
    </li>
  )
}