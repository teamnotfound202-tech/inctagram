'use client'
import { RegisterForm } from '@/features/auth/register'
import { Container, FormWrapper } from '@/shared/ui'
import { Congratulations } from '@/widgets/Congratulations/Congratulations'
import { VerificationLinkExpired } from '@/widgets/VerificationLinkExpired/VerificationLinkExpired'

// Отключить статическую генерацию для страниц с RTK Query
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <Container>
        <FormWrapper>
          <RegisterForm />
        </FormWrapper>
      </Container>
    </>
  )
}
