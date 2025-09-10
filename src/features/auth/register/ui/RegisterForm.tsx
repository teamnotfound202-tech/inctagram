'use client'
import {useRegistrationMutation} from '@/features/auth/api/authApi';
import type {RegistrationData} from '@/shared/api';
import {Path} from '@/shared/config';
import {Input} from "@/shared/ui/Input/Input";
import {Button} from "@/shared/ui/Button/Button";
import {Modal} from '@/shared/ui/Modal/Modal';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {Controller, type SubmitHandler, useForm} from 'react-hook-form';
import s from '../../styles/Register-Form.module.scss'
import GitHubIconRegistration from '@/features/auth/styles/icons/gitHubIconRegistration.svg'
import {CustomCheckbox} from "@/shared/ui/Checkbox/Checkbox";
import Link from "next/link";
import GoogleAuthCodeFlowButton from "@/features/auth/googleOAuth/ui/GoogleAuthCodeFlowButton";
import GitHubAuthButton from "@/features/auth/GitHubAuthButton/ui/GitHubAuthButton";


type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
};

export const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
        watch,
        control,
        reset
    } = useForm<RegisterFormValues>({
        mode: 'onBlur'
    });
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const [credentials] = useRegistrationMutation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [emailValue, setEmailValue] = useState('')
    const router = useRouter()

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        const values: RegistrationData = {
            userName: data.username,
            email: data.email,
            password: data.password,
            baseUrl: baseUrl + '/verify-email'
        }
        credentials(values)
            .unwrap()
            .then(() => {
                setIsModalOpen(true);
                setEmailValue(values.email);
                reset()
            })
            .catch(err => {

            })
    };

    const handleModalClose = () => {
        router.push(Path.SignIn)
    }
    const passwordValue = watch("password");
    const agreeValue = watch("agree");

    return (
        <>
        <div className={s.containerForm}>
            <h1 className={s.registrationFormTitle}>Sign Up</h1>
            <div className={s.oAuthIconContainer}>
                <GoogleAuthCodeFlowButton/>
                <GitHubAuthButton/>
            </div>
                <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
                    <Input
                        id={'username'}
                        autoComplete="username"
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
                        autoComplete="email"
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
                            render={({ field }) => (
                                <CustomCheckbox
                                    className={s.registerCheckbox}
                                    id={'privatePolicy'}
                                    checked={field.value}
                                    onChangeAction={field.onChange}
                                />
                            )}
                        />
                        <span className={s.checkBoxLabel}>
                        I agree to the
                        <Link href={Path.TermsOfService} className={s.linkForm}>Terms of Service</Link>
                         and
                        <Link href={Path.PrivatePolicy} className={s.linkForm}>Privacy Policy</Link>
                        </span>

                        {errors.agree && <span className={s.checkBoxErrorText}>{errors.agree.message}</span>}
                    </div>


                    <Button type="submit" disabled={!isValid || !agreeValue}>
                        Sign Up
                    </Button>
                </form>

                <span className={s.loginSpan}>Do you have an account?</span>
                <Button asChild variant={'text'} className={s.formBtn}>
                    <a href={Path.SignIn}>
                        Sign In
                    </a>
                </Button>

            </div>
            {isModalOpen && (
                <Modal title={'Email sent'} onClick={handleModalClose}>
                    <p style={{maxWidth: '330px'}}>We have sent a link to confirm your email to {emailValue}</p>
                    <Button type={'button'} onClick={handleModalClose}>OK</Button>
                </Modal>
            )}
        </>
    );
};
