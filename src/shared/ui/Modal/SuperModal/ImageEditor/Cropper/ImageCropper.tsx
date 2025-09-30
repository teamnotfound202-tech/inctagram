import React, { useState, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Image from 'next/image'

type Props = {
  imageToCrop: string
  onImageCropped: (croppedImageFile: File, croppedImageUrl: string) => void // ✅ Теперь возвращаем File и URL
  scale: number
  originalFile?: File //  Добавляем оригинальный файл для замены
}

type CropConfig = Crop & {
  aspect?: number
}

export const ImageCropper = ({ imageToCrop, onImageCropped, scale, originalFile }: Props) => {
  const [cropConfig, setCropConfig] = useState<CropConfig>({
    unit: '%',
    width: 60,
    height: 60,

    x: 0,
    y: 0,
    aspect: 16 / 9,
  })

  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  //  Функция для преобразования Blob в File
  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    })
  }

  //  Функция для получения обрезанного изображения как File
  const getCroppedImageAsFile = useCallback(
    (
      sourceImage: HTMLImageElement,
      cropConfig: PixelCrop,
      fileName: string
    ): Promise<{ file: File; url: string }> => {
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
            reject(new Error('Canvas is empty'))
            return
          }

          //  Создаем File из Blob
          const file = blobToFile(blob, fileName)
          const url = URL.createObjectURL(blob)

          resolve({ file, url })
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
          //  Получаем и File и URL
          const { file, url } = await getCroppedImageAsFile(imageRef, crop, 'croppedImage.jpeg')

          //  Передаем оба значения в callback
          onImageCropped(file, url)
        } catch (error) {
          console.log('Error cropping image:', error)
        }
      }
    },
    [imageRef, getCroppedImageAsFile, onImageCropped]
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
      <Image
        width={492}
        height={500}
        src={imageToCrop}
        onLoad={e => handleImageLoaded(e.currentTarget)}
        crossOrigin="anonymous"
        alt="Image to crop"
        style={{
          width: '492px',
          height: '500px',
          transform: `scale(${scale})`,
        }}
      />
    </ReactCrop>
  )
}

ImageCropper.defaultProps = {
  onImageCropped: () => {},
}
