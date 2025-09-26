'use client'
import Avatar from '../../entities/user/ui/Avatar/Avatar'
import s from './ProfileHeader.module.scss'
import { useMeQuery } from '@/features/auth/api/authApi'
import { Button } from '@/shared/ui'
import { useFollowingUserMutation, useGetUserFollowingAndFollowersQuery, useUnFollowingUserMutation} from '@/features/publicUserApi/publicUserApi'
import { UserDataResponse, UserProfileResponse } from '@/features/publicUserApi/types'
import Paid from './icons/Paid.svg'
import { ProfileHeadersStats } from '@/features/profile/ProfileHeadersStats/ProfileHeadersStats'
import Skeleton from 'react-loading-skeleton'

type Props = {
  user: UserDataResponse
  userStats: UserProfileResponse
}

export const ProfileHeader = ({ user, userStats }: Props) => {
  const { data: currentUser } = useMeQuery()
  const {data: freshProfileData, isLoading, isFetching } = useGetUserFollowingAndFollowersQuery({ userName: user.userName })

  const dataForRender = freshProfileData || userStats
  const [followingUser, { isLoading: isFollowingLoading }] = useFollowingUserMutation()
  const [unFollowingUser, { isLoading: isUnfollowingLoading }] = useUnFollowingUserMutation()

  const isOwnProfile = currentUser?.userId === user?.id
  const isLoadingButtons = isFollowingLoading || isUnfollowingLoading || isFetching
  const showLoading =  isFollowingLoading || isUnfollowingLoading || isFetching

  const followHandler = () => {
    followingUser({ selectedUserId: user.id, userName: user.userName })
  }
  const unFollowHandler = () => {
    unFollowingUser({ userId: user.id, userName: user.userName  })
  }

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
                  height={32}
                />
              )}

              {!isLoading && currentUser?.userId &&
                (isOwnProfile  ? (
                  <Button variant={'secondary'}>Profile Settings</Button>
                ) : (
                  <div className={s.foreignProfileButtons}>
                    {freshProfileData?.isFollowing ? (
                      <Button variant={'outline'} onClick={unFollowHandler} disabled={isLoadingButtons}>
                        {showLoading ? 'Loading...' : 'Unfollow'}
                      </Button>
                    ) : (
                      <Button variant={'primary'} onClick={followHandler} disabled={isLoadingButtons}>
                        {showLoading ? 'Loading...' : 'Follow'}
                      </Button>
                    )}
                    <Button variant={'secondary'}>Send Message</Button>
                  </div>
                ))}
            </div>
          </div>

          <ProfileHeadersStats data={dataForRender} userName={user.userName}/>

          <div className={s.userAbout}>
            <p>{user.aboutMe}</p>
          </div>

        </div>

      </div>
    </div>
  )
}