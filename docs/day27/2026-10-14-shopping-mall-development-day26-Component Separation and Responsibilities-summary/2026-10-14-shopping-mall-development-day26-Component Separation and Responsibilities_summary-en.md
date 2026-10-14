# Day 27 — Component Separation and Responsibilities: Complete Summary

## Core takeaway
**Split components to clarify responsibilities, not simply to reduce line count.** The current admin order screen is already well structured; no mandatory refactor is needed.

## Existing component tree
```text
AdminOrdersPage
└── OrderCard (one per order)
    └── OrderItemList (items belonging to that order)

useOrders: supplies data and update functions
```

| Unit | Owns | Does not own |
|---|---|---|
| AdminOrdersPage | Layout, loading/error/empty states, `orders.map`, hook wiring | Order-card details |
| OrderCard | One order's details, status select, item-list composition, total | Entire order collection or update implementation |
| OrderItemList | `items.map`, item names, quantities, prices | Order status updates |
| useOrders | Data and `updateOrderStatus` | HTML and card styling |

## Data and event flow
```tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))}
```
`OrderCard` invokes `onStatusChange(order.id, status)`; the actual update logic remains in `useOrders`.

## Four criteria for extraction
1. **Meaning:** Does the UI have a clear, independent name?
2. **Duplication:** Is the same JSX repeated?
3. **Reason to change:** Might it evolve independently?
4. **Props boundary:** Can data and events be passed cleanly?

`OrderCustomerInfo` is a possible extraction, not a requirement. Do not duplicate the existing `OrderItemList`.

## Props destructuring versus TypeScript annotations
**Incorrect:**
```tsx
function UserCard({ name: string, age: number }) {}
```
This *renames* the destructured variables to `string` and `number`; it does not declare their types.

**Correct:**
```tsx
function UserCard({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return <div>{name} — {age}</div>;
}
```

Callback props follow the same pattern:
```tsx
function OrderStatusButton({
  orderId,
  onStatusChange,
}: {
  orderId: number;
  onStatusChange: (id: number, status: OrderStatus) => void;
}) {
  return <button onClick={() => onStatusChange(orderId, "배송중")}>Start shipping</button>;
}
```
Import `OrderStatus` from `@/types/order`. Keep the project's existing Korean status literals.

## JSX map syntax
```tsx
{items.map((item) => {
  return (
    <div key={item.id}>
      <p>{item.name}</p>
      <p>Quantity: {item.quantity}</p>
      <p>{item.price.toLocaleString()}원</p>
    </div>
  );
})}
```
The closing sequence is `}` (callback body), `)` (`map` call), `}` (JSX expression).

## Optional minor cleanup
In `OrderCard`, a wrapper with `space-y-3` around only one `OrderItemList` child adds no sibling spacing. Item spacing already belongs to `OrderItemList`; removing the wrapper is optional.

## Verification
Run `npm run lint` and the project's type-check command (for example, `npx tsc --noEmit`). Check the order list, loading/error/empty states, status selection, and item display.

**Tip:** Ask whether a line belongs to the whole page, one order, its items, or data behavior.
