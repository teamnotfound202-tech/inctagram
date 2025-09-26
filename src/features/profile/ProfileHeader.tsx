'use client'
import Avatar from '../../entities/user/ui/Avatar/Avatar'
import s from './ProfileHeader.module.scss'
import { useMeQuery } from '@/features/auth/api/authApi'
import Skeleton from 'react-loading-skeleton'
import { Button } from '@/shared/ui'
import {
  useFollowingUserMutation,
  useGetUserFollowingAndFollowersQuery,
  useUnFollowingUserMutation,
} from '@/features/publicUserApi/publicUserApi'
import { UserDataResponse } from '@/features/publicUserApi/types'
import Paid from './icons/Paid.svg'
import { useState } from 'react'
import { ModalUserFollowers } from '@/shared/lib/components/ModalUserFollowers/ModalUserFollowers'

type Props = {
  user: UserDataResponse
}

export const ProfileHeader = ({ user }: Props) => {
  const { data: currentUser } = useMeQuery()
  const { data: userProfile, isLoading, isFetching} = useGetUserFollowingAndFollowersQuery({ userName: user.userName})

  const [followingUser, { isLoading: isFollowingLoading }] = useFollowingUserMutation()
  const [unFollowingUser, { isLoading: isUnfollowingLoading }] = useUnFollowingUserMutation()

  const [isModalOpen, setModalOpen] = useState(false)
  const [typeModal, setTypeModal] = useState<'following'| 'followers'>('following')

  const isOwnProfile = currentUser?.userId === user?.id
  const isLoadingButtons = isFollowingLoading || isUnfollowingLoading || isFetching



  const followHandler = () => {
    followingUser({ selectedUserId: user.id })
  }
  const unFollowHandler = () => {
    unFollowingUser({ userId: user.id })
  }


  const showFollowingHandler = () =>{
        setModalOpen(true)
        setTypeModal('following')
  }
  const showFollowersHandler = () =>{
        setModalOpen(true)
        setTypeModal('followers')
  }
  const handleModelClose = () => setModalOpen(false)

  return (
    <div>
      <div className={s.contentContainer}>
        <Avatar src={user?.avatars?.[0]?.url} alt={'Avatar Image'} size={'large'} />
        <div className={s.content}>
          <div className={s.userInfo}>
            <div className={s.userName}>
              <h1>{user?.userName}</h1>
              {user.hasPaymentSubscription && <Paid />}
            </div>

            <div className={s.buttonGroup}>
              {isLoading && (
                <Skeleton
                  baseColor="rgba(23, 23, 23, 0.6)"
                  highlightColor="rgba(40, 40, 40, 0.8)"
                  width={272}
                  height={36}
                />
              )}

              {!isLoading &&
                currentUser?.userId &&
                (isOwnProfile ? (
                  <Button variant={'secondary'}>Profile Settings</Button>
                ) : (
                  <div className={s.foreignProfileButtons}>
                    {userProfile?.isFollowing ? (
                      <Button
                        variant={'outline'}
                        onClick={unFollowHandler}
                        disabled={isLoadingButtons}
                      >
                        {isUnfollowingLoading || isFetching ? 'Loading...' : 'Unfollow'}
                      </Button>
                    ) : (
                      <Button
                        variant={'primary'}
                        onClick={followHandler}
                        disabled={isLoadingButtons}
                      >
                        {isFollowingLoading || isFetching ? 'Loading...' : 'Follow'}
                      </Button>
                    )}
                    <Button variant={'secondary'}>Send Message</Button>
                  </div>
                ))}
            </div>
          </div>

          <div className={s.userStats}>
            <button className={s.statsButton} onClick={showFollowingHandler} disabled={!currentUser?.userId}>
              {isLoading ?
                <Skeleton baseColor="rgba(23, 23, 23, 0.6)" highlightColor="rgba(40, 40, 40, 0.8)" width={48} height={20} />
                : <span className={s.statsCount}>{userProfile?.followingCount}</span>}
              <span className={s.statsDescription}>Following</span>
            </button>

            <button className={s.statsButton} onClick={showFollowersHandler} disabled={!currentUser?.userId}>
              {isLoading ?
                <Skeleton baseColor="rgba(23, 23, 23, 0.6)" highlightColor="rgba(40, 40, 40, 0.8)" width={48} height={20} />
                : <span className={s.statsCount}>{userProfile?.followersCount}</span>}
              <span className={s.statsDescription}>Followers</span>
            </button>

            <button className={s.statsButton} disabled={!currentUser?.userId}>
              {isLoading ?
                <Skeleton baseColor="rgba(23, 23, 23, 0.6)" highlightColor="rgba(40, 40, 40, 0.8)" width={48} height={20} />
                : <span className={s.statsCount}>{userProfile?.publicationsCount}</span>}
              <span className={s.statsDescription}>Publications</span>
            </button>
          </div>

          <div className={s.userAbout}>
            <p>{user.aboutMe}</p>
          </div>
        </div>

        {(isModalOpen && typeModal === 'following') && (
          <ModalUserFollowers userName={user.userName} type={'following'} currentUser={currentUser} onClose={handleModelClose} isOpen={isModalOpen} isOwnProfile={isOwnProfile}/>
        )}
        {(isModalOpen && typeModal === 'followers') && (
          <ModalUserFollowers userName={user.userName} type={'followers'} currentUser={currentUser} onClose={handleModelClose} isOpen={isModalOpen} isOwnProfile={isOwnProfile}/>
        )}
      </div>
    </div>
  )
}
