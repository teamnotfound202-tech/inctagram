import { Tooltip } from "radix-ui";

import styles from "./Tooltip.module.scss";
import {ReactNode} from "react";
type Props = {
    children:ReactNode
    title:string|null
}

export const ToolTip = ({children,title}:Props) => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className={styles.Content} sideOffset={5}>
                        <span>Помните!</span>
                        <span>{title}</span>
                        <Tooltip.Arrow className={styles.Arrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default ToolTip;