import styles from './MultipleImage.module.scss'
import DeleteIcon from '../../../icons/close.svg'
import PlusPhotoIcon from '../../../icons/plus-circle.svg'
import { clsx } from 'clsx'
import { Images } from '@/shared/lib/sсhemas/posts'
import { ChangeEvent, useRef } from 'react'
import { SuperUploadInput } from '@/shared/ui/Modal/SuperModal/SuperUploadInput/SuperUploadInput'

type Props = {
  images: Images[]
  selectedImage: number
  deletePost: (postId: string,index:number) => void
  addNewFiles: (newFiles: File[]) => void
}

export const MultipleImage = ({ images, selectedImage, addNewFiles, deletePost }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addToExistingFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || [])
    addNewFiles(newFiles)
  }
  const handleDelete = (postId: string,index:number) => {
    deletePost(postId,index)
  }
  return (
    <div className={styles.container}>
      <div className={styles.thumbnailContainer}>
        {images.length > 0 &&
          images.map((image, i) => (
            <div key={image.uploadId}
              className={clsx(styles.imageContainer, {
                [styles.selected]: i === selectedImage,
              })}
            >
              <img src={image.url} />
              <div
                onClick={() => handleDelete(image.uploadId,i)}
                className={styles.deleteIconContainer}
              >
                <DeleteIcon className={styles.deleteIconBtn} />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.addPhotoContainer}>
        <PlusPhotoIcon className={styles.plusIcon} onClick={() => fileInputRef.current?.click()} />
        <SuperUploadInput ref={fileInputRef} handleChange={addToExistingFile} />
      </div>
    </div>
  )
}
