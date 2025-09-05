import {
    baseApi,
    type RequestBodyLogin,
    type RequestBodyRegistrationConformation,
    type ResponsesLogin, type ResponsesMe
} from '@/shared/api';
import type {RegistrationData} from '@/shared/api/types';


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registration: builder.mutation<void, RegistrationData>({
            query: (body) => ({ method: "post", url: "auth/registration", body }),
        }),
        registrationConfirmation: builder.mutation<void, RequestBodyRegistrationConformation>({
            query: (body) => ({ method: "post", url: "auth/registration-confirmation", body }),
        }),
        login: builder.mutation<ResponsesLogin, RequestBodyLogin>({
            query: () => ({ method: "post", url: "auth/login" }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({ method: "post", url: "auth/logout" }),
        }),
        me: builder.query<ResponsesMe, void>({
            query: () => "auth/me",
        }),
    }),
})

export const {useRegistrationMutation} = authApi