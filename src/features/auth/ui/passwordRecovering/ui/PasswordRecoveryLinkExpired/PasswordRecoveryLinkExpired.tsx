import React from 'react'
import TimeManagement from '@/shared/assets/icons/timeManagement.svg'
import Link from 'next/link'
import s from '../ForgotPassword.module.scss'
import {Button, Card} from "@/shared/ui";
import {Path} from "@/shared/config";

const PasswordRecoveryLinkExpired: React.FC = () => {
  return (
      <Card title={'Email verification link expired'}>
        <p className={s.text}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>
          <Button fullWidth type={'submit'}>  <Link href={Path.PasswordRecovery}>Resend link</Link></Button>
        <TimeManagement />
      </Card>
  )
}

export default PasswordRecoveryLinkExpired
