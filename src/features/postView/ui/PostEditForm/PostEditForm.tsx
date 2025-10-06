'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/shared/ui/Button/Button'
import { TextArea } from '@/shared/ui/TextArea/TextArea'
import Avatar from '@/entities/user/ui/Avatar/Avatar'
import s from './PostEditForm.module.scss'
import { CloseIcon } from '@/shared/ui/Alerts/CloseIcon/CloseIcon'
import { useUpdatePostMutation } from '@/features/posts/api/posts-api'
import * as React from 'react'
import {
  PostText
} from '@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostText/PostText'

type Props = {

  postId: number
  initialDescription: string
  authorName: string
  avatarUrl: string
  onCancel: (hasChanges: boolean) => void
  onSave: () => void

}

export const PostEditForm = ({
                               postId,
                               initialDescription,
                               authorName,
                               avatarUrl,
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
      <div className={s.editForm}>
        <div className={s.header}>
          <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className={s.buttonClose}
        >
          <CloseIcon/>
        </Button>
        </div>
        <div className={s.content}>
          <article className={s.comment}>
            <Avatar src={avatarUrl} alt={'avatar'} size={"small"}/>
            <p>{authorName}</p>

          </article>
          <p>Add publication descriptions</p>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание поста..."
            className={s.textarea}
            rows={4}
          />
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
      </div>

    </>

  )
}