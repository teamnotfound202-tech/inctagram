import { useState } from 'react'
import styles from './ImageEditor.module.scss'
import BackArrow from '../../icons/backArrow.svg'
import ForwardArrow from '../../icons/forwardArrow.svg'
import ImageControls from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageControls/ImageControls'
import { ImageRatio } from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageScale/ImageRatio'
import { MultipleImage } from '@/shared/ui/Modal/SuperModal/ImageEditor/MultipleImage/MultipleImage'
import { Image } from '@/shared/lib/sсhemas/posts'
import { ModalSkeleton } from '@/shared/ui/Modal/SuperModal/Skeleton/Skeleton'
import { ZoomCrop } from '@/shared/ui/Modal/SuperModal/ImageEditor/Cropper/ZoomCrop'

import { Crop } from 'react-image-crop'
import { ImageCropper } from '@/shared/ui/Modal/SuperModal/ImageEditor/Cropper/ImageCropper'

type ImageEditorProps = {
  images: Image[]
  selectedImage: number
  isLoading: boolean
  onSelectImage: (index: number) => void
  onUpload: (files: File[]) => void
  deletePost: (id: string, inex: number) => void
}
export type TypeOfControls = 'ratio' | 'zoom' | 'multiple' | null
export const ImageEditor = ({
  images,
  selectedImage,
  onSelectImage,
  isLoading,
  onUpload,
  deletePost,
}: ImageEditorProps) => {
  const [openState, setOpenState] = useState<TypeOfControls>(null)
  const [crop, setCrop] = useState<Crop>()
  const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined)
  const [scale, setScale] = useState(1)

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
  const openControlsHandler = (type: TypeOfControls) => {
    setOpenState(openState === type ? null : type)
  }

  // Показываем скелетон во время загрузки
  if (isLoading) {
    return <ModalSkeleton />
  }

  // Проверяем наличие изображений
  if (!images || images.length === 0) {
    return <div>No images to edit</div>
  }

  // Проверяем существование текущего изображения
  const currentImage = images[selectedImage]
  if (!currentImage) {
    return <div>Selected image not found</div>
  }
  const handleChangeScale = (value: number) => {
    setScale(value)
  }
  return (
    <div className={styles.imageEditor}>
      {/* Основная область редактирования */}
      <div className={styles.editorArea}>
        <div className={styles.imageContainer}>
          {openState === 'zoom' ? (
             /* <img
                style={{
                  transform: `scale(${scale})`,
                }}
                src={currentImage.url}
                alt={`Editing ${selectedImage + 1} of ${images.length}`}
                className={styles.editableImage}
              />*/
            <ImageCropper
              scale={scale}
              imageToCrop={currentImage.url}
              onImageCropped={croppedImage => setCroppedImage(croppedImage)}
            />
          ) : (
            <img
              src={currentImage.url}
              alt={`Editing ${selectedImage + 1} of ${images.length}`}
              className={styles.editableImage}
            />
          )}
        </div>

        {/* Элементы управления слайдером */}
        {images.length > 1 && (
          <div className={styles.sliderControls}>
            <button
              onClick={handlePrevImage}
              disabled={selectedImage === 0}
              className={`${styles.sliderButton} ${styles.backArrow}`}
            >
              <BackArrow />
            </button>
            <div className={styles.sliderDots}>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === selectedImage ? styles.active : ''}`}
                  onClick={() => onSelectImage(index)}
                />
              ))}
            </div>
            <button
              onClick={handleNextImage}
              disabled={selectedImage === images.length - 1}
              className={`${styles.sliderButton} ${styles.forwardArrow}`}
            >
              <ForwardArrow />
            </button>
          </div>
        )}

        <ImageControls openState={openState} onClickHandler={openControlsHandler} />

        {openState === 'ratio' && <ImageRatio />}
        {openState === 'multiple' && (
          <MultipleImage
            addNewFiles={onUpload}
            deletePost={deletePost}
            selectedImage={selectedImage}
            images={images}
          />
        )}
        {openState === 'zoom' && <ZoomCrop handleChangeScale={handleChangeScale} />}
      </div>
    </div>
  )
}
