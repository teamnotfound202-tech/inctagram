'use client';
import {useRegistrationConfirmationMutation} from '@/features/auth/api/authApi';
import {Path} from '@/shared/config';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function Page() {
    const searchParams = useSearchParams()
    const [verify] = useRegistrationConfirmationMutation()
    const router = useRouter()


    useEffect(() => {
        const code = searchParams.get('code')
        if (code) {
            console.log({confirmationCode: code});
            verify({confirmationCode: code })
                .unwrap()
                .then(() => {
                    router.push(Path.Success)
                })
                .catch(err => {
                    console.log('Error', err);
                    router.push(Path.Resend)
                })
        }
    },[searchParams, verify, router])


    return <></>
}