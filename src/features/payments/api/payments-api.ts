import { baseApi } from '@/shared/api'
import {
  CreatePaymentsSubscription,
  CreatePaymentsSubscriptionResponse,
  CurrentSubscriptionsResponse,
  PaymentType,
} from '@/features/payments/api/types'

export const paymentsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    fetchMyPayments: builder.query<PaymentType[], void>({
      query: () => `/subscriptions/my-payments`,
      providesTags: ['Payments'],
    }),
    fetchCurrentSubscription: builder.query<CurrentSubscriptionsResponse, void>({
      query: () => `/subscriptions/current-payment-subscriptions`,
      providesTags: ['Subscription'],
    }),
    cancelAutoRenewal: builder.mutation<void, void>({
      query: () => ({ url: `/subscriptions/canceled-auto-renewal`, method: 'POST' }),
      invalidatesTags: ['Subscription'],
    }),
    renewAutoRenewal: builder.mutation<void, void>({
      query: () => ({ url: `/subscriptions/renew-auto-renewal `, method: 'POST' }),
      invalidatesTags: ['Subscription'],
    }),
    createSubscription: builder.mutation<
      CreatePaymentsSubscriptionResponse,
      CreatePaymentsSubscription
    >({
      query: body => ({ url: `/subscriptions`, method: 'POST', body }),
    }),
  }),
})
export const {
  useFetchMyPaymentsQuery,
  useCreateSubscriptionMutation,
  useFetchCurrentSubscriptionQuery,
  useCancelAutoRenewalMutation,
  useRenewAutoRenewalMutation,
} = paymentsApi
