import {
  useLazyFollowersUserQuery,
  useLazyFollowingsUserQuery,
} from '@/features/publicUserApi/publicUserApi'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useEffect, useState } from 'react'
import { UserItem, UserProfileResponse } from '@/features/publicUserApi/types'
import { ResponsesMe } from '@/shared/api'
import { UserListItem } from '@/shared/lib/components/ModalUserFollowers/UserListItem/UserListItem'
import Skeleton from 'react-loading-skeleton'
import { Input } from '@/shared/ui'
import s from './ModalUsers.module.scss'

type Props = {
  type: 'following' | 'followers'
  userName: string
  currentUser: ResponsesMe | undefined
  isOpen: boolean
  onClose: () => void
  userStats: UserProfileResponse
}

export const ModalUsers = ({ type, isOpen, onClose, userName, userStats }: Props) => {
  const [
    getUserFollowings,
    { isLoading: isLoadingFollowingsUsers, isFetching: isFetchingFollowingsUsers },
  ] = useLazyFollowingsUserQuery()
  const [
    getUserFollowers,
    { isLoading: isLoadingFollowersUsers, isFetching: isFetchingFollowersUsers },
  ] = useLazyFollowersUserQuery()

  const [title, setTitle] = useState('')
  const [users, setUsers] = useState<UserItem[]>([])
  const [skeletonCount, setSkeletonCount] = useState<number>(0)

  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setDebounced('')
    }
  }, [isOpen])

  const isLoading = isLoadingFollowingsUsers || isLoadingFollowersUsers
  const isFetching = isFetchingFollowingsUsers || isFetchingFollowersUsers

  useEffect(() => {
    if (isOpen) {
      if (type === 'following') {
        setSkeletonCount(userStats.followingCount > 7 ? 7 : userStats.followingCount)
        setTitle(`${userStats.followingCount} Following`)
        getUserFollowings({ userName: userName })
          .unwrap()
          .then(res => {
            setUsers(res.items)
          })
      } else {
        setSkeletonCount(userStats.followersCount > 7 ? 7 : userStats.followersCount)
        setTitle(`${userStats.followersCount} Followers`)
        getUserFollowers({ userName: userName })
          .unwrap()
          .then(res => {
            setUsers(res.items)
          })
      }
    }
  }, [isOpen, type, userName, getUserFollowings, getUserFollowers, userStats])

  const filtered = !debounced
    ? users
    : users.filter(u => u.userName?.toLowerCase().includes(debounced))

  if (!isOpen) return null

  return (
    <Modal title={title} onClick={onClose}>
      <Input
        className={s.searchInput}
        type={'search'}
        placeholder={'Search'}
        onChange={e => setSearch(e.target.value)}
        value={search}
      />

      {(isLoading || isFetching) && (
        <div className={s.skeletonWrapper}>
          <Skeleton
            className={s.skeleton}
            baseColor="rgba(23, 23, 23, 0.6)"
            highlightColor="rgba(40, 40, 40, 0.8)"
            width={572}
            height={33}
            count={skeletonCount}
          />
        </div>
      )}
      <div className={s.usersList}>
        {!isLoading && !isFetching && filtered.length === 0 && (
          <div className={s.notFoundMessage}>
            {search ? 'No users match your search' : 'No users to show'}
          </div>
        )}

        {filtered.map(user => (
          <UserListItem user={user} key={user.id} isLoading={isLoading} type={type} />
        ))}
      </div>
    </Modal>
  )
}
