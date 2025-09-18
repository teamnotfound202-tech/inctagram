'use client'

import {useGitHubOAuthService} from "@/features/auth/gitHubOAuth/hooks/useGitHubOAuthService";
import AuthCallback from "@/views/AuthCallbackPage/AuthCallbackPage";

export default function Page() {
    return (
            <AuthCallback useOAuthHook={useGitHubOAuthService}/>
    );
}
