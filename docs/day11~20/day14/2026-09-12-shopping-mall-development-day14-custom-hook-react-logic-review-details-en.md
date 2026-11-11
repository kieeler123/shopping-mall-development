# Day 14 Review Questions

## STEP 1

**Q1. What was the main learning goal of Day 14?**

<details><summary><strong>Show answer</strong></summary>

**A1.** To separate the React state and state-update logic mixed inside
`AdminOrdersPage` into a Custom Hook called `useOrders`.

On Day 13, UI responsibilities were separated into `OrderCard` and
`OrderItemList`. On Day 14, the responsibility for order-related React
logic such as `orders`, `setOrders`, and `updateOrderStatus` was
separated.

**Tip:** It is easier to understand if you first think
`Component = what to show` and
`Custom Hook = how to manage React state and related behavior`.

---

</details>

## STEP 2

**Q2. How do you distinguish UI from React logic?**

<details><summary><strong>Show answer</strong></summary>

**A2.** If the purpose is to render something on the screen, it is
closer to UI. If the purpose is to store or update state, it is closer
to React logic.

```tsx
orders.map((order) => <OrderCard key={order.id} order={order} />);
```

The `map()` above is UI rendering because it repeatedly displays
`OrderCard` on the screen.

반면:

```tsx
setOrders(
  orders.map((order) =>
    order.id === orderId ? { ...order, status: newStatus } : order,
  ),
);
```

The `map()` above is logic because it is used to transform data.

**Tip:** Do not memorize syntax such as `map()` as UI or logic by
itself; look at the purpose of the code.

---

</details>

## STEP 3

**Q3. What is the difference between UI logic, React logic, and business
logic?**

<details><summary><strong>Show answer</strong></summary>

**A3.** UI logic handles screen interactions such as opening/closing a
modal or selecting a tab. React logic uses React state and rendering
mechanisms such as `useState`, `useEffect`, and Custom Hooks. Business
logic consists of service/domain rules that would exist even without
React.

For example:

```tsx
function canCancelOrder(order: Order) {
  return order.status !== "배송완료";
}
```

A rule such as "a delivered order cannot be canceled" is closer to
business logic because it is needed even without React.

**Tip:** Ask `Would this rule still be needed if React disappeared?` to
help identify business logic.

---

</details>

## STEP 4

**Q4. What is the difference between a regular function and a Custom
Hook?**

<details><summary><strong>Show answer</strong></summary>

**A4.** A regular function can handle calculations or data processing
that do not depend on React.

```tsx
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

A Custom Hook uses React Hooks to group React state and related logic.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return { orders };
}
```

A Custom Hook is still a JavaScript function, but it uses React Hooks,
follows the Rules of Hooks, and starts its name with `use`.

**Tip:** If it can run unchanged outside React, think of a regular
function. If it needs a Hook such as `useState`, think of a Custom Hook.

---

</details>

## STEP 5

**Q5. Why was the `orders` state moved into `useOrders`?**

<details><summary><strong>Show answer</strong></summary>

**A5.** Because `AdminOrdersPage` was responsible for both UI rendering
and order-state management.

Before separation:

```tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  // ...
}
```

After separation:

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return { orders };
}
```

In the page:

```tsx
const { orders } = useOrders();
```

The responsibility for managing order state has now moved to
`useOrders`.

**Tip:** If a component is doing too much, check whether its state and
closely related logic can be grouped into a Custom Hook.

---

</details>

## STEP 6

**Q6. Why did a `setOrders` error occur after moving only the state into
`useOrders`?**

<details><summary><strong>Show answer</strong></summary>

**A6.** Because of JavaScript function scope. Once `setOrders` moved
inside `useOrders`, the `handleStatusChange` that remained in
`AdminOrdersPage` could no longer access it.

```tsx
function useOrders() {
  const [orders, setOrders] = useState(initialOrders);
}
```

Here, `setOrders` is a local variable inside `useOrders`.

Therefore, moving `handleStatusChange` into `useOrders` was the natural
next step.

**Tip:** Do not treat every temporary error during refactoring as
failure. Ask which related responsibility has not yet been moved.

---

</details>

## STEP 7

**Q7. Why was `handleStatusChange` renamed to `updateOrderStatus`?**

<details><summary>strong>Show answer</strong></summary>

**A7.** `handleStatusChange` sounds like a UI event handler, while the
function inside the Hook actually performs the operation of updating
order-status data.

```tsx
function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  // 주문 상태 변경
}
```

`updateOrderStatus` expresses the function's actual responsibility more
clearly.

**Tip:** Name functions according to what they do rather than how they
are implemented.

---

</details>

## STEP 8

**Q8. Why is `return { orders, updateOrderStatus }` important?**

<details><summary><strong>Show answer`</strong></summary>

