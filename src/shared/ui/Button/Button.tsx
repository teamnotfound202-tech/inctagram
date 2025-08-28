import {ComponentProps, ReactNode} from 'react';
import clsx from 'clsx';
import s from './button.module.scss';
import {ButtonVariant} from "@/shared/ui/Button/type";
import {Slot} from "@radix-ui/react-slot";

type Props = {
    asChild?: boolean;
    children: ReactNode;
    variant?: ButtonVariant;
    fullWidth?: boolean;
}  & ComponentProps<'button'>

export const Button = ({ children, variant = 'primary',fullWidth, asChild, ...props }: Props) => {
    const buttonClassName = clsx(s.button, s[variant], fullWidth && s.fullWidth);
    const Component = asChild ? Slot : 'button';
    return (
        <Component{...props} className={buttonClassName}>
            {children}
        </Component>

    );
};