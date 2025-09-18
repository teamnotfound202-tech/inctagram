'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { type ReactNode} from 'react'

export const AppWrapper = ({children}: {children: ReactNode}) => {
  const {data} = useMeQuery()
  return (
    <>
      {children}
    </>
  )
}