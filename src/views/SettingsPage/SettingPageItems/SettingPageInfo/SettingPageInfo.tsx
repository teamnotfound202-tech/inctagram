import s from './SettingPageInfo.module.scss'
import AvatarIcon from './icons/avatarIcon.svg'
import { Button, Input, SelectBox, SimpleDatePicker, TextArea } from '@/shared/ui'
import { ChangeEvent, useRef, useState } from 'react'
import { CloseIcon } from '@/shared/ui/Alerts/CloseIcon/CloseIcon'
import Image from 'next/image'
import { useUpdateAvatarMutation, } from '@/features/publicUserApi/publicUserApi'

import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import {
  useFetchMyProfileQuery,
  useUpdateMyProfileMutation,
} from '@/features/publicUserApi/publicUserApi'
import {useEffect } from 'react'
import { GeneralInformaitionValues } from '@/shared/api/types'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { validateAtLeast13 } from '@/shared/lib/utils/isAtLeastYear'

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

  const {data:userData} = useFetchMyProfileQuery()
  const [updateUserInfo] = useUpdateMyProfileMutation()
  const [updateAvatar] = useUpdateAvatarMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
    reset,
  } = useForm<GeneralInformaitionValues>({
    mode: 'all',
  })

  useEffect(() => {
      if(userData){
      reset({
        userName: userData?.userName,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        dateOfBirth: userData?.dateOfBirth,
        country: userData?.country,
        city: userData?.city,
        aboutMe: userData?.aboutMe
      })
    }
  }, [userData, reset])
  const onSubmit: SubmitHandler<GeneralInformaitionValues> = data => {
    updateUserInfo(data)
      .unwrap()
      .then(() => {
      toast.custom(() => (
        <AlertToast variant='success' title={`Success`} description={'Your settings are saved!'} />
      ))
    }).catch(()=>{
      toast.custom(() => (
        <AlertToast variant='error' title={`Error!`} description={'Server is not available!'} />
      ))
    })
  }

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
      <form onSubmit={handleSubmit(onSubmit)} className={s.settingPageInfoForm}>

        <div className={s.formWrapper}>
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
              {...register('userName', {
                required: 'Enter your username',
                minLength: { value: 6, message: 'Minimum number of characters 6' },
                maxLength: { value: 30, message: 'Maximum number of characters 30' },
                pattern: {
                  value: /^[A-Za-z0-9_-]+$/,
                  message: 'You can only use letters, numbers, _ and -',
                },
              })}
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
              {...register('firstName', {
                required: 'Enter your First Name',
                minLength: { value: 1, message: 'Minimum number of characters 1' },
                maxLength: { value: 50, message: 'Maximum number of characters 50' },
                pattern: {
                  value: /^[A-Za-zА-Яа-яЁё]+$/,
                  message: 'You can only use Latin and Russian letters',
                },
              })}
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
              {...register('lastName', {
                required: 'Enter your Last Name',
                minLength: { value: 1, message: 'Minimum number of characters 1' },
                maxLength: { value: 50, message: 'Maximum number of characters 50' },
                pattern: {
                  value: /^[A-Za-zА-Яа-яЁё]+$/,
                  message: 'You can only use Latin and Russian letters',
                },
              })}
            />

            <fieldset className={s.datePickerWrapper}>

              <Controller control={control}
                          name={'dateOfBirth'}
                          rules={{
                            validate: validateAtLeast13
                          }}
                          render={({field})=>{
                            return (
                              <SimpleDatePicker value={field.value}
                                                onDateChange={(d: Date | string ) => field.onChange(d)}
                                                label={'Date of birth'}
                                                error={errors?.dateOfBirth || ''}
                                                className={s.settingPageInfoDatePicker} />
                            )
                          }}/>
            </fieldset>

            <fieldset className={s.countryWrapper}>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <SelectBox
                    defaultValue={'Country'}
                    placeholder={'Country'}
                    label={'Select your country'}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    options={[
                      { value: 'Country', label: 'Country' },
                      { value: 'USA', label: 'USA' },
                    ]}
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <SelectBox
                    defaultValue={'City'}
                    placeholder={'City'}
                    label={'Select your city'}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    options={[
                      { value: 'City', label: 'City' },
                      { value: 'New York', label: 'New York' },
                    ]}
                  />
                )}
              />
            </fieldset>
            <TextArea
              title={'About Me'}
              placeholder={''}
              {...register('aboutMe', {
                maxLength: { value: 200, message: 'Maximum number of characters 200' },
                pattern: {
                  value: /^[A-Za-zА-Яа-яЁё0-9 !"#$%&'()*+,\-./:;<=>?@\\^_{|}~]+$/,
                  message: 'You can only use Latin and Russian letters',
                },
              })}
            />
          </div>
        </div>

        <Button type={'submit'} variant={'primary'} className={s.settingPageInfoSubmitButton}>
          Save Changes
        </Button>
      </form>
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
