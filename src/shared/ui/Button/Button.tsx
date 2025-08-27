import { ReactNode } from 'react';
import clsx from 'clsx';
import s from './button.module.scss';

type Props = {
    children: ReactNode;
    variant?: string;
    isDisabled?: boolean;
    onClick?: () => void;
    fullWidth?: boolean;
};

export const Button = ({ children, variant, isDisabled, onClick, fullWidth }: Props) => {
    const buttonClassName = clsx(
        s.defaultBtn,
        {
            [s.grayBtn]: variant === 'grayBtn',
            [s.transparentBtn]: variant === 'transparentBtn',
            [s.linkBtn]: variant === 'linkBtn',
            [s.fullWidth]: fullWidth,
        },
    );

    return (
        <button
            className={buttonClassName}
            disabled={isDisabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};