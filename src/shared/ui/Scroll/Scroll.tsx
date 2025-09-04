'use client';

import * as React from "react";
import { ScrollArea } from "radix-ui";
import s from './Scroll.module.scss';

type Props = {
    children: React.ReactNode;                         // содержимое, которое нужно скроллить
    orientation?: 'vertical' | 'horizontal' | 'both';  // какие полосы показывать
    className?: string;                                // внешний класс
    type?: 'auto' | 'always' | 'scroll';               // режим видимости скролла (Radix)
    scrollHideDelay?: number;                          // задержка скрытия (мс), если type='auto'
};

export const ScrollBox = ({
                              children,
                              orientation = 'vertical',
                              className,
                              type = 'always',
                              scrollHideDelay = 600,
                          }: Props) => {
    const rootClass = [s.root, className].filter(Boolean).join(' ');

    return (
        <ScrollArea.Root
            className={rootClass}
            type={type}
            scrollHideDelay={scrollHideDelay}
        >
            <ScrollArea.Viewport className={s.viewport} >
                {children}
            </ScrollArea.Viewport>

            {orientation !== 'horizontal' && (
                <ScrollArea.Scrollbar className={s.scrollbar} orientation="vertical">
                    <ScrollArea.Thumb className={s.thumb} />
                </ScrollArea.Scrollbar>
            )}

            {orientation !== 'vertical' && (
                <ScrollArea.Scrollbar className={s.scrollbar} orientation="horizontal">
                    <ScrollArea.Thumb className={s.thumb} />
                </ScrollArea.Scrollbar>
            )}

            {orientation === 'both' && <ScrollArea.Corner className={s.corner} />}
        </ScrollArea.Root>
    );
};