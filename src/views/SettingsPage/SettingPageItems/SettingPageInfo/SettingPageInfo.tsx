import s from './SettingPageInfo.module.scss'
import AvatarIcon from './icons/avatarIcon.svg'
import { Button, Input, SelectBox, SimpleDatePicker, TextArea } from '@/shared/ui'
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

export const SettingPageInfo = () => {
  const {data:userData} = useFetchMyProfileQuery()
  const [updateUserInfo] = useUpdateMyProfileMutation()
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
  return (
    <div className={s.settingPageInfo}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.settingPageInfoForm}>

        <div className={s.formWrapper}>
          <div className={s.settingPageInfoPhotoWrapper}>
            <div className={s.avatarIconWrapper}>
              <AvatarIcon />
            </div>
            <Button variant={'outline'}>Select Profile Photo</Button>
          </div>
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
    </div>
  )
}
