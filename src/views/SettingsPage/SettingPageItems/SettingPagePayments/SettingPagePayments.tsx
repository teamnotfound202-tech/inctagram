import s from './SettingPagePayments.module.scss'
import {PaymentTable} from "@/widgets/PaymentTable/PaymentTable";

export const SettingPagePayments = () => {
    return <div className={s.settingPagePayments}>
        <PaymentTable />
    </div>
}
