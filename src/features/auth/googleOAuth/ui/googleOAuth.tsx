'use client';

import {useGoogleLogin} from '@react-oauth/google';
import IconGoogleRegistration from "@/features/auth/styles/icons/iconGoogleRegistration.svg";
import {Button} from '@/shared/ui'

export default function GoogleAuthCodeFlowButton() {
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log('Authorization code:', codeResponse.code);
            // Перенаправляем на callback страницу с кодом
            window.location.href = `/auth/callback?code=${codeResponse.code}`;//TODO: проверить, это можно не писать?
        },
        onError: (error) => {
            console.error('Login error:', error);
            window.location.href = `/auth/callback?error=${error.error}`;
        },
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!
    });

    return (<>
            <Button onClick={() => login()} variant={'text'} style={{padding: '0'}}>    {/*TODO: To fix styles: border*/}
                <IconGoogleRegistration/>
            </Button>
        </>
    );
}