import styles from './MultipleImage.module.scss'
import DeleteIcon from '../../../icons/close.svg'
import PlusPhotoIcon from '../../../icons/plus-circle.svg'
import { clsx } from 'clsx'

type Props = {
  images: string[]
  selectedImage: number
}

export const MultipleImage = ({ images,selectedImage }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.thumbnailContainer}>
        {images.length > 0 &&
          images.map((image, i) => (
            <div key={i} className={clsx(styles.imageContainer,
              {
                [styles.selected]: i === selectedImage
              }
            )}>
              <img src={image} />
              <div onClick={() => alert('hi')} className={styles.deleteIconContainer}>
                <DeleteIcon className={styles.deleteIconBtn} />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.addPhotoContainer}>
        <PlusPhotoIcon className={styles.plusIcon} />
      </div>
    </div>
  )
}
