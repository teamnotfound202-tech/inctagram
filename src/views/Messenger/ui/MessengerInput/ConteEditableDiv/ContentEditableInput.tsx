'use client'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import s from './Content.module.scss'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { MessageSendingType } from '@/views/Messenger/ui/MessengerInput/MessengerInput'
import PlusIcon from '../../../../../shared/ui/Modal/icons/plus-circle.svg'
import Image from 'next/image'
import CrossIcon from '../../../icons/CrossIcon.svg'
import { useContentEditable } from '@/views/Messenger/hooks/useContentEditable'
import { useImageHandler } from '@/views/Messenger/hooks/useImageHandler'
import { useDragAndDrop } from '@/views/Messenger/hooks/useDragAndDrop'

export type ContentEditableInputRef = {
  triggerAddImage: () => void
  getContent: () => { text: string; images: string[] }
  clearContent: () => void
}
type Props = {
  setSendingType: (type: MessageSendingType) => void
}

export const ContentEditableInput = forwardRef<ContentEditableInputRef, Props>(
  ({ setSendingType }, ref) => {
    const messages = useAppSelector(selectCurrentMessages)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Используем кастомные хуки
    const {
      text,
      images,
      setImages,
      divRef,
      handleInput,
      handlePaste,
      insertTextModern,
      clearContent,
      getContent
    } = useContentEditable(setSendingType)

    const {
      handleImageFile,
      removeImage: baseRemoveImage
    } = useImageHandler(setImages, divRef)

    const {
      isDragOver,
      wrapperRef,
      handleWrapperDragOver,
      handleWrapperDragLeave,
      handleWrapperDrop
    } = useDragAndDrop(handleImageFile)

    // Обработчик вставки
    const handlePasteWithImages = useCallback((e: React.ClipboardEvent) => {
      const result = handlePaste(e)
      if (result.type === 'IMAGE') {
        handleImageFile(result.file)
      } else if (result.text.trim().length > 0) {
        insertTextModern(result.text)
      }
    }, [handlePaste, handleImageFile, insertTextModern])

    // Обработчик выбора файла
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      handleImageFile(files[0])
      e.target.value = ''
    }, [handleImageFile])

    // Удаление изображения
    const removeImage = useCallback((index: number) => {
      baseRemoveImage(index, setImages)
    }, [baseRemoveImage, setImages])

    // Expose методы через ref
    useImperativeHandle(ref, () => ({
      triggerAddImage: () => {
        fileInputRef.current?.click()
      },
      getContent,
      clearContent
    }))

    return (
      <div
        ref={wrapperRef}
        className={`${s.contentEditableWrapper} ${isDragOver ? s.dragOver : ''}`}
        onDragOver={handleWrapperDragOver}
        onDragLeave={handleWrapperDragLeave}
        onDrop={handleWrapperDrop}
      >
        {/* Кнопка для добавления ПЕРВОЙ картинки */}
        {images.length === 0 && (
          <div className={s.initialAddButton}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className={s.addFirstImageButton}
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
        )}

        {/* Превью изображений */}
        {images.length > 0 && (
          <div className={s.imagesPreview}>
            <div className={s.imagesContainer}>
              <div className={s.imagesList}>
                {images.map((imageUrl, index) => (
                  <div key={index} className={s.imagePreviewItem}>
                    <Image
                      src={imageUrl}
                      width={38}
                      height={38}
                      alt={`Preview ${index + 1}`}
                      className={s.imagePreview}
                    />
                    <button
                      type="button"
                      className={s.removeImageButton}
                      onClick={() => removeImage(index)}
                      aria-label="Удалить изображение"
                    >
                      <CrossIcon />
                    </button>
                  </div>
                ))}

                {/* Кнопка добавления дополнительных картинок */}
                <div className={s.addMoreButtonWrapper}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className={s.addMoreButton}
                    onClick={() => fileInputRef.current?.click()}
                    title="Добавить ещё фото"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Текстовое поле */}
        <div
          ref={divRef}
          className={s.contentEditable}
          contentEditable
          onInput={handleInput}
          onPaste={handlePasteWithImages}
          suppressContentEditableWarning={true}
          data-placeholder={messages.messenger.typeMessage}
        />
      </div>
    )
  }
)

ContentEditableInput.displayName = 'ContentEditableInput'