**A8.** Because it determines which values and operations `useOrders`
exposes to outside components.

```tsx
return {
  orders,
  updateOrderStatus,
};
```

In the page:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

can be used like this.

Because `setOrders` is not returned, it cannot be used directly from
outside the Hook.

**Tip:** Think of a Custom Hook's `return` as its **public interface or
usage guide**.

---

</details>

## STEP 9

**Q9. Why is hiding `setOrders` considered encapsulation?**

<details><summary><strong>Show answer</strong></summary>

**A9.** Because internal implementation details are hidden while only
the necessary operations are exposed.

`setOrders`is also exposed, outside code can::

```tsx
setOrders([]);
```

directly change the order state like this.

However:

```tsx
updateOrderStatus(1, "shipping");
```

By exposing only meaningful operations like this, order state can be
changed through a defined path.

```text
setOrders

→ internal implementation detail

updateOrderStatus

→ operation exposed to outside code
```

**Tip:** Encapsulation is not merely hiding things; it means
**protecting internal implementation and exposing only the necessary
entry points**.

---

</details>

## STEP 10

**Q10. Why doesn't `orders` change immediately after calling`setOrders()`?**

<details><summary><strong>Show answer</strong></summary>

**A10.** Because `orders` in the current render is the state snapshot
used by that render.

```tsx
console.log(orders);
setOrders(newOrders);
console.log(orders);
```

The second log can still show the old `orders` from the current render.
Rather than directly mutating the current variable, `setOrders()`
requests a state update and rerender from React.

**Tip:** Understand `setOrders()` as "request a state update for the
next render" rather than "change the variable now."

---

</details>

## STEP 11

**Q11. How does `useState` inside `useOrders` lead to rerendering?**

<details><summary><strong>Show answer</strong></summary>

**A11.** `useOrders` does not rerender like a separate component.
`useOrders()` runs as part of rendering `AdminOrdersPage`.

```text
Run AdminOrdersPage

→ run useOrders()

→ call useState()

→ return orders

→ create JSX
```

When the state changes:

```text
updateOrderStatus()

→ setOrders()

→ update state

→ AdminOrdersPage rerenders

→ run useOrders() again

→ use the new orders
```

**Tip:** A Custom Hook is not an independent component; it is **a bundle
of React logic that runs as part of a component's render**.

---

</details>

## STEP 12

**Q12. Why doesn't `OrderCard` need to know the implementation of
`updateOrderStatus`?**

<details><summary><strong>Show answer</strong></summary>

**A12.** Because `OrderCard` only needs to know how to call the
`onStatusChange` callback prop.

```tsx
onStatusChange(order.id, newStatus);
```

In the page:

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

Because the function is passed this way, `OrderCard` is unaffected even
though the actual implementation lives inside `useOrders`.

**Tip:** A child component only needs to know **which arguments to
pass**, not the callback's internal implementation.

---

</details>

## STEP 13

**Q13. What is the complete data flow when an order status changes?**

<details><summary><strong>Show answer</strong></summary>

**A13.**

```text
User changes select
→ OrderCard onChange
→ onStatusChange(order.id, newStatus)
→ updateOrderStatus()
→ setOrders() inside useOrders
→ orders state changes
→ AdminOrdersPage rerenders
→ new orders are passed to OrderCard
→ updated status is displayed
```

