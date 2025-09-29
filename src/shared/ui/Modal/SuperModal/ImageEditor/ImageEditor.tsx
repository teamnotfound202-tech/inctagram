import {useCallback, useRef, useState} from 'react'
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
import { ModifiedImage } from '@/shared/ui/Modal/SuperModal/ImageEditor/model/prepareImagesToStorage'

type ImageEditorProps = {
  images: Image[]
  selectedImage: number
  isLoading: boolean
  onSelectImage: (index: number) => void
  onUpload: (files: File[]) => void
  deletePost: (id: string, inex: number) => void
  onImageUpdate: (index: number, updatedImage: ModifiedImage, updatedFile?: File) => void
}
export type TypeOfControls = 'ratio' | 'zoom' | 'multiple' | null
export const ImageEditor = ({
  images,
  selectedImage,
  onSelectImage,
  isLoading,
  onUpload,
  deletePost,
    onImageUpdate
}: ImageEditorProps) => {
  const [openState, setOpenState] = useState<TypeOfControls>(null)
const [ratio, setRatio] = useState<AspectRatio>('base')
  const [temporaryCroppedImage, setTemporaryCroppedImage] = useState<string | undefined>(undefined) // ✅ Временное обрезанное изображение
  const [temporaryCroppedFile, setTemporaryCroppedFile] = useState<File | undefined>(undefined) // ✅ Временный файл
  const [scale, setScale] = useState(1)
  //const cropperRef = useRef<any>(null)
  const currentImage = images[selectedImage]

  const handleTemporaryCrop = useCallback((croppedFile: File, croppedImageUrl: string) => {
    setTemporaryCroppedImage(croppedImageUrl)
    setTemporaryCroppedFile(croppedFile)
  }, [])
  //  Функция для применения изменений
  const applyChanges = useCallback(() => {
    if (temporaryCroppedImage && temporaryCroppedFile) {
      // Создаем обновленный объект Image
      const updatedImage: Image = {
        ...currentImage,
        url: temporaryCroppedImage,
        fileSize: temporaryCroppedFile.size,
        // Можно добавить другие обновленные свойства
      }

      onImageUpdate(selectedImage, updatedImage, temporaryCroppedFile)

      setTemporaryCroppedImage(undefined)
      setTemporaryCroppedFile(undefined)
    }
  }, [temporaryCroppedImage, temporaryCroppedFile, currentImage, selectedImage, onImageUpdate])

  //  Функция для отмены изменений
  const cancelChanges = useCallback(() => {
    setTemporaryCroppedImage(undefined)
    setTemporaryCroppedFile(undefined)
  }, [])

  const handleNextImage = () => {
    if (selectedImage < images.length - 1) {
      onSelectImage(selectedImage + 1)
    }
  }
  const handleDeletePost = useCallback((id: string, index: number) => {
       cancelChanges()

    deletePost(id, index)

    if (index === selectedImage && images.length > 1) {
      const newSelectedIndex = index === 0 ? 0 : index - 1
      onSelectImage(newSelectedIndex)
    }
  }, [deletePost, selectedImage, images.length, onSelectImage, cancelChanges])
  const handlePrevImage = () => {
    if (selectedImage > 0) {
      onSelectImage(selectedImage - 1)
    }
  }
  const openControlsHandler = (type: TypeOfControls) => {
    cancelChanges()
    setOpenState(openState === type ? null : type)
  }

  const resetEditingImages=(index:number)=>{
    if (hasUnsavedChanges) {
      cancelChanges()
    }
    onSelectImage(index)
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
  if (isLoading) {
    return <ModalSkeleton />
  }
  if (!currentImage) {
    return <div>Selected image not found</div>
  }
  if (!images || images.length === 0) {
    return <div>No images to edit</div>
  }
  const displayImageUrl = temporaryCroppedImage || currentImage.url|| ''
  const hasUnsavedChanges = !!temporaryCroppedImage
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
              onImageCropped={handleTemporaryCrop}
            />
          ) : (

            <img
              src={displayImageUrl}
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
                  onClick={() => resetEditingImages(index)}
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

        <ImageControls   onApplyChanges={applyChanges}
                         onCancelChanges={cancelChanges}
                         hasUnsavedChanges={hasUnsavedChanges}
                         openState={openState}
                         onClickHandler={openControlsHandler} />

        {openState === 'ratio' && <ImageRatio onRatioChange={handleRatioChange}/>}
        {openState === 'multiple' && (
          <MultipleImage
            addNewFiles={onUpload}
            deletePost={handleDeletePost}
            selectedImage={selectedImage}
            images={images}
          />
        )}
        {openState === 'zoom' && <ZoomCrop handleChangeScale={handleChangeScale} />}
      </div>
    </div>
  )
}
