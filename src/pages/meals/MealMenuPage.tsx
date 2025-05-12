import { MealList } from "@/components/MealList";
import { Meal } from "@/types/meal";
import { useLoaderData } from "react-router-dom";

export function MealMenuPage() {
    const meals: Meal[] = useLoaderData()

    return (
        <div className="h-100 w-screen">
            <header className="py-5 text-center font-bold text-xl">
                Menu
            </header>
            <div className="flex flex-col items-center justify-center">
                <MealList meals={meals} linkMutation={(id: number) => `${id}`}/>
            </div>
        </div>
    )
}