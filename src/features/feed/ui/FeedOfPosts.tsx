'use client'

import Avatar from "@/entities/user/ui/Avatar/Avatar"
import { LinkContent } from '@/views/ProfilePosts/PostItem/LinkContent/LinkContent'
import { useFetchPostQuery } from '@/features/posts/api/posts-api'
import Like from './icons/like.svg'
import Message from './icons/message.svg'
import Air from './icons/air.svg'
import Threedot from './icons/threedot.svg'

export const FeedOfPosts = () => {

  const {data: postFromCache} = useFetchPostQuery(516)

  return (
    <div>
      <div style={{padding: '20px 0'}}>
        <Avatar src={""} alt={'avatar'} size={'small'}/>
        <span>userName</span>
        <span>* 22 minutes ago</span>
        <button>***</button>
      </div>

      <div style={{width:491,height:504}}>
        {postFromCache && <LinkContent post={postFromCache}/>}
      </div>

      <div>
        <Like/>
        <Message/>
        <Air/>
        <Threedot/>
      </div>

      <div>аватар+юзернэйм + комент</div>

      <div>аватар плюс счетчик лайков</div>

      <div>кнопка со всеми коментариями с переходом на модалку</div>

      <div>добавление комента с кнопкой паблиш</div>
    </div>
  )
}
