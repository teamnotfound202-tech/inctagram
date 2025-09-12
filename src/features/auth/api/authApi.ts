import {
    baseApi,
    type RequestBodyLogin,
    type RequestBodyRegistrationConformation,
    type ResponsesLogin,
    type ResponsesMe
} from '@/shared/api';
import type {
    RegistrationData,
    RequestBodyGoogleLogin,
    RequestBodyResending,
    ResponseGoogleLogin,
    RequestCreateNewPassword,
    RequestRecoveryPassword, RequestResendRecoveryPassword
} from '@/shared/api/types';


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registration: builder.mutation<void, RegistrationData>({
            query: (body) => ({method: "post", url: "auth/registration", body}),
        }),
        registrationConfirmation: builder.mutation<void, RequestBodyRegistrationConformation>({
            query: (body) => ({method: "post", url: "auth/registration-confirmation", body}),
        }),
        registrationEmailResending: builder.mutation<void, RequestBodyResending>({
            query: (body) => ({method: "post", url: "auth/registration-email-resending", body}),
        }),
        login: builder.mutation<ResponsesLogin, RequestBodyLogin>({
            query: (args) => ({
                url: `auth/login`,
                method: 'POST',
                body: args
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({method: "post", url: "auth/logout"}),
        }),
        me: builder.query<ResponsesMe, void>({

            query: () => "auth/me",
        }),
        googleLogin: builder.mutation<ResponseGoogleLogin, RequestBodyGoogleLogin>({
            query: (args) => ({
                url: 'auth/google/login',
                method: 'POST',
                body: args
            }),
        }),
        recoveryPassword: builder.mutation<void, RequestRecoveryPassword>(
            {
                query: body => ({
                    url: '/auth/password-recovery',
                    method: 'POST',
                    body,
                }),
            }
        ),
        createNewPassword: builder.mutation<void, RequestCreateNewPassword>({
            query: body => ({
                url: '/auth/new-password',
                method: 'POST',
                body,
            }),
        }),
        resendRecoveryPassword: builder.mutation<void, RequestResendRecoveryPassword>({
            query: body => ({
                url: '/auth/password-recovery-resending',
                method: 'POST',
                body,
            }),
        }),
        checkRecoveryCode: builder.mutation<void, { recoveryCode: string }>({
            query: body => ({
                url: '/auth/check-recovery-code',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const {
    useRegistrationMutation,
    useLoginMutation,
    useRegistrationConfirmationMutation,
    useRegistrationEmailResendingMutation,
    useGoogleLoginMutation,
    useMeQuery,
    useLogoutMutation,
    useRecoveryPasswordMutation,
    useCreateNewPasswordMutation,
    useResendRecoveryPasswordMutation,
    useCheckRecoveryCodeMutation
} = authApi