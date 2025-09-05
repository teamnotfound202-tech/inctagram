import s from './RadioItem.module.scss';
import {RadioGroup} from 'radix-ui';

type Props = {
    id: string,
    text: string,
    defaultValue: string
    disabled: boolean
}

export const RadioItem = ({text, id, defaultValue, disabled}: Props) => {
    return (
        <div className={s.wrapper}>
            <RadioGroup.Item className={s.Item} value={id === defaultValue ? 'default' : 'comfortable'} id={id} disabled={disabled}>
                <RadioGroup.Indicator className={s.Indicator} />
            </RadioGroup.Item>
            <label className={s.Label} htmlFor={id}>
                {text}
            </label>
        </div>
    )
}