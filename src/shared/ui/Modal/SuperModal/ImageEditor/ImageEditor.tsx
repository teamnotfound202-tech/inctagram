import { useEffect, useState } from 'react'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import styles from './ImageEditor.module.scss'
import BackArrow from '../../icons/backArrow.svg'
import ForwardArrow from '../../icons/forwardArrow.svg'
import ImageControls from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageControls/ImageControls'
import { ImageRatio } from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageScale/ImageRatio'

type ImageEditorProps = {
  images: File[]
  selectedImage: number
  onSelectImage: (index: number) => void
  onCropComplete?: (croppedImage: File, index: number) => void
}
export type TypeOfControls = 'ratio'|'zoom'|'multiple'|null
export const ImageEditor = ({
  images,
  selectedImage,
  onSelectImage,

}: ImageEditorProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [openState,setOpenState] = useState<TypeOfControls>(null)

  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  // Создание URL для превью изображений
  useEffect(() => {
    const urls: string[] = []

    images.forEach(image => {
      const url = URL.createObjectURL(image)
      urls.push(url)
    })

    setImageUrls(urls)

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [images])

  // Навигация по слайдеру
   const handleNextImage = () => {
    if (selectedImage < images.length - 1) {
      onSelectImage(selectedImage + 1)
    }
  }

   const handlePrevImage = () => {
    if (selectedImage > 0) {
      onSelectImage(selectedImage - 1)
    }
  }
  if (images.length === 0) {
    return <div>No images to edit</div>
  }
  const openControlsHandler = (type:TypeOfControls)=>{
    setOpenState(openState === type ? null : type)
  }
  return (
    <div className={styles.imageEditor}>
      {/* Основная область редактирования */}
      <div className={styles.editorArea}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrls[selectedImage]}
            alt={`Editing ${selectedImage + 1} of ${images.length}`}
            className={styles.editableImage}
          />
        </div>

        {/* Элементы управления слайдером */}

        {images.length > 1 && (
          <div className={styles.sliderControls}>
            <button
              onClick={handlePrevImage}
              disabled={selectedImage === 0}
              className={`${styles.sliderButton} ${styles.backArrow}`}
            >
              <BackArrow/>
            </button>
            <div className={styles.sliderDots}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === selectedImage ? styles.active : ''}`}
                  onClick={() => {
                    onSelectImage(index)

                  }}
                />
              ))}
            </div>
            <button
              onClick={handleNextImage}
              disabled={selectedImage === images.length - 1}
              className={`${styles.sliderButton} ${styles.forwardArrow}`}
            >
              <ForwardArrow/>
            </button>

          </div>

        )}
        <ImageControls onClickHandler={openControlsHandler}/>
        {openState==='ratio' && <ImageRatio/>}
      </div>
    </div>
  )
}
