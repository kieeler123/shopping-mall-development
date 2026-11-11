# Day 26 --- Props and Parent--Child Data Flow

A study guide connecting React + TypeScript fundamentals to an existing
Next.js admin orders project.

> **Scope:** Distinguish the local-State exercise from the real admin
> order screen.

## 1. Learning objectives

Understand parent/child components, data Props, callback Props, events,
State ownership, and TypeScript contracts.

## 2. Core principle

Parent passes `order` and `onStatusChange` → child invokes the callback
on click → parent updates `setOrders` with a new array → React
re-renders → child receives updated Props.

## 3. TypeScript Props types

`Order` defines the order data shape; `OrderCardProps` defines the
child's input contract. A union type restricts `status` to allowed
literals.

## 4. Data Props and function Props

`order` contains display data; `onStatusChange` lets the child request a
change. `onClick={() => onStatusChange(order.id)}` defers the call until
a click.

### OrderCard.tsx

``` tsx
type Order = {
  id: number;
  productName: string;
  price: number;
  status: "PAID" | "CANCELLED";
};

type OrderCardProps = {
  order: Order;
  onStatusChange: (id: number) => void;
};

function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <article>
      <h3>{order.productName}</h3>
      <p>{order.price}</p>
      <p>{order.status}</p>
      <button
        disabled={order.status === "CANCELLED"}
        onClick={() => onStatusChange(order.id)}
      >
        Cancel
      </button>
    </article>
  );
}
```

## 5. Parent State and immutable updates

`setOrders(prev => prev.map(...))` creates a new array, replacing only
the matching order with a new object. `...order` preserves the other
fields; unrelated entries are returned unchanged.

### Parent update example

``` tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? { ...order, status: "CANCELLED" }
        : order
    )
  );
}

// In the parent's JSX:
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={handleCancel}
  />
))}
```

## 6. Events and disabled buttons

`disabled={order.status === 'CANCELLED'}` disables the cancel button
after cancellation. The actual admin UI uses a `select` and its
`onChange` event instead.

## 7. Connection to the Next.js project

The actual `AdminOrdersPage` obtains `orders`, `isLoading`, `error`, and
`updateOrderStatus` from `useOrders()`, then passes `order={order}` and
`onStatusChange={updateOrderStatus}` to `OrderCard`. The child invokes
`onStatusChange(order.id, e.target.value as OrderStatus)`. Keep the
customer order-history page separate.

``` tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
) )}
```

## 8. Important caveats

Next.js App Router requires an appropriate Client Component boundary for
`useState`, `useEffect`, and browser events. `as OrderStatus` is not
runtime validation. A local State change is not a real server
cancellation; server operations need authorization, requests, error
handling, and synchronization. The internals of `useOrders` were not
provided, so its persistence behavior is unknown.
