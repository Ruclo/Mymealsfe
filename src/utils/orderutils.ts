import type { Meal } from "../types/meal"

export function getTotalPrice(items: { meal_id: number; quantity: number }[], meals: Meal[]): number {
    return items.reduce((total, item) => {
        const itemPrice = meals.find(meal => meal.id === item.meal_id)?.price
        if (itemPrice == undefined) {
            throw new Error("Undefined price")
        }
        return total += item.quantity * itemPrice
    }, 0)
}

export function getMealById(mealId: number, meals: Meal[]): Meal {
    const meal = meals.find(meal => meal.id === mealId)
    if (!meal) {
        throw new Error("Meal not found")
    }
    return meal
}