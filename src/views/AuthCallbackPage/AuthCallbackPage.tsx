'use client'
import { selectStatus } from '@/shared/api/appSlice'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { Loader } from '@/shared/ui/Loader/Loader'
import {useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {toast} from "sonner";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";
import {CallbackContentProps} from "@/views/AuthCallbackPage/types/types";

function CallbackContent({useOAuthHook}: CallbackContentProps) {

    const params = useSearchParams()
    const [mounted, setMounted] = useState(false);
    const status = useAppSelector(selectStatus)

    useEffect(() => {
        setMounted(true);
    }, []);


    const {oAuthService, error} = useOAuthHook(params)

    useEffect(() => {
        if (error) {
            toast.custom(() => (<AlertToast variant="error"
                                            title={`Ошибка авторизации`}
                                            description={error}
            />))
        }
    }, [error]);


    if (error) {
        return (
            <div style={{padding: '20px'}}>
                <h2>❌ Ошибка</h2>
                <p>{error}</p>
            </div>
        )
    }

    if (!mounted) {
      return
    }

    return <>
    {status === 'loading' && <Loader/>}
    </>;
}

export default function AuthCallback({useOAuthHook}: CallbackContentProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent useOAuthHook={useOAuthHook}/>
        </Suspense>
    );
}
