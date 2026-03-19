import { useMealQuery } from "@/api/meals";
import { MealList } from "@/components/MealList";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
export function ManageMealsPage() {
    const {data} = useMealQuery()

    return (
        <div className="px-4 py-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                    <h1 className="display-serif text-3xl">Manage meals</h1>
                </div>
                <Link to="create" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold transition hover:bg-white">
                    <PlusCircle className="h-4 w-4" />
                    Add meal
                </Link>
            </header>
            {data != null && <MealList meals={data} linkMutation={(id:number) => `${id}/edit`}/>}
        </div>
)}
