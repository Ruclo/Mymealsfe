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
import { createOrder } from "@/api/orders";
import type { Order } from "@/types/order";
import { Plus } from "lucide-react";
import { getTotalPrice } from "@/utils/orderutils";
import { useMealQuery } from "@/api/meals";

export function CreateOrderPage() {
    const navigate = useNavigate()
    const { getCurrentOrder, saveCurrentOrder, updateOrder } = useOrderContext()
    const currentOrder = getCurrentOrder()
    const { data, isLoading } = useMealQuery()
    const meals = data ?? []

    const form = useForm<OrderData>({
        resolver: zodResolver(orderSchema),
        defaultValues: currentOrder
    })
    
    const items = form.getValues('items')
    const price = useMemo(() => meals.length ? getTotalPrice(items, meals) : 0, [items, meals])

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

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    return (
        <div className="form-shell">
            <div className="text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Table</div>
                <h2 className="display-serif form-title">Create an order</h2>
                <p className="form-subtitle mt-2">Start a new order and add meals from the menu.</p>
            </div>

            <div className="form-card">
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
                        
                        {
                            return (
                    <FormItem>
                        <FormLabel>Meals</FormLabel>
                        
                        {field.value.map(item => {
                            const meal = meals.find(meal => meal.id === item.meal_id)
                            return (
                            <Link to={"meals/" + meal?.id} key={item.meal_id}>

                            <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                                <img className="rounded-full aspect-square" src={meal?.image_url} width="80" />
                                <div className="">
                                    {item.quantity}x {meal?.name}
                                </div>
                            </div>
                            </Link>
                    )})}
                    <div className="flex flex-col items-center">

                        <Link to='meals' className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70">
                            <Plus />
                        </Link>
                    </div>
                        <FormMessage />
                    </FormItem>
                    )}}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">                           
                    <span className="text-sm text-muted-foreground">
                        Total: <span className="font-semibold text-foreground">{price}€</span>
                    </span>
                    <Button type="submit">Place order</Button>
                </div>  
                </form>
            </Form>  
            </div>
        </div>
    )
}
