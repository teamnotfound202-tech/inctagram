'use client';

import {Suspense} from 'react';
import EmailVerificationHandler from "@/views/EmailVerificationHandler/EmailVerificationHandler";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
         <EmailVerificationHandler/>
        </Suspense>
        )
}