import Link from 'next/link'
import { clsx } from 'clsx'
import s from '@/features/messenger/ui/MessengerWindow/MessengerUsers/MessengerUsers.module.scss'
import { Avatar } from '@/entities/user/ui/Avatar'
import { formatCreatedAt } from '@/shared/lib/utils/formatCreatAt'
import { useMeQuery } from '@/features/auth/api/authApi'
import { GetMessengerUser } from '@/features/messenger/api/type'
import { isUserFromSearch, isUserMessage } from '@/shared/lib/utils/isUser'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectLanguage } from '@/shared/api/appSlice'
import { UserFromSearch } from '@/features/publicUserApi/types'

type Props = {
  user: UserFromSearch | GetMessengerUser
  type: 'messages' | 'user'
}

export const MessengerUserItem = ({user, type}: Props) => {
  const { data: meData } = useMeQuery()
  const lang = useAppSelector(selectLanguage)
  if (type === 'messages' && isUserMessage(user)) {
    return (
      <li>
        <Link
          href={`/messenger/${meData?.userId === user.ownerId ? user.receiverId : user.ownerId}`}
          className={clsx(s.usersWindowItem, {
            [s.messageNotRead]: user.status !== 'READ',
          })}
        >
          <Avatar src={user.avatars[1]?.url} alt={user.userName} />
          <div className={s.usersWindowItemContent}>
            <div className={s.usersWindowItemTop}>
              <span className={s.usersWindowItemName}>{user.userName}</span>
              <span className={s.usersWindowItemDate}>
                {formatCreatedAt(user.createdAt, { locale: lang })}
              </span>
            </div>
            <div className={s.usersWindowItemText}>
              {user.messageText.length > 15
                ? user.messageText.slice(0, 15) + '...'
                : user.messageText}
            </div>
          </div>
        </Link>
      </li>)
  }

  if (type === 'user' && isUserFromSearch(user)) {
    console.log(isUserFromSearch(user))
    return (
      <li key={user.id}>
        <Link href={`/messenger/${user.id}`} className={s.usersWindowItem}>
          <Avatar src={user.avatars[1]?.url} alt={user.userName} />
          <div className={s.usersWindowItemContent}>
            <div className={s.usersWindowItemTop}>
              <span className={s.usersWindowItemName}>{user.userName}</span>
              <span className={s.usersWindowItemDate}>
                {formatCreatedAt(user.createdAt, { locale: lang })}
              </span>
            </div>
          </div>
        </Link>
      </li>
    )
  }
  return null
}