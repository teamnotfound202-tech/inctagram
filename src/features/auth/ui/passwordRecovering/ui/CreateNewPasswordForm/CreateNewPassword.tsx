'use client'

import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/Button/Button'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

import s from '@/features/auth/ui/passwordRecovering/ui/ForgotPassword.module.scss'
import {useCheckRecoveryCodeMutation, useCreateNewPasswordMutation} from "@/features/auth/api/authApi";
import {CreateNewPasswordInputs, createNewPasswordSchema} from "@/shared/lib/schemas/auth";
import {Card} from "@/shared/ui";

export default function CreateNewPasswordForm() {
  const [createNewPassword] = useCreateNewPasswordMutation()
  const [checkRecoveryCode, { isLoading }] = useCheckRecoveryCodeMutation()
  const searchParams = useSearchParams()
  const recoveryCode = searchParams.get('code')
  const router = useRouter()

  const [serverError, setServerError] = useState<undefined | string>(undefined)

  useEffect(() => {
    const verifyRecoveryCode = async () => {
      if (recoveryCode) {
        try {
          await checkRecoveryCode({ recoveryCode }).unwrap()
        } catch (err: any) {
          if (err.data.messages[0].message === 'Code is not valid') {
            router.push('/password-recovery/link-expired')
          } else {
            alert(err)
          }
        }
      }
    }

    verifyRecoveryCode()
  }, [recoveryCode])

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewPasswordInputs>({
    resolver: zodResolver(createNewPasswordSchema),
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<CreateNewPasswordInputs> = async data => {
    setServerError(undefined)
    try {
      recoveryCode &&
        (await createNewPassword({
          ...data,
          recoveryCode,
        }).unwrap())

      router.push('/sign-in')
    } catch (err: any) {
      if (err.data?.messages?.[0]?.message) {
        setServerError(err.data.messages[0].message)
      } else {
        setServerError('An unknown error occurred')
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={s.wrapper}>
      <Card title={'Create New Password'}>
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <div className={s.textFields}>
            // тут будут инпуты
            {errors.newPassword?.message || serverError}

            <p className={s.instruction}>Your password must be between 6 and 20 characters</p>
          </div>
          <Button fullWidth type={'submit'}>
            Create new password
          </Button>
        </form>
      </Card>
    </div>
  )
}
