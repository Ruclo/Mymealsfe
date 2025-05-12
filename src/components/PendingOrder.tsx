import { Order } from "@/types/order"
import { UseMutateFunction } from "@tanstack/react-query"
import type { OrderItem } from "@/types/order"
import { PendingOrderItem } from "@/components/PendingOrderItem"
type PendingOrderProps = {
    order: Order,
    markDone: UseMutateFunction<any, Error, { orderID: number; mealID: number; }, unknown>
}


export function PendingOrder({ order, markDone }: PendingOrderProps) {

    const handleMarkDone = (item: OrderItem) => {
        markDone({ orderID: order.id, mealID: item.meal_id })
    }
    console.log('PendingOrder', order.items)
    const filteredItems = order.items.filter(item => item.completed < item.quantity)

    return (
        <div className="pending-order w-1/3">
            <div className="flex justify-between">
                <div>Order ID: {order.id}</div>
                <div>Table n.: {order.table_no}</div>
            </div>
            <div className="flex">
                {filteredItems.map((item) => (
                    <PendingOrderItem key={item.meal_id} item={item} onMarkDone={handleMarkDone}/>
                ))}
            </div>
        </div>
    )
}