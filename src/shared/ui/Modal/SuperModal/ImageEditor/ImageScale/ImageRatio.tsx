import styles from './ImageRatio.module.scss'
import { useState } from 'react'
import OriginalIcon from '../../../icons/photoUploadBg.svg'
import OneToOneIcon from '../../../icons/11.svg'
import FourToFiveIcon from '../../../icons/45.svg'
import SixTeenToNineIcon from '../../../icons/169.svg'
export type AspectRatio = '1:1' | '4:5' | '16:9' | 'base'

/*interface AspectRatioPickerProps {
  selectedRatio: AspectRatio
  onRatioChange: (ratio: AspectRatio) => void
  className?: string
}*/

// Компоненты-иконки для соотношений
const RatioIcon = ({ ratio }: { ratio: AspectRatio }) => {
  switch (ratio) {
    case 'base':
      return <OriginalIcon className={styles.originalIcon}/>
    case '1:1':
      return <OneToOneIcon/>
    case '4:5':
      return <FourToFiveIcon/>
    case '16:9':
      return <SixTeenToNineIcon/>
    default:
      return null
  }
}

export const ImageRatio = ({}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('base')

  const handleRatioChange = (ratio: AspectRatio) => {
    setSelectedRatio(ratio)

    // Дополнительная логика при изменении соотношения
  }
  const ratios: { value: AspectRatio; label: string }[] = [
    { value: 'base', label: 'Original' },
    { value: '1:1', label: '1:1' },
    { value: '4:5', label: '4:5' },
    { value: '16:9', label: '16:9' },
  ]

  return (
    <div className={`${styles.container}`}>
      {ratios.map(ratio => (
        <button
          key={ratio.value}
          className={`${styles.ratioButtons} ${selectedRatio === ratio.value ? styles.active : ''}`}
          onClick={() => handleRatioChange(ratio.value)}
        >
          <div className={styles.ratiocontent}>
            <span>{ratio.label}</span>

            <RatioIcon ratio={ratio.value} />
          </div>
        </button>
      ))}
    </div>
  )
}
