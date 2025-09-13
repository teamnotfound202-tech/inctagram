'use client'

import {useGitHubOAuthService} from "@/features/auth/gitHubOAuth/hooks/useGitHubOAuthService";
import AuthCallback from "@/widgets/AuthCallbackPage/AuthCallbackPage";

export default function Page() {
    return (
            <AuthCallback useOAuthHook={useGitHubOAuthService}/>
    );
}
