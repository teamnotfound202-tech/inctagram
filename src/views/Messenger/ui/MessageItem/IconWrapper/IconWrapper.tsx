import SentIcon from '../../../icons/ReadIcon.svg'
import ReadIcon from '../../../icons/ReadAndSendIcon.svg'
import { clsx } from 'clsx'
import s from './IconWrapper.module.scss'
import { Status } from '@/features/messengerApi/types'

type Props = {
  owner: boolean
  date: string
  status: Status
}
export const IconWrapper = ({ owner, date, status }: Props) => {
  return (
    <div className={s.iconWrapper}>
      <span className={clsx(s.data, owner ? s.ownerData : s.partnerData)}>{date}</span>
      {owner && (
        <div className={s.readIcon}>
          {status === 'SENT' && <SentIcon />}
          {status === 'READ' && <ReadIcon />}
        </div>
      )}
    </div>
  )
}
