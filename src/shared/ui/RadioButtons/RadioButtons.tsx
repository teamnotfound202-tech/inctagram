import { RadioGroup } from 'radix-ui'
import s from './RadioButtons.module.scss'

 type Values = {
    defaultValue: string
    changesValue: (value: string) => void
    children: React.ReactNode
 }

export const RadioButtons = ({ children, defaultValue, changesValue }: Values) => {
  return (
    <>
      <RadioGroup.Root
        key={defaultValue}
        className={s.Root}
        defaultValue={defaultValue}
        aria-label="View density"
        onValueChange={changesValue}
      >
        {children}
      </RadioGroup.Root>
    </>
  )
}
