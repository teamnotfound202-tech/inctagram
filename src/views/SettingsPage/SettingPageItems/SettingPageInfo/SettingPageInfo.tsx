import s from './SettingPageInfo.module.scss'
import AvatarIcon from './icons/avatarIcon.svg'
import { Button, Input, SelectBox, SimpleDatePicker, TextArea } from '@/shared/ui'


export const SettingPageInfo = () => {
  return (
    <div className={s.settingPageInfo}>
      <form className={s.settingPageInfoForm}>
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
      <Button type={'submit'} variant={'primary'} className={s.settingPageInfoSubmitButton}>Save Changes</Button>
    </div>
  )
}
