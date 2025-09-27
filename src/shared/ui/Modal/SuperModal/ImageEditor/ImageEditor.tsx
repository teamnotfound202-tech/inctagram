import { useState } from 'react'
import styles from './ImageEditor.module.scss'
import BackArrow from '../../icons/backArrow.svg'
import ForwardArrow from '../../icons/forwardArrow.svg'
import ImageControls from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageControls/ImageControls'
import { AspectRatio, ImageRatio } from '@/shared/ui/Modal/SuperModal/ImageEditor/ImageScale/ImageRatio'
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
const [ratio, setRatio] = useState<AspectRatio>('base')
  const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined)
  const [croppedImageIsSettled, setCroppedImageIsSettled] = useState<boolean>(false)
  const [scale, setScale] = useState(1)


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


  if (isLoading) {
    return <ModalSkeleton />
  }


  if (!images || images.length === 0) {
    return <div>No images to edit</div>
  }


  const currentImage = images[selectedImage]
  if (!currentImage) {
    return <div>Selected image not found</div>
  }
  const handleChangeScale = (value: number) => {
    setScale(value)
  }
  const handleRatioChange = (ratio: AspectRatio) => {
        setRatio(ratio)
  }
  const getRatioAttribute = (ratio: AspectRatio): string => {
    const ratioMap: Record<AspectRatio, string> = {
      'base': 'base',
      '1:1': '1/1',
      '4:5': '4/5',
      '16:9': '16/9'
    }
    return ratioMap[ratio] || 'base'
  }
  return (
    <div className={styles.imageEditor}>
      <div className={styles.editorArea}>
        <div
          className={styles.imageContainer}
          data-ratio={getRatioAttribute(ratio)}
        >
          {openState === 'zoom' ? (
            <ImageCropper
              scale={scale}
              imageToCrop={currentImage.url}
              onImageCropped={croppedImage => setCroppedImage(croppedImage)}
            />
          ) : (

            <img
              src={croppedImageIsSettled ? croppedImage: currentImage.url}
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

        <ImageControls setCroppedImage={()=>setCroppedImageIsSettled(true)} openState={openState} onClickHandler={openControlsHandler} />

        {openState === 'ratio' && <ImageRatio onRatioChange={handleRatioChange}/>}
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
