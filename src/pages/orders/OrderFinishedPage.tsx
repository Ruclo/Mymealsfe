import { useOrderContext } from "@/context/OrderContext";
import type { Order } from "@/types/order";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export function OrderFinishedPage() {
    
    const { getOrder } = useOrderContext()
    const order: Order | null = getOrder()
    if (order == null) {
        throw new Error("you havent made an order")
    }
    
    const existsReview = useMemo( () => order.review != null, [order.review])
    return (
        <div className="form-shell">
            <div className="form-card text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Order placed</div>
                <h2 className="display-serif text-3xl mt-2">
                    Thank you.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                    Your order #{order.id} is now in progress.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {!existsReview && <Link to='review' className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold transition hover:bg-white">Add review</Link>}
                    <Link to='order-more' className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5">Order more items</Link>
                </div>
            </div>        
        </div>
    )
}
