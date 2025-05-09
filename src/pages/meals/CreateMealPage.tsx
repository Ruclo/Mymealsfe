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

export function CreateMealPage() {
    const addMeal = useAddMeal()
    const navigate = useNavigate()

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
        await addMeal.mutateAsync(data)
        navigate(-1)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("photo", file)
        }
    }
    
    return (
        <div className="w-1/3 my-10 ml-4 md:ml-12 lg:ml-24">
            <h2 className="text-xl text-center">
                Create a new meal
            </h2>
            <div className="my-5">
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
                                <ImageUpload onChange={handleChange}/>          
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
                <div className="flex justify-between">       
                    <Button type="submit">Submit</Button>
                </div>  
                </form>
            </Form>

            </div>
        </div>
    )
}