**Tip:** When React code becomes complex, draw arrows showing where data
starts and where it moves instead of looking only at individual
functions.

---

</details>

## STEP 14

**Q14. How is component separation different from logic separation?**

<details><summary><strong>Show answer</strong></summary>

**A14.** Day 13's component separation divided UI responsibilities.

```text
AdminOrdersPage
→ OrderCard
→ OrderItemList
```

Day 14's logic separation divided responsibility for React state and
state updates.

```text
AdminOrdersPage
→ useOrders
→ useState
```

**Tip:** Start with the basic distinction
`Component = UI responsibility`,
`Custom Hook = React-logic responsibility`, then refine it when needed.

---

</details>

## STEP 15

**Q15. Are logic separation and file separation the same thing?**

<details><summary><strong>Show answer</strong></summary>

**A15.** No. Even inside the same `page.tsx`:

```tsx
function useOrders() {
  // React logic
}

export default function AdminOrdersPage() {
  // UI
}
```

if responsibilities are separated like this, logic separation has
already happened.

After confirming understanding and behavior, the files were separated.

```text
separate responsibilities
→ verify behavior
→ separate files
```

**Tip:** Find responsibility boundaries first instead of creating many
files immediately.

---

</details>

## STEP 16

**Q16. What was the final file structure and the responsibility of each file?**

<details><summary><strong>Show answer</strong></summary>

**A16.**

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts

types/
└─ order.ts
```

`page.tsx` composes the page UI, `OrderCard.tsx` handles the order-card
UI, `OrderItemList.tsx` handles the item-list UI, `useOrders.ts` manages
order state and update logic, and `types/order.ts` contains
order-related types.

**Tip:** If you can explain each file's responsibility in one sentence,
the responsibilities are relatively well separated.

---

</details>

## STEP 17

**Q17. What caused the `CartItem` type error during file separation?**

<details><summary><strong>Show answer</strong></summary>

**A17.** The real `OrderItem` did contain `id`, but auto-import had
referenced a different type, `CartItem`.

Error:

```text
Object literal may only specify known properties,
and 'id' does not exist in type 'CartItem'.
```

The key clue was that the unexpected type name `CartItem` appeared in
the error message.

Debugging process:

```text
check the type name in the error message
→ check the import
→ check the actual type-definition location
→ fix the incorrect auto-import
```

**Tip:** If TypeScript says a property is missing even though you know
the type contains it, first check **which type is actually being
imported** instead of immediately changing the type definition.

---

</details>

## STEP 18

**Q18. Why use `import type`?**

<details><summary><strong>Show answer</strong></summary>

**A18.** Because it clearly expresses that only TypeScript types are
being imported.

```tsx
import type { Order, OrderStatus } from "@/types/order";
```

It can be used for imports such as `Order` and `OrderStatus` that are
used only as types, not runtime values.

**Tip:** Using `import type` for type-only imports makes dependencies at
the top of the file easier to read.

---

</details>

## STEP 19

**Q19. What is a functional state update?**

<details><summary><strong>Show answer</strong></summary>

**A19.** It is a way to calculate new state from previous state by
receiving the previous state as a function argument.

Current form:

```tsx
setOrders(
  orders.map(...)
);
```

Functional update:

```tsx
setOrders((prevOrders) =>
  prevOrders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  }),
);
```

The current code also works, but functional updates are useful when
`new state = calculation based on previous state`.

**Tip:** When the next state is built from previous state, remember the
`setState(prev => ...)` pattern.

---

</details>

## STEP 20

**Q20. How can Day 14 be summarized in one sentence?**

<details><summary><strong>Show answer</strong></summary>

**A20.**

> **A Custom Hook is not merely a tool for shortening code. It separates
> React state and related logic into one responsibility and exposes only
> the values and operations a component needs.**

The representative code from today is:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`AdminOrdersPage` no longer needs to know how order state is stored or
updated internally. It renders the UI with `orders` and passes
`updateOrderStatus` where needed.

**Tip:** When reviewing Day 14, check whether you can explain the flow
`UI → Callback → Custom Hook → setState → rerender → UI` yourself.

</details>
