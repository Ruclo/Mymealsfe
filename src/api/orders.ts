import { type Order } from "@/types/order";
import type { OrderData } from "@/schemas/order";
import { ReviewData } from "@/schemas/review";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "@/api/client";

export async function createOrder(currentOrder: OrderData): Promise<Order> {
    return await apiRequest<Order>('/api/orders', { method: "POST", json: currentOrder })
}

export async function updateOrderItems(orderId: number, currentOrder: OrderData): Promise<Order> {
    return await apiRequest<Order>(`/api/orders/${orderId}/items`, { method: "POST", json: currentOrder.items })
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

    await apiRequest<void>(`/api/orders/${review.order_id}/review`, { method: "POST", body: formData })
}

const INITIAL_OLDER_THAN = new Date(0)

const fetchOrders = async (olderThan: Date, pageSize: number): Promise<Order[]> => {
    let urlString = `/api/orders?pageSize=${pageSize}`
    if (olderThan !== INITIAL_OLDER_THAN) {
        urlString += `&olderThan=${olderThan.toISOString()}`
    }

    return await apiRequest<Order[]>(urlString)
}

export const usePaginatedOrders = (pageSize: number) => {
    return useInfiniteQuery({
        queryKey: ["orders", pageSize],
        queryFn: async ({ pageParam }) => fetchOrders(pageParam, pageSize),
        getNextPageParam: (lastPage) => {
            if (lastPage.length < pageSize) {
                return null
            }
            const lastOrder = lastPage[lastPage.length - 1]
            return new Date(lastOrder.created_at)
        },
        initialPageParam: INITIAL_OLDER_THAN,
    })
}

