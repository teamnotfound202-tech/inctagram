import PhotoUplaodBg from '@/shared/ui/Modal/icons/photoUploadBg.svg'
import { ChangeEvent, useRef, useState } from 'react'
import styles from './ImageUploader.module.scss'
import { Button } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

type ImageUploaderProps = {
  onUpload: (files: File[]) => void
  images: File[]
}
export const ImageUploader = ({ onUpload,images }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    validateAndUpload(files)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    const files = Array.from(event.dataTransfer.files)
    validateAndUpload(files)
  }

  const validateAndUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
      const isValidSize = file.size <= 20 * 1024 * 1024 // 20MB
      if (!isValidType) {
        alert('Only JPEG and PNG files are allowed')
        return false
      }
      if (!isValidSize) {
        alert('File size must be less than 20MB')
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      onUpload(validFiles.slice(0, 10)) // Max 10 files
    }
  }

  const containerClasses = `${styles.container} ${dragOver ? styles.dragOver : ''}`

  return (
<div className={styles.modalWrapper}>
    <div
      className={containerClasses}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onDragEnter={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png"
        onChange={handleFileSelect}
        className={styles.fileInput}
      />

      <div className={styles.content}>
        <PhotoUplaodBg className={styles.photoUploadBg}/>
      </div>
    </div>
<div className={styles.buttonUploadContainer}>
  <Button className={styles.buttonUploadItem} onClick={() => fileInputRef.current?.click()}>
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/jpeg,image/png"
      onChange={handleFileSelect}
      className={styles.fileInput}
    />
    {currentLanguageArray.modals.selectPhoto}
  </Button>
  <Button onClick={()=>validateAndUpload(images)} className={styles.buttonUploadItem} variant={'outline'} >{currentLanguageArray.modals.openDraft}</Button>
</div>
</div>
  )
}
