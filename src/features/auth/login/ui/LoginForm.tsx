'use client'
import s from '../../styles/Register-Form.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/shared/ui/Input/Input'
import { Button } from '@/shared/ui/Button/Button'
import { type SubmitHandler, useForm } from 'react-hook-form'
import GitHubIconRegistration from '@/features/auth/styles/icons/gitHubIconRegistration.svg'

import { useLoginMutation } from '@/features/auth/api/authApi'
import { Path } from '@/shared/config'
import { useEffect, useId, useState } from 'react'
import { RequestBodyLogin } from '@/shared/api'
import { ACCESS_TOKEN } from '@/shared/lib'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/shared/lib/hooks/hooks'
import { loginTC } from '@/shared/api/appSlice'
import { LoginFormData, loginSchema } from '@/shared/lib/shemas/loginShema'
import GoogleAuthCodeFlowButton from '@/features/auth/googleOAuth/ui/GoogleAuthCodeFlowButton'
import Link from 'next/link'

export const LoginForm = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Добавляем zod resolver
    mode: 'onChange',
  })
  const [mounted, setMounted] = useState(false)

  const [login] = useLoginMutation()
  const emailId = useId()
  const passwordId = useId()
  useEffect(() => {
    setMounted(true)
  }, [])
  const onSubmit: SubmitHandler<RequestBodyLogin> = async data => {
    const values: RequestBodyLogin = {
      email: data.email,
      password: data.password,
    }

    try {
      const res = await login(data).unwrap()

      if (res.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, res.accessToken)
        dispatch(loginTC({ isLoggedIn: true }))
        router.replace(Path.Home)
        reset()
      } else {

        reset({ password: '' })
      }
    } catch {
      reset({ password: '' })
    }
  }

  const error = errors.email?.message || errors.password?.message
  const disabled = isSubmitting || !!error

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nativeOnBlur = register('email').onBlur
    if (nativeOnBlur) {
      nativeOnBlur(e)
    }
    await trigger('email')
  }

  return (
    <div className={s.containerForm}>
      <h1 className={s.registrationFormTitle}>Sign In</h1>
      <div className={s.oAuthIconContainer}>
        <GoogleAuthCodeFlowButton />
        <a href={'https://github.com/'}>
          <GitHubIconRegistration />
        </a>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <Input
          id={'email' + emailId}
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
          onBlur={handleEmailBlur}
        />

        <Input
          id={'password' + passwordId}
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className={s.fogrotBtnContainer}>
          <Link href={Path.PasswordRecovery} className={s.forgotBtn}>
            Forgot Password
          </Link>
        </div>

        <Button type="submit" disabled={disabled}>
          {isSubmitting ? 'Loading...' : 'Sign In'}
        </Button>
      </form>

      <span className={s.loginSpan}>Do you have an account?</span>

      <Button asChild variant={'text'} fullWidth>
        <a href={Path.SignUp}>Sign Up</a>
      </Button>
    </div>
  )
}
