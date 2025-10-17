import { CurrentDeviceType } from '@/features/devices/api/types'
import s from './CurrentDevice.module.scss'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { CurrentDeviceCard } from '@/shared/ui/CurrentDeviceCard/CurrentDeviceCard'

type Props = {
  currentDevice: CurrentDeviceType
}

export const CurrentDevice = ({ currentDevice }: Props) => {
  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  return (
    <>
      <h3 className={s.currentDeviceTitle}>{currentLanguageArray.devices.currentDevice}</h3>
      <CurrentDeviceCard device={currentDevice} />
    </>
  )
}