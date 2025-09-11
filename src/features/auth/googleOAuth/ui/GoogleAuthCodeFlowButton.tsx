'use client';

import {useGoogleLogin} from '@react-oauth/google';
import IconGoogleRegistration from "@/features/auth/styles/icons/iconGoogleRegistration.svg";
import {Button} from '@/shared/ui'
import s from './GoogleAuthCodeFlowButton.module.scss'

export default function GoogleAuthCodeFlowButton() {
    const login = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!
    });

    return (<>
            <Button onClick={login} variant={'text'} className={s.googleAuthButton} >
                <IconGoogleRegistration/>
            </Button>
        </>
    );
}