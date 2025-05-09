export type Meal = {
    id: number,
    name: string,
    category: MealCategory,
    description: string,
    image_url: string,
    price: number,
}

export enum MealCategory {
    Drinks = 'Drinks',
    Starters = 'Starters',
    MainCourses = 'Main Courses',
    SideDishes = 'Side Dishes',
    Desserts = 'Desserts'
}
