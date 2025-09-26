// components/modal.tsx
'use client'; // Так как используем хуки для навигации

import { useRouter } from 'next/navigation';
import s from "./PostModal.module.scss"

export default function PostModal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const onClose = () => {
        router.back();
    };

    return (
        <div className={s.modalWrapper}>
            <div
                className={s.modalOverlay}
                onClick={onClose} // Закрытие по клику на фон TODO: заменить на кнопку крестик
            />
            <div className={s.modalContent}>
                {children}
            </div>
        </div>
    );
}