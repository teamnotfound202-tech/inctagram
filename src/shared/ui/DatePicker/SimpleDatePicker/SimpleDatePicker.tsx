'use client'
import { DayPicker, DayPickerProps } from "react-day-picker";
import { Popover } from "radix-ui";
import clsx from "clsx";
import "react-day-picker/style.css";

import s from "../DatePicker.module.scss";
import {CalendarOutline} from "@/shared/ui/DatePicker/icons/CalendarOutline";
import {sharedDatePickerClassNames} from "@/shared/ui/DatePicker/ClassNames";
import {useState} from "react";
import {CalendarOpened} from "@/shared/ui/DatePicker/icons/CalendarOpened";
import {formatDate, isWeekend} from "@/shared/ui/DatePicker/utils/utils";


export type DatePickerSingleProps = {
    value?: Date;
    onDateChange?: (date: Date) => void;
    label?: string;
    error?:boolean
} & Omit<DayPickerProps, "mode" | "selected" | "onSelect">;

export const SimpleDatePicker = ({
                                     value,
                                     onDateChange,

                                     label = "Select Date",
                                     ...restProps
                                 }: DatePickerSingleProps) => {
    const [opened,setIsOpened]=useState(false)
    const [error,setError]=useState(false);
    const [disabled,setIsDisabled]=useState(true);
    const handleOpen = () => {
        setIsOpened(prev=>!prev);
    }
    const handleSelect = (date: Date | undefined) => {

        if (date) {
            onDateChange?.(date);
        }
    };
    return (
        <div>
            <div className={s.text}>{label}</div>
            <Popover.Root  onOpenChange={handleOpen}>
                <Popover.Trigger asChild >
                    <div className={clsx(s.datePicker, { [s.error]: error },{ [s.disabled]: disabled })}>
                        <div>{value ? formatDate(value) : formatDate(new Date())}</div>
                        {!opened ? <CalendarOutline/> :<CalendarOpened /> }
                    </div>
                </Popover.Trigger>
                {error && (
                    <div className={s.errorMessage}>Error</div>
                )}
                <Popover.Portal>
                    <Popover.Content>
                        <div className={s.wrapperCalendar}>
                            <DayPicker
                                mode="single"
                                selected={new Date()}
                                onSelect={handleSelect}
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
    );
};