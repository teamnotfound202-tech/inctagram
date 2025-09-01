import {RadioItem} from '@/shared/ui/RadioButtons/RadioItem/RadioItem';
import { RadioGroup } from 'radix-ui'
import s from './RadioButtons.module.scss'

const values = [
    {
        id: 'r1',
        text: 'RadioGroup1',
        disabled: true
    },
    {
        id: 'r2',
        text: 'RadioGroup2',
        disabled: false
    },
]

export type RadioType = {
    id: string
    text: string
    disabled: boolean
}

export const RadioButtons = () => {
    return (
        <>
            <RadioGroup.Root
                className={s.Root}
                defaultValue="default"
                aria-label="View density"
            >
                {
                    values.map(value => (
                        <RadioItem
                            key={value.id}
                            text={value.text}
                            id={value.id}
                            defaultValue={'r1'}
                            disabled={value.disabled}
                        />
                    ))
                }
            </RadioGroup.Root>
        </>
    )
}