import s from './SettingPageSubscriptions.module.scss'
import { Button, Card, CustomCheckbox, RadioButtons } from '@/shared/ui'
import { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { RadioItem } from '@/shared/ui/RadioButtons/RadioItem/RadioItem'
import { ModalsPageSubscriptions } from '@/views/SettingsPage/SettingPageItems/SettingPageSubscriptions/ModalsPageSubscriptions/ModalsPageSubscriptions'
import StripeIcon from './icons/stripeIcon.svg'
import PayPalIcon from './icons/paypalIcon.svg'
import {
  CurrentSubscriptionsResponse,
  PaymantType,
  SubscriptionsType,
} from '@/features/payments/api/types'
import {
  useCancelAutoRenewalMutation,
  useFetchCurrentSubscriptionQuery,
  useRenewAutoRenewalMutation,
} from '@/features/payments/api/payments-api'
import { dateNextPayment, formatDateFromServer } from '@/shared/api/utils'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useRouter, useSearchParams } from 'next/navigation'

const subscriptions: SubscriptionsType = [
  {
    id: '3',
    text: '$10 per 1 Day',
    value: 'DAY',
    amount: 10,
  },
  {
    id: '4',
    text: '$50 per 7 Day',
    value: 'WEEKLY',
    amount: 50,
  },
  {
    id: '5',
    text: '$100 per month',
    value: 'MONTHLY',
    amount: 100,
  },
]

export const SettingPageSubscriptions = () => {
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const {data, isLoading} = useFetchCurrentSubscriptionQuery()
  const [cancelAutoRenewal] = useCancelAutoRenewalMutation()
  const [renewAutoRenewal] = useRenewAutoRenewalMutation()

  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const router = useRouter()

  const [accountId, setAccountId] = useState('1')
  const [subscriptionsId, setSubscriptionsId] = useState('3')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentType, setPaymentType] = useState<PaymantType>('STRIPE')

  const handleModalClose = () => {
    setIsModalOpen(false)
    router.replace(process.env.NEXT_PUBLIC_BASE_URL + '/settings?part=subscriptions')
  }
  const handleStripeButtonClick = () => {
    setPaymentType('STRIPE')
    setIsModalOpen(true)
  }
  const handlePayPalButtonClick = () => {
    setPaymentType('PAYPAL')
    setIsModalOpen(true)
  }
  const handleChangeAccountType = (value: string) => {
    setSubscriptionsId('3')
    setAccountId(value)
  }
  const handleChangeSubscriptionsType = (value: string) => {
    setSubscriptionsId(value)
  }
  const selectedSubscriptions = useMemo(
    () => subscriptions.find(item => item.id === subscriptionsId),
    [subscriptionsId]
  )

  const dateExpireAt = (data:CurrentSubscriptionsResponse) => {
    return formatDateFromServer(data?.data[data.data.length-1].endDateOfSubscription)
  }
  const dateNextPayments = (data:CurrentSubscriptionsResponse) => {
    return dateNextPayment(data?.data[data.data.length-1].endDateOfSubscription)
  }
const handlerChangeAutoRenewal = (data:CurrentSubscriptionsResponse) => {
    if(data.hasAutoRenewal){
      cancelAutoRenewal()
    } else {
      renewAutoRenewal()
    }
}
useEffect(() => {
  console.log(!isLoading)
  console.log(data)
  if (!isLoading && data && data.data.length > 0 ){
    setAccountId('2')
  }
},[isLoading, data])
  return (
    <div className={s.settingPageSubscriptions}>
      {data && data.data?.length > 0 && (
        <div className={s.currentSubscription}>
          <h2 className={s.title}>{currentLanguageArray.settings.currentSubscription}</h2>
          <Card>
            <div className={s.currentSubscriptionInfo}>
              <div className={s.infoGroup}>
                <span className={s.infoTitle}>{currentLanguageArray.settings.expireAt}</span>
                <span className={s.infoDate}>{dateExpireAt(data)}</span>
              </div>
              <div className={s.infoGroup}>
                <span className={s.infoTitle}>{currentLanguageArray.settings.nextPayment}</span>
                <span className={s.infoDate}>{dateNextPayments(data)}</span>
              </div>
            </div>
          </Card>
          <CustomCheckbox
            id={'autoRenewal'}
            className={s.checkBoxReneval}
            text={currentLanguageArray.settings.autoReneval}
            checked={data.hasAutoRenewal}
            onChangeAction={() => handlerChangeAutoRenewal(data)}
          />
        </div>
      )}

      {!isLoading && (
        <div className={s.accountType}>
          <h2 className={s.title}>{currentLanguageArray.settings.accountType}</h2>
          <Card>
            <RadioButtons defaultValue={accountId} changesValue={handleChangeAccountType}>
              <RadioItem text={currentLanguageArray.settings.personal} id={'1'} />
              <RadioItem text={currentLanguageArray.settings.business} id={'2'} />
            </RadioButtons>
          </Card>
        </div>
      )}

      {accountId === '2' && (
        <>
          <div className={s.subscriptionsType}>
            <h2 className={s.title}>{currentLanguageArray.settings.subscriptionCosts}</h2>
            <Card>
              <RadioButtons defaultValue={'3'} changesValue={handleChangeSubscriptionsType}>
                <RadioItem text={currentLanguageArray.settings.dayli} id={'3'} />
                <RadioItem text={currentLanguageArray.settings.weekly} id={'4'} />
                <RadioItem text={currentLanguageArray.settings.monthly} id={'5'} />
              </RadioButtons>
            </Card>
          </div>

          <div className={s.buttonWrapper}>
            <Button
              variant={'secondary'}
              className={s.stripeButton}
              onClick={handlePayPalButtonClick}
            >
              <PayPalIcon />
            </Button>

            <Button
              variant={'secondary'}
              className={s.stripeButton}
              onClick={handleStripeButtonClick}
            >
              <StripeIcon />
            </Button>
          </div>
        </>
      )}

      {isModalOpen && (
        <ModalsPageSubscriptions
          handleModalClose={handleModalClose}
          data={selectedSubscriptions}
          paymentType={paymentType}
        />
      )}
      {success === 'true' && (
        <Modal title={currentLanguageArray.common.success} onClick={handleModalClose}>
          <p className={s.modalContent}>{currentLanguageArray.settings.succesfullPaymentMessage}</p>
          <div className={s.buttonsModal}>
            <Button type={'button'} onClick={handleModalClose}>
              ОК
            </Button>
          </div>
        </Modal>
      )}
      {success === 'false' && (
        <Modal title={currentLanguageArray.common.error} onClick={handleModalClose}>
          <p className={s.modalContent}>{currentLanguageArray.settings.errorMessageSubsriptions}</p>
          <div className={s.buttonsModal}>
            <Button type={'button'} fullWidth onClick={handleModalClose} className={s.buttonModal}>
              {currentLanguageArray.settings.backToPayment}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
