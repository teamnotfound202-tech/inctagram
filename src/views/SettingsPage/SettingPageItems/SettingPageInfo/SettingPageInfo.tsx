import s from './SettingPageInfo.module.scss'
import AvatarIcon from './icons/avatarIcon.svg'
import { Button, Input, SelectBox, SimpleDatePicker, TextArea } from '@/shared/ui'
import { ChangeEvent, useRef, useState } from 'react'
import { CloseIcon } from '@/shared/ui/Alerts/CloseIcon/CloseIcon'
import Image from 'next/image'
import { useUpdateAvatarMutation, } from '@/features/publicUserApi/publicUserApi'

// Тип для предварительного просмотра аватара
interface AvatarPreview {
  file: File
  url: string
}

export const SettingPageInfo = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<AvatarPreview | null>(null)
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateAvatar] = useUpdateAvatarMutation()

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
    setAvatarPreview({ file, url: previewUrl })
  }

  // Обработчик загрузки с компьютера
  const handleSelectFromComputer = () => {
    fileInputRef.current?.click()
  }

  // Обработчик сохранения аватара
  const handleSaveAvatar = async () => {
    if (!avatarPreview) return

    try {
      const response = await updateAvatar(avatarPreview.file).unwrap()
      const uploadedUrl = response.avatars?.[0]?.url
      if (!uploadedUrl) console.error('Invalid server response')

      setAvatarPreview({ file: avatarPreview.file, url: uploadedUrl })
      setIsUploadModalOpen(false)
    } catch (error) {
      setUploadError('Failed to upload avatar. Please try again.')
    }
  }

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setIsUploadModalOpen(false)
    setAvatarPreview(null)
    setUploadError('')

    // Очистка input файла
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={s.settingPageInfo}>
      <form className={s.settingPageInfoForm}>
        <div className={s.settingPageInfoPhotoWrapper}>
          <div className={s.avatarIconWrapper}>
            {/* Показываем превью или иконку по умолчанию */}
            {avatarPreview ? (
                <Image
                  src={avatarPreview.url}
                  alt="Profile preview"
                  className={s.avatarPreview}
                  width={300}
                  height={300}
                />
            ) : (
              <AvatarIcon />
            )}
          </div>
          <Button variant={'outline'} type="button" onClick={() => setIsUploadModalOpen(true)}>
            Select Profile Photo
          </Button>
        </div>

        {/* Остальная форма */}
        <div className={s.settingPageInfoContent}>
          <Input
            className={s.settingPageInfoInput}
            type={'text'}
            id={'Username'}
            label={
              <>
                <span>Username</span>
                <span className={s.textRed}>*</span>
              </>
            }
          />
          <Input
            className={s.settingPageInfoInput}
            type={'text'}
            id={'First Name'}
            label={
              <>
                <span>First Name</span>
                <span className={s.textRed}>*</span>
              </>
            }
          />
          <Input
            className={s.settingPageInfoInput}
            type={'text'}
            id={'Last Name'}
            label={
              <>
                <span>Last Name</span>
                <span className={s.textRed}>*</span>
              </>
            }
          />
          <fieldset className={s.datePickerWrapper}>
            <SimpleDatePicker label={'Date of birth'} className={s.settingPageInfoDatePicker} />
          </fieldset>
          <fieldset className={s.countryWrapper}>
            <SelectBox
              defaultValue={'Country'}
              placeholder={'Country'}
              label={'Select your country'}
              name={'Country'}
              options={[
                { value: 'Country', label: 'Country' },
                { value: 'USA', label: 'USA' },
              ]}
            />
            <SelectBox
              defaultValue={'City'}
              placeholder={'City'}
              label={'Select your city'}
              name={'City'}
              options={[
                { value: 'City', label: 'City' },
                { value: 'New York', label: 'New York' },
              ]}
            />
          </fieldset>
          <TextArea title={'About Me'} placeholder={'text-area'} />
        </div>
      </form>
      <Button type={'submit'} variant={'primary'} className={s.settingPageInfoSubmitButton}>
        Save Changes
      </Button>

      {/* Модальное окно загрузки фото */}
      {isUploadModalOpen && (
        <div className={s.modalOverlay}>
          <div className={s.uploadModal}>
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
                {avatarPreview ? (
                  <div className={s.previewContainer}>
                    <Image
                      src={avatarPreview.url}
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
              {avatarPreview ? (
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
            />
          </div>
        </div>
      )}
    </div>
  )
}
