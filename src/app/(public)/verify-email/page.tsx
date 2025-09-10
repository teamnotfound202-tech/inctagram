import EmailVerificationHandler from '@/widgets/EmailVerificationHandler/EmailVerificationHandler';
import {Suspense} from 'react';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
         <EmailVerificationHandler/>
        </Suspense>
        )
}