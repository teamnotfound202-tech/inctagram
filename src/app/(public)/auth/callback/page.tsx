'use client'
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useState} from 'react';
import {useGoogleLoginMutation} from "@/features/auth/api/authApi";
import {ACCESS_TOKEN} from "@/shared/lib";

function CallbackContent() {
    const router = useRouter();

    const [googleLogin] = useGoogleLoginMutation()
    const params = useSearchParams()
    const code = params.get('code')

    if (!code) {
        throw new Error('Код авторизации не найден в URL');
    }

    useEffect(() => {
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
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        handleGoogleCallback()
    }, [])

    return (
        <div style={{padding: '20px'}}>
            <h2>Google OAuth Callback</h2>

            {code && (
                <div style={{marginTop: '20px'}}>
                    <h3>✅ Успешно получен код авторизации!</h3>
                </div>
            )}

            {!code && (
                <div style={{marginTop: '20px'}}>
                    <p>Ожидание параметров от Google...</p>
                </div>
            )}
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