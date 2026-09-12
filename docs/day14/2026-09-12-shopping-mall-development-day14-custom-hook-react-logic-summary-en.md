# Day 14 Study Notes --- Custom Hooks & React Logic Separation

## 1. Today's Learning Goal

The main goal of Day 14 was to **separate React state and state-update
logic that had been mixed inside a component into a Custom Hook**.

On Day 13, we practiced **separating UI responsibilities** by extracting
the UI inside `AdminOrdersPage` into `OrderCard` and `OrderItemList`.

On Day 14, we took this one step further by moving the `orders` state
and the order-status update logic that remained inside `AdminOrdersPage`
into a Custom Hook called `useOrders`.

The final responsibilities were organized as follows:

```text
AdminOrdersPage
→ Compose the page UI

OrderCard
→ Render the order-card UI and forward user events

OrderItemList
→ Render the order-item list UI

useOrders
→ Manage the orders state and order-status update logic

types/order.ts
→ Define order-related TypeScript types
```

---

## 2. Distinguishing UI from Logic

Initially, UI and React logic lived together inside `AdminOrdersPage`.

```tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function handleStatusChange(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return (
    // UI
  );
}
```

Two responsibilities were mixed together here.

### UI

This is the part that determines what is shown to the user.

```tsx
return (
  <main>
    {orders.map((order) => (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={handleStatusChange}
      />
    ))}
  </main>
);
```

The `map()` method itself is not inherently classified as either UI or
logic.

In the code above, it is used to repeatedly render `OrderCard`
components, so its purpose is related to UI rendering.

### React Logic

This is the part that stores and updates React state.

```tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

For example:

```tsx
setOrders(
  orders.map(...)
);
```

Processing existing order data in order to update state is also
considered React logic.

> **Rule of thumb:** Does it render something on the screen? → UI\
> Does it store or update state? → React logic

**Tip**

When reading code, focus on **what the code exists to do** rather than
the name of the syntax being used.

---

## 3. UI Logic, React Logic, and Business Logic

### UI Logic

UI logic handles presentation state or user interactions.

For example:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

Examples include opening or closing a modal, tracking the selected tab,
and controlling whether a dropdown is visible.

### React Logic

React logic uses React's state and lifecycle mechanisms.

For example:

```tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

React features such as `useState`, `useEffect`, and Custom Hooks are
used to connect state with the rendering process.

### Business Logic

Business logic consists of rules that belong to the service or domain
itself, independently of React.

For example:

```tsx
function canCancelOrder(order: Order) {
  return order.status !== "배송완료";
}
```

Even without React, the rule that **an order that has already been
delivered cannot be canceled** would still exist.

> Would this rule still be necessary if React disappeared? If so, it is
> probably business logic.

**Tip**

On Day 14, the goal is not to separate these three categories perfectly.
The important boundary to understand is:

```text
AdminOrdersPage
→ UI

useOrders
→ Order-related React state and logic
```

---

## 4. Regular Functions vs. Custom Hooks

### Regular Function

A regular function can be used to separate JavaScript or TypeScript
logic that does not depend on React.

```tsx
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

A pure data transformation that receives an order array and returns a
new array can also be written as a regular function.

```tsx
function changeOrderStatus(
  orders: Order[],
  orderId: number,
  newStatus: OrderStatus,
) {
  return orders.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        status: newStatus,
      };
    }

    return order;
  });
}
```

### Custom Hook

A Custom Hook uses React Hooks and groups related React logic into a
single responsibility.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

A Custom Hook is still fundamentally a JavaScript function, but it uses
React Hooks and follows the Rules of Hooks.

```text
Custom Hook
= JavaScript function
+ React Hook usage
+ Rules of Hooks
```

Hook names start with `use`, such as `useOrders`, `useCart`, and
`useProducts`.

**Tip**

Ask yourself: **Could this calculation run unchanged outside React?** If
yes, consider a regular function first. If it needs a React Hook such as
`useState`, consider a Custom Hook.

---

## 5. Creating `useOrders` --- Move the State First

Initially, `AdminOrdersPage` owned the state directly.

```tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

This state was moved into `useOrders`.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

The page then uses:

```tsx
const { orders } = useOrders();
```

