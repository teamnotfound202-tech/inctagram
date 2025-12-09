'use client'
import Avatar from '../../../../entities/user/ui/Avatar/Avatar'
import s from './ListOfSpeakers.module.scss'
import { ISOStringFormat } from 'date-fns'
import { UserInfoBlock } from '@/views/Messenger/ui/UserMessageInfo/UserInfoBlock'
import clsx from 'clsx'

type Props = {
  avatarUrl: string
  userName: string
  message: string
  userId:number
  lastUpdate?: ISOStringFormat
  selectUser: (avatarUrl: string, userName: string,userId:number) => void
  activeClass:boolean
}
export const ListOfSpeakers = ({ avatarUrl, userName, message, selectUser,activeClass,userId }: Props) => {
  return (

    <div className={clsx(s.listContainer,activeClass&&s.active)} onClick={() => selectUser(avatarUrl, userName,userId)}>
      <UserInfoBlock avatarUrl={avatarUrl} userName={userName} message={message} />
      <div className={s.lastUpdateBlock}>
        <span className={s.lastUpdate}>data</span>
      </div>
    </div>
  )
}
