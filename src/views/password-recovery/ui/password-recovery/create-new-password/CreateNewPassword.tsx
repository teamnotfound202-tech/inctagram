'use client'

import { FormWrapper } from '@/shared/ui'
import dynamic from 'next/dynamic'

const CreateNewPasswordForm = dynamic(
  () => import('@/features/auth/ui/passwordRecovering/ui/CreateNewPasswordForm/CreateNewPassword'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
)

export default function CreateNewPassword() {
  return (
    <FormWrapper>
      <CreateNewPasswordForm />
    </FormWrapper>
  )
}
