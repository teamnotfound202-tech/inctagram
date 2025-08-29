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


export type DatePickerSingleProps = {
    value?: Date;
    onDateChange?: (date: Date) => void;
    label?: string;
} & Omit<DayPickerProps, "mode" | "selected" | "onSelect">;

export const SimpleDatePicker = ({
                                     value,
                                     onDateChange,
                                     label = "Select Date",
                                     ...restProps
                                 }: DatePickerSingleProps) => {
    const [opened,setIsOpened]=useState(false)
    const handleSelect = (date: Date | undefined) => {
        console.log(date)
        if (date) {
            onDateChange?.(date);
        }
    };

    const formatDate = (date: Date) => {
        if (!date) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };
const handleOpen = () => {
    setIsOpened(prev=>!prev);
}
    const isWeekend = (date:Date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0 = воскресенье, 6 = суббота
    };
    return (
        <div>
            <div className={s.text}>{label}</div>
            <Popover.Root onOpenChange={handleOpen}>
                <Popover.Trigger asChild >
                    <div className={clsx(s.datePicker)}>
                        <div>{value ? value.toLocaleDateString() : formatDate(new Date())}</div>
                        {!opened ? <CalendarOutline/> :<CalendarOpened /> }
                    </div>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content>
                        <div className={s.wrapperCalendar}>
                            <DayPicker
                                mode="single"
                                selected={value}
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