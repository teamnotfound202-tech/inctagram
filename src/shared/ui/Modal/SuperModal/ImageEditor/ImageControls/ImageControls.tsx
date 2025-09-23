import styles from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageEditor.module.scss'
import ScaleIcon from '@/shared/ui/Modal/icons/scaleIcon.svg'
import ZoomIcon from '@/shared/ui/Modal/icons/zoomIcon.svg'
import PhotoUploadIcon from '@/shared/ui/Modal/icons/photoUploadBg.svg'
import { TypeOfControls } from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageEditor'

type Props = {
  onClickHandler: (type:TypeOfControls) => void,
}

export const ImageControls = ({onClickHandler}:Props) => {

  return (
    <>
      <button
        onClick={()=>onClickHandler('ratio')}

        className={`${styles.sliderButton} ${styles.scaleArrow}`}
      >
        <ScaleIcon className={styles.iconstyle}/>
      </button>
      <button
       onClick={()=>onClickHandler('zoom')}

        className={`${styles.sliderButton} ${styles.zoomArrow}`}
      >
        <ZoomIcon className={styles.iconstyle}/>
      </button>
      <button
        onClick={()=>onClickHandler('multiple')}

        className={`${styles.sliderButton} ${styles.multipleArrow}`}
      >
        <PhotoUploadIcon className={styles.iconstyle}/>
      </button>
    </>
  )
}

export default ImageControls