import {Table} from "@/shared/ui/Table/Table";
import {TableHead} from "@/shared/ui/Table/TableHead/TableHead";
import {TableRow} from "@/shared/ui/Table/TableRow/TableRow";
import {TableBody} from "@/shared/ui/Table/TableBody/TableBody";
import {TableDataCell} from "@/shared/ui/Table/TableDataCell/TableDataCell";
import {TableH} from "@/shared/ui/Table/TableH/TableH";
import {useFetchMyPaymentsQuery} from "@/features/payments/api/payments-api";
import {PaymentService, SubscriptionType} from "@/features/payments/api/types";
import {SuperPagination} from "@/shared/ui";
import {useState} from "react";

export const PaymentTable = () => {
    const {data: payments} = useFetchMyPaymentsQuery()

    //Тестовые данные
    /*const payments = [
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 1,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 2,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 3,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 4,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 5,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price:6,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 7,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 8,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 9,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 11,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 12,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 13,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
        {
            dateOfPayment: "2025-10-13T12:04:31.082Z",
            endDateOfSubscription: "2025-11-12T12:04:31.056Z",
            paymentType: "STRIPE",
            price: 10,
            subscriptionId: "sub_1SHkTPJMgDdGnDBXoloLxTNd",
            subscriptionType: "MONTHLY",
            userId: 5
        },
    ]*/

    const [page, setPage] = useState(1);
    const [itemsCount, setItemsCount] = useState(10);

    const pageChangeHandler = (page: number, count: number) => {
        setPage(page);
        setItemsCount(count);
    }

    const shownPayments = []
    let i: number = (page - 1) * itemsCount
    if (payments) {
        //берем из пришедшего массива оплат только нужную порцию, чтобы отрисовать
        while (i <= page * itemsCount - 1 && i < payments.length) {
            shownPayments.push(
                <TableRow key={payments[i].id}>
                    <TableDataCell>{new Date(payments[i].dateOfPayment).toLocaleDateString('ru')}</TableDataCell>
                    <TableDataCell>{new Date(payments[i].endDateOfSubscription).toLocaleDateString('ru')}</TableDataCell>
                    <TableDataCell>$ {payments[i].price}</TableDataCell>
                    <TableDataCell>{SubscriptionType[payments[i].subscriptionType]}</TableDataCell>
                    <TableDataCell>{PaymentService[payments[i].paymentType]}</TableDataCell>
                </TableRow>
            )
            i++
        }
    }

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
                    {shownPayments}
                </TableBody>
            </Table>
            <SuperPagination
                itemsCount={itemsCount}
                page={page}
                totalCount={payments?.length || 0}
                onChange={pageChangeHandler}/>
        </div>
    )
}
