import {ComponentProps, ReactNode} from 'react';
import clsx from 'clsx';
import s from './Button.module.scss';
import {ButtonVariant} from "@/shared/ui/Button/type";
import {Slot} from "@radix-ui/react-slot";

type Props = {
    asChild?: boolean;
    children: ReactNode;
    variant?: ButtonVariant;
    fullWidth?: boolean;
    className?: string
}  & ComponentProps<'button'>

export const Button = ({ children, variant = 'primary',fullWidth, asChild, className,  ...props }: Props) => {
    const buttonClassName = clsx(s.button, s[variant], fullWidth && s.fullWidth, className && className);
    const Component = asChild ? Slot : 'button';
    return (
        <Component {...props} className={buttonClassName}>
            {children}
        </Component>

    );
};