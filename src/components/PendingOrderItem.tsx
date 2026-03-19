import { useMealQuery } from "@/api/meals"
import { OrderItem } from "@/types/order"
import { Button } from "./ui/button"
import { useMemo } from "react"
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
        data && <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
            <div className="text-sm">
                <span className="font-semibold">{item.quantity}x</span> {getMealById(item.meal_id, data).name}
                {item.completed > 0 && <span className="ml-2 text-xs text-muted-foreground">+{difference} pending</span>}
            </div>
            <div>
                <Button onClick={handleMarkDone} className="h-8 rounded-full px-3 text-xs">Mark as done</Button>
            </div>
        </div>
    )
}
