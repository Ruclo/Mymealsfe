import type { Meal, MealCategory } from "@/types/meal";
import { Link } from "react-router-dom";

type MealListProps = {
  meals: Meal[];
  linkMutation: (id: number) => string;
};

function groupMealsByCategory(meals: Meal[]): Map<MealCategory, Meal[]> {
  return meals.reduce((map, meal) => {
    const category = meal.category
    const mealsInCategory = map.get(category) || [];
    mealsInCategory.push(meal);
    map.set(category, mealsInCategory);
    return map;
  }, new Map<MealCategory, Meal[]>());
}


export function MealList({meals, linkMutation}: MealListProps) {
  const groupedMeals = groupMealsByCategory(meals)
  const mealEntries = Array.from(groupedMeals.entries())
  return (
    <div>
        {mealEntries.map(([category, meals]) => (
            <div key={category}>
            <div className="text-center"><h1 className="font-bold">{category}</h1></div>
            <ul>
                {meals.map(meal => (
                    <li key={meal.id} className="m-[0.5em]">   
                    <Link to={linkMutation(meal.id)}>
                        <div className="flex gap-2">
                            <img className="w-[4em] h-[4em] rounded-full" width={100} src={meal.image_url} />
                            <div className="flex items-center justify-center">
                                {meal.name}
                            </div>
                            <div className="flex items-center justify-center">
                                {meal.price + '€'}
                            </div>
                        </div>
                    </Link>
                    </li>
                ))}
            </ul>
            </div>
        ))}
    </div>
  )
}