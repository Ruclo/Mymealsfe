import { usePaginatedOrders } from '@/api/orders';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { Order } from '@/types/order';
import { useMealQuery } from '@/api/meals';
import { useLoaderData } from 'react-router-dom';
import { getMealById, getTotalPrice } from '@/utils/orderutils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Meal } from '@/types/meal';

function getDateString(created_at: string): string {
    const date = new Date(created_at);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}


export function OrdersPage() {
    const PAGE_SIZE = 10
    const meals: Meal[] = useLoaderData()

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePaginatedOrders(PAGE_SIZE)
    const orders = data?.pages.flat(1) || []
    const isLoading = !data && !isFetchingNextPage

    //Groups orders by the day they were created
    const groupedOrders = orders.reduce((acc: Order[][], order: Order) => {
        const lastGroup = acc[acc.length - 1]
        if (!lastGroup) {
            acc.push([order])
            return acc
        }
        const date = new Date(order.created_at)
        const lastDate = new Date(lastGroup[0].created_at)
        if (date.getDate() === lastDate.getDate() &&
            date.getMonth() === lastDate.getMonth() &&
            date.getFullYear() === lastDate.getFullYear()) {
            lastGroup.push(order)
            return acc
        }
        
        acc.push([order])
        return acc
    }, [])

    return (
        <div>
            <header className="py-5 text-center font-bold text-xl">
                Orders
            </header>

            <div>
                <InfiniteScroll
                    dataLength={orders.length}
                    next={() =>
                        {
                            if (!isFetchingNextPage) {
                                fetchNextPage()
                            }
                        }}
                    hasMore={hasNextPage}
                    loader={<h4 className="text-center">Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>End</b>
                        </p>}
                    >
            {groupedOrders.map((orders) => (
                    <div key={getDateString(orders[0].created_at)} className="border-b border-gray-200 p-4">
                        <div>
                            <h2 className="text-lg font-semibold">{getDateString(orders[0].created_at)}</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                        {orders.map((order) => (
                            <AccordionItem key={order.id} value={order.id.toString()}>
                                <AccordionTrigger>
                                    <div className="py-2 flex gap-2">
                                        <div>
                                            Order ID: {order.id}
                                        </div>
                                        <div>
                                            Total: {getTotalPrice(order.items, meals).toFixed(2)}€
                                        </div>
                                        <div>
                                            {order.review ? `${order.review.rating}/5` : "No review"}
                                        </div>
                                    </div>
                                    </AccordionTrigger>
                                <AccordionContent>
                                    <div>
                                        {order.items.map((item) => {
                                            const meal = getMealById(item.meal_id, meals)
                                            return (
                                            <div key={item.meal_id} className="flex justify-between">
                                                <div>
                                                    {item.quantity}x{meal.name}
                                                </div>
                                                <div>
                                                    {item.quantity * meal.price}€
                                                </div>
                                            </div>)
                                        })}
                                    </div>
                                    {order.review && (<div>
                                        <div>
                                            {order.review.comment}
                                        </div>
                                        <div>
                                            {order.review.photo_urls.map((photo) => (
                                                <img key={photo} src={photo} alt="review" className="w-1/3" />
                                            ))}
                                        </div>
                                    </div>) }
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>

                    </div>
                ))}
            
                </InfiniteScroll>
            </div>
        </div>
    )
}