// src/features/auth/api/authApi.ts
import {
  baseApi,
  type RequestBodyLogin,
  type RequestBodyRegistrationConformation,
  type ResponsesLogin,
  type ResponsesMe
} from '@/shared/api'
import type {
  RegistrationData,
  RequestBodyGoogleLogin,
  RequestBodyResending,
  ResponseGoogleLogin,
  RequestCreateNewPassword,
  RequestRecoveryPassword,
  RequestResendRecoveryPassword,
} from '@/shared/api/types'
import type { UserDataResponse } from '@/features/publicUserApi/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Регистрация и подтверждения — просто проксируем на бэк
    registration: builder.mutation<void, RegistrationData>({
      query: (body) => ({ method: 'POST', url: 'proxy/auth/registration', body }),
    }),
    registrationConfirmation: builder.mutation<void, RequestBodyRegistrationConformation>({
      query: (body) => ({ method: 'POST', url: 'proxy/auth/registration-confirmation', body }),
    }),
    registrationEmailResending: builder.mutation<void, RequestBodyResending>({
      query: (body) => ({ method: 'POST', url: 'proxy/auth/registration-email-resending', body }),
    }),

    // Логин — идём на BFF-ручку (она положит токены в HttpOnly-куки)
    login: builder.mutation<ResponsesLogin, RequestBodyLogin>({
      query: (args) => ({
        url: 'auth/login',    // это /api/bff/auth/login (см. baseUrl в baseQuery)
        method: 'POST',
        body: args,
      }),
      invalidatesTags: ['Me'],
    }),

    // Логаут — тоже BFF-ручка (она очистит наши куки и дернёт бэковский logout)
    logout: builder.mutation<void, void>({
      query: () => ({ method: 'POST', url: 'auth/logout' }),
    }),

    // Текущий пользователь — через прокси на бэк (Authorization добавит BFF)
    me: builder.query<ResponsesMe, void>({
      query: () => 'proxy/auth/me',
      providesTags: ['Me'],
    }),

    // Профиль — тоже через прокси
    myProfile: builder.query<UserDataResponse, void>({
      query: () => 'proxy/users/profile',
    }),

    // Google login (если это чистый POST на API) — проксируем
    // (если у вас OAuth-редирект — это отдельная тема, но POST так ок)
    googleLogin: builder.mutation<ResponseGoogleLogin, RequestBodyGoogleLogin>({
      query: (args) => ({
        url: 'proxy/auth/google/login',
        method: 'POST',
        body: args,
      }),
    }),

    // Восстановление пароля — все эндпоинты через прокси
    recoveryPassword: builder.mutation<void, RequestRecoveryPassword>({
      query: (body) => ({
        url: 'proxy/auth/password-recovery',
        method: 'POST',
        body,
      }),
    }),
    createNewPassword: builder.mutation<void, RequestCreateNewPassword>({
      query: (body) => ({
        url: 'proxy/auth/new-password',
        method: 'POST',
        body,
      }),
    }),
    resendRecoveryPassword: builder.mutation<void, RequestResendRecoveryPassword>({
      query: (body) => ({
        url: 'proxy/auth/password-recovery-resending',
        method: 'POST',
        body,
      }),
    }),
    checkRecoveryCode: builder.mutation<void, { recoveryCode: string }>({
      query: (body) => ({
        url: 'proxy/auth/check-recovery-code',
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
  useCheckRecoveryCodeMutation,
} = authApi