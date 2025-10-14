import {ComponentPropsWithoutRef, forwardRef} from "react";
import s from './TableDataCell.module.scss'

export const TableDataCell = forwardRef<HTMLTableDataCellElement,
    ComponentPropsWithoutRef<'td'>
>(({className, ...rest}, ref) => {
    const computedStyles = s.tableDataSell + (className ? ` ${className}` : '')
    return (
        <td ref={ref} {...rest} className={computedStyles}>

        </td>
    );
});

TableDataCell.displayName = 'TableDataCell';