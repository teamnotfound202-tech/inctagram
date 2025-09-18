import {ReadonlyURLSearchParams} from "next/navigation";

export type OAuthHookResult  = {
    oAuthService: string
    error: string | null
}

export type CallbackContentProps = {
    useOAuthHook: (params: ReadonlyURLSearchParams) => OAuthHookResult
}
