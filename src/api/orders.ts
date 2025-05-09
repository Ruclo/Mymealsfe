import { type Order } from "@/types/order";
import type { OrderData } from "@/schemas/order";
import { ReviewData } from "@/schemas/review";

export async function createOrder(currentOrder: OrderData): Promise<Order> {
    const res = await fetch('/api/orders', {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(currentOrder)
    })

    if (!res.ok) {
        throw new Error(JSON.stringify(res.body))
    }

    return await res.json()
}

export async function updateOrderItems(orderId: number, currentOrder: OrderData): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/items`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(currentOrder.items)
    })

    if (!res.ok) {
        throw new Error(JSON.stringify(res.body))
    }

    return await res.json()
}

export async function createReview(review: ReviewData): Promise<void> {
    const formData = new FormData();
      
    formData.append("rating", review.rating.toString());
    formData.append("comment", review.comment);
    formData.append("order_id", review.order_id.toString());
      
    if (review.photos) {
    for (let i = 0; i < review.photos.length; i++) {
        formData.append("photos", review.photos[i]);
    }
    }

    const res = await fetch(`/api/orders/${review.order_id}/review`,
        {
            credentials: "include",
            method: "POST",
            body: formData
        }
    )

    if (!res.ok) {
        throw new Error(JSON.stringify(res.body))
    }
}