At this point, `setOrders` exists only inside `useOrders`. Therefore, if
the existing `handleStatusChange` remains inside `AdminOrdersPage` and
still tries to use `setOrders`, a scope error occurs.

This was not an incorrect refactoring. It was a **natural intermediate
state caused by moving only the state first**.

**Tip**

Do not try to complete a refactoring in one large step. Move one
responsibility at a time, understand any errors that appear, and then
continue to the next step.

---

## 6. Move the State-Update Logic into `useOrders`

`handleStatusChange`, which is closely tied to the state, was also moved
into the Hook.

At the same time, it was renamed to `updateOrderStatus`.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

`handleStatusChange` sounds like the name of an event handler, while
`updateOrderStatus` more clearly describes the data operation: **update
the order status**.

The page uses it like this:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

It is then passed to `OrderCard` as a callback prop.

```tsx
<OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
```

**Tip**

Name a function according to **what it does**, rather than how it
happens to be implemented.

---

## 7. A Custom Hook's `return` Is Its Public Interface

The following values exist inside `useOrders`:

```text
orders
setOrders
updateOrderStatus
```

But only these two are returned:

```tsx
return {
  orders,
  updateOrderStatus,
};
```

Therefore, `AdminOrdersPage` can use:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`setOrders` remains hidden inside the Hook.

You can think of this returned object as the **public interface that the
Custom Hook exposes to outside code**.

```text
Inside useOrders
├─ orders
├─ setOrders
└─ updateOrderStatus

Publicly exposed
├─ orders
└─ updateOrderStatus
```

**Tip**

When looking at a Custom Hook's `return`, ask: **What values and
operations should components using this Hook be allowed to access?**

---

## 8. Hiding `setOrders` and Encapsulation

If `setOrders` were also returned:

```tsx
return {
  orders,
  setOrders,
  updateOrderStatus,
};
```

outside code could directly change the order state:

```tsx
setOrders([]);
```

That would weaken the boundary that says `useOrders` is responsible for
managing order state.

Instead:

```tsx
return {
  orders,
  updateOrderStatus,
};
```

By exposing only the necessary functionality, outside code updates the
state through the intended operation:

```tsx
updateOrderStatus(1, "배송중");
```

In other words:

```text
setOrders
→ Internal implementation detail

updateOrderStatus
→ Meaningful operation exposed to outside code
```

Hiding implementation details while exposing only the intended way to
use the logic is closely related to **encapsulation**.

**Tip**

Do not think of encapsulation as simply "hiding things." Think of it as
**protecting internal implementation details while exposing only the
necessary interface**.

---

## 9. Why `orders` Does Not Change Immediately After Calling `setOrders`

React state can be thought of as a snapshot for the current render.

```tsx
console.log(orders);

setOrders(newOrders);

console.log(orders);
```

In this example, the second `console.log(orders)` can still show the old
`orders` value from the current render.

It is better to understand `setOrders()` not as a function that
immediately mutates the current variable, but as a function that
**requests a state update and a future rerender**.

The flow is:

```text
Current render
↓
Use current orders
↓
Call setOrders(...)
↓
React processes the state update
↓
AdminOrdersPage rerenders
↓
useOrders runs again
↓
Use the new orders
```

This does not happen because `orders` was declared with `const`. It
happens because each render sees its own state snapshot.

**Tip**

When you see a `setState` function, think **request the state for the
next render**, rather than **change the current variable immediately**.

---

## 10. `useState` Inside `useOrders` and Rerendering

An important point is that `useOrders` does not rerender independently
like a separate component.

The render flow is:

```text
React
↓
Run AdminOrdersPage
↓
Run useOrders()
↓
Call useState()
↓
Return orders
↓
AdminOrdersPage creates JSX
```

When the user changes an order status:

```text
User changes the select
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
updateOrderStatus()
↓
setOrders()
↓
State update
↓
AdminOrdersPage rerenders
↓
useOrders() runs again
↓
Create the UI using the new orders
```

`map()` itself does not cause the rerender. The state update triggered
through `setOrders()` tells React that the component needs to render
again.

Also, although `useState(initialOrders)` appears to be called again in
the code during a rerender, React does not reset the state to
`initialOrders` every time. React returns the current state associated
with that Hook position.

