// 'use client'
// import React from 'react'
// import * as Select from '@radix-ui/react-select'
// import styles from './Select.module.scss'
// import ChevronDownIconUpDown from './icon/ChevronDownIconUpDown.svg'
// import clsx from 'clsx'
//
// export type SelectOption = {
//   value: string
//   label: string
//   disabled?: boolean
//   icon?: React.ReactNode
// }
//
// export type SelectOptionListProps = {
//   options: SelectOption[]
//   value?: string
//   onValueChange?: (value: string) => void
//   placeholder?: string
//   className?: string
//   disabled?: boolean
//   id?: string
//   'aria-labelledby'?: string
//
//   fullWidth?: boolean
//
//   type: 'default' | 'lang'
// }
//
// const SelectOptionList: React.FC<SelectOptionListProps> = ({
//   options,
//   value,
//   onValueChange,
//   placeholder = 'Выберите опцию',
//   className = '',
//   disabled = false,
//   id,
//   'aria-labelledby': ariaLabelledBy,
//
//   fullWidth = true,
//   type = 'default',
// }) => {
//   return (
//     <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
//       <Select.Trigger
//         className={clsx(styles.trigger, className, {
//           [styles.fullWidth]: fullWidth,
//           [styles.selectLang]: type === 'lang',
//         })}
//         id={id}
//         aria-labelledby={ariaLabelledBy}
//       >
//         <Select.Value placeholder={placeholder} />
//         <Select.Icon className={styles.icon}>
//           <ChevronDownIconUpDown />
//         </Select.Icon>
//       </Select.Trigger>
//
//       <Select.Portal>
//         <Select.Content className={styles.content} position="popper">
//           <Select.Viewport className={styles.viewport}>
//             {options.map(option => (
//               <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
//                 {option.icon}
//                 {option.label}
//               </SelectItem>
//             ))}
//           </Select.Viewport>
//         </Select.Content>
//       </Select.Portal>
//     </Select.Root>
//   )
// }
//
// // Компонент для отдельного элемента списка
// export type SelectItemProps = {
//   children: React.ReactNode
//   value: string
//   disabled?: boolean
//   className?: string
// }
//
// const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
//   ({ children, value, disabled, className = '', ...props }, forwardedRef) => {
//     return (
//       <Select.Item
//         value={value}
//         disabled={disabled}
//         className={clsx(styles.item, className)}
//         {...props}
//         ref={forwardedRef}
//       >
//         <Select.ItemText>
//           <div className={styles.itemContent}>{children}</div>
//         </Select.ItemText>
//       </Select.Item>
//     )
//   }
// )
//
// SelectItem.displayName = 'SelectItem'
//
// export default SelectOptionList
'use client'

import React, { useState, useCallback } from 'react'
import styles from './Select.module.scss'
import clsx from 'clsx'
import SelectOptionList, { SelectOption } from '@/shared/ui/Select/Select'

export type SelectBoxProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  triggerClassName?: string
  name: string
  id?: string
  type?: 'default' | 'lang'
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
                                                      type = 'default',
                                                    }) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [value, onValueChange]
  )

  const selectId = id || name

  const displayError =
    error || (required && !currentValue ? 'Поле обязательно для заполнения' : undefined)

  const triggerId = selectId ? `${selectId}-trigger` : undefined
  const labelId = selectId ? `${selectId}-label` : undefined

  return (
    <div className={clsx(styles.selectWrapper, className, { [styles.fullWidth]: fullWidth })}>
      {label && (
        <label className={styles.label} id={labelId} htmlFor={triggerId}>
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

      {displayError && <div className={styles.errorMessage}>{displayError}</div>}

      {/* Скрытое поле для форм */}
      {name && <input type="hidden" name={name} value={currentValue} disabled={disabled} />}
    </div>
  )
}