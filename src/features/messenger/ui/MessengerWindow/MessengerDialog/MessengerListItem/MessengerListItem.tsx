import { clsx } from 'clsx'
import s from './MessengerListItem.module.scss'
import { Avatar } from '@/entities/user/ui/Avatar'
import StatusReadIcon from './icons/statusRead.svg'
import StatusNoReadIcon from './icons/statusNoRead.svg'
import DeleteIcon from './icons/deleteIcon.svg'
import * as React from 'react'
import { useFetchMyProfileQuery } from '@/features/publicUserApi/publicUserApi'
import { MessageItemType } from '@/features/messenger/api/type'
import { User } from '@/features/postView/api/types'
import { useDeleteMessageMutation } from '@/features/messenger/api/messenger-api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentDialogId, selectLanguage } from '@/shared/api/appSlice'
import { EditableSpan } from '@/shared/ui/EditableSpan/EditableSpan'
import { emitWithAuth } from '@/shared/lib/socket/getSocket'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'
import { formatCreatedAt } from '@/shared/lib/utils/formatCreatAt'



type Props = {
  message: MessageItemType
  user: User
  isLoading: boolean
}

export const MessengerListItem = ({ message, user, isLoading }: Props) => {
  const { data: myUserData} = useFetchMyProfileQuery()
  const lang = useAppSelector(selectLanguage)
  const [deleteMessage, { isLoading: deleteMessageLoading }] = useDeleteMessageMutation()
  const [loading, setIsLoading] = useState(false)
  const dialogId = useAppSelector(selectCurrentDialogId)

  const handleDeleteMessage = () => {
    setIsLoading(true)
    if (dialogId) {
      deleteMessage({messageId: message.id, dialogId})
        .unwrap()
        .catch(() => {
          toast.custom(() => (
            <AlertToast
              variant="error"
              title={'Ошибка удаления'}
              description={'Произошла ошибка. Сообщение не удалено'}
            />
          ))
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const handelChangeMessage = async (title: string) => {
    await emitWithAuth(SOCKET_EVENTS.UPDATE_MESSAGE, { id: message.id, message: title })
  }

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  return (
    <li
      className={clsx(s.dialogItem, {
        [s.dialogItemMyProfile]: myUserData?.id === message.ownerId,
      })}
    >
      <Avatar
        src={myUserData?.id === message.ownerId ? myUserData.avatars[0]?.url : user.avatars[0]?.url}
        alt={myUserData?.id === message.ownerId ? myUserData.userName : user.userName}
      />
      <div className={s.dialogContent}>
        <div className={s.dialogTop}>
          <p className={s.dialogText}>
            <EditableSpan value={message.messageText} onChange={handelChangeMessage} />
          </p>
          {message.ownerId === myUserData?.id && (
            <button
              className={s.dialogBtnDelete}
              onClick={handleDeleteMessage}
              disabled={deleteMessageLoading || loading}
            >
              <DeleteIcon className={s.deleteIcon} />
            </button>
          )}
        </div>
        <div className={s.dateWrapper}>
          <p className={s.date}>
            {formatCreatedAt(message.createdAt, { locale: lang })}
          </p>
          {message.ownerId === myUserData?.id && message.status === 'READ' && <StatusReadIcon />}
          {message.ownerId === myUserData?.id && message.status !== 'READ' && <StatusNoReadIcon />}
        </div>
      </div>
    </li>
  )
}