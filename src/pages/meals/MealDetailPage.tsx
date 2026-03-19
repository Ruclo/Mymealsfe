import { useNavigate, useParams } from "react-router-dom";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrderContext } from "@/context/OrderContext";
import { useMealQuery } from "@/api/meals";

export function MealDetailPage() {
    const navigate = useNavigate()
    const { mealID } = useParams()
    const { data, isLoading } = useMealQuery()
    const meal = data?.find(item => item.id === Number(mealID))
    
    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (!meal) {
        return <div className="p-4">Meal not found</div>
    }

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
        <div className="form-shell">
            <div className="form-card">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex-1">
                        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{meal.category}</div>
                        <h2 className="display-serif text-3xl mt-2">{meal.name}</h2>
                        <p className="mt-3 text-sm text-muted-foreground">{meal.description}</p>
                        <div className="mt-4 text-lg font-semibold">{meal.price}€</div>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src={meal.image_url} className="h-40 w-40 rounded-3xl object-cover shadow-md" />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Quantity</span>
                        <QuantityStepper quantity={quantity} onChange={setQuantityState}/>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={onAdd}>Add</Button>
                        <Button onClick={onRemove} variant="outline">Remove</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
