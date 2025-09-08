export type ResponsesTypeError = {
    "statusCode": number,
    "messages": [
        {
            "message": "string",
            "field": "string"
        }
    ],
    "error": "string"
}

export type RegistrationData = {
    "userName": string,
    "email": string,
    "password": string,
    "baseUrl": string
}

export type RequestBodyLogin = Omit<RegistrationData, 'userName'>
export type RequestBodyResending = Omit<RegistrationData, 'userName' | 'password'>
export type RequestBodyGoogleLogin = {
    "redirectUrl": string,
    "code": string
}

export type ResponsesLogin = {
    "accessToken": string
}
export type ResponseGoogleLogin = {
    "accessToken": string,
    "email": string
}

export type ResponsesMe = {
    "userId": number,
    "userName": string,
    "email": string,
    "isBlocked": boolean
}

export type RequestBodyRegistrationConformation = {
    "confirmationCode": string
}
