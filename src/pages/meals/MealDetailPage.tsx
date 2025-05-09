import { useLoaderData, useNavigate } from "react-router-dom";
import { QuantityStepper } from "@/components/quantity-stepper";
import type { Meal } from "@/types/meal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrderContext } from "@/context/OrderContext";

export function MealDetailPage() {
    const navigate = useNavigate()
    const meal: Meal = useLoaderData()
    
    const { getCurrentOrderItem, setQuantity, deleteCurrentOrderItem } = useOrderContext()
    const currentOrderItem = getCurrentOrderItem(meal.id)

    const [quantity, setQuantityState] = useState(currentOrderItem == undefined ? 1 : currentOrderItem.quantity)

    const onAdd = () => {
        setQuantity(meal.id, quantity)
        navigate(-2)
    }

    const onRemove = () => {
        deleteCurrentOrderItem(meal.id)
        navigate(-2)
    }

    return (
        <div className="max-w-1/3 my-10 ml-4 md:ml-12 lg:ml-24">
            <h2 className="text-2xl my-2">
                {meal.name}
            </h2>
            <div className="flex my-2">
                <img src={meal.image_url} className="aspect-1/1" width="200" />
                <div className="mx-2">
                    <div>
                        {meal.category}
                    </div>
                    <div>
                        Price: {meal.price}€
                    </div>
                </div>
            </div>
            <div className="my-2">
                {meal.description}
            </div>
            <div className="flex justify-between my-2 items-center">
                <span>
                    Quantity:
                </span>
                <span>
                    <QuantityStepper quantity={quantity} onChange={setQuantityState}/>
                </span>
            </div>
            <div className="flex justify-between">
                <Button onClick={onAdd}>
                    Add
                </Button>
                <Button onClick={onRemove}>
                    Remove
                </Button>
            </div>
        </div>
    )
}