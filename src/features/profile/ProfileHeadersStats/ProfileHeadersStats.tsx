'use client'
import s from '@/features/profile/ProfileHeader.module.scss'
import { ModalUsers } from '@/shared/lib/components/ModalUserFollowers/ModalUsers'
import { useState } from 'react'
import { useMeQuery } from '@/features/auth/api/authApi'
import { UserProfileResponse } from '@/features/publicUserApi/types'

type Props = {
  data: UserProfileResponse
  userName: string
};

export const ProfileHeadersStats = ({data, userName}: Props) => {
  const { data: currentUser } = useMeQuery()

  const [isModalOpen, setModalOpen] = useState(false)
  const [typeModal, setTypeModal] = useState<'following' | 'followers'>('following')

  const showFollowingHandler = () => {
    setTypeModal('following')
    setModalOpen(true)
  }
  const showFollowersHandler = () => {
    setTypeModal('followers')
    setModalOpen(true)
  }
  const handleModelClose = () => setModalOpen(false)

  return (
    <div className={s.userStats}>
      <button
        className={s.statsButton}
        onClick={showFollowingHandler}
        disabled={!currentUser?.userId}
      >
        <span className={s.statsCount}>{data.followingCount}</span>
        <span className={s.statsDescription}>Following</span>
      </button>

      <button
        className={s.statsButton}
        onClick={showFollowersHandler}
        disabled={!currentUser?.userId}
      >
        <span className={s.statsCount}>{data.followersCount}</span>
        <span className={s.statsDescription}>Followers</span>
      </button>

      <button className={s.statsButton} disabled={!currentUser?.userId}>
        <span className={s.statsCount}>{data.publicationsCount}</span>
        <span className={s.statsDescription}>Publications</span>
      </button>

      {isModalOpen && typeModal === 'following' && (
        <ModalUsers
          userName={userName}
          type={'following'}
          currentUser={currentUser}
          onClose={handleModelClose}
          isOpen={isModalOpen}
          userStats={data}
        />
      )}
      {isModalOpen && typeModal === 'followers' && (
        <ModalUsers
          userName={userName}
          type={'followers'}
          currentUser={currentUser}
          onClose={handleModelClose}
          isOpen={isModalOpen}
          userStats={data}
        />
      )}
    </div>
  )
}