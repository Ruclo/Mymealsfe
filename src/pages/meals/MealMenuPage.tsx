import { MealList } from "@/components/MealList";
import { useMealQuery } from "@/api/meals";

export function MealMenuPage() {
    const { data, isLoading } = useMealQuery()

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (!data) {
        return <div className="p-4">No meals found</div>
    }

    return (
        <div className="h-100 w-screen">
            <header className="py-5 text-center font-bold text-xl">
                Menu
            </header>
            <div className="flex flex-col items-center justify-center">
                <MealList meals={data} linkMutation={(id: number) => `${id}`}/>
            </div>
        </div>
    )
}
