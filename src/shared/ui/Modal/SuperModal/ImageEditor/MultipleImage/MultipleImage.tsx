import styles from './MultipleImage.module.scss'
import DeleteIcon from '../../../icons/close.svg'
import PlusPhotoIcon from '../../../icons/plus-circle.svg'
import { clsx } from 'clsx'
import { Image } from '@/shared/lib/sсhemas/posts'
import { useRef } from 'react'
import { useFileUpload } from '@/shared/ui/Modal/SuperModal/ImageEditor/model/useUploader'
import { SuperUploadInput } from '@/shared/ui/Modal/SuperModal/SuperUploadInput/SuperUploadInput'

type Props = {
  images: Image[]
  selectedImage: number
  onUpload: (files: File[]) => void
}

export const MultipleImage = ({ images,selectedImage,onUpload }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleFileSelect,addToExistingFile } = useFileUpload({
    onUpload: files => {
      onUpload(files)
    },
  })
  return (
    <div className={styles.container}>
      <div className={styles.thumbnailContainer}>
        {images.length > 0 &&
          images.map((image, i) => (
            <div key={image.uploadId} className={clsx(styles.imageContainer,
              {
                [styles.selected]: i === selectedImage
              }
            )}>
              <img src={image.url} />
              <div onClick={() => alert('hi')} className={styles.deleteIconContainer}>
                <DeleteIcon className={styles.deleteIconBtn} />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.addPhotoContainer}>
        <PlusPhotoIcon className={styles.plusIcon} onClick={() => fileInputRef.current?.click()}/>
       <SuperUploadInput ref={fileInputRef} handleChange={addToExistingFile}/>
      </div>
    </div>
  )
}
