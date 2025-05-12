// src/hooks/useOrdersWithSSE.ts
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Order } from '@/types/order';

const isPendingOrder = (order: Order) => {
    console.log('isPendingOrder', order);
    return order.items.some(item => item.completed < item.quantity);
}

const updateOrders = (orders: Order[], newOrder: Order) => {
    if (!isPendingOrder(newOrder)) {
        return orders.filter(order => order.id !== newOrder.id);
    }

    if (orders.filter(order => order.id === newOrder.id).length > 0) {
        return orders.map(order => 
            order.id === newOrder.id ? newOrder : order
        );
       }
    return [newOrder, ...orders];
}

export const useOrdersWithSSE = () => {
  const queryClient = useQueryClient();
  const [isSSEConnected, setIsSSEConnected] = useState(false);
    console.log('useOrdersWithSSE');
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5173/api/events/orders');
    console.log('EventSource created');
    setIsSSEConnected(true);

    // Handle incoming messages
    eventSource.onmessage = (event) => {
        
      const data = JSON.parse(event.data);
      console.log('Received SSE data:', data);
      // Update React Query cache
      queryClient.setQueryData(['pendingorders'], (oldOrders: Order[] = []) => updateOrders(oldOrders, data));
    };

    // Handle errors
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      setIsSSEConnected(false);
      // Optionally implement reconnect logic here
    };

    // Clean up
    return () => {
      eventSource.close();
      queryClient.invalidateQueries({queryKey: ['pendingorders']});
    };
  }, [queryClient]);

  // Only fetch initial data after SSE is connected
  const query = useQuery({
    queryKey: ['pendingorders'],
    queryFn: async () => {
        console.log('Fetching orders');
      const response = await fetch('/api/orders/pending', {
        credentials: 'include',
      })
      return await response.json();
    },
    // Only enable the query once SSE is connected
    enabled: isSSEConnected,
  });

  const markDone = useMutation({
      mutationFn: async ({orderID, mealID}: {orderID: number, mealID: number}) => {
        const res = await fetch(`/api/orders/${orderID}/items/${mealID}/status`, {
            credentials: 'include',
            method: 'POST',
            });
        if (!res.ok) {
            throw new Error(JSON.stringify(res.body));
        }
        return await res.json();
      },
      onSuccess: (data) => {queryClient.setQueryData(['pendingorders'], (oldOrders: Order[] = []) => updateOrders(oldOrders, data))},
    })


  return {query, markDone};
};