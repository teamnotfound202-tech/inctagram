import { ISOStringFormat } from 'date-fns'

export enum PaymentService {
  STRIPE = 'Stripe',
  PAYPAL = 'PayPal',
  CREDIT_CARD = 'Credit Card',
}

export type KeysPaymentService = keyof typeof PaymentService

export enum SubscriptionType {
  MONTHLY = '1 month',
  DAY = '1 day',
  WEEKLY = '7 days',
}

export type KeysSubscriptionType = keyof typeof SubscriptionType

export type PaymentType = {
  subscriptionId: string
  dateOfPayment: ISOStringFormat
  endDateOfSubscription: ISOStringFormat
  price: number
  subscriptionType: KeysSubscriptionType
  paymentType: KeysPaymentService
}
export type CreatePaymentsSubscription = {
  typeSubscription: 'MONTHLY' | 'DAY' | 'WEEKLY'
  paymentType: 'STRIPE' | 'PAYPAL'
  amount: number
  baseUrl: string
}
export type CreatePaymentsSubscriptionResponse = {
  url: string
}

export type Subscription = {
  id: string
  text: string
  value: 'MONTHLY' |'DAY'| 'WEEKLY'
  amount: number
}

export type SubscriptionsType = Subscription[]

export type CurrentSubscriptionType = {
  userId: number
  subscriptionId: string
  dateOfPayment: ISOStringFormat
  endDateOfSubscription: ISOStringFormat
  autoRenewal: boolean
}
export type CurrentSubscriptionsResponse = {
  data: CurrentSubscriptionType[],
  hasAutoRenewal: boolean
}
export type PaymantType = 'STRIPE' | 'PAYPAL'
