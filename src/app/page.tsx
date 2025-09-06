'use client'

import {Header} from "@/widgets/Header/Header";
import {RegisterForm} from "@/features/auth/register";
import {PrivacyPolicy} from "@/shared/lib/components/agreements/ui/privacy-policy/PrivacyPolicy";
import {TermsOfService} from "@/shared/lib/components/agreements/ui/terms-of-service/TermsOfService";

export default function Home() {

    return (
        <div>
            <Header isLogin={false} notification={11}/>
            <main style={{height: '100vh', display: 'flex', flexDirection: 'column',  alignItems: 'center', justifyContent: 'center'}}>
                <RegisterForm/>
            </main>

        </div>
    );
}


