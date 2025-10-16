import {ComponentPropsWithoutRef, forwardRef} from "react";
import s from './Table.module.scss'

export const Table = forwardRef<HTMLTableElement,
    ComponentPropsWithoutRef<'table'>
>(({className, ...rest}, ref) => {
    const computedStyles = s.table + (className ? ` ${className}` : '')
    return (
        <table ref={ref} {...rest} className={computedStyles}>

        </table>
    );
});

Table.displayName = 'Table';