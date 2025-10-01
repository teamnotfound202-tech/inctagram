'use client'
import s from '@/features/profile/ProfileHeader.module.scss'
import { ModalUsers } from '@/shared/lib/components/ModalUserFollowers/ModalUsers'
import { useState } from 'react'
import { useMeQuery } from '@/features/auth/api/authApi'
import { UserProfileResponse } from '@/features/publicUserApi/types'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

type Props = {
  data: UserProfileResponse
  userName: string
};

export const ProfileHeadersStats = ({data, userName}: Props) => {
  const { data: currentUser } = useMeQuery()

  const messages = useAppSelector(selectCurrentMessages)

  const [isModalOpen, setModalOpen] = useState(false)
  const [typeModal, setTypeModal] = useState<'following' | 'followers'>()

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
        disabled={!currentUser?.userId}>

        <span className={s.statsCount}>{data.followingCount}</span>
        <span className={s.statsDescription}>{messages.profile.following}</span>
      </button>

      <button
        className={s.statsButton}
        onClick={showFollowersHandler}
        disabled={!currentUser?.userId}>

        <span className={s.statsCount}>{data.followersCount}</span>
        <span className={s.statsDescription}>{messages.profile.followers}</span>
      </button>

      <button className={s.statsButton} disabled={!currentUser?.userId}>
        <span className={s.statsCount}>{data.publicationsCount}</span>
        <span className={s.statsDescription}>{messages.profile.publications}</span>
      </button>

      {isModalOpen && typeModal === 'following' && (
        <ModalUsers
          userName={userName}
          type={'following'}
          currentUser={currentUser}
          onCloseAction={handleModelClose}
          isOpen={isModalOpen}
          userStats={data}
        />
      )}
      {isModalOpen && typeModal === 'followers' && (
        <ModalUsers
          userName={userName}
          type={'followers'}
          currentUser={currentUser}
          onCloseAction={handleModelClose}
          isOpen={isModalOpen}
          userStats={data}
        />
      )}
    </div>
  )
}