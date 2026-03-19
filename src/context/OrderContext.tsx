import { createContext, useState } from "react"
import type { CurrentOrder, CurrentOrderItem, Order, OrderItem } from "@/types/order"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
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
    const [currentOrder, setCurrentOrder] = useState<CurrentOrder>(structuredClone(defaultCurrentOrder))
    const [order, setOrder] = useState<Order | null>(null)


    // Load order from local storage upon being loaded
    useEffect(() => {
        const stored = localStorage.getItem("order")
        console.log(stored)
        if (stored) {
          const parsed = JSON.parse(stored)
          setOrder(parsed)
        }
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
        setCurrentOrder((prev) => {
            const exists = prev.items.find((item) => item.meal_id === mealID)
            if (exists) {
                return {
                    ...prev,
                    items: prev.items.map(item => item.meal_id === mealID ? { ...item, quantity } : item)
                }
            }
            return {
                ...prev,
                items: [...prev.items, {meal_id: mealID, quantity: quantity}]
            }
        })
    }
    

    const deleteCurrentOrderItem = (mealID: number) => {
        setCurrentOrder((prev) => ({
            ...prev,
            items: prev.items.filter(item => item.meal_id != mealID)
        }))
    }
    const updateOrder = (order: Order) => {
        setOrder(order)
        localStorage.setItem('order', JSON.stringify(order))
        setCurrentOrder(structuredClone(defaultCurrentOrder))
    }

    return (
    <OrderContext.Provider value={{getOrder, getCurrentOrder, saveCurrentOrder, getOrderItems, getCurrentOrderItems, getCurrentOrderItem, setQuantity, deleteCurrentOrderItem, updateOrder}}>
        {children}
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
          <OrderContextGate />
        </div>
      </OrderContextProvider>
    )
  }

const OrderContextGate = () => {
    const { getOrder } = useOrderContext()
    const navigate = useNavigate()
    const location = useLocation()
    const order = getOrder()

    useEffect(() => {
        if (order && location.pathname === "/order") {
            navigate(`/order/${order.id}`, { replace: true })
        }
    }, [order, location.pathname, navigate])

    return <Outlet />
}
