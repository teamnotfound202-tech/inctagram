import s from './CurrentDeviceCard.module.scss'
import { CurrentDeviceType } from '@/features/devices/api/types'
import BraveIcon from './icons/brave.svg'
import ChromeIcon from './icons/chrome.svg'
import FireFoxIcon from './icons/firefox.svg'
import IEIcon from './icons/ie.svg'
import MicEdgeIcon from './icons/micEdge.svg'
import OperaIcon from './icons/opera.svg'
import SafariIcon from './icons/safari.svg'
import UCIcon from './icons/uc.svg'
import YandexIcon from './icons/yandex.svg'


const devices = {
  'Brave': BraveIcon,
  'Chrome': ChromeIcon,
  'Microsoft Edge': MicEdgeIcon,
  'Firefox': FireFoxIcon,
  'Explorer': IEIcon,
  'Opera': OperaIcon,
  'Safari': SafariIcon,
  'Yandex': YandexIcon,
  'Uc browser': UCIcon
}
type Props = {
  device: CurrentDeviceType
}

export const CurrentDeviceCard = ({device}: Props) => {
  const IconItem = devices[device.browserName as keyof typeof devices]
  return (
    <div className={s.currentDeviceCard}>
      <IconItem />
      <div className={s.currentDeviceInfo}>
        <p className={s.currentDeviceName}>Browser: {device.browserName}</p>
        <p className={s.currentDeviceIp}>IP: {device.ip}</p>
      </div>
    </div>
  )
}