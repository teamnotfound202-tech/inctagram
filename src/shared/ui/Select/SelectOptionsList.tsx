import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './Select.module.scss';
import ChevronDownIconUpDown from './icon/ChevronDownIconUpDown.svg'
import clsx from "clsx";

export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export type SelectOptionListProps ={
    options: SelectOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    'aria-labelledby'?: string;

    fullWidth?: boolean;

    type: 'default' | 'lang'
}

const SelectOptionList: React.FC<SelectOptionListProps> = ({
                                                               options,
                                                               value,
                                                               onValueChange,
                                                               placeholder = "Выберите опцию",
                                                               className = '',
                                                               disabled = false,
                                                               id,
                                                               'aria-labelledby': ariaLabelledBy,

                                                               fullWidth = true,
                                                               type = 'default'
                                                           }) => {

    return (
        <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
            <Select.Trigger
                className={clsx(
                    styles.trigger,
                    className,
                    { [styles.fullWidth]: fullWidth,
                    [styles.selectLang] : type=== 'lang'
                    },

                )}
                id={id}
                aria-labelledby={ariaLabelledBy}
            >
                <Select.Value placeholder={placeholder}/>
                <Select.Icon className={styles.icon}>
                    <ChevronDownIconUpDown/>
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
                                {option.icon}
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
export type SelectItemProps = {
    children: React.ReactNode;
    value: string;
    disabled?: boolean;
    className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({children, value, disabled, className = '', ...props}, forwardedRef) => {
        return (
            <Select.Item
                value={value}
                disabled={disabled}
                className={clsx(styles.item, className)}
                {...props}
                ref={forwardedRef}
            >
                <Select.ItemText>
                    <div className={styles.itemContent}>
                        {children}
                    </div>
                </Select.ItemText>
            </Select.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';

export default SelectOptionList;