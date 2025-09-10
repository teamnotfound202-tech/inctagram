'use client'
import dynamic from 'next/dynamic'
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {ACCESS_TOKEN} from "@/shared/lib";

function CallbackContent() {
    const router = useRouter();
    const params = useSearchParams()
    const accessToken = params.get('accessToken')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!accessToken) {
            setError('Код авторизации не найден в URL')
            setTimeout(() => router.push('/login'), 2000)
            return
        }

        localStorage.setItem(ACCESS_TOKEN, accessToken)
        setTimeout(() => router.push('/profile'), 1000)
    }, [accessToken, router]);

    /*useEffect(() => {
        if (!code) {
            setError('Код авторизации не найден в URL')
            setTimeout(() => router.push('/login'), 2000)
            return
        }

        const handleGoogleCallback = async (): Promise<void> => {
            try {
                const response = await googleLogin({
                    code,
                    redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL!
                }).unwrap()

                if (response.accessToken) {
                    sessionStorage.setItem(ACCESS_TOKEN, response.accessToken)
                }

                setTimeout(() => router.push('/profile'), 1000)
            } catch (err) {
                console.error('Ошибка авторизации:', err)
                setError('Ошибка авторизации. Перенаправление на страницу входа...')
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        handleGoogleCallback()
    }, [code, googleLogin, router])


*/

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

// Disable SSR for this component
const AuthCallbackNoSSR = dynamic(() => Promise.resolve(CallbackContent), {
    ssr: false,
    loading: () => <div>Loading...</div>
})

export default function AuthCallback() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthCallbackNoSSR/>
        </Suspense>
    );
}
