import {Button, Input} from '@/shared/ui';
import {type SubmitHandler, useForm} from 'react-hook-form';
import s from './Verification.module.scss'
import VerificationIcon from './icons/verification.svg'

type VerificationFormValues = {
    email: string;
};

export const Verification = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<VerificationFormValues>();

    const onSubmit: SubmitHandler<VerificationFormValues> = (data) => {

    }

    return (
        <div className={s.verificationWrapper}>
            <h2 className={s.verificationTitle}>Email verification link expired</h2>
            <p className={s.verificationText}>Looks like the verification link has expired. Not to worry, we can send the link again</p>
            <form className={s.verificationForm} onSubmit={handleSubmit(onSubmit)}>
                <Input
                    className={s.verificationInput}
                    id={'email'}
                    autoComplete="email"
                    type="email"
                    label="Email"
                    placeholder="epam@emapm.com"
                    error={errors.email?.message}
                    {...register("email", {
                        required: "Enter your email",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                        },
                    })}
                />
                <Button type="submit" className={s.verificationBtn}>
                    Resend verification link
                </Button>
            </form>
            <VerificationIcon className={s.verificationIcon}/>
        </div>
    )
}