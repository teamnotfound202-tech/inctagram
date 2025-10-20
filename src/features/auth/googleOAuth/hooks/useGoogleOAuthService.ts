import {useEffect, useState} from "react";
import {Path} from "@/shared/config";
import {ACCESS_TOKEN} from "@/shared/lib";
import {ReadonlyURLSearchParams, useRouter} from "next/navigation";
import {useGoogleLoginMutation} from "@/features/auth/api/authApi";
import {OAuthHookResult} from "@/views/AuthCallbackPage/types/types";

export function useGoogleOAuthService(params: ReadonlyURLSearchParams) {
    const router = useRouter();
    const code = params.get('code');
    const [googleLogin] = useGoogleLoginMutation()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        //если в URL нет query параметра code
        if (!code) {
            setError('Код авторизации не найден в URL');
            router.push(`${Path.SignIn}`)
            return;
        }

        const handleGoogleCallback = async (): Promise<void> => {
            //делаем запрос на бэк с полученным code
            const response = await googleLogin({
                code,
                redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL!
            }).unwrap()

            if (response.accessToken) {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken)
            }
            //если бэк прислал accessToken - перенаправляем на защищенную страницу
            router.replace(`${Path.Profile}`)
        }

        handleGoogleCallback()
    }, [code, router, googleLogin])

    return {oAuthService: 'Google', error}
}