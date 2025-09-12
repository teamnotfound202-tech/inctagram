'use client'

import { useEffect, useId, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/Button/Button'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

import s from "@/features/auth/ui/passwordRecovering/ui/ForgotPassword.module.scss";
import {
  useCheckRecoveryCodeMutation,
  useCreateNewPasswordMutation,
} from "@/features/auth/api/authApi";
import {
  CreateNewPasswordInputs,
  createNewPasswordSchema,
} from "@/shared/lib/schemas/auth";
import { Card, Input } from "@/shared/ui";
import { Path } from "@/shared/config";

export default function CreateNewPasswordForm() {
  const [createNewPassword] = useCreateNewPasswordMutation();
  const [checkRecoveryCode, { isLoading }] = useCheckRecoveryCodeMutation();
  const searchParams = useSearchParams();
  const recoveryCode = searchParams.get("code");
  const router = useRouter();
  const passwordId = useId();

  const [serverError, setServerError] = useState<undefined | string>(undefined);
  const [isVerifyingSuccess, setIsVerifyingSuccess] = useState(false);

  useEffect(() => {
    const verifyRecoveryCode = async () => {
      if (recoveryCode) {
        try {
          await checkRecoveryCode({ recoveryCode }).unwrap();
          setIsVerifyingSuccess(true);
        } catch (err: any) {
          if (err.data.messages[0].message === "Code is not valid") {
            router.push("/password-recovery/link-expired");
            isVerifyingSuccess && setIsVerifyingSuccess(false);
          } else {
            alert(err);
          }
        }
      }
    };

    verifyRecoveryCode();
  }, [recoveryCode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewPasswordInputs>({
    resolver: zodResolver(createNewPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<CreateNewPasswordInputs> = async (data) => {
    setServerError(undefined);
    try {
      recoveryCode &&
        (await createNewPassword({
          ...data,
          recoveryCode,
        }).unwrap());

      router.push(Path.SignIn);
    } catch (err: any) {
      if (err.data?.messages?.[0]?.message) {
        setServerError(err.data.messages[0].message);
      } else {
        setServerError("An unknown error occurred");
      }
    }
  };

  if (isLoading || !isVerifyingSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <Card title={"Create New Password"}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.textFields}>
          <Input
            id={"password" + passwordId}
            type="password"
            label="New password"
            placeholder="Enter your password"
            {...register("newPassword")}
            error={errors.newPassword?.message || serverError}
          />
          <Input
            id={"password" + passwordId}
            type="password"
            label="Password confirmation"
            placeholder="Enter your password"
            {...register("passwordConfirmation")}
            error={errors.passwordConfirmation?.message}
          />

          <p className={s.instruction}>
            Your password must be between 6 and 20 characters
          </p>
        </div>
        <Button fullWidth type={"submit"}>
          Create new password
        </Button>
      </form>
    </Card>
  );
}
