import * as React from 'react'
import { DropdownMenu } from 'radix-ui'
import Bucket from '../../../Icons/Bucket.svg'
import Copy from '../../../Icons/copy.svg'
import Edit from '../../../Icons/edit-2-outline.svg'
import Unfollow from '../../../Icons/person-remove-outline.svg'
import Follow from '../../../Icons/person-plus-outline.svg'
import s from './DropdownPostActionsMenu.module.scss'
import DotsHorizontalIcon from '@/features/postView/ui/PostSSR/PostView/Icons/DotsHorizontal.svg'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { DeletePostModal } from '@/features/postView/ui/DeletePostModal/DeletePostModal'
import {
  useFollowersUserQuery,
  useFollowingsUserQuery,
  useFollowingUserMutation,
  useGetUserFollowingAndFollowersQuery,
  useUnFollowingUserMutation,
} from '@/features/publicUserApi/publicUserApi'
import { useMeQuery } from '@/features/auth/api/authApi'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { postsApi } from '@/features'

type Props = {
  isPostOwner: boolean
  postId: number
  onEdit?: () => void
  onCancel?: (hasChanges: boolean) => void
  deleteHandler: (value: boolean) => void
  isDeleteModalOpen: boolean
  ownerName: string
  userName: string
  ownerId: number
}

const DropdownPostActionsMenu = ({
  isPostOwner,
  postId,
  onEdit,
  onCancel,
  deleteHandler,
  isDeleteModalOpen,
  ownerName,
                                   userName, ownerId
}: Props) => {
  const currentLanguage = useAppSelector(selectCurrentMessages)
  const dispatch = useAppDispatch()

  const {
    data: profileData,
    isLoading,
    isFetching,
  } = useGetUserFollowingAndFollowersQuery({ userName: ownerName})

  const [isLoadingPopUp, setIsLoadingPopUp] = useState(false)

  const [followUser, { isLoading: isFollowMutLoading }] = useFollowingUserMutation()
  const [unfollowUser, { isLoading: isUnfollowMutLoading }] = useUnFollowingUserMutation()

  const editHandler = () => {
    if (onEdit) {
      onEdit()
    }
  }
  const deletenHandler = () => {
    deleteHandler(true)
  }
  const unfollowHandler = () => {
    if (userName && ownerId) {
      setIsLoadingPopUp(true)
      unfollowUser({userName, userId: ownerId})
        .unwrap()
        .then(()=>{
          dispatch(postsApi.util.invalidateTags(['UserProfile']))
        })
        .catch(() => {
          toast.custom((err) => (
            <AlertToast variant="error" title="Error unfollowing for user" description={err.toString()} />
          ))
        })
        .finally(() => {
          setIsLoadingPopUp(false)
        })
    }
  }
  const followHandler = () => {
    if (userName && ownerId){
      setIsLoadingPopUp(true)
      followUser({ userName, selectedUserId: ownerId })
        .unwrap()
        .then(()=>{
          dispatch(postsApi.util.invalidateTags(['UserProfile']))
        })
        .catch(() => {
          toast.custom(err => (
            <AlertToast
              variant="error"
              title="Error following for user"
              description={err.toString()}
            />
          ))
        })
        .finally(() => {
          setIsLoadingPopUp(false)
        })
    }
  }
  const copyLinkHandler = () => {}

  const handleCloseDeleteModal = () => {
    deleteHandler(false)
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className={s.IconButton} aria-label="Customise options">
            <DotsHorizontalIcon />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={s.Content} align={'end'} alignOffset={0}>
            {isPostOwner && (
              <>
                <DropdownMenu.Item className={s.Item} onClick={editHandler}>
                  <div>
                    <Edit />
                  </div>
                  {currentLanguage.posts.dropdownMenu.editPost}
                </DropdownMenu.Item>
                <DropdownMenu.Item className={s.Item} onClick={deletenHandler}>
                  <div>
                    <Bucket />
                  </div>
                  {currentLanguage.posts.dropdownMenu.deletePost}
                </DropdownMenu.Item>
              </>
            )}

            {!isPostOwner && (
              <>
                {profileData && profileData.isFollowing ?
                  (<DropdownMenu.Item className={s.Item} onClick={unfollowHandler}>
                    <div>
                      <Unfollow />
                    </div>
                    {currentLanguage.posts.dropdownMenu.unfollow}
                  </DropdownMenu.Item>)
                  : (<DropdownMenu.Item className={s.Item} onClick={followHandler}>
                    <div>
                      <Follow />
                    </div>
                    {currentLanguage.posts.dropdownMenu.follow}
                  </DropdownMenu.Item>)
                }
                <DropdownMenu.Item className={s.Item} onClick={copyLinkHandler}>
                  <div>
                    <Copy />
                  </div>
                  {currentLanguage.posts.dropdownMenu.copyLink}{' '}
                  {/*TODO: fix-при перезагрузке страницы язык сбрасывается, нужно сохранять его в localStorage*/}
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <DeletePostModal
        postId={postId}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
      />
    </>
  )
}

export default DropdownPostActionsMenu
