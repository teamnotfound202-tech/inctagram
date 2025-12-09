import { useState, useCallback, useRef, useEffect } from 'react'
import { MessageSendingType } from '@/views/Messenger/ui/MessengerInput/MessengerInput'

export const useContentEditable = (setSendingType: (type: MessageSendingType) => void) => {
  const [text, setText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const divRef = useRef<HTMLDivElement>(null)

  // Обновляем sendingType при изменении контента
  useEffect(() => {
    const hasTextContent = text.trim().length > 0
    const hasImagesContent = images.length > 0
    const hasContent = hasTextContent || hasImagesContent
    setSendingType(hasContent ? 'message' : 'none')
  }, [text, images, setSendingType])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const rawText = e.currentTarget.textContent || ''
    const cleanText = rawText.replace(/\s/g, '')

    if (cleanText.length > 0) {
      setText(rawText.trim())
    } else {
      setText('')
    }
  }, [])

  const insertTextModern = useCallback((textToInsert: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    range.deleteContents()

    const textNode = document.createTextNode(textToInsert)
    range.insertNode(textNode)

    range.setStartAfter(textNode)
    range.collapse(true)

    selection.removeAllRanges()
    selection.addRange(range)
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()

    const items = e.clipboardData.items

    // Ищем изображения
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('IMAGE') !== -1) {
        const file = item.getAsFile()
        if (file) {
          return { type: 'IMAGE', file } as const
        }
      }
    }

    // Если нет изображений, возвращаем текст
    const text = e.clipboardData.getData('text/plain')
    return { type: 'TEXT', text } as const
  }, [])

  const clearContent = useCallback(() => {
    setText('')
    setImages([])
    if (divRef.current) {
      divRef.current.textContent = ''
    }
  }, [])

  const getContent = useCallback(() => ({
    text,
    images
  }), [text, images])

  return {
    text,
    images,
    setText,
    setImages,
    divRef,
    handleInput,
    handlePaste,
    insertTextModern,
    clearContent,
    getContent
  }
}