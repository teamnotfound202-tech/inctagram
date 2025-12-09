import s from './UserInfoBlock.module.scss'
import Avatar from '../../../../entities/user/ui/Avatar/Avatar'

type Props = {
  avatarUrl: string
  userName: string
  message?: string
}
export const UserInfoBlock = ({ avatarUrl, userName, message }: Props) => {
  return (
    <div className={s.userBlock}>

      <Avatar src={avatarUrl ?? ''} alt="Avatar Image" size="small" />
      <div className={s.userInfoBlock}>
        <span className={s.userName}>{userName}</span>
        {message && <span className={s.userMessage}>{message}</span>}
      </div>
    </div>
  )
}
