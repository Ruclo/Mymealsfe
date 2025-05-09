import { useMealQuery } from "@/api/meals";
import { MealList } from "@/components/MealList";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
export function ManageMealsPage() {
    const {data} = useMealQuery()

    return (
        <div>
            <div className="flex items-center">
                <h2>
                    Manage meals
                </h2>
                <Link to="create">
                    <PlusCircle />  
                </Link>
            </div> 
            {data != null && <MealList meals={data} linkMutation={(id:number) => `edit/${id}`}/>}
        </div>
    )
}