import { Meal } from "@/types/meal";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import type { CreateMealData, MealData } from "@/schemas/meal";

async function fetchMeals(): Promise<Meal[]> {
    const res = await fetch('/api/meals', {
        credentials: 'include'
    })

    if (!res.ok) {
        throw new Error('Failed to fetch meals')
    }
    return await res.json()
}

const mealQueryOptions = queryOptions({
    queryKey: ['meals'],
    queryFn: () => fetchMeals()
})

export const mealsLoader = (queryClient: QueryClient) => 
    async () => await queryClient.ensureQueryData(mealQueryOptions)

export const mealByIdLoader = (queryClient: QueryClient) => 
    async ( params: LoaderFunctionArgs<{ mealID: string | null }> ) => {
        const { mealID } = params.params
        if (!mealID) {
            throw new Error('Meal ID is required')
        }
        if (isNaN(Number(mealID))) {
            throw new Error('Meal ID must be a number')
        }
    
        const meals = await queryClient.ensureQueryData(mealQueryOptions)
        return meals.find(meal => meal.id == Number(mealID))
    }


export const createMeal = async (meal: CreateMealData) => {
    const formData = new FormData()
    formData.append("name", meal.name)
    formData.append("category", meal.category)
    formData.append("description", meal.description)
    formData.append("photo", meal.photo)
    formData.append("price", String(meal.price))

    const res = await fetch('/api/meals', {
        credentials: "include",
        method: "POST",
        body: formData
    })

    if (!res.ok) {
        throw new Error(JSON.stringify(res.body))
    }

    const mealResponse: Meal = await res.json()
    return mealResponse
}

//mutator 
export function useAddMeal() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createMeal,
      onSuccess: (meal) => {
        queryClient.setQueryData(['meals'], (old: Meal[] = []) => [...old, meal]);
      },
});
}


export const useMealQuery = () => useQuery(mealQueryOptions)