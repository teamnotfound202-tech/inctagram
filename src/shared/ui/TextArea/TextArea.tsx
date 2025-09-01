'use client';

import React, {ChangeEvent, forwardRef, TextareaHTMLAttributes} from 'react';
import s from './TextArea.module.scss';

type Props = {
    title?: string;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    onValueChange?: (value: string) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
    (props, ref) => {
        const { title, disabled, error, onValueChange, className, id, onChange, ...rest } = props;

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange?.(e.target.value);
            onChange?.(e);
        };

        return (
            <div className={s.container}>
                {title && (
                    <label className={s.title} htmlFor={id}>
                        {title}
                    </label>
                )}
                <textarea
                    id={id}
                    ref={ref}
                    className={`${s.textarea} ${className} ${error ? s.error : ''}`}
                    onChange={handleChange}
                    {...rest}
                    disabled={disabled}
                />
                {error && (
                    <div className={s.errorText}>
                        {error}
                    </div>
                )}
            </div>
        );
    });

TextArea.displayName = 'TextArea';