import s from './PostContent.module.scss'
import { PostTitle } from '@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/PostTitle'
import { PostMetaInfWithControls } from '@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/PostMetaInfWithControls'
import { AddCommentForm } from '@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm'
import { PostComments } from '@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComments'
import { useState } from 'react'
import { PostEditForm } from '@/features/postView/ui/PostEditForm/PostEditForm'
import { EditCancelModal } from '@/features/postView/ui/EditCancelModal/EditCancelModal'
import { useFetchMyProfileQuery } from '@/features/publicUserApi/publicUserApi'
import { Post } from '@/features/publicUserApi/types'

type Props = {
  post: Post
  editingHandler: (value: boolean) => void
  isEditing: boolean
  deleteHandler: (value: boolean) => void
  isDeleteModalOpen: boolean
}
export const PostContent = ({
  post,
  editingHandler,
  isEditing,
  deleteHandler,
  isDeleteModalOpen,
}: Props) => {
  const { data: userMe, isLoading } = useFetchMyProfileQuery()

  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleStartEdit = () => {
    editingHandler(true)
  }

  const handleCancelEdit = (hasChanges: boolean) => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      editingHandler(false)
    }
  }

  const handleConfirmCancel = () => {
    editingHandler(false)
    setShowCancelModal(false)
  }

  const handleSaveEdit = () => {
    editingHandler(false)
  }

  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
  }
  return (
    <div className={s.postContentWrapper}>
      {!isEditing && post.id &&(
        <PostTitle
          postUserName={post.userName}
          ownerId={post.ownerId}
          firstName={post.owner.firstName}
          lastName={post.owner.lastName}
          postId={post.id}
          onEdit={handleStartEdit}
          onCancel={handleCancelEdit}
          deleteHandler={deleteHandler}
          isDeleteModalOpen={isDeleteModalOpen}
        />
      )}
      {isEditing ? post.id && (
        <PostEditForm
          postId={post.id}
          ownerId={post.ownerId}
          initialDescription={post.description}
          authorName={post.owner.firstName + ' ' + post.owner.lastName}
          avatarUrl={post.avatarOwner}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      ) : (
        <>
          <PostComments post={post} />
          <PostMetaInfWithControls
            id={post.id}
            avatars={post.avatarWhoLikes}
            likesCount={post.likesCount}
            updatedAt={post.updatedAt}
            isLiked={post.isLiked}
          />
          {!isLoading && userMe && (
            <AddCommentForm
              postId={post.id}
              user={{
                id: userMe.id,
                username: userMe.userName,
                avatars: [...userMe.avatars],
              }}
            />
          )}
        </>
      )}

      <EditCancelModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
