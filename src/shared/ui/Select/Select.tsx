import React, {useState, useEffect} from 'react';
import styles from './Select.module.scss';
import SelectOptionList, {SelectOption} from "@/shared/ui/Select/SelectOptionsList";

export interface SelectBoxProps {
    // Основные пропсы
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;

    // Дополнительные настройки
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    triggerClassName?: string;
    name?: string;
    id?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({
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
                                                 id
                                             }) => {

    // Внутреннее состояние для неконтролируемого режима
    const [internalValue, setInternalValue] = useState(defaultValue);
    
    // Определяем, контролируемый ли компонент
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    // Синхронизация с внешним value при изменении
    useEffect(() => {
        if (isControlled && value !== internalValue) {
            setInternalValue(value);
        }
    }, [value, isControlled, internalValue]);

    // Определяем ошибку для обязательного поля
    const displayError = error || (required && !currentValue ? "Поле обязательно для заполнения" : undefined);

    return (
        <div className={`${styles.select} ${className}`}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
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

export default SelectBox;