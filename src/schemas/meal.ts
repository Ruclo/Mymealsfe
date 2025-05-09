import { MealCategory } from "@/types/meal"
import { z } from "zod"

const baseMealSchema = z.object({
    name: z.string().min(1, {
        message: "Meal must have a name"
    }),
    category: z.nativeEnum(MealCategory),
    description: z.string().min(1, {message:
        "Meal must have a description"
    }),
    price: z.coerce.number().gt(0, {
        message: "Meal must have a price"
    })
})

export const createMealSchema = baseMealSchema.extend({
    photo: z
        .instanceof(File)
        .refine(file => file.size < 5_000_000, "File must be less than 5MB")
        .refine(file => file.type.startsWith("image/"), "File must be an image"),
    
})

export type CreateMealData = z.infer<typeof createMealSchema>

export const updateMealSchema = baseMealSchema.extend({
    photo: z
        .instanceof(File)
        .refine(file => file.size < 5_000_000, "File must be less than 5MB")
        .refine(file => file.type.startsWith("image/"), "File must be an image")
        .optional(),
})

export type UpdateMealData = z.infer<typeof updateMealSchema>