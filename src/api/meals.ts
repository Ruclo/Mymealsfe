import { Meal } from "@/types/meal";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMealData, UpdateMealData } from "@/schemas/meal";
import { apiRequest } from "@/api/client";

async function fetchMeals(): Promise<Meal[]> {
    return await apiRequest<Meal[]>('/api/meals')
}

const mealQueryOptions = queryOptions({
    queryKey: ['meals'],
    queryFn: () => fetchMeals()
})

const createMeal = async (meal: CreateMealData) => {
    const formData = new FormData()
    formData.append("name", meal.name)
    formData.append("category", meal.category)
    formData.append("description", meal.description)
    formData.append("photo", meal.photo)
    formData.append("price", String(meal.price))

    return await apiRequest<Meal>('/api/meals', { method: "POST", body: formData })
}

const updateMeal = async (meal: UpdateMealData) => {
    const formData = new FormData()
    formData.append("name", meal.name)
    formData.append("category", meal.category)
    formData.append("description", meal.description)
    if (meal.photo) {
        formData.append("photo", meal.photo)
    }
    formData.append("price", String(meal.price))

    return await apiRequest<Meal>(`/api/meals/${meal.id}`, { method: "PUT", body: formData })
}

const deleteMeal = async (id: number) => {
    await apiRequest<void>(`/api/meals/${id}`, { method: "DELETE" })
    return id
}

export function useAddMeal() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createMeal,
      onSuccess: (meal) => {
        queryClient.setQueryData(['meals'], (old: Meal[] = []) => [...old, meal]);
      },
});
}

export function useUpdateMeal() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateMeal,
      onSuccess: () => queryClient.invalidateQueries({queryKey: ['meals']})
    })
}

export function useDeleteMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMeal,
        onSuccess: (id) => {
            queryClient.setQueryData(['meals'], (old: Meal[] = []) => {
                const index = old.findIndex(m => m.id === id)
                if (index === -1) return old
                const newMeals = [...old]
                newMeals.splice(index, 1)
                return newMeals
            });
        }
    })
}

export const useMealQuery = () => useQuery(mealQueryOptions)
