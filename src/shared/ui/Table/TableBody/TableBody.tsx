import {ComponentPropsWithoutRef, forwardRef} from "react";
import s from './TableBody.module.scss'

export const TableBody = forwardRef<HTMLTableSectionElement,
    ComponentPropsWithoutRef<'tbody'>
>(({className, ...rest}, ref) => {
    const computedStyles = s.tableBody + (className ? ` ${className}` : '')
    return (
        <tbody ref={ref} {...rest} className={computedStyles}>

        </tbody>
    );
});

TableBody.displayName = 'TableBody';