import { SidebarItem } from '@/widgets/Sidebar/SidebarItem/SidebarItem'
import s from './Sidebar.module.scss'
import { useState } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { ACCESS_TOKEN } from '@/shared/lib'
import { sideBarData } from '@/shared/config/sideBarItems/sideBarData'
import type { ResponsesMe } from '@/shared/api'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { loginTC, selectIsLoggedIn } from '@/shared/api/appSlice'
import clx from 'classnames'

type Props = {
  data: ResponsesMe | undefined
}

export const Sidebar = ({ data }: Props) => {
  const [logout] = useLogoutMutation()

  const [isModalOpen, setModalOpen] = useState(false)

  const islogined = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const handleModelOpen = () => setModalOpen(true)
  const handleModelClose = () => setModalOpen(false)
  const handleLogout = () => {

    logout()
      .unwrap()
      .then(() => {
        localStorage.removeItem(ACCESS_TOKEN)
        dispatch(loginTC({ isLoggedIn: false }))
        handleModelClose()
      })
  }
  const isVisible = !islogined
  return (
    <ul className={clx(s.sidebar, { [s.unvisible]: isVisible })}>
      {sideBarData.map(item => {
        return (
          <SidebarItem
            key={item.key}
            text={item.text}
            link={item.link}
            isDisabled={item.isDisabled}
            {...(item.onclick && { onClickAction: handleModelOpen })}
          />
        )
      })}

      {isModalOpen && (
        <Modal title={'Log Out'} onClick={handleModelClose}>
          <p className={s.contentTextModal}>
            Are you really want to log out of your account <span>{data?.email}</span>
          </p>
          <div className={s.buttonWrapper}>
            <Button variant={'outline'} onClick={handleLogout}>
              Yes
            </Button>
            <Button onClick={handleModelClose}>No</Button>
          </div>
        </Modal>
      )}
    </ul>
  )
}
