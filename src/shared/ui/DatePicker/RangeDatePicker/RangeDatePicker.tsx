"use client";

import * as React from "react";
import {useState} from "react";
import {DateRange, DayPicker, DayPickerProps} from "react-day-picker";

import {Popover} from "radix-ui";
import clsx from "clsx";
import "react-day-picker/style.css";
// Import the shared classNames utility
import s from "../DatePicker.module.scss";
import {CalendarOutline} from "@/shared/ui/DatePicker/icons/CalendarOutline";
import {CalendarOpened} from "@/shared/ui/DatePicker/icons/CalendarOpened";
import {sharedDatePickerClassNames} from "@/shared/ui/DatePicker/ClassNames";
import {formatDate, isWeekend} from "@/shared/ui/DatePicker/utils/utils";


type DatePickerRangeProps = {
    value?: DateRange;
    onDateChange?: (date: DateRange) => void;
    label?: string;
    error?: boolean
    disabled?: boolean;
} & Omit<DayPickerProps, "mode" | "selected" | "onSelect">;

export const RangeDatePicker = ({
                                    value,
                                    onDateChange,

                                    label = "Select Date Range",
                                    ...restProps
                                }: DatePickerRangeProps) => {
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(value);
    const [opened, setIsOpened] = useState(false)
    const [error,setError]=useState(false);
    const [disabled,setIsDisabled]=useState(false);
    const handleOpen = () => {
        setIsOpened(prev => !prev);
    }
    const handleSelect = (range: DateRange | undefined) => {
        if (range) {
            setSelectedRange(range);
            onDateChange?.(range);
        }
    };

    const renderRange = () => {
        const now = new Date();
        if (selectedRange?.from && selectedRange.to) {
            return `${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`;
        }
        if (selectedRange?.from) {
            return formatDate(selectedRange.from);
        }
        return `${formatDate(new Date())} - ${formatDate(new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)))}`;
    };

    return (
        <div>
            <div className={s.text}>{label}</div>
            <Popover.Root onOpenChange={handleOpen}>
                <Popover.Trigger asChild>
                    <div tabIndex={0} className={clsx(s.datePicker, { [s.error]: error },{ [s.disabled]: disabled })}>
                        <div>{renderRange()}</div>
                        {!opened ? <CalendarOutline/> : <CalendarOpened/>}
                    </div>
                </Popover.Trigger>
                {error && (
                    <div className={s.errorMessage}>Error, select current month or last month</div>
                )}
                <Popover.Content>
                    <div className={s.wrapperCalendar}>
                        <DayPicker
                            mode="range"
                            selected={selectedRange}
                            onSelect={handleSelect}
                            ISOWeek
                            required
                            showOutsideDays
                            modifiers={{weekend: isWeekend}}
                            modifiersClassNames={{weekend: 'rdp-day_weekend'}}
                            classNames={sharedDatePickerClassNames}
                            {...restProps}
                        />
                    </div>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
};