import s from './PopUpPost.module.scss'
import CopyIcon from './icons/copy.svg'
import FollowIcon from './icons/follow.svg'
import UnFollowIcon from './icons/unfollow.svg'
import {
  useFollowingUserMutation,
  useGetUserFollowingAndFollowersQuery,
  useUnFollowingUserMutation,
} from '@/features/publicUserApi/publicUserApi'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { useState } from 'react'

type Props = {
  userName: string | undefined
  userId: number | undefined
}

export const PopUpPost = ({userName, userId}: Props) => {
  const messages = useAppSelector(selectCurrentMessages)
  const {data: freshProfileData, isLoading, isFetching } = useGetUserFollowingAndFollowersQuery({ userName: userName || '' })
  const [following] = useFollowingUserMutation()
  const [unfollowing] = useUnFollowingUserMutation()
  const [isLoadingPopUp, setIsLoadingPopUp] = useState(false)

  const handleFollowingByUser = () => {
    if (userName && userId){
      setIsLoadingPopUp(true)
      following({ userName, selectedUserId: userId })
        .unwrap()
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
  const handleUnFollowingByUser = () => {
    if (userName && userId) {
        setIsLoadingPopUp(true)
        unfollowing({userName, userId})
          .unwrap()
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

  return (
    <div className={s.feedPopupContent}>
      {
        !isLoadingPopUp && !isLoading && !isFetching && freshProfileData ?
          freshProfileData?.isFollowing ? (
          <button className={s.popUpBtn} onClick={handleUnFollowingByUser}>
            <UnFollowIcon/>
            Unfollow
          </button>
        ) : (
          <button className={s.popUpBtn} onClick={handleFollowingByUser}>
            <FollowIcon/>
            Follow
          </button>
        ) : <Spinner type="secondary" size={16} label={messages.common.loading} fullWidth center />
      }
      <button className={s.popUpBtn}>
        <CopyIcon/>
        Copy link
      </button>
    </div>
  )
}