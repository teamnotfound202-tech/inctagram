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
import {validatePassword} from "@/features/auth/model";
import {responseCodes} from "@/shared/config/responseCode/responseCode";
import {ACCESS_TOKEN} from "@/shared/lib";

interface IProps {
    setFormType: (type: boolean) => void;
}



export const LoginForm = ({setFormType}:IProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}, reset, trigger} = useForm<RequestBodyLogin>({
        mode: 'onBlur', // ← Валидация при потере фокуса
        reValidateMode: 'onBlur', // ← Повторная валидация тоже при blur
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

            if (res.statusCode === responseCodes.success) {
                localStorage.setItem(ACCESS_TOKEN, res.accessToken);
                reset();
            }
        } catch (error) {
            console.error("Login error:", error);
            reset({password: ''});
        }
    };

    const error = errors.email?.message||errors.password?.message
    const disabled = isSubmitting || !!error

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
                    <Button className={s.forgotBtn} onClick={()=>setFormType(true)} > Forgot Password</Button>
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
