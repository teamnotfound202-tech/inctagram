'use client';

import { SettingsNavLinks } from '@/views/SettingsPage/SettingsNavLinks/SettingsNavLinks'
import s from './SettingsPage.module.scss'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { SettingPageInfo } from '@/views/SettingsPage/SettingPageItems/SettingPageInfo/SettingPageInfo'
import { SettingPageDevices } from '@/views/SettingsPage/SettingPageItems/SettingPageDevices/SettingPageDevices'
import {
  SettingPageSubscriptions
} from '@/views/SettingsPage/SettingPageItems/SettingPageSubscriptions/SettingPageSubscriptions'
import { SettingPagePayments } from '@/views/SettingsPage/SettingPageItems/SettingPagePayments/SettingPagePayments'
export const SettingsPage = () => {
  const searchParams = useSearchParams()
  const path = useMemo(() => searchParams.get('part'), [searchParams])
  const router = useRouter()

  useEffect(() => {
    router.replace('?part=info')
  },[router])

  return (
    <div className={s.settingsPage}>
      <SettingsNavLinks />
      {path === 'info' && <SettingPageInfo />}
      {path === 'devices' && <SettingPageDevices />}
      {path === 'subscriptions' && <SettingPageSubscriptions />}
      {path === 'payments' && <SettingPagePayments/>}
    </div>
  )
}