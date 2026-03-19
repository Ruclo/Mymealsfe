import { UpdateMealData, updateMealSchema } from "@/schemas/meal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectLabel, SelectItem, SelectContent, SelectGroup } from "@/components/ui/select"
import { Meal, MealCategory } from "@/types/meal"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ImageUpload"
import { useDeleteMeal, useUpdateMeal } from "@/api/meals"
import { useNavigate, useParams } from "react-router-dom"
import { useMealQuery } from "@/api/meals"
import { useEffect } from "react"

export function EditMealPage() {
    const { mealID } = useParams()
    const { data, isLoading } = useMealQuery()
    const meal: Meal | undefined = data?.find(item => item.id === Number(mealID))
    const updateMeal = useUpdateMeal()
    const deleteMeal = useDeleteMeal()

    const navigate = useNavigate()

    const form = useForm<UpdateMealData>({
        resolver: zodResolver(updateMealSchema),
        defaultValues: {
            id: 0,
            name: "",
            category: MealCategory.MainCourses,
            description: "",
            price: 0,
        },
    })

    useEffect(() => {
        if (!meal) {
            return
        }
        form.reset({
            id: meal.id,
            name: meal.name,
            category: meal.category,
            description: meal.description,
            price: meal.price,
        })
    }, [meal, form])

    const onSubmit = async (data: UpdateMealData) => {
        await updateMeal.mutateAsync(data)
        navigate(-1)
    }

    const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!meal) {
            return
        }
        await deleteMeal.mutateAsync(meal.id)
        navigate(-1)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("photo", file)
        }
    }
    
    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (!meal) {
        return <div className="p-4">Meal not found</div>
    }

    return (
        <div className="form-shell">
            <div className="text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                <h2 className="display-serif form-title">Edit meal</h2>
                <p className="form-subtitle mt-2">Update details, price, or replace the image.</p>
            </div>
            <div className="form-card">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex justify-between">
                    <div className="flex flex-col justify-evenly">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Meal name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a meal category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {Object.values(MealCategory).map(category =>(
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <div>
                    <FormField
                    control={form.control}
                    name="photo"
                    render={() => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageUpload onChange={handleChange} initialImage={meal.image_url}/>          
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) =>
                        (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Meal description" {...field} />
                        </FormControl>
                        
                        <FormMessage />
                    </FormItem>
                    )}
                />

                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) =>
                        (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input placeholder="Price" {...field} />
                        </FormControl>
            
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="flex justify-end gap-3">       
                    <Button type="submit">Save changes</Button>
                    <Button onClick={onDelete} variant="outline">Delete</Button>
                </div>  
                </form>
            </Form>

            </div>
        </div>
    )
}
