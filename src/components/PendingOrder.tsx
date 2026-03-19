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
        <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Order #{order.id}</div>
                <div className="rounded-full bg-black/5 px-3 py-1 text-xs">Table {order.table_no}</div>
            </div>
            <div className="mt-4 space-y-2">
                {filteredItems.map((item) => (
                    <PendingOrderItem key={item.meal_id} item={item} onMarkDone={handleMarkDone}/>
                ))}
            </div>
        </div>
    )
}
