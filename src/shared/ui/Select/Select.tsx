// 'use client'
//
// import React, { useState, useCallback } from 'react'
// import styles from './Select.module.scss'
// import SelectOptionList, { SelectOption } from '@/shared/ui/Select/SelectOptionsList'
// import clsx from 'clsx'
//
// export type SelectBoxProps = {
//   options: SelectOption[]
//   value?: string
//   defaultValue?: string
//   onValueChange?: (value: string) => void
//   placeholder?: string
//
//   label?: string
//   error?: string
//   disabled?: boolean
//   required?: boolean
//   className?: string
//   triggerClassName?: string
//   name: string
//   id?: string
//   type?: 'default' | 'lang'
//
//   // Настройки размеров
//   fullWidth?: boolean
// }
//
// export const SelectBox: React.FC<SelectBoxProps> = ({
//   options,
//   value,
//   defaultValue = '',
//   onValueChange,
//   placeholder,
//   label,
//   error,
//   disabled = false,
//   required = false,
//   className = '',
//   triggerClassName = '',
//   name,
//   id,
//   fullWidth = true,
//   type = 'default',
// }) => {
//   const [internalValue, setInternalValue] = useState(defaultValue)
//   const currentValue = value !== undefined ? value : internalValue
//
//   const handleValueChange = useCallback(
//     (newValue: string) => {
//       if (value === undefined) {
//         setInternalValue(newValue)
//       }
//       onValueChange?.(newValue)
//     },
//     [value, onValueChange]
//   )
//
//   const selectId = id || name
//
//   const displayError =
//     error || (required && !currentValue ? 'Поле обязательно для заполнения' : undefined)
//
//   // стили для ширины
//   // const selectStyles: React.CSSProperties = {
//   //     // width: typeof width === 'number' ? `${width}px` : width,
//   //
//   // };
//
//   const triggerId = selectId ? `${selectId}-trigger` : undefined
//   const labelId = selectId ? `${selectId}-label` : undefined
//
//   return (
//     <div className={clsx(styles.selectContainer, className, { [styles.fullWidth]: fullWidth })}>
//       {label && (
//         <label className={styles.label} id={labelId} htmlFor={triggerId}>
//           {label}
//           {required && <span style={{ color: '#ef4444' }}>*</span>}
//         </label>
//       )}
//
//       <SelectOptionList
//         options={options}
//         id={triggerId}
//         aria-labelledby={labelId}
//         value={currentValue}
//         onValueChange={handleValueChange}
//         placeholder={placeholder}
//         disabled={disabled}
//         className={clsx(
//           triggerClassName,
//           { [styles.error]: displayError },
//           { [styles.disabled]: disabled }
//         )}
//         fullWidth={fullWidth}
//         type={type}
//       />
//
//       {displayError && <div className={styles.errorMessage}>{displayError}</div>}
//
//       {/* Скрытое поле для форм */}
//       {name && <input type="hidden" name={name} value={currentValue} disabled={disabled} />}
//     </div>
//   )
// }

'use client'

import React, { useState, useRef, useEffect} from 'react'
import styles from './Select.module.scss'
import ChevronDownIconUpDown from './icon/ChevronDownIconUpDown.svg'
import clsx from 'clsx'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

export type SelectOptionListProps = {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
  'aria-labelledby'?: string
  fullWidth?: boolean
  type: 'default' | 'lang'
}

const SelectOptionList: React.FC<SelectOptionListProps> = ({
                                                             options,
                                                             value,
                                                             onValueChange,
                                                             placeholder = 'Выберите опцию',
                                                             className = '',
                                                             disabled = false,
                                                             id,
                                                             'aria-labelledby': ariaLabelledBy,
                                                             fullWidth = true,
                                                             type = 'default',
                                                           }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  // Закрытие селекта при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionClick = (optionValue: string) => {
    if (!disabled) {
      onValueChange?.(optionValue)
      setIsOpen(false)
    }
  }

  const selectedOption = options.find(option => option.value === value)
  const displayValue = selectedOption ? (
    <div className={styles.itemContent}>
      {selectedOption.icon}
      {selectedOption.label}
    </div>
  ) : (
    <span className={styles.placeholder}>{placeholder}</span>
  )

  return (
    <div
      ref={selectRef}
      className={clsx(styles.selectContainer, {
        [styles.fullWidth]: fullWidth,
        [styles.open]: isOpen,
      })}
    >
      <button
        type="button"
        className={clsx(styles.trigger, className, {
          [styles.fullWidth]: fullWidth,
          [styles.selectLang]: type === 'lang',
          [styles.error]: false, // Можно добавить обработку ошибок
          [styles.disabled]: disabled,
        })}
        id={id}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {displayValue}
        <span className={clsx(styles.icon, { [styles.rotated]: isOpen })}>
          <ChevronDownIconUpDown />
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.viewport}>
            {options.map(option => (
              <div
                key={option.value}
                className={clsx(styles.item, {
                  [styles.selected]: option.value === value,
                  [styles.disabled]: option.disabled,
                })}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
              >
                <div className={styles.itemContent}>
                  {option.icon}
                  {option.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectOptionList