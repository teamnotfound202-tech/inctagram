'use client'

import {Input} from "@/shared/ui/Input/Input";
import {Button} from "@/shared/ui/Button/Button";
import {type SubmitHandler, useForm} from 'react-hook-form';

import s from '../../styles/Register-Form.module.scss'
import GitHubIconRegistration from '@/features/auth/styles/icons/gitHubIconRegistration.svg'
import {zodResolver} from "@hookform/resolvers/zod"
import {useLoginMutation} from "@/features/auth/api/authApi";
import {Path} from "@/shared/config";
import {useId} from "react";
import {ACCESS_TOKEN} from "@/shared/lib";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/shared/lib/hooks/hooks";
import {loginTC} from "@/shared/api/appSlice";
import GoogleAuthCodeFlowButton from "@/features/auth/googleOAuth/ui/googleOAuth";
import {LoginFormData, loginSchema} from "@/shared/lib/shemas/loginShema";


export const LoginForm = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
        trigger
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema), // Добавляем zod resolver
        mode: 'onChange',
    });

    const [login] = useLoginMutation()
    const emailId = useId();
    const passwordId = useId();

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            const res = await login(data).unwrap();

            if (res.accessToken) {
                localStorage.setItem(ACCESS_TOKEN, res.accessToken);
                dispatch(loginTC({isLoggedIn: true}))
                router.replace(Path.Profile)
                reset();
            } else {
                reset({password: ''});
            }
        } catch {
            reset({password: ''});
        }
    };

    const error = errors.email?.message || errors.password?.message
    const disabled = isSubmitting || !!error

    const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const nativeOnBlur = register('email').onBlur;
        if (nativeOnBlur) {
            nativeOnBlur(e);
        }
        await trigger('email');
    };

    return (
        <div className={s.containerForm}>
            <h1 className={s.registrationFormTitle}>Sign In</h1>
            <div className={s.oAuthIconContainer}>
                <GoogleAuthCodeFlowButton/>
                <a href={'https://github.com/'}><GitHubIconRegistration/></a>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={s.form}>

                <Input
                    id={'email' + emailId}
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...register("email")}
                    onBlur={handleEmailBlur}
                />

                <Input
                    id={'password' + passwordId}
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <div className={s.fogrotBtnContainer}>
                    <Button className={s.forgotBtn} onClick={() => router.replace('/')}>
                        Forgot Password
                    </Button>
                </div>

                <Button type="submit" disabled={disabled}>
                    {isSubmitting ? "Loading..." : "Sign In"}
                </Button>
            </form>

            <span className={s.loginSpan}>Do you have an account?</span>

            <Button asChild variant={'text'} fullWidth>
                <a href={Path.SignUp}>
                    Sign Up
                </a>
            </Button>
        </div>
    );
};