import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui/Button/Button'

import s from './DeletePostModal.module.scss'
import { useDeletePostMutation } from '@/features/posts/api/posts-api'

type Props = {
  postId: number
  isOpen: boolean
  onClose: () => void
}

export const DeletePostModal = ({ postId, isOpen, onClose }: Props) => {
  const router = useRouter()
  const [deletePost] = useDeletePostMutation()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true)
      await deletePost({postId}).unwrap()

      // Перенаправляем пользователя на домашнюю страницу
      router.push('/profile')
      onClose()
    } catch (error) {
      console.error('Ошибка при удалении поста:', error)
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal title="Delete Post" onClick={onClose}>
      <div className={s.content}>
        <p className={s.message}>
          Are you sure you want to delete this post?
        </p>
        <div className={s.actions}>
          <Button
            variant="outline"
            onClick={handleDeletePost}
            disabled={isDeleting}
            className={s.deleteButton}
          >
            {isDeleting ? 'Удаление...' : 'Yes'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className={s.cancelButton}
          >
            No
          </Button>

        </div>
      </div>
    </Modal>
  )
}