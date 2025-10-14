import s from './SettingPageSubscriptions.module.scss'
import { Button, Card, RadioButtons } from '@/shared/ui'
import { useMemo, useState } from 'react'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { RadioItem } from '@/shared/ui/RadioButtons/RadioItem/RadioItem'
import { ModalsPageSubscriptions } from '@/views/SettingsPage/SettingPageItems/SettingPageSubscriptions/ModalsPageSubscriptions'
import StripeIcon from './icons/stripeIcon.svg'

export type SubscriptionType = {
  id: string
  text: string
  value: 'MONTHLY' |'DAY'| 'WEEKLY'
  amount: number
}

export type SubscriptionsType = SubscriptionType[]

export const subscriptions: SubscriptionsType = [
  {
    id: '1',
    text: '$10 per 1 Day',
    value: 'DAY',
    amount: 10,
  },
  {
    id: '2',
    text: '$50 per 7 Day',
    value: 'WEEKLY',
    amount: 50,
  },
  {
    id: '3',
    text: '$100 per month',
    value: 'MONTHLY',
    amount: 100,
  },
]

export const SettingPageSubscriptions = () => {
  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  const [accountValue, setAccountValue] = useState(currentLanguageArray.settings.personal)
  const [subscriptionsId, setSubscriptionsId] = useState('1')

  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [modalType, setModalType] = useState('')

  const handleModalClose = () => {
    setIsModalOpen(false)
  }
  const handleButtonClick = () => {
    // setModalType('payment')
    setIsModalOpen(true)
  }
  const handleChangeAccountType = (value: string) => {
    setSubscriptionsId('1')
    setAccountValue(value)
  }
  const handleChangeSubscriptionsType = (value: string) => {
    setSubscriptionsId(value)
  }
  const selectedSubscriptions = useMemo(
    () => subscriptions.find(item => item.id === subscriptionsId),
    [subscriptionsId]
  )

  return (
    <div className={s.settingPageSubscriptions}>
      <div className={s.accountType}>
        <h2 className={s.title}>{currentLanguageArray.settings.accountType}</h2>
        <Card>
          <RadioButtons defaultValue={'1'} changesValue={handleChangeAccountType}>
            <RadioItem text={currentLanguageArray.settings.personal} id={'1'} />
            <RadioItem text={currentLanguageArray.settings.business} id={'2'} />
          </RadioButtons>
        </Card>
      </div>

      {accountValue === '2' && (
        <>
          <div className={s.subscriptionsType}>
            <h2 className={s.title}>{currentLanguageArray.settings.subscriptionCosts}</h2>
            <Card>
              <RadioButtons defaultValue={'1'} changesValue={handleChangeSubscriptionsType}>
                <RadioItem text={currentLanguageArray.settings.dayli} id={'1'} />
                <RadioItem text={currentLanguageArray.settings.weekly} id={'2'} />
                <RadioItem text={currentLanguageArray.settings.monthly} id={'3'} />
              </RadioButtons>
            </Card>
          </div>

          <div className={s.buttonWrapper}>
            <Button variant={'secondary'} className={s.stripeButton} onClick={handleButtonClick}>
              <StripeIcon />
            </Button>
          </div>
        </>
      )}

      {isModalOpen && (
        <ModalsPageSubscriptions
          handleModalClose={handleModalClose}
          data={selectedSubscriptions}
        />
      )}
    </div>
  )
}
