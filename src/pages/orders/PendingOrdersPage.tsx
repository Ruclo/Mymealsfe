import { useOrdersWithSSE } from "@/hooks/usePendingOrders";
import type { Order } from "@/types/order";
import { PendingOrder } from "@/components/PendingOrder";
export function PendingOrdersPage() {
    const { query, markDone } = useOrdersWithSSE()
    const { data } = query
    
    return (
        <div className="px-4 py-8">
            <header className="mb-8">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Staff</div>
                <h1 className="display-serif text-3xl">Pending Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">Live queue of meals that still need to be prepared.</p>
            </header>
            <div className="grid gap-4 md:grid-cols-2">
                {data && data.map((order: Order) => (
                    <PendingOrder key={order.id} order={order} markDone={markDone.mutate}/>
                ))}
            </div>
        </div>
    );
}
