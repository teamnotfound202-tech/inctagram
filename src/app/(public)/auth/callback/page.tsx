'use client';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {ACCESS_TOKEN} from '@/shared/lib';
import {useGoogleLoginMutation} from "@/features/auth/api/authApi";

function CallbackContent() {
    const router = useRouter();
    const params = useSearchParams();
    const code = params.get('code');
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [googleLogin] = useGoogleLoginMutation()


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!code) {
            setError('Код авторизации не найден в URL');
            setTimeout(() => router.push('/login'), 2000);
            return;
        }

        const handleGoogleCallback = async (): Promise<void> => {
            try {

                /* // Динамически импортируем store и API
                 const { store } = await import('@/shared/lib/store/store');
                 const { authApi } = await import('@/features/auth/api/authApi');

                 // Выполняем мутацию через store dispatch
                 const result = await store.dispatch(
                     authApi.endpoints.googleLogin.initiate({
                         code,
                         redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL!
                     })
                 );
                  if ('data' in result && result.data?.accessToken) {
           sessionStorage.setItem(ACCESS_TOKEN, result.data.accessToken);
           setTimeout(() => router.push('/profile'), 1000);
         } else {
           throw new Error('No access token received');
         }
       } catch (err) {
         console.error('Ошибка авторизации:', err);
         setError('Ошибка авторизации. Перенаправление на страницу входа...');
         setTimeout(() => router.push('/login'), 2000);
       }
                 */

                const response = await googleLogin({
                    code,
                    redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL!
                }).unwrap()

                if (response.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken)
                }

                setTimeout(() => router.replace('/profile'), 1000)
            } catch (err) {
                console.error('Ошибка авторизации:', err)
                setError('Ошибка авторизации. Перенаправление на страницу входа...')
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        handleGoogleCallback()
    }, [mounted, code, router])

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
            <h2>Google OAuth Callback</h2>
            <div style={{marginTop: '20px'}}>
                <h3>✅ Обработка авторизации...</h3>
                <p>Пожалуйста, подождите, происходит перенаправление.</p>
            </div>
        </div>
    );
}

// Disable SSR for this component
/*
const AuthCallbackNoSSR = dynamic(() => Promise.resolve(CallbackContent), {
    ssr: false,
    loading: () => <div>Loading...</div>
})
*/

export default function AuthCallback() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent/>
        </Suspense>
    );
}
