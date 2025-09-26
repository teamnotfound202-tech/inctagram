import PhotoUplaodBg from '@/shared/ui/Modal/icons/photoUploadBg.svg'
import { ChangeEvent, useRef, useState } from 'react'
import styles from './ImageUploader.module.scss'
import { Button } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

import { useFileUpload } from '@/shared/ui/Modal/SuperModal/ImageEditor/model/useUploader'
import { SuperUploadInput } from '@/shared/ui/Modal/SuperModal/SuperUploadInput/SuperUploadInput'

type ImageUploaderProps = {
  onUpload: (files: File[]) => void
  handleOpenDraft: () => void
}
export const ImageUploader = ({ onUpload, handleOpenDraft }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  const { dragOver, setDragOver, handleFileSelect, handleDrop } = useFileUpload({
    onUpload: files => {
      onUpload(files)
    },
  })

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
        <SuperUploadInput ref={fileInputRef} handleChange={handleFileSelect} />

        <div className={styles.content}>
          <PhotoUplaodBg className={styles.photoUploadBg} />
        </div>
      </div>
      <div className={styles.buttonUploadContainer}>
        <Button className={styles.buttonUploadItem} onClick={() => fileInputRef.current?.click()}>
          {currentLanguageArray.modals.selectPhoto}
        </Button>
        <Button onClick={handleOpenDraft} className={styles.buttonUploadItem} variant={'outline'}>
          {currentLanguageArray.modals.openDraft}
        </Button>
      </div>
    </div>
  )
}
