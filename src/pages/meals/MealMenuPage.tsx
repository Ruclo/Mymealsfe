import { MealList } from "@/components/MealList";
import { Meal } from "@/types/meal";
import { useLoaderData } from "react-router-dom";

export function MealMenuPage() {
    const meals: Meal[] = useLoaderData()

    return (
        <div className="flex w-screen h-screen flex-col items-center justify-center">
            <header className="font-bold text-xl m-[0.5em]">
                Menu
            </header>
            <MealList meals={meals} linkMutation={(id: number) => `${id}`}/>
        </div>
    )
}