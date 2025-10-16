'use client'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { Popover } from 'radix-ui'
import clsx from 'clsx'
import 'react-day-picker/style.css'

import s from '../DatePicker.module.scss'
import { CalendarOutline } from '@/shared/ui/DatePicker/icons/CalendarOutline'
import { sharedDatePickerClassNames } from '@/shared/ui/DatePicker/ClassNames'
import { useEffect, useState } from 'react'
import { CalendarOpened } from '@/shared/ui/DatePicker/icons/CalendarOpened'
import { formatDate, isWeekend } from '@/shared/ui/DatePicker/utils/utils'
import { Path } from '@/shared/config'
import Link from 'next/link'
import { dateFormatterForServer, formatDateFromServer } from '@/shared/api/utils'

export type DatePickerSingleProps = {
  value?: Date | string
  onDateChange?: (date: Date | string) => void
  label?: string
  error?: string
  disabled?: boolean
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect'>

export const SimpleDatePicker = ({
  value,
  onDateChange,
  error: errorMessage,
  label = 'Select Date',
  ...restProps
}: DatePickerSingleProps) => {
  const [opened, setIsOpened] = useState<boolean | undefined>(false)
  const [error, setError] = useState<string | undefined>(errorMessage)
  const [dateValue, setDateValue] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date | string>(value || new Date())
  const [disabled, setIsDisabled] = useState(false)
  const handleOpen = (event: boolean) => {
    setIsOpened(event)
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDateValue(date)

      if (onDateChange) {
        onDateChange(dateFormatterForServer(date))
        handleOpen(false)
      }
    }
  }

  useEffect(() => {
    setError(errorMessage)
  }, [errorMessage])

  return (
    <div>
      <div className={s.text}>{label}</div>
      <Popover.Root open={opened} onOpenChange={handleOpen}>
        <Popover.Trigger asChild>
          <div
            tabIndex={0}
            className={clsx(s.datePicker, { [s.error]: error }, { [s.disabled]: disabled })}
          >
            <div> {value ? formatDateFromServer(value as string) : formatDate(new Date())}</div>
            {!opened ? <CalendarOutline /> : <CalendarOpened />}
          </div>
        </Popover.Trigger>
        {!!error && (
          <div className={s.errorMessage}>
            {error} <Link className={s.linkPolicy} href={Path.PrivatePolicy}>Privacy Policy</Link>
          </div>
        )}
        <Popover.Portal>
          <Popover.Content>
            <div className={s.wrapperCalendar}>
              {opened && (
                <DayPicker
                  mode="single"
                  selected={dateValue}
                  captionLayout="dropdown"
                  onSelect={handleSelect}
                  ISOWeek
                  showOutsideDays
                  modifiers={{ weekend: isWeekend }}
                  modifiersClassNames={{ weekend: 'rdp-day_weekend' }}
                  classNames={sharedDatePickerClassNames}
                  {...restProps}
                />
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
