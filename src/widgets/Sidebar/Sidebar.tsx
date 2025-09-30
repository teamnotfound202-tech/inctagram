import { baseApi } from '@/shared/api'
import { SidebarItem } from '@/widgets/Sidebar/SidebarItem/SidebarItem'
import s from './Sidebar.module.scss'
import { useState } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui'
import { useLogoutMutation, useMeQuery } from '@/features/auth/api/authApi'
import { ACCESS_TOKEN } from '@/shared/lib'
import { sideBarData } from '@/shared/config/sideBarItems/sideBarData'
import { useRouter } from 'next/navigation'
import { Path } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages, selectLanguage } from '@/shared/api/appSlice'
import { SuperModal } from '@/shared/ui/Modal/SuperModal/SuperModal'
import { SideBarWarning } from '@/shared/ui/Modal/SideBarWarning/SideBarWarning'

export type TypeOfModalWindow = 'Logout' | 'AddPhotoModal' |'exitEditing'| null

export const Sidebar = () => {
  const [logout] = useLogoutMutation()
  const { data } = useMeQuery()
  const language = useAppSelector(selectLanguage)
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState<TypeOfModalWindow>('exitEditing')

  const handleModelHandler = (type: TypeOfModalWindow) => {
    setModalOpen(type)
  }


  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        handleModelHandler(null)
        router.replace(Path.Home)
        localStorage.removeItem(ACCESS_TOKEN)
        dispatch(baseApi.util.resetApiState())
      })
      .catch(() => {
        handleModelHandler(null)
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
            link={item.link}
            spanText={item.textForLink[language]}
            isDisabled={item.isDisabled}
            {...(item.onclick && { onClickAction: handleModelHandler })}
          />
        )
      })}

      {isModalOpen === 'Logout' && (
        <Modal title={currentLanguageArray.navigation.logOut} onClick={()=>handleModelHandler(null)}>
          <SideBarWarning>
            {currentLanguageArray.modals.confirmLogoutMessage} <span>{data?.email}</span>
          </SideBarWarning>
          <div className={s.buttonWrapper}>
            <Button variant={'outline'} onClick={handleLogout}>
              Yes
            </Button>
            <Button onClick={()=>handleModelHandler(null)}>No</Button>
          </div>
        </Modal>
      )}
      {isModalOpen === 'AddPhotoModal' && (
        <SuperModal callback={handleModelHandler} title={currentLanguageArray.posts.addPhoto}/>
      )}

    </ul>
  )
}
