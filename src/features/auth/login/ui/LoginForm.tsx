'use client'

import {Input} from "@/shared/ui/Input/Input";
import {Button} from "@/shared/ui/Button/Button";
import {type SubmitHandler, useForm} from 'react-hook-form';
import s from '../../styles/Register-Form.module.scss'
import IconGoogleRegistration from '@/features/auth/styles/icons/iconGoogleRegistration.svg'
import GitHubIconRegistration from '@/features/auth/styles/icons/gitHubIconRegistration.svg'

import {useLoginMutation} from "@/features/auth/api/authApi";
import {Path} from "@/shared/config";
import {useId} from "react";
import {RequestBodyLogin} from "@/shared/api";
import {isSuccessResponse, validatePassword} from "@/features/auth/model";
import {ACCESS_TOKEN} from "@/shared/lib";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/shared/lib/hooks/hooks";
import {loginTC} from "@/shared/api/appSlice";




export const LoginForm = () => {
    const router = useRouter()
    const dispatch =useAppDispatch()
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},

        reset,

        trigger
    } = useForm<RequestBodyLogin>({
            mode: 'onChange', // ← Валидация при потере фокуса
            //reValidateMode: 'onBlur', // ← Повторная валидация тоже при blur
        }
    );
    const [login] = useLoginMutation()
    const emailId = useId();
    const passwordId = useId();
    const onSubmit: SubmitHandler<RequestBodyLogin> = async (data) => {
        const values: RequestBodyLogin = {
            email: data.email,
            password: data.password,
        }

        try {
            const res = await login(values).unwrap();
            if (isSuccessResponse(res)) {
                sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
                dispatch(loginTC({isLoggedIn:true}))
                router.replace(Path.Profile)
                reset();
            } else {
                reset({password: ''});
            }
        } catch (error) {
            console.log("Login error:", error);
            reset({password: ''});
        }
    };

    const error = errors.email?.message || errors.password?.message
    const disabled = isSubmitting || !!error


    // Автоматически очищаем ошибку при вводе

    const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        // Сохраняем native onBlur из register
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
                <a href={'https://www.google.com'}><IconGoogleRegistration/></a>
                <a href={'https://github.com/'}><GitHubIconRegistration/></a>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={s.form}>

                <Input
                    id={'email' + emailId}
                    type="email"
                    label="Email"

                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...register("email", {
                        required: "Enter your email",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: " The email must match the format example@example.com",
                        },

                    })}
                    onBlur={handleEmailBlur}
                />

                <Input
                    id={'password' + passwordId}
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Enter your password",
                        validate: validatePassword
                    })}
                />
                <div className={s.fogrotBtnContainer}>
                    <Button className={s.forgotBtn} onClick={() => router.replace('/')}> Forgot Password</Button>
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
