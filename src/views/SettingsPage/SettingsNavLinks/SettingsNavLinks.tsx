import s from './SettingsNavLinks.module.scss'
import { SettingNavLinkItem } from '@/views/SettingsPage/SettingsNavLinks/SettingNavLinkItem/SettingNavLinkItem'

const navLinkItems = [
  {
    href: 'info',
    text: 'General information',
  },
  {
    href: 'devices',
    text: 'Devices',
  },
  {
    href: 'subscriptions',
    text: 'Account Management',
  },
  {
    href: 'payments',
    text: 'My payments',
  },
]

export const SettingsNavLinks = () => {
  return (
    <nav className={s.settingsNavLinks}>
      {navLinkItems.map(navLinkItem => (
        <SettingNavLinkItem key={navLinkItem.href} href={navLinkItem.href} text={navLinkItem.text}/>
      ))}
    </nav>
  )
}