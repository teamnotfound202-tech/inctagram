import s from './AvatarUser.module.scss'
import Image from 'next/image'
import AvatarIcon from '@/views/SettingsPage/SettingPageItems/SettingPageInfo/AvatarUser/icons/avatarIcon.svg'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui'
import { CloseIcon } from '@/shared/ui/Alerts/CloseIcon/CloseIcon'
import {
  useDeleteAvatarMutation,
  useUpdateAvatarMutation,
} from '@/features/publicUserApi/publicUserApi'
import DeleteAvatar from './icons/deleteAvatar.svg'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { Loader } from '@/shared/ui/Loader/Loader'

type Props = {
  avatarURL: string | undefined
}

export const AvatarUser = ({ avatarURL }: Props) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [avatarPreviewURL, setAvatarPreviewURL] = useState<string | undefined>(undefined)
  const [avatarPreviewFile, setAvatarPreviewFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string>('')
  const [updateAvatar, {isLoading}] = useUpdateAvatarMutation()
  const [deleteAvatar] = useDeleteAvatarMutation()


  // Обработчик выбора файла
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError('')

    if (!file) return

    // Валидация формата
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setUploadError('Error! The format of the uploaded photo must be\n' + 'PNG and JPEG')
      return
    }

    // Валидация размера (10 МБ)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Error! Photo size must be less than 10 MB!')
      return
    }

    // Создание URL для предварительного просмотра
    const previewUrl = URL.createObjectURL(file)
    // setAvatarPreview({ file, url: previewUrl })
    setAvatarPreviewFile(file)
    setAvatarPreviewURL(previewUrl)
  }

  // Обработчик загрузки с компьютера
  const handleSelectFromComputer = () => {
    fileInputRef.current?.click()
  }

  // Обработчик сохранения аватара
  const handleSaveAvatar = () => {
    if (!avatarPreviewFile) return

    updateAvatar(avatarPreviewFile)
      .unwrap()
      .then(res => {
        const uploadedUrl = res.avatars[0].url
        if (!uploadedUrl) console.error('Invalid server response')
        setAvatarPreviewURL(uploadedUrl)
        setAvatarPreviewFile(null)
        setIsUploadModalOpen(false)
        toast.custom(() => (
          <AlertToast variant="success" title={`Success`} description={'Your avatar saved!'} />
        ))
      })
      .catch(() => {
        setUploadError('Failed to upload avatar. Please try again.')
        toast.custom(() => (
          <AlertToast variant="error" title={`Success`} description={'Your avatar not saved!'} />
        ))
      })
  }

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setIsUploadModalOpen(false)
    // setAvatarPreview(null)
    setAvatarPreviewFile(null)
    setAvatarPreviewURL(avatarURL)
    setUploadError('')

    // Очистка input файла
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteAvatar = () => {
    deleteAvatar()
      .unwrap()
      .then(() => {
        setAvatarPreviewURL(undefined)
        setAvatarPreviewFile(null)
        toast.custom(() => (
          <AlertToast
            variant="success"
            title={`Success`}
            description={'Your avatar deleted!'}
          />
        ))
      })
  }

  useEffect(() => {
    setAvatarPreviewURL(avatarURL)
  }, [avatarURL])

  return (
    <>
      <div className={s.settingPageInfoPhotoWrapper}>
        <div className={s.avatarUser}>
          {/* Показываем превью или иконку по умолчанию */}
          {avatarPreviewURL ? (
            <div className={s.avatarImgUser}>
              <Image
                src={avatarPreviewURL}
                alt="Profile preview"
                className={s.avatarPreview}
                width={300}
                height={300}
                priority
              />
              <button className={s.deleteBtn} onClick={handleDeleteAvatar}>
                <DeleteAvatar />
              </button>
            </div>
          ) : (
            <div className={s.avatarIconWrapper}>
              <AvatarIcon />
            </div>
          )}
        </div>
        <Button variant={'outline'} type="button" onClick={() => setIsUploadModalOpen(true)}>
          Select Profile Photo
        </Button>
      </div>
      {/* Модальное окно загрузки фото */}
      {isUploadModalOpen && (
        <div className={s.modalOverlay}>
          <div className={s.uploadModal}>
            {isLoading && (
              <div className={s.loaderModal}>
                <Loader />
              </div>
            )}
            {/* Заголовок с кнопкой закрытия */}
            <div className={s.modalHeader}>
              <h3 className={s.modalTitle}>Add a Profile Photo</h3>
              <Button
                className={s.closeButton}
                onClick={handleCloseModal}
                type="button"
                variant={'text'}
              >
                <CloseIcon />
              </Button>
            </div>

            {/* Сообщения об ошибках */}
            {uploadError && <div className={s.errorMessage}>{uploadError}</div>}

            {/* Область предварительного просмотра */}
            <div className={s.previewContent}>
              <div className={s.previewArea}>
                {avatarPreviewURL ? (
                  <div className={s.previewContainer}>
                    <Image
                      src={avatarPreviewURL}
                      alt="Avatar preview"
                      className={s.previewImage}
                      width={300}
                      height={300}
                    />
                  </div>
                ) : (
                  <div className={s.placeholder}>
                    <AvatarIcon className={s.placeholderIcon} />
                  </div>
                )}
              </div>
            </div>

            {/* Основная кнопка действия */}
            <div className={s.mainActionButton}>
              {avatarPreviewFile ? (
                <Button variant={'primary'} onClick={handleSaveAvatar} className={s.saveButton}>
                  Save
                </Button>
              ) : (
                <Button
                  variant={'primary'}
                  onClick={handleSelectFromComputer}
                  className={s.selectButton}
                >
                  Select from Computer
                </Button>
              )}
            </div>

            {/* Скрытый input для выбора файла */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png"
              className={s.hiddenFileInput}
              value=""
            />
          </div>
        </div>
      )}
    </>
  )
}