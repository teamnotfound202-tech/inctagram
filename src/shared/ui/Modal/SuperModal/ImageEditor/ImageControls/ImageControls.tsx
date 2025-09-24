import styles from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageEditor.module.scss'
import ScaleIcon from '@/shared/ui/Modal/icons/scaleIcon.svg'
import ZoomIcon from '@/shared/ui/Modal/icons/zoomIcon.svg'
import PhotoUploadIcon from '@/shared/ui/Modal/icons/photoUploadBg.svg'
import { TypeOfControls } from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageEditor'
import { clsx } from 'clsx'

type Props = {
  onClickHandler: (type: TypeOfControls) => void
  openState: TypeOfControls
}

export const ImageControls = ({ onClickHandler, openState }: Props) => {
  return (
    <>
      <button
        onClick={() => onClickHandler('ratio')}
        className={`${styles.sliderButton} ${styles.scaleArrow}`}
      >
        <ScaleIcon
          className={clsx(styles.iconstyle, {
            [styles.iconActive]: openState === 'ratio',
          })}
        />
      </button>
      <button
        onClick={() => onClickHandler('zoom')}
        className={`${styles.sliderButton} ${styles.zoomArrow}`}
      >
        <ZoomIcon
          className={clsx(styles.iconstyle, {
            [styles.iconActive]: openState === 'zoom',
          })}
        />
      </button>
      <button
        onClick={() => onClickHandler('multiple')}
        className={`${styles.sliderButton} ${styles.multipleArrow}`}
      >
        <PhotoUploadIcon
          className={clsx(styles.iconstyle, {
            [styles.iconActive]: openState === 'multiple',
          })}
        />
      </button>
    </>
  )
}

export default ImageControls
