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
  'aria-invalid'?: boolean
  fullWidth?: boolean
  type?: 'default' | 'lang'
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
      })}
    >
      <button
        type="button"
        className={clsx(styles.trigger, className, {
          [styles.fullWidth]: fullWidth,
          [styles.selectLang]: type === 'lang',
          [styles.disabled]: disabled,
        })}
        id={id}
        aria-labelledby={ariaLabelledBy}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
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