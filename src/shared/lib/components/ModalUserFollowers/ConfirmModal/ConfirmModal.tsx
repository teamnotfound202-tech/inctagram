'use client'

import { Modal } from '@/shared/ui/Modal/Modal'
import Avatar from '@/entities/user/ui/Avatar/Avatar'
import Link from 'next/link'
import { Button } from '@/shared/ui'
import s from './ConfirmModal.module.scss'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

type ConfirmRelationModalProps = {
  isOpen: boolean
  kind: 'unfollow' | 'delete-following'
  confirmAction: () => void
  closeAction: () => void
  user: {
    userId: number
    userName: string
    avatarUrl?: string
  }
}

export function ConfirmModal({ isOpen, kind, confirmAction, closeAction, user}: ConfirmRelationModalProps) {
  const messages = useAppSelector(selectCurrentMessages)
  if (!isOpen) return null

  const title = kind === 'delete-following' ? messages.modals.deleteFollowing : messages.profile.unFollow
  const question =
    kind === 'delete-following'
      ? messages.modals.deleteFollowConfirm
      : messages.modals.unfollowConfirm

  return (
    <Modal title={title} onClick={closeAction}>
        <div className={s.content}>
          <Avatar src={user.avatarUrl} alt="Avatar Image" size="small" />
          <div>
            <span className={s.text}>{question}</span>
            <Link className={s.userName} href={`/profile/${user.userId}`} prefetch target={'_blank'}>
              <span>{user.userName}?</span>
            </Link>
          </div>
        </div>

        <div className={s.buttonGroup}>
          <Button className={s.buttonsModal} variant={'outline'} onClick={confirmAction}>{messages.common.yes}</Button>
          <Button className={s.buttonsModal} variant="primary" onClick={closeAction}>{messages.common.no}</Button>
        </div>
    </Modal>
  )
}
