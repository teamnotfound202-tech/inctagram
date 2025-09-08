import {isErrorWithMessage} from '@/shared/lib/utils/isErrorWithMessage';
import type {BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue} from '@reduxjs/toolkit/query';

export const handleError = (
    api: BaseQueryApi,
    result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
) => {
    let error = "Some error occurred"
    if (result.error) {
        switch (result.error.status) {
            case "FETCH_ERROR":
            case "PARSING_ERROR":
            case "CUSTOM_ERROR":
                error = result.error.error
                break
            case 403:
                error = "403 Forbidden Error. Check API-KEY"
                break
            case 400:
            case 404:
            case 500:
                if (isErrorWithMessage(result.error.data.messages[0])) {
                    error = result.error.data.messages[0].message
                } else {
                    error = JSON.stringify(result.error.data)
                }
                break
            default:
                error = JSON.stringify(result.error)
                break
        }
        console.log('error', error);
        // api.dispatch(setAppErrorAC({ error }))
    }
}
