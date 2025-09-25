import { useState, ChangeEvent, DragEvent } from 'react'

type UseFileUploadProps = {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
  allowedTypes?: string[]
}

export const useFileUpload = ({
  onUpload,
  maxFiles = 10,
  maxSizeMB = 20,
  allowedTypes = ['image/jpeg', 'image/png'],
}: UseFileUploadProps) => {
  const [dragOver, setDragOver] = useState(false)
  const validateFiles = (files: File[]): File[] => {
    return files.filter(file => {
      const isValidType = allowedTypes.includes(file.type)
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024
      if (!isValidType) {
        alert(`Only ${allowedTypes.join(', ')} files are allowed`)
        return false
      }
      if (!isValidSize) {
        alert(`File size must be less than ${maxSizeMB}MB`)
        return false
      }
      return true
    })
  }
  const validateAndUpload = (files: File[]) => {
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onUpload(validFiles)

    }
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    validateAndUpload(files)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    const files = Array.from(event.dataTransfer.files)
    validateAndUpload(files)
  }

  return {
    dragOver,
    setDragOver,
    handleFileSelect,
    handleDrop,
  }
}
