/*
'use client';

import {useRouter} from 'next/navigation';
import s from "./PostModal.module.scss"
import Close from "./Icons/Close.svg"

export default function PostModal({ children }: { children: React.ReactNode }) {
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
}*/


/*import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';*/

interface PostModalProps {
    children: React.ReactNode;
}

export const PostModal = ({ children }: PostModalProps) => {
  /*  const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('postId');
    const [isMounted, setIsMounted] = useState(false);

    // Ждем монтирования на клиенте
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onClose = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('postId');

        const newUrl = `?${newSearchParams.toString()}`;
        router.replace(newUrl, { scroll: false });
    };

    // Закрытие по ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Блокировка скролла
    useEffect(() => {
        if (postId && isMounted) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [postId, isMounted]);

    // Не рендерим ничего до монтирования на клиенте
    if (!isMounted) return null;
    if (!postId) return null;*/

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="absolute inset-0"

            />
            <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
                <button

                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 text-xl w-8 h-8 flex items-center justify-center"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};