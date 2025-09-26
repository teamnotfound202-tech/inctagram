import React, { useState, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

type Props = {
  imageToCrop: string
  onImageCropped: (croppedImage: string) => void
  scale: number
}

// Используем тип Crop из библиотеки и расширяем его если нужно
type CropConfig = Crop & {
  aspect?: number
}

export const ImageCropper = ({ imageToCrop, onImageCropped, scale }: Props) => {
  // Инициализируем с правильными свойствами
  const [cropConfig, setCropConfig] = useState<CropConfig>({
    unit: '%',
    width: 30,
    height: 30,
    x: 0,
    y: 0,
    aspect: 16 / 9,
  })

  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  // Функция для получения обрезанного изображения
  const getCroppedImage = useCallback(
    (sourceImage: HTMLImageElement, cropConfig: PixelCrop, fileName: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const scaleX = sourceImage.naturalWidth / sourceImage.width
        const scaleY = sourceImage.naturalHeight / sourceImage.height

        canvas.width = cropConfig.width
        canvas.height = cropConfig.height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(
          sourceImage,
          cropConfig.x * scaleX,
          cropConfig.y * scaleY,
          cropConfig.width * scaleX,
          cropConfig.height * scaleY,
          0,
          0,
          cropConfig.width,
          cropConfig.height
        )

        canvas.toBlob(blob => {
          if (!blob) {
            reject('Canvas is empty')
            return
          }

          const croppedImageUrl = URL.createObjectURL(blob)
          resolve(croppedImageUrl)
        }, 'image/jpeg')
      })
    },
    []
  )

  // Функция для обработки кадрирования
  const cropImage = useCallback(
    async (crop: PixelCrop) => {
      if (imageRef && crop.width && crop.height) {
        try {
          const croppedImage = await getCroppedImage(imageRef, crop, 'croppedImage.jpeg')
          onImageCropped(croppedImage)
        } catch (error) {
          console.error('Error cropping image:', error)
        }
      }
    },
    [imageRef, getCroppedImage, onImageCropped]
  )

  // Обработчики событий
  const handleImageLoaded = useCallback((image: HTMLImageElement) => {
    setImageRef(image)
  }, [])

  const handleCropComplete = useCallback(
    (crop: PixelCrop) => {
      cropImage(crop)
    },
    [cropImage]
  )

  const handleCropChange = useCallback((crop: Crop) => {
    setCropConfig(prev => ({ ...prev, ...crop }))
  }, [])

  return (
    <ReactCrop
      crop={cropConfig}
      onChange={handleCropChange}
      onComplete={handleCropComplete}
      aspect={cropConfig.aspect}
    >
      <img
        src={imageToCrop}
        onLoad={e => handleImageLoaded(e.currentTarget)}
        crossOrigin="anonymous"
        alt="Image to crop"
        style={{
          width:'492px',
          height:'100%',
          transform: `scale(${scale})`,
        }}
      />
    </ReactCrop>
  )
}

ImageCropper.defaultProps = {
  onImageCropped: () => {},
}
