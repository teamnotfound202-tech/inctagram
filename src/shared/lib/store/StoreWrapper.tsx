'use client';

import {store} from '@/shared/lib';
import type {ReactNode} from 'react';
import {Provider} from 'react-redux';

type Props = {
    children: ReactNode
}

export const StoreWrapper = ({children}: Props) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}