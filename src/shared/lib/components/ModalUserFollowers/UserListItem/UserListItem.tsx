'use client'
import Avatar from '../../../../../entities/user/ui/Avatar/Avatar'
import s from './UserListItem.module.scss'
import Skeleton from 'react-loading-skeleton'
import { Button } from '@/shared/ui'
import {
  useFollowingUserMutation,
  useUnFollowingUserMutation,
} from '@/features/publicUserApi/publicUserApi'
import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useMeQuery } from '@/features/auth/api/authApi'
import { UserItem } from '@/features/publicUserApi/types'
import { ConfirmModal } from '@/shared/lib/components/ModalUserFollowers/ConfirmModal/ConfirmModal'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

type Props = {
  user: UserItem
  isLoading: boolean
  type: 'following' | 'followers'
}

type ModalKind = 'unfollow' | 'delete-following' | null

export const UserListItem = ({ user, isLoading, type }: Props) => {
  const { data: currentUser } = useMeQuery()
  const [followUser, { isLoading: isFollowMutLoading }] = useFollowingUserMutation()
  const [unfollowUser, { isLoading: isUnfollowMutLoading }] = useUnFollowingUserMutation()

  const messages = useAppSelector(selectCurrentMessages)

  const [isFollowing, setIsFollowing] = useState<boolean>(user.isFollowing)
  const [modalKind, setModalKind] = useState<ModalKind>(null)

  const pendingAction = useMemo<ModalKind | null>(() => {
    if (isFollowMutLoading) return 'delete-following'
    if (isUnfollowMutLoading) return 'unfollow'
    return null
  }, [isFollowMutLoading, isUnfollowMutLoading])

  const openUnfollowModal = useCallback(() => setModalKind('unfollow'), [])
  const openDeleteFollowingModal = useCallback(() => setModalKind('delete-following'), [])
  const closeModal = useCallback(() => setModalKind(null), [])

  const handleFollow = useCallback(async () => {
    await followUser({ selectedUserId: user.userId, userName: user.userName }).unwrap()
    setIsFollowing(true)
  }, [followUser, user.userId, user.userName])

  const handleUnfollowConfirmed = useCallback(async () => {
    await unfollowUser({ userId: user.userId, userName: user.userName }).unwrap()
    setIsFollowing(false)
    closeModal()
  }, [unfollowUser, user.userId, user.userName, closeModal])

  const followDisabled = Boolean(pendingAction)
  const unfollowDisabled = Boolean(pendingAction)

  return (
    <div className={s.item}>
      <div className={s.userInfoWrapper}>
        <Avatar src={user?.avatars?.[0]?.url} alt="Avatar Image" size="small" />

        <Link className={s.userName} href={`/profile/${user.userId}`} target={"_blank"} prefetch>
          <span>{user.userName}</span>
        </Link>
      </div>

      <div className={s.buttonGroup}>
        {isLoading ? (
          <Skeleton
            baseColor="rgba(23, 23, 23, 0.6)"
            highlightColor="rgba(40, 40, 40, 0.8)"
            width={250}
            height={36}
          />
        ) : (
          currentUser?.userId && ( //если мы авторизованы
            <div>
              {type === 'followers' && !isFollowing && ( //если модалка followers и юзер НЕ ПОДПИСАН на нас
                <div>
                  <Button className={s.modalButtons} variant="primary" onClick={handleFollow} disabled={followDisabled}>
                    {isFollowMutLoading ? messages.common.loading : messages.profile.follow}
                  </Button>
                  <Button className={s.modalDeleteButton} variant="text" onClick={openDeleteFollowingModal} disabled={unfollowDisabled || !isFollowing}>
                    {isUnfollowMutLoading ? messages.common.loading : messages.profile.delete}
                  </Button>
                </div>
              )}

              {type === 'followers' && isFollowing && (//если модалка followers и юзер ПОДПИСАН на нас
                <Button className={s.modalDeleteButton} variant="text" onClick={openDeleteFollowingModal} disabled={unfollowDisabled}>
                  {isUnfollowMutLoading ? messages.common.loading : messages.profile.delete}
                </Button>
              )}

              {type === 'following' && //если модалка following и юзер ПОДПИСАН на нас
                (isFollowing ? (
                  <Button className={s.modalButtons} variant="outline" onClick={openUnfollowModal} disabled={unfollowDisabled}>
                    {isUnfollowMutLoading ? messages.common.loading : messages.profile.unFollow}
                  </Button>
                ) : ( //если модалка following и юзер НЕ ПОДПИСАН на нас
                  <Button className={s.modalButtons} variant="primary" onClick={handleFollow} disabled={followDisabled}>
                    {isFollowMutLoading ? messages.common.loading : messages.profile.follow}
                  </Button>
                ))}
            </div>
          )
        )}
      </div>

      <ConfirmModal
        isOpen={modalKind !== null}
        kind={(modalKind ?? 'unfollow') as 'unfollow' | 'delete-following'}
        confirmAction={handleUnfollowConfirmed}
        closeAction={closeModal}
        user={{
          userId: user.userId,
          userName: user.userName,
          avatarUrl: user?.avatars?.[0]?.url,
        }}
      />
    </div>
  )
}