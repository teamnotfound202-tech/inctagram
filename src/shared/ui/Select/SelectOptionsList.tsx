import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './Select.module.scss';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectOptionListProps {
    options: SelectOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const SelectOptionList: React.FC<SelectOptionListProps> = ({
                                                               options,
                                                               value,
                                                               onValueChange,
                                                               placeholder = "Выберите опцию",
                                                               className = '',
                                                               disabled = false
                                                           }) => {
    return (
        <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
            <Select.Trigger
                className={`${styles.trigger} ${className}`}
                aria-label="Выбор опции"
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon className={styles.icon}>
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content 
                    className={styles.content} 
                    position="popper"
                    sideOffset={1}
                >
                    <Select.Viewport className={styles.viewport}>
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};

// Компонент для отдельного элемента списка
interface SelectItemProps {
    children: React.ReactNode;
    value: string;
    disabled?: boolean;
    className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, value, disabled, className = '', ...props }, forwardedRef) => {
        return (
            <Select.Item
                value={value}
                disabled={disabled}
                className={`${styles.item} ${className}`}
                {...props}
                ref={forwardedRef}
            >
                <Select.ItemText>{children}</Select.ItemText>
            </Select.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';

// Иконка стрелки вниз
const ChevronDownIcon: React.FC = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default SelectOptionList;