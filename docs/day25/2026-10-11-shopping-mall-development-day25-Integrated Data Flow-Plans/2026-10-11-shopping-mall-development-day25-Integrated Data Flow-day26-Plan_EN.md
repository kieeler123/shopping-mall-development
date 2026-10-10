# Day 26 — Props and Parent/Child Data Flow

Days 21–25: How does data move? Day 26: How should we structure the code that uses this flow?

## Objectives

Parent/child components, data props, callback props, child events, State ownership, TypeScript prop types

## Schedule

Parent/child 15 min; data props 20 min; callback props 20 min; events and State 20 min; project refactor 25 min; review 15 min

## Key principle

```text
Parent (OrdersPage)
  | order + onStatusChange (props)
  v
Child (OrderCard)
  | user click -> callback(order.id)
  v
Parent updates State -> React re-renders -> new props
```

`order` provides data for rendering. `onStatusChange` is a callback that lets a child request a parent State update. Props flow downward; the parent owns the State change.

## OrderCard.tsx

```tsx
type Order = { id: number; productName: string; status: "PAID" | "CANCELLED" };
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number) => void;
};
function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return <article>
    <h3>{order.productName}</h3>
    <p>{order.status}</p>
    <button disabled={order.status === "CANCELLED"}
      onClick={() => onStatusChange(order.id)}>Cancel</button>
  </article>;
}
```

## OrdersPage.tsx

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 101, productName: "Keyboard", status: "PAID" },
    { id: 102, productName: "Mouse", status: "PAID" }
  ]);
  function updateOrderStatus(orderId: number) {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: "CANCELLED" } : order
    ));
  }
  return <section>{orders.map(order =>
    <OrderCard key={order.id} order={order}
      onStatusChange={updateOrderStatus} />
  )}</section>;
}
```

> This is a local-State demonstration. A real cancellation requires a server-side POST request, authorization checks, error handling, and refetching authoritative order data.

## Practice tasks

Extract OrderCard; type its props; map orders in the parent; invoke callback on cancel click; update parent State; disable cancelled orders

## Knowledge check

Which direction do props flow?; How does a child request a parent State update?; Why not invoke a handler directly during render?

## Answers

Parent to child; call the parent-provided callback; it would run during rendering

## Tip

Start with local State to verify props flow, then integrate the Day 25 cancellation POST endpoint.

## Next

Day 27: Lifting State Up · Day 28: Reusable Components · Day 29: Custom Hooks
