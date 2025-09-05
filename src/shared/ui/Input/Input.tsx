import React, {forwardRef} from "react";
import s from "./Input.module.scss";
import { TextField } from "@radix-ui/themes";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import clsx from "clsx";
import {EyePasswordIcon} from "@/shared/ui/Input/iconsComponents/EyePasswordIcon";
import {SearchIcon} from "@/shared/ui/Input/iconsComponents/SearchIcon";
import { Label } from "@radix-ui/react-label";

type InputProps = {
    placeholder?: string;
    type: "email" | "password" | "search" | "text" ;
    id?: string;
    label?: string;
    error?: string;
    isDisabled?: boolean;

    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    name?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, type, id, label, error, isDisabled, value, onChange, onBlur, name }, ref) => {

        const classNameInput = clsx(s.Input, { [s.inputError]: error });
        const classNameLabel = clsx(s.inputLabel, isDisabled && s.labelDisabled)

        if (type === "password") {
            return (
                <PasswordToggleField.Root>
                    <div className={s.Root}>
                        {label && <Label htmlFor={id} className={classNameLabel}> {label} </Label>}
                        <PasswordToggleField.Input
                            id={id}
                            placeholder={placeholder}
                            className={classNameInput}
                            disabled={isDisabled}

                            ref={ref}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            name={name}
                        />
                        <PasswordToggleField.Toggle className={s.Toggle} disabled={isDisabled}>
                            <PasswordToggleField.Icon visible={<EyePasswordIcon />} hidden={<EyePasswordIcon />} />
                        </PasswordToggleField.Toggle>
                        {error && <span className={s.inputErrorText}>{error}</span>}
                    </div>
                </PasswordToggleField.Root>
            );
        }

        return (
            <div className={s.Root}>
                {label && <Label htmlFor={id} className={classNameLabel}>{label}</Label>}
                <TextField.Root
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={classNameInput}
                    disabled={isDisabled}

                    ref={ref}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                >
                    {type === "search" && <SearchIcon/>}
                </TextField.Root>
                {error && <span className={s.inputErrorText}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";