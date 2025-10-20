'use client'
import { Path } from '@/shared/config'
import { Button, Input } from '@/shared/ui'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import s from './VerificationLinkExpired.module.scss'
import VerificationIcon from './icons/verification.svg'

type VerificationFormValues = {
  email: string
}

export const VerificationLinkExpired = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<VerificationFormValues>()
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const onSubmit: SubmitHandler<VerificationFormValues> = async (data: { email: string }) => {
    if (!mounted) return

    const newData = {
      email: data.email,
      baseUrl: baseUrl + '/verify-email',
    }

    try {
      // Динамически импортируем store и API
      const { store } = await import('@/shared/lib/store/store')
      const { authApi } = await import('@/features/auth/api/authApi')

      // Выполняем мутацию через store dispatch
      await store.dispatch(authApi.endpoints.registrationEmailResending.initiate(newData))

      setIsModalOpen(true)
      setEmailValue(newData.email)
      reset()
      router.push(Path.SignIn)
    } catch (error) {
      console.error('Error resending email:', error)
    }
  }

  const handleModalClose = () => setIsModalOpen(false)

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={s.verificationWrapper}>
        <h2 className={s.verificationTitle}>Email verification link expired</h2>
        <p className={s.verificationText}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>
        <form className={s.verificationForm} onSubmit={handleSubmit(onSubmit)}>
          <Input
            className={s.verificationInput}
            id={'email'}
            autoComplete="email"
            type="email"
            label="Email"
            placeholder="epam@emapm.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            })}
          />
          <Button type="submit" className={s.verificationBtn} disabled={!isValid || !!errors.email}>
            Resend verification link
          </Button>
        </form>
        <VerificationIcon className={s.verificationIcon} />
      </div>
      {isModalOpen && (
        <Modal title={'Email sent'} onClick={handleModalClose}>
          <p style={{ maxWidth: '330px' }}>
            We have sent a link to confirm your email to {emailValue}
          </p>
          <Button type={'button'} onClick={handleModalClose}>
            OK
          </Button>
        </Modal>
      )}
    </>
  )
}
