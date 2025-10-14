export type ResponsesTypeError = {
  statusCode: number
  messages: [
    {
      message: 'string'
      field: 'string'
    },
  ]
  error: 'string'
}

export type RegistrationData = {
  userName: string
  email: string
  password: string
  baseUrl?: string
}

export type RequestBodyLogin = Omit<RegistrationData, 'userName' | 'baseUrl'>
export type RequestBodyResending = Omit<RegistrationData, 'userName' | 'password'>
export type RequestBodyGoogleLogin = {
  redirectUrl: string
  code: string
}

export type ResponsesLogin = {
  accessToken: string
}
export type ResponseGoogleLogin = {
  accessToken: string
  email: string
}

export type ResponsesMe = {
  userId: number
  userName: string
  email: string
  isBlocked: boolean
}

export type RequestBodyRegistrationConformation = {
  confirmationCode: string
}

export type RequestRecoveryPassword = { email: string; baseUrl: string; recaptcha: string }
export type RequestCreateNewPassword = { newPassword: string; recoveryCode: string }
export type RequestResendRecoveryPassword = { email: string; baseUrl: string }

export type GeneralInformaitionValues = {
  userName: string
  firstName: string
  lastName: string
  dateOfBirth: Date | string
  country: string
  city: string
  aboutMe: string
}
export type CreatePaymentsSubscription = {
  "typeSubscription": 'MONTHLY' |'DAY'| 'WEEKLY',
  "paymentType": "STRIPE" | 'PAYPAL',
  "amount": number,
  "baseUrl": string
}
export type CreatePaymentsSubscriptionResponse = {
 url: string
}
