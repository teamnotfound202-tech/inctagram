'use client';

import {useRouter} from 'next/navigation';
import s from "./PostModal.module.scss"
import Close from "./Icons/Close.svg"

export default function PostModal({children}: { children: React.ReactNode }) {
    const router = useRouter();

    const onClose = () => {
        router.back();
    };

    return (
        <div className={s.modalWrapper}>
            <div
                className={s.modalOverlay}
                onClick={onClose} // Закрытие по клику на фон
            />
            <div className={s.modalContent}>
                {children}
                <button className={s.closeButton} onClick={onClose}>
                    <Close/>
                </button>
            </div>
        </div>
    );
}