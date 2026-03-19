import { useOrderContext } from "@/context/OrderContext";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderData } from "@/schemas/order";
import { Form } from "@/components/ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { updateOrderItems } from "@/api/orders";
import type { Order } from "@/types/order";
import { Plus } from "lucide-react";
import { useMealQuery } from "@/api/meals";

export function OrderMoreMealsPage() {
    const navigate = useNavigate()
    const { getOrder, getCurrentOrder, saveCurrentOrder, updateOrder } = useOrderContext()

    // Meals currently added to order but not yet ordered
    const currentOrder = getCurrentOrder()

    // Already ordered meals
    const order = getOrder()
    if (order == undefined) {
        throw new Error("Could not find your order")
    }

    const { data, isLoading } = useMealQuery()
    const meals = data ?? []

    const form = useForm<OrderData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            ...currentOrder,
            table_no: order.table_no,
            notes: order.notes,
        }
    })
    
    const items = form.getValues('items')
    const price = useMemo(() => {
        if (meals.length === 0) {
            return 0
        }
        return items.reduce((total, item) => {
            const itemPrice = meals.find(meal => meal.id === item.meal_id)?.price
            if (itemPrice == undefined) {
                throw new Error("Undefined price")
            }
            return total += item.quantity * itemPrice
        }, 0)
    }, [items, meals])

    //Save to context
    useEffect(() => {
        return () => {
            const currOrder = form.getValues()
            saveCurrentOrder(currOrder)
        }
    }, [])

    const onSubmit = async (orderData: OrderData) => {
        const newOrder: Order = await updateOrderItems(order.id, orderData)
        updateOrder(newOrder)

        // Reset order before saving
        form.setValue('items', [])
        navigate(`/order/${newOrder.id}`)
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    return (
        <div className="w-1/3 my-10 ml-4 md:ml-12 lg:ml-24">  
            <h2 className="text-xl text-center">
                Order more items
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
                        <Input disabled placeholder="Table number" {...field} />
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
                        <Input disabled placeholder="Notes" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />


                    <FormField
                    control={form.control}
                    name="items"
                    render={({ field }) =>
                        
                        {
                            return (
                    <FormItem>
                        <FormLabel>Meals</FormLabel>
                        {order.items.map (item => {
                            const meal = meals.find(meal => meal.id === item.meal_id)
                            return (
                            <div className="flex items-center justify-between">
                            <img className="rounded-full aspect-square" src={meal?.image_url} width="100" />
                            <div className="">
                                {item.quantity}x {meal?.name}
                            </div>
                            </div>
                            )})}

                        <hr className="border-black"/>
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
