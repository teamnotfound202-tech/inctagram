'use client';

import {useRouter} from 'next/navigation';
import s from "./PostModal.module.scss"
import Close from "./Icons/Close.svg"
import {useEffect} from "react";

interface PostModalProps {
    children: React.ReactNode;
    isEditing?: boolean;
    isDeleteModalOpen?: boolean;
    onCloseRedirectUrl?: string
}


export default function PostModal({children, isEditing, isDeleteModalOpen, onCloseRedirectUrl}: PostModalProps) {
    const router = useRouter();

    const onClose = () => {
        if (!isEditing && !isDeleteModalOpen) {
            if (onCloseRedirectUrl) {
                router.push(onCloseRedirectUrl)
            } else {
                router.back()
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className={s.modalWrapper}>
            <div
                className={s.modalOverlay}
                onClick={onClose} // Закрытие по клику на фон
            />
            <div className={s.modalContent}>
                {children}
                {!isEditing && !isDeleteModalOpen && <button className={s.closeButton} onClick={onClose}>
                    <Close/>
                </button>}
            </div>

        </div>
    );
}