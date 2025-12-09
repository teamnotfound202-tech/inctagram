import { useCallback } from 'react'

export const useImageHandler = (
  setImages: React.Dispatch<React.SetStateAction<string[]>>,
  divRef: React.RefObject<HTMLDivElement | null>
) => {
  const handleImageFile = useCallback((file: File) => {
    if (!file.type.match('image.*')) {
      alert('Пожалуйста, выберите изображение')
      return false
    }

    // Проверяем размер
    if (file.size > 5 * 1024 * 1024) {
      alert('Изображение слишком большое. Максимальный размер: 5MB')
      return false
    }

    const reader = new FileReader()

    reader.onload = e => {
      const imageUrl = e.target?.result as string
      setImages(prev => [...prev, imageUrl])

      // Фокусируемся на текстовом поле
      if (divRef?.current) {
        divRef?.current.focus()
      }
    }

    reader.readAsDataURL(file)
    return true
  }, [setImages, divRef])

  const removeImage = useCallback((index: number, setImages: React.Dispatch<React.SetStateAction<string[]>>) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  return {
    handleImageFile,
    removeImage
  }
}