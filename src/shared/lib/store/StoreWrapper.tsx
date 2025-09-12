'use client';


import type {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {store} from "@/shared/lib/store/store";

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