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
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="text-2xl">
                    Thank you for your order.
                </h2>
                <div>
                    Your order with ID {order.id} is in making.
                </div>
                <div className="flex justify-between w-1/1">
                    {!existsReview && <Link to='review'> Add review</Link>}
                    <Link to='order-more'>Order more items</Link>
                </div>
            </div>        
        </div>
    )
}