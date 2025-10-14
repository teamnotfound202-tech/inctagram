import {ComponentPropsWithoutRef, forwardRef} from "react";
import s from './TableH.module.scss'

export const TableH = forwardRef<HTMLTableHeaderCellElement,
    ComponentPropsWithoutRef<'th'>
>(({className, ...rest}, ref) => {
    const computedStyles = s.tableH + (className ? ` ${className}` : '')
    return (
        <th ref={ref} {...rest} className={computedStyles}>

        </th>
    );
});

TableH.displayName = 'TableH';