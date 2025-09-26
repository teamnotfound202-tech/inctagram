'use client'

import { Modal } from '@/shared/ui/Modal/Modal'
import Avatar from '@/entities/user/ui/Avatar/Avatar'
import Link from 'next/link'
import { Button } from '@/shared/ui'
import s from './ConfirmModal.module.scss'

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
  if (!isOpen) return null

  const title = kind === 'delete-following' ? 'Delete Following' : 'Unfollow'
  const question =
    kind === 'delete-following'
      ? 'Do you really want to delete a Following '
      : 'Do you really want to Unfollow from this user '

  return (
    <Modal title={title} onClick={closeAction}>
        <div className={s.content}>
          <Avatar src={user.avatarUrl} alt="Avatar Image" size="small" />
          <div>
            <span className={s.text}>{question}</span>
            <Link className={s.userName} href={`/profile/${user.userId}`} prefetch>
              <span>{user.userName}?</span>
            </Link>
          </div>
        </div>

        <div className={s.buttonGroup}>
          <Button className={s.buttonsModal} variant={'outline'} onClick={confirmAction}> Yes </Button>
          <Button className={s.buttonsModal} variant="primary" onClick={closeAction}> No </Button>
        </div>
    </Modal>
  )
}
