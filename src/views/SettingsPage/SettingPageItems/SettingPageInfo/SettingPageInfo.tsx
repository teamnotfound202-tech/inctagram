import s from './SettingPageInfo.module.scss'
import AvatarIcon from './icons/avatarIcon.svg'
import { Button, Input, SelectBox, SimpleDatePicker, TextArea } from '@/shared/ui'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { Control } from '@radix-ui/react-form'

type GeneralInformaitionFormValues = {
  username: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  country: string
  city: string
  aboutMe: string
}

export const SettingPageInfo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
    reset,
  } = useForm<GeneralInformaitionFormValues>({
    mode: 'all',
  })

  const onSubmit: SubmitHandler<GeneralInformaitionFormValues> = data => {
    // const values = {
    //   Username: data.username,
    //   email: data.email,
    //   password: data.password,
    // };
    console.log(data)
  }
  return (
    <div className={s.settingPageInfo}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.settingPageInfoForm}>
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
            {...register('username', {
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
                        render={({field})=>(
                            <SimpleDatePicker value={field.value}
                                              onDateChange={(d: Date | string ) => field.onChange(d)}
                                              label={'Date of birth'}
                                              className={s.settingPageInfoDatePicker} />
                          )}/>
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
        <Button type={'submit'} variant={'primary'} className={s.settingPageInfoSubmitButton}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