**Tip**

Do not think of a Custom Hook as a small independent component. Think of
it as **a group of React logic that runs as part of the component's
render process**.

---

## 11. Connecting Callback Props and the Custom Hook

`OrderCard` receives the following callback prop:

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
};
```

When the user changes the `<select>`:

```tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus,
  );
}}
```

is executed.

The important point is that `OrderCard` does not need to know where
`onStatusChange` is actually implemented.

The page passes:

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

Therefore, the `updateOrderStatus` function inside `useOrders` is what
actually runs.

```text
OrderCard
→ Requests a status change

useOrders
→ Actually updates the orders state
```

**Tip**

A child component does not need to know the internal implementation of a
callback. It only needs to know **which arguments to provide when
calling it**.

---

## 12. Complete Data Flow

At the end of Day 14, the complete order-status update flow is:

```text
1. The user changes the select in OrderCard.
        ↓
2. OrderCard's onChange handler runs.
        ↓
3. It calls onStatusChange(order.id, newStatus).
        ↓
4. The passed updateOrderStatus function runs.
        ↓
5. setOrders is called inside useOrders.
        ↓
6. A new orders state is created.
        ↓
7. AdminOrdersPage rerenders.
        ↓
8. OrderCard is rendered again using the new orders.
        ↓
9. The updated order status appears on the screen.
```

This connects to React's fundamental flow:

```text
state
↓
UI
↓
user event
↓
callback
↓
state update
↓
rerender
↓
new UI
```

**Tip**

When code becomes complicated, do not look only at individual functions.
Draw arrows showing **where the data starts and where it moves**.

---

## 13. Component Separation vs. Logic Separation

### Day 13 --- Component / UI Responsibility Separation

```text
AdminOrdersPage
↓
OrderCard
↓
OrderItemList
```

Main concepts learned:

- Component responsibility
- Props
- Parent / Child relationships
- Callback Props
- UI separation

### Day 14 --- React Logic Responsibility Separation

```text
AdminOrdersPage
↓
useOrders
↓
useState
```

Main concepts learned:

- Custom Hooks
- React state responsibility
- State-update functions
- Hook return values
- Encapsulation
- The difference between component and Hook responsibilities

**Tip**

At this stage, a useful mental model is:

```text
Component
→ Mainly focuses on what to display

Custom Hook
→ Mainly focuses on how React state and related operations are managed
```

---

## 14. Logic Separation Is Not the Same as File Separation

When `useOrders` was first created, responsibility separation had
already begun even if it was still in the same `page.tsx` file.

```tsx
function useOrders() {
  // React logic
}

export default function AdminOrdersPage() {
  // UI
}
```

In other words, **logic separation does not necessarily mean file
separation**.

Responsibilities were separated first, behavior was verified, and only
then were the files separated.

The final structure was:

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

**Tip**

A useful refactoring order is:

```text
Separate responsibilities
↓
Verify behavior
↓
Separate files
```

This makes it easier to identify the cause when something breaks.

---

## 15. Final Responsibility of Each File

### `page.tsx`

Composes the overall page UI.

The core code became very simple:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

Then:

```tsx
{
  orders.map((order) => {
    return (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={updateOrderStatus}
      />
    );
  });
}
```

The page no longer needs to know about `setOrders` or the implementation
details of updating an order status.

### `hooks/useOrders.ts`

Owns the order state and its update logic.

```tsx
export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

### `components/OrderCard.tsx`

Displays one order and forwards status-change events.

```tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus,
  );
}}
```

### `components/OrderItemList.tsx`

Receives the items in an order and renders the item-list UI.

### `types/order.ts`

Defines shared order-related types.

```tsx
export type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

The Korean string literals above are intentionally preserved because
they are actual values used by the application, not explanatory prose.

**Tip**

Open each file and try to describe its responsibility in one sentence.
If the explanation becomes too long, check whether multiple
responsibilities have become mixed together again.

---

## 16. TypeScript Auto-Import Problem Encountered During File Separation

While separating files, the following error occurred:

```text
Object literal may only specify known properties,
and 'id' does not exist in type 'CartItem'.
```

At first, it looked like a problem with the `initialOrders` data or the
`OrderItem` type. However, the actual `OrderItem` type did contain an
`id` property:

```tsx
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

