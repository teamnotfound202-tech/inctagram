'use client'
import {useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {toast} from "sonner";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";
import {CallbackContentProps} from "@/views/AuthCallbackPage/types/types";

function CallbackContent({useOAuthHook}: CallbackContentProps) {

    const params = useSearchParams()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
    }, [mounted]);

    const {oAuthService, error} = useOAuthHook(params)

    useEffect(() => {
        if (error) {
            toast.custom(() => (<AlertToast variant="error"
                                            title={`Ошибка авторизации`}
                                            description={error}
            />))
        }
    }, [error]);

    if (!mounted) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div style={{padding: '20px'}}>
                <h2>❌ Ошибка</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div style={{padding: '20px'}}>
            <h2>{oAuthService} OAuth Callback</h2>
            <div style={{marginTop: '20px'}}>
                <h3>✅ Обработка авторизации...</h3>
                <p>Пожалуйста, подождите, происходит перенаправление.</p>
            </div>
        </div>
    );
}

export default function AuthCallback({useOAuthHook}: CallbackContentProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent useOAuthHook={useOAuthHook}/>
        </Suspense>
    );
}
