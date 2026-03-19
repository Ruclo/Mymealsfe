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
    <div className="space-y-10">
        {mealEntries.map(([category, meals]) => (
            <section key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="display-serif text-2xl">{category}</h2>
                    <div className="h-px flex-1 bg-border/60 ml-4" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {meals.map(meal => (
                        <Link to={linkMutation(meal.id)} key={meal.id} className="group">
                            <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <img className="h-14 w-14 rounded-full object-cover ring-2 ring-white" src={meal.image_url} />
                                    <div className="flex-1">
                                        <div className="font-semibold">{meal.name}</div>
                                        <div className="text-xs text-muted-foreground">{meal.description}</div>
                                    </div>
                                    <div className="text-sm font-semibold text-foreground/80">{meal.price}€</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        ))}
    </div>
  )
}
