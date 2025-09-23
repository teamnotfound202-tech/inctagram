import styles from './ImageRatio.module.scss'
import { useState } from 'react'

export type AspectRatio = '1:1' | '4:5' | '16:9'|'base'

/*interface AspectRatioPickerProps {
  selectedRatio: AspectRatio
  onRatioChange: (ratio: AspectRatio) => void
  className?: string
}*/

// Компоненты-иконки для соотношений
const RatioIcon = ({ ratio }: { ratio: AspectRatio }) => {
  switch (ratio) {
    case '1:1':
      return <div className={styles.iconSquare}>□</div>
    case '4:5':
      return <div className={styles.iconPortrait}>▭</div>
    case '16:9':
      return <div className={styles.iconLandscape}>▬</div>
    default:
      return null
  }
}

export const ImageRatio = ({}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1');

  const handleRatioChange = (ratio: AspectRatio) => {
    setSelectedRatio(ratio);
    // Дополнительная логика при изменении соотношения
  };
  const ratios: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: '1:1' },
    { value: '4:5', label: '4:5' },
    { value: '16:9', label: '16:9' },
    { value: 'base', label: 'Original' },
  ]

  return (
    <div className={`${styles.container}`}>
      <span className={styles.label}>Соотношение сторон:</span>
      <div className={styles.ratioButtons}>
        {ratios.map(ratio => (
          <button
            key={ratio.value}
            type="button"
            className={`${styles.ratioButton} ${
              selectedRatio === ratio.value ? styles.active : ''
            }`}
            onClick={() => handleRatioChange(ratio.value)}
            title={`Соотношение ${ratio.label}`}
          >
            <RatioIcon ratio={ratio.value} />
            <span>{ratio.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
