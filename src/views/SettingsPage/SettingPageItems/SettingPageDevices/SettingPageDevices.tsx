import s from './SettingPageDevices.module.scss'
import { useGetCurrentDeviceQuery } from '@/features/devices/api/devicesApi'
import { CurrentDevice } from '@/views/SettingsPage/SettingPageItems/SettingPageDevices/CurrentDevice/CurrentDevice'
import { ActiveSessions } from '@/views/SettingsPage/SettingPageItems/SettingPageDevices/ActiveSessions/ActiveSessions'
import Skeleton from 'react-loading-skeleton'

export  const SettingPageDevices = () => {
  const {data: devicesData, isLoading: isLoadingCurrent} = useGetCurrentDeviceQuery()

  return (
    <div className={s.settingPageDevices}>
      {isLoadingCurrent && (
        <>
          <Skeleton
            baseColor="rgba(23, 23, 23, 0.6)"
            highlightColor="rgba(40, 40, 40, 0.8)"
            className={s.skeletonCurrentDevice}
          />

          <Skeleton
          baseColor="rgba(23, 23, 23, 0.6)"
          highlightColor="rgba(40, 40, 40, 0.8)"
          className={s.skeletonActiveDevice}
          />
        </>
      )}
      {devicesData && <CurrentDevice currentDevice={devicesData.current} />}
      {devicesData && <ActiveSessions activeDevices={devicesData.others} currentDeviceId={devicesData.current.deviceId} />}
    </div>
  )
}