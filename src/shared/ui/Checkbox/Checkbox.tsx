'use client';

import { Checkbox } from "radix-ui";
import {useEffect, useState} from 'react';
import s from './Checkbox.module.scss'
import CheckboxIcon from './icons/checkIcon.svg'

type Props = {
    text?: string
    id: string
    disabled?: boolean
    checked?: boolean
    onChangeAction?: (value: boolean) => void
}

export const CustomCheckbox = ({text, id, disabled, checked=false,onChangeAction}: Props) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const onChangeHandler = (value: boolean) => {
        setIsChecked(value);
        if (onChangeAction) {
            onChangeAction(value); // пробрасываем новое значение наружу
        }
    };

    return (
        <div className={s.checkboxWrapper}>
            <div className={s.checkboxInner}>
                <Checkbox.Root className={s.checkboxRoot} checked={isChecked}  onCheckedChange={onChangeHandler} id={id} disabled={disabled}>
                    <Checkbox.Indicator className={s.checkboxIndicator}>
                        <CheckboxIcon className={s.checkboxIcon}/>
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <div className={s.circle}/>
            </div>
            {text && <label className={disabled ? s.labelDisabled :s.label} htmlFor={id}>{text}</label>}
        </div>
    )
}