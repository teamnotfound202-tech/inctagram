import React from 'react'
import TimeManagement from '@/shared/icons/timeManagement.svg'
import Link from 'next/link'
import s from '../ForgotPasswordForm/ForgotPassword.module.scss'
import {Card} from "@/shared/ui";
import {Path} from "@/shared/config";

const PasswordRecoveryLinkExpired: React.FC = () => {
  return (
    <div className={s.wrapper}>
      <Card title={'Email verification link expired'}>
        <p className={s.text}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>
         <Link href={Path.PasswordRecovery}>Resend link</Link>
        <TimeManagement />
      </Card>
    </div>
  )
}

export default PasswordRecoveryLinkExpired
