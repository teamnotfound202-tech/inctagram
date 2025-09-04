import s from '../CustomSelect.module.scss'
import ArrowIc from './arrowDownIcon.svg'

export const ArrowIcon = () => {
    return (
        <div className={s.iconContainer}>
            <ArrowIc/>
        </div>
    )
}