import AuthGuard from '@/shared/lib/components/AuthGuard/AuthGuard'
import type { ReactNode } from 'react'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <>{children}</>/*<AuthGuard>{children}</AuthGuard>TODO: с AuthGuard нет SSR*/
}
