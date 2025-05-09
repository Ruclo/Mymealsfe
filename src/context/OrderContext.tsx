import { createContext, useState } from "react"
import type { CurrentOrder, CurrentOrderItem, Order, OrderItem } from "@/types/order"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect} from "react"
import { useContext } from "react"

type OrderContextType = {
    getOrder: () => Order | null
    getOrderItems: () => OrderItem[]
    getCurrentOrder: () => CurrentOrder
    saveCurrentOrder: (currentOrder: CurrentOrder) => void
    getCurrentOrderItems: () => CurrentOrderItem[]
    getCurrentOrderItem: (mealID: number) => CurrentOrderItem | undefined
    setQuantity: (mealID: number, quantity: number) => void
    deleteCurrentOrderItem: (mealID: number) => void
    updateOrder: (order: Order) => void
}

const defaultCurrentOrder: CurrentOrder = {
    table_no: 1,
    notes: "",
    items: []
}


const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderContextProvider({children}: {children: React.ReactNode}) {
    const [isLoading, setLoading] = useState(true)
    const [currentOrder, setCurrentOrder] = useState<CurrentOrder>(structuredClone(defaultCurrentOrder))
    const [order, setOrder] = useState<Order | null>(null)
    const navigate = useNavigate()


    // Load order from local storage upon being loaded
    useEffect(() => {
        setLoading(true)
        const stored = localStorage.getItem("order")
        console.log(stored)
        if (stored) {
          const parsed = JSON.parse(stored)
          setOrder(parsed)
          navigate(`/order/${parsed.id}`)
        }
        setLoading(false)
      }, [])

    const getOrder = () => order

    const getOrderItems = () => {
        if (order == null) {
            return []
        }
        return order.items
    }

    const getCurrentOrder = () => currentOrder

    const saveCurrentOrder = (currentOrder: CurrentOrder) => {
        setCurrentOrder(currentOrder)
    }

    const getCurrentOrderItems = () => 
        {
            if (currentOrder == null) {
                return []
            }
            return currentOrder.items
        }
    
    const getCurrentOrderItem = (mealID: number) => {
        return getCurrentOrderItems().find(item => item.meal_id === mealID)
    }
    
    const setQuantity = (mealID: number, quantity: number) => {
        const exists = getCurrentOrderItems().find((item) => item.meal_id === mealID)
        const currentOrder = getCurrentOrder()

        if (exists) {
            currentOrder.items = (getCurrentOrderItems().map(item => item.meal_id === mealID ? { ...item, quantity } : item))
            return
        }
    
        currentOrder.items = [...getCurrentOrderItems(), {meal_id: mealID, quantity: quantity}]
        }
    

    const deleteCurrentOrderItem = (mealID: number) => {
        const currentOrder = getCurrentOrder()
        currentOrder.items = getCurrentOrderItems().filter(item => item.meal_id != mealID)
        
    }
    const updateOrder = (order: Order) => {
        setOrder(order)
        localStorage.setItem('order', JSON.stringify(order))
        setCurrentOrder(structuredClone(defaultCurrentOrder))
    }

    return (
    <OrderContext.Provider value={{getOrder, getCurrentOrder, saveCurrentOrder, getOrderItems, getCurrentOrderItems, getCurrentOrderItem, setQuantity, deleteCurrentOrderItem, updateOrder}}>
        {!isLoading && children}
    </OrderContext.Provider>
    )
}

export const useOrderContext = () => {
    const ctx = useContext(OrderContext)
    if (!ctx) throw new Error("useOrder must be used within OrderProvider")
    return ctx
}

export const OrderContextRoute = () => {
    return (
      <OrderContextProvider>
        <div id="outlet-container">
          <Outlet>

          </Outlet>
        </div>
      </OrderContextProvider>
    )
  }