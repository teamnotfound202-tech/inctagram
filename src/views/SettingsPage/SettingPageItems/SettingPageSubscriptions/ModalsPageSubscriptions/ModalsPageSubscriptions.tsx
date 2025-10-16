import { Button, CustomCheckbox } from '@/shared/ui'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateSubscriptionMutation } from '@/features/payments/api/payments-api'
import { PaymantType, Subscription } from '@/features/payments/api/types'
import s from './ModalsPageSubscriptions.module.scss'

type Props = {
  handleModalClose: () => void
  data: Subscription | undefined
  paymentType: PaymantType
};

export const ModalsPageSubscriptions = ({handleModalClose, data, paymentType}: Props) => {
  const [createPaymentSubscription,{isLoading}] = useCreateSubscriptionMutation()
  const router = useRouter()

  const handleCreateSubscription = ()=> {
    if(data){
      createPaymentSubscription({typeSubscription: data.value,
        paymentType: paymentType,
        amount: data.amount,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL + '/settings?part=subscriptions' })
        .unwrap()
        .then((res)=>{
          router.push(res.url)
        })
    }
  }

  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const [isAgree, setIsAgree] = useState(false)
  return (
    <div>
        <Modal title={currentLanguageArray.settings.createPayment} onClick={handleModalClose}>
          <p className={s.modalContent}>{currentLanguageArray.settings.autoRenewalModals}</p>
          <div className={s.buttonsGroup}>
            <CustomCheckbox id={'agree'}
                            text={currentLanguageArray.modals.agree}
                            checked={isAgree}
                            onChangeAction={(checked)=>setIsAgree(checked)} />

            <Button type={'button'} disabled={!isAgree} onClick={handleCreateSubscription}>
              {isLoading ?
                currentLanguageArray.common.loading:
                currentLanguageArray.common.ok
              }
            </Button>
          </div>
        </Modal>
    </div>
  )
}