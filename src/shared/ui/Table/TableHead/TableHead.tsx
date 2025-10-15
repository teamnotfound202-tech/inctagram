import {ComponentPropsWithoutRef, forwardRef} from "react";
import s from './TableHead.module.scss'

export const TableHead = forwardRef<HTMLTableSectionElement,
    ComponentPropsWithoutRef<'thead'>
>(({className, ...rest}, ref) => {
    const computedStyles = s.tableHead + (className ? ` ${className}` : '')
    return (
        <thead ref={ref} {...rest} className={computedStyles}>

        </thead>
    );
});

TableHead.displayName = 'TableHead';