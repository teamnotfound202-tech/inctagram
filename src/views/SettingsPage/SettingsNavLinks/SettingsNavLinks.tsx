import s from './SettingsNavLinks.module.scss'
import { SettingNavLinkItem } from '@/views/SettingsPage/SettingsNavLinks/SettingNavLinkItem/SettingNavLinkItem'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

export const SettingsNavLinks = () => {
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  return (
    <nav className={s.settingsNavLinks}>
      <SettingNavLinkItem href={'info'} text={currentLanguageArray.profile.generalInformation} />
      <SettingNavLinkItem href={'devices'} text={currentLanguageArray.profile.devices} />
      <SettingNavLinkItem
        href={'subscriptions'}
        text={currentLanguageArray.profile.accountManagement}
      />
      <SettingNavLinkItem
        href={'payments'}
        text={currentLanguageArray.profile.myPayments}
      />
    </nav>
  )
}