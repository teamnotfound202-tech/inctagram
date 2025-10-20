'use client'

import React, { useState, useCallback, useEffect } from 'react'
import styles from './Select.module.scss'
import clsx from 'clsx'
import { SelectOption, SelectOptionList } from '@/shared/ui/Select/SelectOptionsList'
import { LANGUAGE } from '@/shared/lib/constants/constants'
import { Language } from '@/shared/lib/locale/message'

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
                                                      name,
                                                      id,
                                                      fullWidth = true,
                                                      type = 'default',
                                                    }) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue
  useEffect(() => {
    const languageItem = localStorage.getItem(LANGUAGE)
    const language = (JSON.parse(languageItem  as Language)) || 'en';
    const optionsValue = language === 'ru' ? 'option1' : 'option2'
    setInternalValue(optionsValue)
  }, [])
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
  const displayError = error || (required && !currentValue ? 'Поле обязательно для заполнения' : undefined)
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
        aria-invalid={!!displayError}
        value={currentValue}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        type={type}
      />

      {displayError && <div className={styles.errorMessage}>{displayError}</div>}

      {/* Скрытое поле для форм */}
      {name && <input type="hidden" name={name} value={currentValue ? currentValue : ''} disabled={disabled} onChange={() => {}} />}
    </div>
  )
}