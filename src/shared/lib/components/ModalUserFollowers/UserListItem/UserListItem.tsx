import Avatar from '../../../../../entities/user/ui/Avatar/Avatar'
import s from '@/shared/lib/components/ModalUserFollowers/ModalUserHeaderProfile.module.scss'
import Skeleton from 'react-loading-skeleton'
import { Button } from '@/shared/ui'
import {
  useFollowingsUserQuery,
  useFollowingUserMutation,
  useUnFollowingUserMutation,
} from '@/features/publicUserApi/publicUserApi'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMeQuery } from '@/features/auth/api/authApi'
import { UserItem } from '@/features/publicUserApi/types'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Path } from '@/shared/config'
import { ACCESS_TOKEN } from '@/shared/lib'
import { baseApi } from '@/shared/api'



type Props = {
  user: UserItem
  isLoading: boolean
  type: 'following' | 'followers'
  isOwnProfile: boolean
};
export const UserListItem = ({user,isLoading,type, isOwnProfile}: Props) => {
  const router = useRouter()

  const { data: currentUser } = useMeQuery()
  const {data:followingUsers} = useFollowingsUserQuery({ userName: user.userName })
  const [followingUser, { isLoading: isFollowingLoading }] = useFollowingUserMutation()
  const [unFollowingUser, { isLoading: isUnfollowingLoading }] = useUnFollowingUserMutation()

  const isLoadingButtons = isFollowingLoading || isUnfollowingLoading

  const [buttonIsLoading, setbuttonIsLoading] = useState(false)

  const [isModalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')


  const handleModelClose = () => setModalOpen(false)

  const handleDeleteFollowing = () => {
    setbuttonIsLoading(true)
    unFollowingUser({ userId: user.userId })
      .unwrap()
      .then(() => {
        setbuttonIsLoading(false)
        setUserIsFollowing(false)
        handleModelClose()
    })
      .catch(() => {
        handleModelClose()
      })
  }

  const followHandler = () =>{
    setbuttonIsLoading(true)
    followingUser({ selectedUserId: user.userId }).then(() => {
      setbuttonIsLoading(false)
      setUserIsFollowing(true)
    })
  }
  const unFollowHandler = () =>{
    setbuttonIsLoading(true)
    unFollowingUser({ userId: user.userId })
      .then(() => {
        setbuttonIsLoading(false)
    })
  }
  const [userIsFollowing, setUserIsFollowing] = useState<boolean>(user.isFollowing)

  return (
    <div key={user.id}>
      <Avatar src={user?.avatars?.[0]?.url} alt={'Avatar Image'} size={'small'} />
      <button className={s.userNameButton} onClick={() => router.push(`/profile/${user.userId}`)}>
        <span>{user.userName}</span>
      </button>

      <div className={s.buttonGroup}>
        {isLoading && (
          <Skeleton
            baseColor="rgba(23, 23, 23, 0.6)"
            highlightColor="rgba(40, 40, 40, 0.8)"
            width={250}
            height={36}
          />
        )}

        {!isLoading &&
          currentUser?.userId && //делаем проверку на то что загрузка завершена
          isOwnProfile && ( //на то что мы авторизованы, и что мы вызываем модалку на нашем профиле
            <div>
              {
                //если модалка "followers" и мы не подписаны на юзера из списка
                type === 'followers' && !userIsFollowing && (
                  <div>
                    <Button
                      variant={'primary'}
                      onClick={followHandler}
                      disabled={isLoadingButtons}
                    >
                      {buttonIsLoading ? 'Loading...' : 'Follow'}
                    </Button>
                    <Button variant={'text'} onClick={()=>{
                      setModalOpen(true)
                      setModalTitle('Delete Following')
                    }} disabled={isLoadingButtons}>
                      {buttonIsLoading && isUnfollowingLoading ? 'Loading...' : 'Delete'}
                    </Button>
                  </div>
                )
              }
              {
                //если модалка "followers" и мы подписаны на юзера из списка
                type === 'followers' && userIsFollowing && (
                  <Button variant={'text'} onClick={()=>{
                    setModalOpen(true)
                    setModalTitle('Delete Following')
                  }} disabled={isLoadingButtons}>
                    {buttonIsLoading ? 'Loading...' : 'Delete'}
                  </Button>
                )
              }

              {
                //если модалка "following", затем меняем кнопки в зависимости от того отписались мы от юзера или нет
                type === 'following' &&
                  (userIsFollowing ? (
                    <Button
                      variant={'outline'}
                      onClick={()=>{
                        setModalOpen(true)
                        setModalTitle('Unfollow')
                      }}
                      disabled={isLoadingButtons}
                    >
                      {buttonIsLoading ? 'Loading...' : 'Unfollow'}
                    </Button>
                  ) : (
                    <Button
                      variant={'primary'}
                      onClick={followHandler}
                      disabled={isLoadingButtons}
                    >
                      {buttonIsLoading ? 'Loading...' : 'Follow'}
                    </Button>
                  ))
              }
            </div>
          )}
      </div>

      {isModalOpen && (
        <Modal title={modalTitle} onClick={handleModelClose}>
          <div>
            <Avatar src={user?.avatars?.[0]?.url} alt={'Avatar Image'} size={'small'} />

            {modalTitle === 'Delete Following' ? (
              <div>
                <span>Do you really want to delete a Following </span>
                <button className={s.userNameButton} onClick={() => router.push(`/profile/${user.userId}`)}>
                  <span>{user.userName}?</span>
                </button>
              </div>
            ):(
              <div>
                <span>Do you really want to Unfollow from this user </span>
                <button className={s.userNameButton} onClick={() => router.push(`/profile/${user.userId}`)}>
                  <span>{user.userName}?</span>
                </button>
              </div>
            )}

          </div>
          <div className={s.buttonWrapper}>
            <Button variant={'outline'} onClick={handleDeleteFollowing}>
              Yes
            </Button>
            <Button onClick={handleModelClose}>No</Button>
          </div>
        </Modal>
      )}
    </div>

  )
}