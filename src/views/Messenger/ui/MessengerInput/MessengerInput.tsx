'use client'
import s from './MessengerInput.module.scss'
import MicrofoneIcon from '../../icons/MicrofoneIcon.svg'
import AddImageIcon from '../../icons/AddPictureIcon.svg'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import {
  ContentEditableInput,
  ContentEditableInputRef,
} from '@/views/Messenger/ui/MessengerInput/ConteEditableDiv/ContentEditableInput'
import { useRef, useState } from 'react'
import { useSendMessageWithOptimisticMutation } from '@/features/messengerApi/messengerApi'

export type MessageSendingType = 'message' | 'voice' | 'none'
type Props = {
  dialogPartnerId: number
  ownerId: number
}
export const MessengerInput = ({ dialogPartnerId, ownerId }: Props) => {
  const messages = useAppSelector(selectCurrentMessages)
  const [sendingType, setSendingType] = useState<MessageSendingType>('none')
  const contentEditableRef = useRef<ContentEditableInputRef>(null)
  const handleAddImage = () => {
    // Вызываем метод дочернего компонента через ref
    contentEditableRef.current?.triggerAddImage()
    setSendingType('message')
  }
  const [sendMessage, { isLoading, error }] = useSendMessageWithOptimisticMutation()

  const handleSend = async () => {
    // Получаем контент из дочернего компонента
    const content = contentEditableRef.current?.getContent()
    // Очищаем после отправки

    try {
      await sendMessage({
        message: content?.text || '',
        receiverId: dialogPartnerId,
      }).unwrap()

    } catch (error) {}
    contentEditableRef.current?.clearContent()
  }
  const setSendingTypeHandler = (type: MessageSendingType) => {
    switch (type) {
      case 'message':
        return <button onClick={handleSend}>{messages.messenger.sendMessage}</button>
        break
      case 'voice':
        return <button>{messages.messenger.noRecentRequests}</button>
        break
      case 'none':
        return (
          <div className={s.iconsBlock}>
            <MicrofoneIcon onClick={() => setSendingType('voice')} />
            <AddImageIcon onClick={handleAddImage} />
          </div>
        )
        break
      default:
        return ''
    }
  }

  return (
    <div className={s.messengerInputWrapper}>
      <div className={s.messagerInputBlock}>
        <ContentEditableInput ref={contentEditableRef} setSendingType={setSendingType} />
      </div>
      <div className={s.sendingContainer}>{setSendingTypeHandler(sendingType)}</div>
    </div>
  )
}
