import { type Order } from "@/types/order";
import type { OrderData } from "@/schemas/order";
import { ReviewData } from "@/schemas/review";
import { QueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { mealQueryOptionsWithDeleted, mealsLoader } from "./meals";

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

const INITIAL_OLDER_THAN = new Date(0)

const fetchOrders = async (olderThan: Date, pageSize: number): Promise<Order[]> => {
    let urlString = `/api/orders?pageSize=${pageSize}`
    if (olderThan !== INITIAL_OLDER_THAN) {
        urlString += `&olderThan=${olderThan.toISOString()}`
    }

    const res = await fetch(urlString, {
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error(JSON.stringify(res.body))
    }
    return await res.json()
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

export const ordersLoader = (queryClient: QueryClient) => {
    return async () => await queryClient.ensureQueryData(mealQueryOptionsWithDeleted)
}