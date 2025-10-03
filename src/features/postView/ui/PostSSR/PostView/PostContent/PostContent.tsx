import {Post} from "@/features/postView/api/types";
import s from "./PostContent.module.scss"
import {PostTitle} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/PostTitle";
import {
    PostMetaInfWithControls
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/PostMetaInfWithControls";
import {AddCommentForm} from "@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm";
import {PostComments} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComments";
import {useFetchMyProfileQuery} from "@/features/postView/api/postApi";
import { useState } from 'react'
import { PostEditForm } from '@/features/postView/ui/PostEditForm/PostEditForm'
import { EditCancelModal } from '@/features/postView/ui/EditCancelModal/EditCancelModal'

type Props = {
    post: Post
};
export const PostContent = ({post}: Props) => {
    const {data: userMe, isLoading} = useFetchMyProfileQuery()
  const [isEditing, setIsEditing] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = (hasChanges: boolean) => {
    if (hasChanges) {
      setShowCancelModal(true)
    } else {
      setIsEditing(false)
    }
  }

  const handleConfirmCancel = () => {
    setIsEditing(false)
    setShowCancelModal(false)
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
  }

  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
  }

    return (
        <div className={s.postContentWrapper}>
            <PostTitle ownerId={post.ownerId}
                       avatarOwner={post.avatarOwner}
                       firstName={post.owner.firstName}
                       lastName={post.owner.lastName}
                       postId={post.id}
                       onEdit={handleStartEdit}
                       />
          {isEditing ? (
              <PostEditForm
                postId={post.id}
                initialDescription={post.description}
                authorName={post.owner.firstName + ' ' + post.owner.lastName}
                avatarUrl={post.avatarOwner}
                descriptionCreationTime={post.createdAt}
                onCancel={handleCancelEdit}
                onSave={handleSaveEdit}
              />
            ) :
            (<>
              <PostComments post={post}/>
              <PostMetaInfWithControls id={post.id}
                                       avatars={post.avatarWhoLikes}
                                       likesCount={post.likesCount}
                                       updatedAt={post.updatedAt}
                                       isLiked={post.isLiked}

              />
              {!isLoading && userMe && <AddCommentForm postId={post.id} user={{
                id: userMe.id,
                username: userMe.userName,
                avatars: [...userMe.avatars]
              }}/>}
            </>)}

          <EditCancelModal
            isOpen={showCancelModal}
            onClose={handleCloseCancelModal}
            onConfirm={handleConfirmCancel}
          />
        </div>
    );
};

