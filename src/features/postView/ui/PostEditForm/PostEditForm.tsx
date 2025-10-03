'use client'

import { useState, useEffect } from 'react'
import { useUpdatePostMutation } from '@/features/postView/api/postApi'
import { Button } from '@/shared/ui/Button/Button'
import { TextArea } from '@/shared/ui/TextArea/TextArea'
import Avatar from '@/entities/user/ui/Avatar/Avatar'
import s from './PostEditForm.module.scss'
import { CloseIcon } from '@/shared/ui/Alerts/CloseIcon/CloseIcon'

type Props = {
  postId: number
  initialDescription: string
  authorName: string
  avatarUrl: string
  descriptionCreationTime: string
  onCancel: (hasChanges: boolean) => void
  onSave: () => void
}

export const PostEditForm = ({
                               postId,
                               initialDescription,
                               authorName,
                               avatarUrl,
                               descriptionCreationTime,
                               onCancel,
                               onSave
                             }: Props) => {
  const [description, setDescription] = useState(initialDescription)
  const [updatePost, { isLoading }] = useUpdatePostMutation()

  const hasChanges = description !== initialDescription

  const handleSave = async () => {
    if (!hasChanges) {
      onSave()
      return
    }

    try {
      await updatePost({ postId, description }).unwrap()
      onSave()
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error)
    }
  }

  const handleCancel = () => {
    onCancel(hasChanges)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleCancel}
        disabled={isLoading}
      >
        <CloseIcon/>
      </Button>
      <div className={s.editForm}>


        <div className={s.content}>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание поста..."
            className={s.textarea}
            rows={4}
          />
        </div>

        <div className={s.actions}>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Save Changes'}
          </Button>
        </div>
      </div>

    </>

  )
}