import {
    baseApi,
    type RequestBodyLogin,
    type RequestBodyRegistrationConformation,
    type ResponsesLogin, type ResponsesMe, ResponsesTypeError
} from '@/shared/api';
import {RegistrationData, RequestBodyGoogleLogin, RequestBodyResending, ResponseGoogleLogin} from '@/shared/api/types';


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
        login: builder.mutation<ResponsesLogin | ResponsesTypeError, RequestBodyLogin>({    //TODO: нужно ли ставить тип ResponsesTypeError?
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
        googleLogin: builder.mutation<ResponseGoogleLogin, RequestBodyGoogleLogin>({    //TODO: нужно ли ставить тип ResponsesTypeError?
            query: (args) => ({
                url: `auth/google/login`,
                method: 'POST',
                body: args
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
} = authApi