import { useMealQuery } from "@/api/meals"
import { OrderItem } from "@/types/order"
import { Button } from "./ui/button"
import { useMemo, useState } from "react"
import { getMealById } from "@/utils/orderutils"

type PendingOrderItemProps = {
    item: OrderItem
    onMarkDone: (item: OrderItem) => void
}

export function PendingOrderItem({item, onMarkDone}: PendingOrderItemProps) {
    const {data} = useMealQuery()

    const difference = useMemo(() => {
        return item.quantity - item.completed
    }, [item.quantity, item.completed])

    const handleMarkDone = () => {
        onMarkDone(item)
    }

    return (
        data && <div className="pending-order-item flex items-center justify-between">
            <div>
                <span>{item.quantity}x{getMealById(item.meal_id, data).name}</span>
                {item.completed > 0 && <span>+{difference}</span>}
            </div>
            <div>
                <Button onClick={handleMarkDone}>Mark as done</Button>
            </div>
        </div>
    )
}