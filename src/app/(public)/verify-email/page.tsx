import {Metadata} from "next";
export const metadata: Metadata = {title: 'Verify Email'};
export {EmailVerificationHandler as default}  from "@/features/auth/EmailVerificationHandler";
export const dynamic = 'force-dynamic'