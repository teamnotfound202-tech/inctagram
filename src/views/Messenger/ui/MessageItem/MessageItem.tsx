import { clsx } from 'clsx'
import s from './MessageItem.module.scss'
import { Avatar } from '@/entities/user/ui/Avatar'
import { IconWrapper } from '@/views/Messenger/ui/MessageItem/IconWrapper/IconWrapper'
import { Status } from '@/features/messengerApi/types'

type Props = {
  owner: boolean
  message: string
  date: string
  avatarUrl?: string
  status:Status
}
export const MessageItem = ({ owner, message, date, avatarUrl,status }: Props) => {
  return (
    <div className={clsx(s.messageItemContainer, owner ? s.alignRight : s.alignLeft)}>
      {!owner && <Avatar src={avatarUrl ?? ''} alt="Avatar Image" size="small" />}
     <div className={clsx(s.textContainer,owner ? s.ownerMessage : s.partnerMessage)}>
       <span className={s.message}>{message}</span>
       <div className={s.info}>
          <IconWrapper date={date} owner={owner} status={status}/>
       </div>
     </div>
    </div>
  )
}
