import AuthGuard from '@/shared/lib/components/authGuard';
import type {ReactNode} from 'react';

export default function PrivateLayout({children}: {children: ReactNode}) {
    return <AuthGuard>{children}</AuthGuard>
}