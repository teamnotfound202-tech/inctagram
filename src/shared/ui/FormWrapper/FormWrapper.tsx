import type {ReactNode} from 'react';
import s from './FormWrapper.module.scss'

export const FormWrapper = ({children}: {children: ReactNode}) => {
    return (
        <div className={s.formWrapper}>
            {children}
        </div>
    )
}