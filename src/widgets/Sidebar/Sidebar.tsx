import {SidebarItem} from '@/widgets/Sidebar/SidebarItem/SidebarItem'
import s from './Sidebar.module.scss'
import {useState} from 'react'
import {Modal} from '@/shared/ui/Modal/Modal'
import {Button} from '@/shared/ui'
import {useLogoutMutation} from '@/features/auth/api/authApi'
import {ACCESS_TOKEN} from '@/shared/lib'
import {sideBarData} from '@/shared/config/sideBarItems/sideBarData'
import {useAppDispatch, useAppSelector} from '@/shared/lib/hooks/hooks'
import {logoutAC,selectUserEmail} from '@/shared/api/appSlice'
import {useRouter} from "next/navigation";
import {Path} from "@/shared/config";



export const Sidebar = () => {
  const dispatch = useAppDispatch()
  const email = useAppSelector(selectUserEmail)
  const [logout] = useLogoutMutation()
  const router = useRouter()

  const [isModalOpen, setModalOpen] = useState(false)


  const handleModelOpen = () => setModalOpen(true)
  const handleModelClose = () => setModalOpen(false)
  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        localStorage.removeItem(ACCESS_TOKEN)
        dispatch(logoutAC())
        handleModelClose()
        router.push(Path.Home)
      })
  }

  return (
    <ul className={s.sidebar}>
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
            Are you really want to log out of your account <span>{email}</span>
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
