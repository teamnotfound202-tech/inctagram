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

export type RequestBodyLogin = Omit<RegistrationData, 'userName' | 'baseUrl'>
export type RequestBodyResending = Omit<RegistrationData, 'userName' | 'password'>

export type ResponsesLogin = {
    "accessToken": string
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
