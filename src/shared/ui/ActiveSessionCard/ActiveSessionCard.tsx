import s from './ActiveSessionCard.module.scss'
import {OtherDevice } from '@/features/devices/api/types'
import DesktopIcon from './icons/desktop.svg'
import MobileIcon from './icons/mobile.svg'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { Button } from '@/shared/ui'
import LogOutIcon from './icons/logout.svg'
import { useDeleteDeviceMutation } from '@/features/devices/api/devicesApi'
import { Path } from '@/shared/config'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { formatDateFromServer } from '@/shared/api/utils'

type Props = {
  activeDevice: OtherDevice
}

export const ActiveSessionCard = ({activeDevice}: Props) => {
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const [deleteDevice, {isLoading}] = useDeleteDeviceMutation()

  const handleLogoutDevice = () => {
    deleteDevice({ deviceId: activeDevice.deviceId })
      .unwrap()
      .catch(() => {
        toast.custom(() => (
          <AlertToast
            variant="error"
            title={currentLanguageArray.errors.serverError}
            description={currentLanguageArray.errors.serverError}
          />
        ))
      })
  }
  return (
    <div className={s.activeDeviceCard}>
      {activeDevice.deviceType === 'mobile' ? <MobileIcon /> : <DesktopIcon />}
      <div className={s.activeDeviceInfo}>
        <p className={s.activeDeviceName}>{activeDevice.deviceName}</p>
        <p className={s.activeDeviceIp}>IP: {activeDevice.ip}</p>
        <p className={s.activeDeviceBrowserName}>{activeDevice.browserName}</p>
        <p className={s.activeDeviceLastVisit}>
          {currentLanguageArray.devices.lastVisit}: {formatDateFromServer(activeDevice.lastActive)}
        </p>
      </div>
      <div className={s.activeDeviceBtnWrapper}>
        <Button variant={'text'} className={s.activeDeviceBtn} onClick={handleLogoutDevice} disabled={isLoading}>
          <LogOutIcon />
          Log Out
        </Button>
      </div>
    </div>
  )
}