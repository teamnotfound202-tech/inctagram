import { ChangeEvent, RefObject } from 'react'
import styles from '@/shared/ui/Modal/SuperModal/ImageUploader/ImageUploader.module.scss'

type Props ={
  ref: RefObject<HTMLInputElement |null>
  handleChange:(event: ChangeEvent<HTMLInputElement>)=>void
}

export const SuperUploadInput = ({ref,handleChange}:Props) => {
  return (
    <input
      ref={ref}
      type="file"
      multiple
      accept="image/jpeg,image/png"
      onChange={handleChange}
      className={styles.fileInput}
    />
  )
}

