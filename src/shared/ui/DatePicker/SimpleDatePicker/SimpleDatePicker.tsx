'use client'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { Popover } from 'radix-ui'
import clsx from 'clsx'
import 'react-day-picker/style.css'

import s from '../DatePicker.module.scss'
import { CalendarOutline } from '@/shared/ui/DatePicker/icons/CalendarOutline'
import { sharedDatePickerClassNames } from '@/shared/ui/DatePicker/ClassNames'
import { useState } from 'react'
import { CalendarOpened } from '@/shared/ui/DatePicker/icons/CalendarOpened'
import { formatDate, isWeekend } from '@/shared/ui/DatePicker/utils/utils'
import { CustomMonthDropdown } from '@/shared/ui/DatePicker/CustomCaption/CustomCaption'

export type DatePickerSingleProps = {
  value?: Date
  onDateChange?: (date: Date) => void
  label?: string
  error?: boolean
  disabled?: boolean
} & Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect'>

export const SimpleDatePicker = ({
  value,
  onDateChange,

  label = 'Select Date',
  ...restProps
}: DatePickerSingleProps) => {
  const [opened, setIsOpened] = useState(false)
  const [error, setError] = useState(false)
  const [dateValue, setDateValue] = useState<Date>(new Date())
  const [yearChangerIsOpened, setYearChangerIsOpened] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date())
  const [disabled, setIsDisabled] = useState(false)
  const handleOpen = () => {
    setIsOpened(prev => !prev)
    setYearChangerIsOpened(prev => !prev)
    if (dateValue) {
      setCurrentMonth(dateValue)

    }
  }
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDateValue(date)
      setCurrentMonth(date)
    }

  }
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth)
  }
  return (
    <div>
      <div className={s.text}>{label}</div>
      <Popover.Root onOpenChange={handleOpen}>
        <Popover.Trigger asChild>
          <div
            tabIndex={0}
            className={clsx(s.datePicker, { [s.error]: error }, { [s.disabled]: disabled })}
          >
            <div> {dateValue ? formatDate(dateValue) : formatDate(new Date())}</div>
            {!opened ? <CalendarOutline /> : <CalendarOpened />}
          </div>
        </Popover.Trigger>
        {error && <div className={s.errorMessage}>Error</div>}
        <Popover.Portal>
          <Popover.Content>
            <div className={s.wrapperCalendar}>
              {/*{yearChangerIsOpened && (
                <CustomMonthDropdown date={currentMonth} onChange={handleMonthChange} />
              )}*/}
              <DayPicker
                mode="single"
                selected={dateValue}
                captionLayout="dropdown"
                onSelect={handleSelect}
               /* month={currentMonth} // ✅ Контролируем отображаемый месяц
                onMonthChange={setCurrentMonth}*/ // ✅ Обновляем при ручной навигации
                ISOWeek
                showOutsideDays
                modifiers={{ weekend: isWeekend }}
                modifiersClassNames={{ weekend: 'rdp-day_weekend' }}
                classNames={sharedDatePickerClassNames}
                {...restProps}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
