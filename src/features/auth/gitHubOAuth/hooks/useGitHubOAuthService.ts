import {useEffect, useState} from "react";
import {Path} from "@/shared/config";
import {ACCESS_TOKEN} from "@/shared/lib";
import {ReadonlyURLSearchParams, useRouter} from "next/navigation";
import {OAuthHookResult} from "@/views/AuthCallbackPage/types/types";

export function useGitHubOAuthService(params: ReadonlyURLSearchParams) {
    const router = useRouter();
    const accessToken = params.get('accessToken')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        //если в URL нет query параметра accessToken
        if (!accessToken) {
            setError('Код авторизации не найден в URL')
            router.push(`${Path.SignIn}`)
            return
        }

        //если есть accessToken - перенаправляем на защищенную страницу
        localStorage.setItem(ACCESS_TOKEN, accessToken)
        router.replace(`${Path.Profile}`)
    }, [accessToken, router]);

    return {oAuthService: 'GitHub', error}
}