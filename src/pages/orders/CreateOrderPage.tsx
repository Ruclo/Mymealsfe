import { useOrderContext } from "@/context/OrderContext";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderData } from "@/schemas/order";
import { Form } from "@/components/ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import { useLoaderData, useNavigate } from "react-router-dom";
import type { Meal } from "@/types/meal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { createOrder } from "@/api/orders";
import type { Order } from "@/types/order";
import { Plus } from "lucide-react";
import { getTotalPrice } from "@/utils/orderutils";

export function CreateOrderPage() {
    const navigate = useNavigate()
    const { getCurrentOrder, saveCurrentOrder, updateOrder } = useOrderContext()
    const currentOrder = getCurrentOrder()

    const meals: Meal[] = useLoaderData()

    const form = useForm<OrderData>({
        resolver: zodResolver(orderSchema),
        defaultValues: currentOrder
    })
    
    const items = form.getValues('items')

    // Total price
    const price = useMemo(() => getTotalPrice(items, meals), [items, meals])

    // Save current order to context when leaving this page
    useEffect(() => {
        return () => {
            const currOrder = form.getValues()
            saveCurrentOrder(currOrder)
        }
    }, [])

    
    const onSubmit = async (orderData: OrderData) => {
        const order: Order = await createOrder(orderData)
        updateOrder(order)

        //resets current order items
        form.setValue('items', [])
        navigate(`/order/${order.id}`)
    }

    return (
        <div className="w-1/3 my-10 ml-4 md:ml-12 lg:ml-24">  
            <h2 className="text-xl text-center">
                Create an order
            </h2>

            <div className="my-5">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="table_no"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Table number</FormLabel>
                        <FormControl>
                        <Input placeholder="Table number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                        <Input placeholder="Notes" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />


                    <FormField
                    control={form.control}
                    name="items"
                    render={({ field }) =>
                        
                        {console.log(field)
                            return (
                    <FormItem>
                        <FormLabel>Meals</FormLabel>
                        
                        {field.value.map(item => {
                            const meal = meals.find(meal => meal.id === item.meal_id)
                            return (
                            <Link to={"meals/" + meal?.id} key={item.meal_id}>

                            <div className="flex items-center justify-between">
                                <img className="rounded-full aspect-square" src={meal?.image_url} width="100" />
                                <div className="">
                                    {item.quantity}x {meal?.name}
                                </div>
                            </div>
                            </Link>
                    )})}
                    <div className="flex flex-col items-center">

                        <Link to='meals'>
                            <Plus />
                        </Link>
                    </div>
                        <FormMessage />
                    </FormItem>
                    )}}
                />
                <div className="flex justify-between">
                                            
                    <Button type="submit">Submit</Button>
                    <span>
                        Price: {price}€
                    </span>
                </div>  
                </form>
            </Form>  
            </div>
        </div>
    )
}