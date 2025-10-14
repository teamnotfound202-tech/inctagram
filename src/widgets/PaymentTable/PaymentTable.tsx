// @flow
import * as React from 'react';
import {Table} from "@/shared/ui/Table/Table";
import {TableHead} from "@/shared/ui/Table/TableHead/TableHead";
import {TableRow} from "@/shared/ui/Table/TableRow/TableRow";
import {TableBody} from "@/shared/ui/Table/TableBody/TableBody";
import {TableDataCell} from "@/shared/ui/Table/TableDataCell/TableDataCell";
import {TableH} from "@/shared/ui/Table/TableH/TableH";

type PaymentService = 'Stripe' | 'Paypal';

type PaymentType = {
    id: string;
    dateOfPayment: string
    endDateOfSubscription: string
    price: number
    subscriptionType: number
    paymentType: PaymentService
}

type Props = {
    data: PaymentType[];
};

export const PaymentTable = ({data}: Props) => {

    return (
        <div>
            PaymentTable
            <Table>
                <TableHead>
                    <TableRow>
                        <TableH>Date of Payment</TableH>
                        <TableH>End date of subscription</TableH>
                        <TableH>Price</TableH>
                        <TableH>Subscription type</TableH>
                        <TableH>Payment type</TableH>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.map((payment: PaymentType) => (
                            <TableRow key={payment.id}>
                                <TableDataCell>{payment.dateOfPayment}</TableDataCell>
                                <TableDataCell>{payment.endDateOfSubscription}</TableDataCell>
                                <TableDataCell>{payment.price}</TableDataCell>
                                <TableDataCell>{payment.subscriptionType}</TableDataCell>
                                <TableDataCell>{payment.paymentType}</TableDataCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};