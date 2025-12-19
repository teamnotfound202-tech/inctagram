'use client'

import { ReactNode} from 'react'
import { Messenger } from '@/views/messenger/Messenger'

export default function MessengerLayout({ children }: { children: ReactNode }) {
  return (
    <Messenger>
      {children}
    </Messenger>
  )
}