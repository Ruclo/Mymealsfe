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
        <div className="px-4 py-8">
            <header className="mb-8 text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Table Menu</div>
                <h1 className="display-serif text-4xl">Today’s Menu</h1>
                <p className="mt-2 text-sm text-muted-foreground">Browse by category and tap to add items.</p>
            </header>
            <MealList meals={data} linkMutation={(id: number) => `${id}`}/>
        </div>
    )
}
