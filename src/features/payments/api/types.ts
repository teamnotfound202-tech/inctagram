import {ISOStringFormat} from "date-fns";

export enum PaymentService {
    STRIPE = 'Stripe',
    PAYPAL = 'PayPal',
    CREDIT_CARD = 'Credit Card',
}

export type KeysPaymentService = keyof typeof PaymentService;

export enum SubscriptionType {
    MONTHLY = '1 month',
    DAY = '1 day',
    WEEKLY = '7 days'
}

export type KeysSubscriptionType = keyof typeof SubscriptionType;

export type PaymentType = {
    id: string
    dateOfPayment: ISOStringFormat
    endDateOfSubscription: ISOStringFormat
    price: number
    subscriptionType: KeysSubscriptionType
    paymentType: KeysPaymentService
}
