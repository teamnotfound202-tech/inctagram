import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui/Button/Button'
import { useDeletePostMutation } from '@/features/postView/api/postApi'
import s from './DeletePostModal.module.scss'

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
      router.push('/')
      onClose()
    } catch (error) {
      console.error('Ошибка при удалении поста:', error)
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal title="Удалить публикацию" onClick={onClose}>
      <div className={s.content}>
        <p className={s.message}>
          Вы уверены, что хотите удалить эту публикацию?
        </p>
        <div className={s.actions}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className={s.cancelButton}
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={handleDeletePost}
            disabled={isDeleting}
            className={s.deleteButton}
          >
            {isDeleting ? 'Удаление...' : 'Yes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}