The real cause was that **automatic import had referenced a different
type instead of the intended type**.

The debugging rule learned from this was:

```text
The property clearly exists in the expected type,
but TypeScript says it does not.
        ↓
Check the type name shown in the error message.
        ↓
Check the current import.
        ↓
Ctrl + click the type.
        ↓
Verify the actual type-definition location.
```

The unexpected name `CartItem` in the error message was an important
clue.

**Tip**

Do not blindly trust automatic imports. After an import is added,
quickly check its path and type name. This becomes increasingly
important as a project gains more types with similar names or
structures.

---

## 17. Learning `import type`

When importing TypeScript types only:

```tsx
import type { Order, OrderStatus } from "@/types/order";
```

you can use `import type`.

A regular import may also work depending on the situation, but
`import type` clearly communicates that the imported names are
TypeScript types rather than runtime values.

**Tip**

For values such as `Order`, `OrderStatus`, and `OrderCardProps` that are
used only as types, developing the habit of using `import type` makes
the purpose of imports easier to understand.

---

## 18. Functional State Updates --- A Future Improvement

The current code is:

```tsx
setOrders(
  orders.map((currentOrder) => {
    // ...
  }),
);
```

This works for the current learning example. However, when the new state
is calculated from the previous state, a functional state update can
also be used.

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

This form calculates the next state from the previous state provided by
React.

**Tip**

When the relationship is:

```text
new state
= calculation based on previous state
```

remember the `setState((prev) => ...)` pattern. However, the main focus
of Day 14 was Custom Hook separation, so this can remain a separate
advanced topic for later.

---

## 19. Day 14 Completion Checklist

- [x] Distinguish UI from React logic.
- [x] Understand the difference between UI logic, React logic, and
      business logic.
- [x] Understand the difference between a regular function and a
      Custom Hook.
- [x] Create the `useOrders` Custom Hook.
- [x] Move the `orders` state into `useOrders`.
- [x] Move the order-status update logic into `updateOrderStatus`.
- [x] Return `orders` from the Hook.
- [x] Return `updateOrderStatus` from the Hook.
- [x] Destructure the returned values inside `AdminOrdersPage`.
- [x] Connect `OrderCard` callback props to `updateOrderStatus`.
- [x] Understand the relationship between hiding `setOrders` and
      encapsulation.
- [x] Understand why the current render's state does not immediately
      change after calling `setOrders`.
- [x] Understand the state-update and rerender flow.
- [x] Understand the difference between logic separation and file
      separation.
- [x] Separate `OrderCard`, `OrderItemList`, and `useOrders` into
      files according to their responsibilities.
- [x] Manage shared order-related types in a separate type file.
- [x] Debug a TypeScript error caused by an incorrect automatic
      import.
- [x] Verify that the existing order-list and status-update behavior
      still works.

---

## 20. Key Sentence of the Day

> **A Custom Hook is not merely a tool for shortening code. It is a
> structure for separating React state and the logic related to that
> state into a clear responsibility, while exposing only the values and
> operations that a component needs.**

The following line best represents that structure in today's code:

```tsx
const { orders, updateOrderStatus } = useOrders();
```

`AdminOrdersPage` no longer needs to know how the order state is stored
or updated internally.

The page receives `orders` to render the UI and uses `updateOrderStatus`
when an order status needs to change.

---

## 21. Debugging and Design Rules to Remember After Day 14

```text
Does it render something on the screen?
→ UI / Component

Does it store or update React state?
→ React logic / Custom Hook candidate

Is it a service or domain rule that exists independently of React?
→ Business logic candidate

What should outside code be able to use from the Hook?
→ Expose it through return

Is it an implementation detail that outside code does not need to access directly?
→ Keep it hidden inside the Hook

Did a strange type error appear after separating files?
→ Check the import and the actual type-definition location

Are there no errors after refactoring?
→ Retest the actual UI behavior
```

**Tip**

Continue using these rules as the code becomes more complex after Day 15. The goal is not to classify every line perfectly from the beginning.
The important skill is being able to **recognize responsibility
boundaries and improve them as the codebase grows**.
