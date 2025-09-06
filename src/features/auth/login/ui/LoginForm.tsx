'use client'

import {Input} from "@/shared/ui/Input/Input";
import {Button} from "@/shared/ui/Button/Button";
import {type SubmitHandler, useForm} from 'react-hook-form';
import s from '../../register/ui/Register-Form.module.scss'
import IconGoogleRegistration from '../../register/ui/icons/iconGoogleRegistration.svg'
import GitHubIconRegistration from '../../register/ui/icons/gitHubIconRegistration.svg'
import Link from "next/link";
import {useLoginMutation} from "@/features/auth/api/authApi";


type LoginFormValues = {

    email: string;
    password: string;

};

export const LoginForm = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting}, watch, trigger} = useForm<LoginFormValues>();
    const [login] = useLoginMutation()

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        const values: LoginFormValues = {
            email: data.email,
            password: data.password,
        }
        login(values)
            .unwrap()
            .then(res => {
                console.log('Super');
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    };
    console.log(errors);

    // const passwordValue = watch("password");
    const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        // Сохраняем native onBlur из register
        const nativeOnBlur = register('email').onBlur;
        if (nativeOnBlur) {
            nativeOnBlur(e);
        }

        // Запускаем валидацию только для email
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
                    id={'email'}
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
                    id={'password'}
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Enter your password",
                        minLength: {
                            value: 6,
                            message: "Password must be longer than 5 characters",
                        },
                        pattern: {
                            value: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~])[A-Za-z0-9!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]+$/,
                            message: "The password must not contain special characters.",
                        },
                    })}
                />


                <div className={s.checkBoxContainer}>

                    <span className={s.checkBoxLabel}>

                    <Link href={'/'}> Forgot Password</Link>
                                        </span>
                </div>


                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Sign Шт"}
                </Button>
            </form>

            <span className={s.loginSpan}>Do you have an account?</span>
            <Button asChild variant={'text'} fullWidth>
                <a href={'/auth/register'}>
                    Sign Up
                </a>
            </Button>

        </div>
    );
};
