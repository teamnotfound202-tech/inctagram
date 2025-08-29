import { DayPicker, DayPickerProps } from "react-day-picker";
import { Popover } from "radix-ui";
import clsx from "clsx";
import "react-day-picker/style.css";

import s from "../DatePicker.module.scss";
import {CalendarOutline} from "@/shared/ui/DatePicker/icons/CalendarOutline";
import {sharedDatePickerClassNames} from "@/shared/ui/DatePicker/ClassNames";


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
    const handleSelect = (date: Date | undefined) => {
        if (date) {
            onDateChange?.(date);
        }
    };

    return (
        <div>
            <div className={s.text}>{label}</div>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <div className={clsx(s.datePicker)}>
                        <div>{value ? value.toLocaleDateString() : "Select date"}</div>
                        <CalendarOutline />
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