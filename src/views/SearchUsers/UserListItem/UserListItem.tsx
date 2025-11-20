// @flow
import * as React from 'react'
import s from '@/views/SearchUsers/SearchUsers.module.scss'
import Avatar from '../../../entities/user/ui/Avatar/Avatar'
import Link from 'next/link'
import { Button } from '@/shared/ui'
import { UserFromSearch } from '@/features/publicUserApi/types'

type Props = {
  user: UserFromSearch
  handleUsersFromSearch: (filteredUsers:UserFromSearch[])=>void
  debounced: string
};
export const UserListItem = ({user, handleUsersFromSearch,debounced}: Props) => {

  const saveUserToLocalStorage = (user: UserFromSearch) => {
    const usersFromSearch = localStorage.getItem('usersFromSearch')
    const users = usersFromSearch ? JSON.parse(usersFromSearch).splice(0, 4) : []
    const usersId = users.map((user: UserFromSearch) => user.id)
    if (!usersId.includes(user.id)) {
      localStorage.setItem('usersFromSearch', JSON.stringify([user, ...users]))
    }
  }
  const removeUserFromLocalStorage = (userId:number) => {
    const usersFromSearch = localStorage.getItem('usersFromSearch')
    const users = usersFromSearch ? JSON.parse(usersFromSearch) : []
    const filteredUsers = users.filter((user: UserFromSearch) => user.id !== userId)
    handleUsersFromSearch(filteredUsers)
    localStorage.setItem('usersFromSearch', JSON.stringify(filteredUsers))
  }
  return (
    <div className={s.user}>
      <Avatar src={user.avatars[0]?.url ?? ''} alt="Avatar Image" size="small" />
      <div>
        <Link
          className={s.userName}
          href={`/profile/${user.id}`}
          onClick={() => saveUserToLocalStorage(user)}
        >
          <span className={s.userName}>{user.userName}</span>
        </Link>
        <div className={s.fullName}>
                <span>
                  {user.firstName} {user.lastName}
                </span>
        </div>
      </div>
      {!debounced && (
        <Button variant={'text'} onClick={() => removeUserFromLocalStorage(user.id)}>
          X
        </Button>
      )}
    </div>
  )
}