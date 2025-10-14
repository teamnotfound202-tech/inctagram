import s from './SettingPagePayments.module.scss'
import {PaymentTable} from "@/widgets/PaymentTable/PaymentTable";

export const SettingPagePayments = () => {
    const data = [
        {
            id:'1',
            dateOfPayment: '12.05.25',
            endDateOfSubscription: '30.05.25',
            price: 10,
            subscriptionType: 30,
            paymentType: 'Stripe' as const,
        },
        {
            id:'2',
            dateOfPayment: '12.05.25',
            endDateOfSubscription: '30.05.25',
            price: 10,
            subscriptionType: 30,
            paymentType: 'Stripe' as const,
        },
        {
            id:'3',
            dateOfPayment: '12.05.25',
            endDateOfSubscription: '30.05.25',
            price: 10,
            subscriptionType: 30,
            paymentType: 'Stripe' as const,
        },
    ]
    return <div className={s.settingPagePayments}>
        <PaymentTable data={data}/>
    </div>
}
