import s from "./Cards.module.scss";
import React, { ComponentPropsWithRef } from "react";
import { clsx } from "clsx";

export type Props = React.PropsWithChildren & ComponentPropsWithRef<"div">;

export const Card= ({ children, className, ...rest }:Props) => {
    return (
        <div className={clsx(s.card, className)} {...rest}>
            {children}
        </div>
    );
};