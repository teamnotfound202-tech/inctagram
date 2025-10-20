import s from './RadioItem.module.scss'
import { RadioGroup } from 'radix-ui'

type Props = {
  id: string
  text: string
}

export const RadioItem = ({ text, id}: Props) => {
  return (
    <div className={s.wrapper}>
      <RadioGroup.Item
        className={s.Item}
        value={id}
        id={id}
      >
        <RadioGroup.Indicator className={s.Indicator} />
      </RadioGroup.Item>
      <label className={s.Label} htmlFor={id}>
        {text}
      </label>
    </div>
  )
}
