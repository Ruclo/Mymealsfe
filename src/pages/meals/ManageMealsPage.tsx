import { useMealQuery } from "@/api/meals";
import { MealList } from "@/components/MealList";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
export function ManageMealsPage() {
    const {data} = useMealQuery()

    return (
        <div className="w-screen h-100">
            <header className="py-5 text-center font-bold text-xl flex justify-center items-center">
                <div>
                    Manage meals
                </div>
                <Link to="create" className="ml-2">
                    <PlusCircle />
                </Link>
            </header>
            <div className="flex flex-col items-center justify-center">
                {data != null && <MealList meals={data} linkMutation={(id:number) => `${id}/edit`}/>}
            </div>
        </div>
)}
