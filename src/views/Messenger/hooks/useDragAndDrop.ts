import { useState, useEffect, useRef, useCallback } from 'react'

export const useDragAndDrop = (
  onDrop: (file: File) => void,
  enabled: boolean = true
) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const relatedTarget = e.relatedTarget as Node
    if (!wrapperRef.current?.contains(relatedTarget)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      onDrop(file)
    }
  }, [onDrop])

  useEffect(() => {
    if (!enabled) return

    const wrapper = wrapperRef.current
    if (!wrapper) return

    wrapper.addEventListener('dragover', handleDragOver)
    wrapper.addEventListener('dragleave', handleDragLeave)
    wrapper.addEventListener('drop', handleDrop)

    return () => {
      wrapper.removeEventListener('dragover', handleDragOver)
      wrapper.removeEventListener('dragleave', handleDragLeave)
      wrapper.removeEventListener('drop', handleDrop)
    }
  }, [enabled, handleDragOver, handleDragLeave, handleDrop])

  // React обработчики для лучшего UX
  const handleWrapperDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleWrapperDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const relatedTarget = e.relatedTarget as Node
    if (!wrapperRef.current?.contains(relatedTarget)) {
      setIsDragOver(false)
    }
  }, [])

  const handleWrapperDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      onDrop(file)
    }
  }, [onDrop])

  return {
    isDragOver,
    wrapperRef,
    handleWrapperDragOver,
    handleWrapperDragLeave,
    handleWrapperDrop
  }
}