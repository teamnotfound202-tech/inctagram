import { Button, CustomCheckbox } from '@/shared/ui'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { useState } from 'react'
import {
  SubscriptionType
} from '@/views/SettingsPage/SettingPageItems/SettingPageSubscriptions/SettingPageSubscriptions'
import { useCreateSubscriptionMutation } from '@/features/publicUserApi/publicUserApi'
import { useRouter } from 'next/navigation'

type Props = {
  handleModalClose: () => void
  data: SubscriptionType | undefined
};

export const ModalsPageSubscriptions = ({handleModalClose, data}: Props) => {
  const [createPaymentSubscription] = useCreateSubscriptionMutation()
  const router = useRouter()

  const handleCreateSubscription = ()=> {
    if(data){
      createPaymentSubscription({typeSubscription: data.value,
        paymentType: 'STRIPE',
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
      <Modal title={'Create payment'} onClick={handleModalClose}>
        <p>{currentLanguageArray.settings.autoRenewalModals}</p>
        <CustomCheckbox id={'agree'}
                        text={currentLanguageArray.modals.agree}
                        checked={isAgree}
                        onChangeAction={(checked)=>setIsAgree(checked)} />
        <Button type={'button'} disabled={!isAgree} onClick={handleCreateSubscription}>OK</Button>
      </Modal>
    </div>
  )
}