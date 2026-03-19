import { createMealSchema, type CreateMealData } from "@/schemas/meal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectLabel, SelectItem, SelectContent, SelectGroup } from "@/components/ui/select"
import { MealCategory } from "@/types/meal"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ImageUpload"
import { useAddMeal } from "@/api/meals"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ApiError } from "@/api/client"

export function CreateMealPage() {
    const addMeal = useAddMeal()
    const navigate = useNavigate()
    const [requestError, setRequestError] = useState<string | null>(null)

    const form = useForm<CreateMealData>({
        resolver: zodResolver(createMealSchema),
        defaultValues: {
            name: "",
            category: MealCategory.MainCourses,
            description: "",
            price: 0,
        }
    })

    const onSubmit = async (data: CreateMealData) => {
        setRequestError(null)

        try {
            await addMeal.mutateAsync(data)
            navigate(-1)
        } catch (err) {
            if (err instanceof ApiError) {
                setRequestError(err.message)
                return
            }

            if (err instanceof Error) {
                setRequestError(err.message)
                return
            }

            setRequestError("Failed to create meal. Please try again.")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("photo", file)
        }
    }
    
    return (
        <div className="form-shell">
            <div className="text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                <h2 className="display-serif form-title">Create a new meal</h2>
                <p className="form-subtitle mt-2">Add a new dish to the menu with image and details.</p>
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
                        <Input placeholder="Meal name" {...field} disabled={addMeal.isPending} />
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={addMeal.isPending}>
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
                                <ImageUpload onChange={handleChange} disabled={addMeal.isPending}/>          
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
                        <Textarea placeholder="Meal description" {...field} disabled={addMeal.isPending} />
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
                        <Input placeholder="Price" {...field} disabled={addMeal.isPending} />
                        </FormControl>
            
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {requestError && (
                    <div className="text-sm text-red-500">{requestError}</div>
                )}
                <div className="flex justify-end">       
                    <Button type="submit" disabled={addMeal.isPending}>
                        {addMeal.isPending ? "Creating meal..." : "Create meal"}
                    </Button>
                </div>  
                </form>
            </Form>

            </div>
        </div>
    )
}
