import {
  useLazyFollowersUserQuery,
  useLazyFollowingsUserQuery,
} from '@/features/publicUserApi/publicUserApi'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useEffect, useState } from 'react'
import { UserItem } from '@/features/publicUserApi/types'
import { ResponsesMe } from '@/shared/api'
import { UserListItem } from '@/shared/lib/components/ModalUserFollowers/UserListItem/UserListItem'

type Props = {
  type: 'following' | 'followers'
  userName: string
  currentUser: ResponsesMe | undefined
  isOpen: boolean
  onClose: () => void
  isOwnProfile: boolean
}

export const ModalUserFollowers = ({
  type,
  isOpen,
  onClose,
  userName,
  isOwnProfile,
}: Props) => {
  const [getUserFollowings, {data, isLoading: isLoadingFollowingsUsers }] = useLazyFollowingsUserQuery()
  const [getUserFollowers, { isLoading: isLoadingFollowersUsers }] = useLazyFollowersUserQuery()

  const [title, setTitle] = useState('')
  const [users, setUsers] = useState<UserItem[]>([])


  const isLoading = isLoadingFollowingsUsers || isLoadingFollowersUsers

  useEffect(() => {
    if (isOpen) {
      if (type === 'following') {
        getUserFollowings({ userName: userName })
          .unwrap()
          .then(res => {
            setTitle(`${res.items.length} Following`)
            setUsers(res.items)
          })
      } else {
        getUserFollowers({ userName: userName })
          .unwrap()
          .then(res => {
            setTitle(`${res.items.length} Followers`)
            setUsers(res.items)
          })
      }
    }
  }, [isOpen, type, userName, getUserFollowings, getUserFollowers])

  if (!isOpen) return null

  return (
    <Modal title={title} onClick={onClose}>
      {users.map(user => (
        <UserListItem user={user} key={user.id} isLoading={isLoading} type={type} isOwnProfile={isOwnProfile}/>
      ))}
    </Modal>
  )
}
