import React, {useState, useEffect} from 'react';
import styles from './Select.module.scss';
import SelectOptionList, {SelectOption} from "@/shared/ui/Select/SelectOptionsList";

export interface SelectBoxProps {
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
    name?: string;
    id?: string;
    
    // Настройки размеров
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
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
                                                 width,
                                                 minWidth,
                                                 maxWidth
                                             }) => {

    const [internalValue, setInternalValue] = useState(defaultValue);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };


    useEffect(() => {
        if (isControlled && value !== internalValue) {
            setInternalValue(value);
        }
    }, [value, isControlled, internalValue]);

    const displayError = error || (required && !currentValue ? "Поле обязательно для заполнения" : undefined);

    // стили для ширины
    const selectStyles: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    };

    return (
        <div className={`${styles.select} ${className}`} style={selectStyles}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
            )}

            <SelectOptionList
                options={options}
                value={currentValue}
                onValueChange={handleValueChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${triggerClassName} ${displayError ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
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

