# Day 26 — Practical Coding Test (React · TypeScript · Next.js)

15 tasks · 5 beginner / 5 intermediate / 5 practical. Try each task before expanding its answer. Solutions are examples; equivalent implementations are valid.

> Note: Local-State cancellation does not cancel a server order. Real changes require an API, authorization, error handling, and synchronization.

## 1. Beginner — 1–5

**Tip:** Distinguish the Props contract from values rendered in JSX.

### Task 1

Define an `Order` type with id, productName, price, and a PAID/CANCELLED status. Then define `OrderCardProps` containing `order`.

<details>
<summary>Show solution and explanation</summary>

```tsx
type Order = { id: number; productName: string; price: number; status: "PAID" | "CANCELLED" };
type OrderCardProps = { order: Order };
```

Define the data shape separately from the component contract.

</details>

### Task 2

Write an `OrderCard` component that displays the product name and price from `order`.

<details>
<summary>Show solution and explanation</summary>

```tsx
function OrderCard({ order }: OrderCardProps) {
  return <article><h3>{order.productName}</h3><p>{order.price}</p></article>;
}
```

Read object properties in JSX after destructuring Props.

</details>

### Task 3

Add a function Prop that accepts an order ID and returns void.

<details>
<summary>Show solution and explanation</summary>

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (id: number) => void;
};
```

Declare the callback argument and return types.

</details>

### Task 4

Invoke the callback with the current order ID only when the button is clicked.

<details>
<summary>Show solution and explanation</summary>

```tsx
<button onClick={() => onStatusChange(order.id)}>Cancel</button>
```

An arrow function delays execution until click time.

</details>

### Task 5

Disable the Cancel button for canceled orders.

<details>
<summary>Show solution and explanation</summary>

```tsx
<button disabled={order.status === "CANCELLED"} onClick={() => onStatusChange(order.id)}>Cancel</button>
```

The button is disabled when the comparison evaluates to true.

</details>

## 2. Intermediate — 6–10

**Tip:** Update arrays immutably; pass callback references instead of invoking them.

### Task 6

Render one `OrderCard` per order with a stable key and callback Prop.

<details>
<summary>Show solution and explanation</summary>

```tsx
{orders.map((order) => (
  <OrderCard key={order.id} order={order} onStatusChange={handleCancel} />
))}
```

Map each order to a component and provide a stable key.

</details>

### Task 7

Update only the matching order to CANCELLED without mutating State.

<details>
<summary>Show solution and explanation</summary>

```tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id ? { ...order, status: "CANCELLED" } : order
    )
  );
}
```

Map and object spread avoid direct State mutation.

</details>

### Task 8

Derive the number of canceled orders from the `orders` array.

<details>
<summary>Show solution and explanation</summary>

```tsx
const cancelledCount = orders.filter((order) => order.status === "CANCELLED").length;
```

Derive a count from State instead of storing redundant State.

</details>

### Task 9

In an admin `OrderCard`, send the selected status and order ID through a callback. Assume `OrderStatus` contains the option values.

<details>
<summary>Show solution and explanation</summary>

```tsx
<select
  value={order.status}
  onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
>
  <option value="결제완료">결제완료</option>
  <option value="배송중">배송중</option>
</select>
```

Pass the ID and selected value from the change event. A type assertion is not runtime validation.

</details>

### Task 10

Pass `updateOrderStatus` from `useOrders()` into the child's `onStatusChange` Prop.

<details>
<summary>Show solution and explanation</summary>

```tsx
<OrderCard
  key={order.id}
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

Pass the parent function reference as a child Prop.

</details>

## 3. Practical — 11–15

**Tip:** Respect the actual admin-page architecture and Client Component boundary.

### Task 11

Import the shared `Order` type from `@/types/order` using a type-only import.

<details>
<summary>Show solution and explanation</summary>

```tsx
import type { Order } from "@/types/order";
```

A type-only import is distinct from importing a runtime value.

</details>

### Task 12

Handle loading, error, and empty states in that order before rendering the list.

<details>
<summary>Show solution and explanation</summary>

```tsx
if (isLoading) return <p>Loading orders...</p>;
if (error) return <p role="alert">{error}</p>;
if (orders.length === 0) return <p>No orders found.</p>;
```

Show status messages before the order list.

</details>

### Task 13

Refactor the admin page so it maps orders to an existing `OrderCard` instead of duplicating card markup. Assume imports and loading/error handling exist.

<details>
<summary>Show solution and explanation</summary>

```tsx
function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  return (
    <main>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={updateOrderStatus}
        />
      ))}
    </main>
  );
}
```

The page owns the list; each card owns its presentation.

</details>

### Task 14

Make `handleCancel` ignore orders that are already canceled.

<details>
<summary>Show solution and explanation</summary>

```tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id && order.status !== "CANCELLED"
        ? { ...order, status: "CANCELLED" }
        : order
    )
  );
}
```

Ignore already canceled orders, in addition to disabling the UI.

</details>

### Task 15

Create a minimal Next.js App Router Client Component that uses `useState` and a click handler.

<details>
<summary>Show solution and explanation</summary>

```tsx
"use client";

import { useState } from "react";

export default function AdminOrdersPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  return <button onClick={() => setSelectedId(101)}>{selectedId ?? "Select"}</button>;
}
```

Use a Client Component boundary for State and event handlers.

</details>
