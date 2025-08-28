'use client';

import { Checkbox } from "radix-ui";
import {useEffect, useState} from 'react';
import s from './Checkbox.module.scss'
import {CheckboxIcon} from './CheckboxIcon/CheckboxIcon'

type Props = {
    text?: string
    id: string
    disabled?: boolean
    checked?: boolean
}

export const CustomCheckbox = ({text, id, disabled, checked=false}: Props) => {
    const [isChecked, setIsChecked] = useState(checked)

    useEffect(() => {
        setIsChecked(checked)
    }, [checked]);

    return (
        <div className={s.checkboxWrapper}>
            <div className={s.checkboxInner}>
                <Checkbox.Root className={s.checkboxRoot} defaultChecked={isChecked} id={id} disabled={disabled}>
                    <Checkbox.Indicator className={s.checkboxIndicator}>
                        <CheckboxIcon/>
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <div className={s.circle}/>
            </div>
            {text && <label className={disabled ? s.labelDisabled :s.label} htmlFor={id}>{text}</label>}
        </div>
    )
}