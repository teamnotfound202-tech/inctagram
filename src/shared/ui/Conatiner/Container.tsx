import type {ReactNode} from 'react';
import s from './Container.module.scss'

export const Container = ({children}: {children: ReactNode}) => {
    return (
        <div className={s.container}>
            {children}
        </div>
    )
}