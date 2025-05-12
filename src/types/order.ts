export type Order = {
    id: number,
    table_no: number,
    notes: string,
    created_at: string,
    items: OrderItem[],
    review: Review
}

export type CurrentOrder = {
    table_no: number,
    notes: string,
    items: CurrentOrderItem[]
}

export type OrderItem = {
    meal_id: number,
    quantity: number,
    completed: number,
}

export type Review = {
    id: number,
    order_id: number,
    rating: number,
    comment: string,
    photo_urls: string[]
}

export type CurrentOrderItem = {
    meal_id: number,
    quantity: number,
}