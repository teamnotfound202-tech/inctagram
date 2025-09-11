import s from './TotalRegisteredUsers.module.scss'

type Props = {
    totalCount: number
}
export const TotalRegisteredUsers = ({totalCount = 0}: Props) => {
    const formatted = String(totalCount).padStart(6, '0')
    const digits = formatted.split('')
    return (
        <div className={s.container}>
            <h2 className={s.title}>Registered users:</h2>
            <div className={s.numbersContainer}>
                {digits.map((digit, i) => (
                    <div key={i} className={s.digit}>
                        {digit}
                    </div>
                ))}
            </div>
        </div>
    )
}