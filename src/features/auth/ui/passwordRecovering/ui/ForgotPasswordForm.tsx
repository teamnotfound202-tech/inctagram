'use client'

import { Input } from '@/shared/ui/Input/Input'
import { Button } from '@/shared/ui/Button/Button'
import { type SubmitHandler, useForm } from 'react-hook-form'
import s from './ForgotPassword.module.scss'
import Link from 'next/link'
import {
  useRecoveryPasswordMutation,
  useResendRecoveryPasswordMutation,
} from '@/features/auth/api/authApi'
import { Path } from '@/shared/config'
import { Card } from '@/shared/ui/Card/Card'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { Modal } from '@/shared/ui/Modal/Modal'
import { EmailInputType, LoginInputs, loginSchema } from '@/shared/lib/schemas/auth'
import { getTypedErrorData } from '@/shared/api/utils'
import { ResponsesTypeError } from '@/shared/api'

export const ForgotPasswordForm = () => {
  const [recoveryPassword] = useRecoveryPasswordMutation()
  const [resendRecoveryPassword] = useResendRecoveryPasswordMutation()
  const [serverError, setServerError] = useState<undefined | string>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLetterSent, setLetterSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
  } = useForm<EmailInputType>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(loginSchema.pick({ email: true })),
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<Pick<LoginInputs, 'email'>> = async data => {
    setServerError(undefined)

    if (!captchaToken) {
      alert('Пожалуйста, подтвердите, что вы не робот')

      return
    }

    try {
      if (!isLetterSent) {
        await recoveryPassword({
          ...data,
          baseUrl: `${window.location.origin}/password-recovery/create-new-password`,
          recaptcha: captchaToken,
        }).unwrap()
      } else {
        await resendRecoveryPassword({
          ...data,
          baseUrl: `${window.location.origin}/password-recovery/create-new-password`,
        }).unwrap()
      }

      setUserEmail(data.email)
      setIsModalOpen(true)
      reset()
    } catch (err: unknown) {
      const typedError = getTypedErrorData<ResponsesTypeError>(err)

      if (typedError?.data) {
        setServerError(typedError.data.messages[0].message)
      } else {
        setServerError('An unknown error occurred')
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setLetterSent(true)
  }

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
  }

  return (
    <>
      <Card title={'Forgot Password'}>
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <div className={s.textFields}>
            <Input
              id={'email'}
              type="email"
              label="Email"
              placeholder="Enter your email"
              error={errors.email?.message || serverError}
              {...register('email', {
                onChange: () => {
                  if (touchedFields.email) {
                    void trigger('email')
                    setServerError(undefined)
                  }
                },
              })}
            />
            <div className={s.instruction}>
              Enter your email address and we will send you further instructions
            </div>
          </div>
          {isLetterSent && (
            <div className={s.text}>
              The link has been sent by email. If you don’t receive an email send link again
            </div>
          )}
          {!isLetterSent && (
            <div className={s.captchaBlock}>
              <ReCAPTCHA
                sitekey={'6LdHxG4qAAAAAPKRxEHrlV5VvLFHIf2BO5NMI8YM'}
                theme={'dark'}
                onChange={handleCaptchaChange}
              />
            </div>
          )}
          <div className={s.buttonsBlock}>
            <Button fullWidth type={'submit'}>
              {!isLetterSent ? 'Send Link' : 'Send Link Again'}
            </Button>
            <Button variant={'text'}>
              <Link href={Path.SignIn}>Back to Sign In</Link>
            </Button>
          </div>
        </form>
      </Card>
      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={'Email sent'}>
          We have sent a link to confirm your email to {userEmail}
        </Modal>
      )}
    </>
  )
}
