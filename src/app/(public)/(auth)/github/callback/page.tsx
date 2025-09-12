'use client'
import dynamic from 'next/dynamic'
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {ACCESS_TOKEN} from "@/shared/lib";
import {Path} from "@/shared/config";

function CallbackContent() {
    const router = useRouter();
    const params = useSearchParams()
    const accessToken = params.get('accessToken')
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!accessToken) {
            setError('Код авторизации не найден в URL')
            setTimeout(() => router.push(`${Path.SignIn}`), 2000)
            return
        }

        localStorage.setItem(ACCESS_TOKEN, accessToken)
        setTimeout(() => router.push(`${Path.Profile}`), 1000)
    }, [mounted, accessToken, router]);

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
            <h2>GitHub OAuth Callback</h2>
            <div style={{marginTop: '20px'}}>
                <h3>✅ Обработка авторизации...</h3>
                <p>Пожалуйста, подождите, происходит перенаправление.</p>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent/>
        </Suspense>
    );
}
