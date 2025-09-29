import { baseApi } from '@/shared/api'
import {SidebarItem} from '@/widgets/Sidebar/SidebarItem/SidebarItem'
import s from './Sidebar.module.scss'
import {useState} from 'react'
import {Modal} from '@/shared/ui/Modal/Modal'
import {Button} from '@/shared/ui'
import { useLogoutMutation, useMeQuery } from '@/features/auth/api/authApi'
import {ACCESS_TOKEN} from '@/shared/lib'
import {sideBarData} from '@/shared/config/sideBarItems/sideBarData'
import {useRouter} from "next/navigation";
import {Path} from "@/shared/config";
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectLanguage } from '@/shared/api/appSlice'




export const Sidebar = () => {
  const [logout] = useLogoutMutation()
  const {data} = useMeQuery()
  const language = useAppSelector(selectLanguage)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState(false)

  const handleModelOpen = () => setModalOpen(true)
  const handleModelClose = () => setModalOpen(false)

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        handleModelClose()
        router.replace(Path.Home)
        localStorage.removeItem(ACCESS_TOKEN)
        dispatch(baseApi.util.resetApiState())
      })
      .catch(() => {
        handleModelClose()
        router.replace(Path.SignIn)
        dispatch(baseApi.util.resetApiState())
      })
  }

  return (
    <ul className={s.sidebar}>
      {sideBarData.map(item => {
        return (
          <SidebarItem
            key={item.key}
            text={item.text}
            link={item.text === 'My Profile'? `/profile/${data?.userId}` : item.link}
            spanText={item.textForLink[language]}
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
