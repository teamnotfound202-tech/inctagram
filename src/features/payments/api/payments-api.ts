import {baseApi} from '@/shared/api'
import {PaymentType} from "@/features/payments/api/types";

export const paymentsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        fetchMyPayments: builder.query<PaymentType[], void>({
            query: () => `/subscriptions/my-payments`,
            providesTags: ['Payments'],
        }),
    }),
})
export const {
    useFetchMyPaymentsQuery
} = paymentsApi
