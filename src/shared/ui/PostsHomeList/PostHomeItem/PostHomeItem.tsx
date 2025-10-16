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

const countLetter = 82
const maxLetters = 210

export const PostHomeItem = ({post}: Props) => {

  const [text, setText] = useState('Show more')
  const postDescriptionLength =
    post && post.description && post.description.length > countLetter
      ? post.description.slice(0, countLetter) + '...'
      : post.description
  const [textDescription, setTextDescription] = useState(postDescriptionLength)

  const handleChangeHeightText = (value?: number) => {

    if (value){
        setTimeout(()=>{
            setTextDescription(post.description.slice(0, value) + '...')
        },390)

    } else {
      setTextDescription(post.description.slice(0, countLetter) + '...')
    }
  }

  return (
    <li className={s.postItem}>
      <div className={s.postImageWraper}>
        <Link href={`/profile/${post.ownerId}/post/${post.id}`} prefetch={false}>
          <LinkContent post={post} isTrim={text} />
        </Link>
      </div>

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
              if (text === 'Show more') {
                handleChangeHeightText(maxLetters)
                setText('Show less')
              } else {
                handleChangeHeightText()
                setText('Show more')
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