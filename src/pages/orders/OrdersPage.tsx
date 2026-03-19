import { usePaginatedOrders } from '@/api/orders';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { Order } from '@/types/order';
import { useMealQuery } from '@/api/meals';
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
    const { data: mealsData, isLoading: mealsLoading } = useMealQuery()
    const meals: Meal[] = mealsData ?? []

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePaginatedOrders(PAGE_SIZE)
    const orders = data?.pages.flat(1) || []

    if (mealsLoading || !mealsData) {
        return <div className="p-4">Loading meals...</div>
    }

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
        <div className="px-4 py-8">
            <header className="mb-8">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                <h1 className="display-serif text-3xl">Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">Track daily volume, open each order to inspect items and reviews.</p>
            </header>

            <div className="space-y-6">
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
                    <div key={getDateString(orders[0].created_at)} className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{getDateString(orders[0].created_at)}</h2>
                            <div className="text-xs text-muted-foreground">{orders.length} orders</div>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                        {orders.map((order) => (
                            <AccordionItem key={order.id} value={order.id.toString()}>
                                <AccordionTrigger>
                                    <div className="py-2 flex flex-wrap gap-3 text-sm">
                                        <div className="rounded-full bg-black/5 px-3 py-1">
                                            Order #{order.id}
                                        </div>
                                        <div className="rounded-full bg-black/5 px-3 py-1">
                                            Total {getTotalPrice(order.items, meals).toFixed(2)}€
                                        </div>
                                        <div className="rounded-full bg-black/5 px-3 py-1">
                                            {order.review ? `${order.review.rating}/5` : "No review"}
                                        </div>
                                    </div>
                                    </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        {order.items.map((item) => {
                                            const meal = getMealById(item.meal_id, meals)
                                            return (
                                            <div key={item.meal_id} className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                                                <div className="text-sm">
                                                    {item.quantity}x {meal.name}
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    {item.quantity * meal.price}€
                                                </div>
                                            </div>)
                                        })}
                                    </div>
                                    {order.review && (<div>
                                        <div className="mt-4 text-sm text-muted-foreground">
                                            {order.review.comment}
                                        </div>
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {order.review.photo_urls.map((photo) => (
                                                <img key={photo} src={photo} alt="review" className="h-24 w-full rounded-lg object-cover" />
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
