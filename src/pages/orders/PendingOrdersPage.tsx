import { useOrdersWithSSE } from "@/hooks/usePendingOrders";
import type { Order } from "@/types/order";
import { PendingOrder } from "@/components/PendingOrder";
export function PendingOrdersPage() {
    const { query, markDone } = useOrdersWithSSE()
    const { data } = query
    
    return (
        <div>
        <h1 className="text-center text-2xl">Pending Orders</h1>
        {data && data.map((order: Order) => (
            <PendingOrder key={order.id} order={order} markDone={markDone.mutate}/>
        ))}
        {/* Add any additional UI elements or components here */}
        </div>
    );
}