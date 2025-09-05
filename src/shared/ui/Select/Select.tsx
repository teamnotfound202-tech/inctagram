'use client';
import React, {useState, useCallback} from 'react';
import styles from './Select.module.scss';
import SelectOptionList, {SelectOption} from "@/shared/ui/Select/SelectOptionsList";
import clsx from "clsx";

export type SelectBoxProps = {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;

    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    triggerClassName?: string;
    name: string;
    id?: string;
    type?: 'default' | 'lang'
    
    // Настройки размеров
    fullWidth?: boolean
}

export const SelectBox: React.FC<SelectBoxProps> = ({
                                                 options,
                                                 value,
                                                 defaultValue = '',
                                                 onValueChange,
                                                 placeholder,
                                                 label,
                                                 error,
                                                 disabled = false,
                                                 required = false,
                                                 className = '',
                                                 triggerClassName = '',
                                                 name,
                                                 id,
                                                 fullWidth = true,
                                                 type = 'default'
                                             }) => {

    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = useCallback((newValue: string) => {
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    }, [value, onValueChange]);

    const selectId = id || name;

    const displayError = error || (required && !currentValue ? "Поле обязательно для заполнения" : undefined);

    // стили для ширины
    // const selectStyles: React.CSSProperties = {
    //     // width: typeof width === 'number' ? `${width}px` : width,
    //
    // };

    const triggerId = selectId ? `${selectId}-trigger` : undefined;
    const labelId = selectId ? `${selectId}-label` : undefined;

    return (
        <div className={clsx(
            styles.selectContainer,
            className,
            { [styles.fullWidth]: fullWidth }
        )}>
            {label && (
                <label className={styles.label}
                       id={labelId}
                       htmlFor={triggerId}>
                    {label}
                    {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
            )}

            <SelectOptionList
                options={options}
                id={triggerId}
                aria-labelledby={labelId}
                value={currentValue}
                onValueChange={handleValueChange}
                placeholder={placeholder}
                disabled={disabled}
                className={clsx(
                    triggerClassName,
                    { [styles.error]: displayError },
                    { [styles.disabled]: disabled }
                )}
                fullWidth={fullWidth}
                type={type}
            />

            {displayError && (
                <div className={styles.errorMessage}>
                    {displayError}
                </div>
            )}

            {/* Скрытое поле для форм */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={currentValue}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

