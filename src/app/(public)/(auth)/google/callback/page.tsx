'use client'
import {useGoogleOAuthService} from "@/features/auth/googleOAuth/hooks/useGoogleOAuthService";
import AuthCallback from "@/views/AuthCallbackPage/AuthCallbackPage";


export default function Page() {
    return (
        <AuthCallback useOAuthHook={useGoogleOAuthService}/>
    );
}
