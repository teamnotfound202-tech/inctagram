'use client'
import {useRegistrationMutation} from '@/features/auth/api/authApi';
import type {RegistrationData} from '@/shared/api';
import {Input} from "@/shared/ui/Input/Input";
import {Button} from "@/shared/ui/Button/Button";
import {Controller, type SubmitHandler, useForm} from 'react-hook-form';
import s from './Register-Form.module.scss'
import IconGoogleRegistration from './icons/iconGoogleRegistration.svg'
import GitHubIconRegistration from './icons/gitHubIconRegistration.svg'
import {CustomCheckbox} from "@/shared/ui/Checkbox/Checkbox";
import Link from "next/link";


type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
};

export const RegisterForm = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting}, watch, control} = useForm<RegisterFormValues>();
    const [credentials] = useRegistrationMutation()

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        const values: RegistrationData = {
            userName: data.username,
            email: data.email,
            password: data.password,
        }
        credentials(values)
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

    const passwordValue = watch("password");

    return (
        <div className={s.containerForm}>
            <h1 className={s.registrationFormTitle}>Sign Up</h1>
            <div className={s.oAuthIconContainer}>
                <a href={'https://www.google.com'}><IconGoogleRegistration/></a>
                <a href={'https://github.com/'}><GitHubIconRegistration/></a>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
                <Input
                    id={'username'}
                    type="text"
                    label="Username"
                    placeholder="Enter your username"
                    error={errors.username?.message}
                    {...register("username", {
                        required: "Enter your username",
                        minLength: {value: 6, message: "Minimum number of characters 6"},
                        maxLength: {value: 30, message: "Maximum number of characters 30"},
                        pattern: {
                            value: /^[A-Za-z0-9_-]+$/,
                            message: "You can only use letters, numbers, _ and -",
                        },
                    })}
                />

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
                            message: "Invalid email format",
                        },
                    })}
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

                <Input
                    id={'confirmPassword'}
                    type="password"
                    label="Password confirmation"
                    placeholder="Repeat your password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword", {
                        required: "Repeat password",
                        validate: (value) =>
                            value === passwordValue || "Passwords must match",
                    })}
                />

                <div className={s.checkBoxContainer}>
                    <Controller
                        control={control}
                        name="agree"
                        rules={{required: "You must agree to the terms"}}
                        render={({field}) => (
                            <CustomCheckbox
                                id="privatePolicy"
                                checked={field.value}
                                onChangeAction={field.onChange}
                            />
                        )}
                    />
                    <span className={s.checkBoxLabel}>
                    I agree to the
                    <Link href={'/terms-of-service'}> Terms of Service </Link>
                     and
                    <Link href={'/privacy-policy'}> Privacy Policy</Link>
                    </span>

                    {errors.agree && <span className={s.checkBoxErrorText}>{errors.agree.message}</span>}
                </div>


                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Sign Up"}
                </Button>
            </form>

            <span className={s.loginSpan}>Do you have an account?</span>
            <Button asChild variant={'text'} fullWidth>
                <a href={'/'}>
                    Sign In
                </a>
            </Button>

        </div>
    );
};
