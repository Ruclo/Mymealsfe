import { updateMealSchema, type UpdateMealData } from "@/schemas/meal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useLoaderData } from "react-router-dom"
import type { Meal } from "@/types/meal"
import { MealForm } from "@/components/MealForm"

export function EditMealPage() {

    const form = useForm<UpdateMealData>({resolver: zodResolver(updateMealSchema)})
    const data: Meal = useLoaderData()

    const onSubmit = async (data: UpdateMealData) => {
        return data
    }

    return (
        <div>
            <h2>
                Create a new meal
            </h2>
            <MealForm form={form} onSubmit={onSubmit} initialImage={data.image_url}/>
        </div>
    )
}