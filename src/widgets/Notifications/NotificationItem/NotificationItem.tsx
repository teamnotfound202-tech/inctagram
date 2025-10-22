import { NotificationType } from '@/shared/api/types'
import { getTimeDifference } from '@/shared/lib/utils/getTimeDifference'
import s from './NotificationItem.module.scss'

type Props = {
  notification: NotificationType
};
export const NotificationItem = ({notification}: Props) => {

  return (
    <div className={s.Notification}>
      <h4 className={s.notificationTitle}>
        New notification
        {!notification.isRead && <span className={s.notificationIsRead}>Новое</span>}
      </h4>
      <span className={s.notificationMessage}>{notification.message}</span>
      <span className={s.notificationDate}>{getTimeDifference(notification.createdAt)}</span>
    </div>
  )
}