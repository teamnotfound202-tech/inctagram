'use client';

import React from 'react';
import * as Toast from '@radix-ui/react-toast'; //для всплывающих подсказок
import s from './Alerts.module.scss';
import {CloseIcon} from "@/shared/ui/Alerts/CloseIcon/CloseIcon";

export type AlertVariant = 'success' | 'error';

type AlertsProviderProps = {
    children: React.ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';//где появится сообщение на экране
};

export function AlertsProvider({children, position = 'top-right'}: AlertsProviderProps) {
    const viewportClass = `${s.viewport} ${s[position.replace('-', '')]}`//к классу viewport добавляет класс с позицией

    return (
        <Toast.Provider>
            <Toast.Viewport className={viewportClass}/>
            {children}
        </Toast.Provider>
    );
}

type AlertToastProps = {
    title?: string;
    description?: string;
    variant?: AlertVariant;
    duration?: number;            // через сколько мс скрыть автоматически (0 — не скрывать)
    open?: boolean; //показать всплывающее сообщение или нет
    onOpenChange?: (open: boolean) => void; //при нажатии на крестик
    closable?: boolean;           // показать кнопку закрытия или нет
    className?: string;
};

export function AlertToast({title, description, variant = 'success', duration = 4000, open,
                               onOpenChange, closable = true, className,}: AlertToastProps) {

    const alertClass = `${s.root} ${s[variant]} ${className ? className : ''}`;// к классу root добавляем класс варианта сообщения и если есть тот класс, что пропсами передали

    return (
        <Toast.Root className={alertClass} duration={duration} open={open} onOpenChange={onOpenChange}>
            <div className={s.content}>
                {title && <Toast.Title className={s.title}>{title}</Toast.Title>}
                {description && (<Toast.Description className={s.desc}>{description}</Toast.Description>)}
            </div>

            {closable && (//если есть крестик для закрытия, то показать его
                <Toast.Close className={s.close} aria-label="Close">
                    <CloseIcon/>
                </Toast.Close>
            )}
        </Toast.Root>
    );
}







