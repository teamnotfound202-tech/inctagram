import {ComponentPropsWithoutRef, forwardRef} from "react";
import s from './TableRow.module.scss'

export const TableRow = forwardRef<HTMLTableRowElement,
    ComponentPropsWithoutRef<'tr'>
>(({className, ...rest}, ref) => {
    const computedStyles = s.tableHead + (className ? ` ${className}` : '')
    return (
        <tr ref={ref} {...rest} className={computedStyles}>

        </tr>
    );
});

TableRow.displayName = 'TableRow';