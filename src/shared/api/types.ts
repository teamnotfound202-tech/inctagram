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

export type RequestBodyRegistration = {
    "userName": string,
    "email": string,
    "password": string
}

export type RequestBodyLogin = Omit<RequestBodyRegistration, 'userName'>

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
    "confirmationCode": boolean
}