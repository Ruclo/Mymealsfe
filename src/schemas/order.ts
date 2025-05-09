import {z} from 'zod'

export const orderSchema = z.object({
    
    table_no: z.coerce.number().int().gt(0),
    notes: z.string(),
    items: z.array(z.object({
        meal_id: z.number(),
        quantity: z.number().int().gt(0)
    })).min(1, "You must choose at least 1 meal to complete an order")
})

export type OrderData = z.infer<typeof orderSchema>