import type {ReactNode} from 'react';
import CloseBtnIcon from './icons/close.svg'
import s from './Modal.module.scss'

type Props ={
    title: string,
    children: ReactNode,
    onClick: () => void,
}

export const Modal = ({title, children, onClick}: Props) => {
    return(
        <div className={s.overlay}>
            <div className={s.modal}>
                <div className={s.modalTop}>
                    <h3 className={s.modalTitle}>{title}</h3>
                    <button className={s.modalCloseBtn} onClick={onClick}>
                        <CloseBtnIcon className={s.closeBtnIcon}/>
                    </button>
                </div>
                <div className={s.modalContent}>
                    {children}
                </div>
            </div>
        </div>
    )
}