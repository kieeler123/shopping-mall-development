# Day 24 Study Guide --- `useEffect` and Synchronizing with External Systems

> E-commerce orders page · Main question: **Why does this work belong in
> an Effect or an event handler rather than render?**

## 1. The central idea

`useEffect` does **not** mean `fetch`. An Effect synchronizes a React
component with a system outside React: APIs, WebSockets, browser events,
timers, or third-party libraries.

- **Render:** compute JSX from current props and state; keep it pure.
- **Effect:** after React commits the render, connect to or
  synchronize with an external system; clean up when necessary.
- **Event handler:** respond to a particular user action.
- **State update:** request another render so the UI reflects new
  data.

**Tip:** Classify the _trigger_ of the operation, not whether an HTTP
request sends or receives data.

## 2. Orders page lifecycle

```text
OrdersPage renders (orders = [])
  → React commits DOM updates
  → Effect setup runs
  → GET /api/orders
  → response arrives → setOrders(data)
  → state update → rerender
  → orders.map(...) displays orders
```

The Effect does not draw the UI; it initiates synchronization. If a
value can be derived entirely from existing props/state, compute it
during render rather than using an Effect.

**Tip:** Follow the entire `fetch → setOrders → orders.map` chain.

## 3. Why fetching during render is dangerous

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  loadOrders(); // ❌ side effect during render
  return <OrderList orders={orders} />;
}
```

If each API response calls `setOrders(newArray)`, a cycle can occur:

```text
render → loadOrders → response → setOrders → render → ...
```

Rendering must be pure; React may interrupt or retry it. Not every state
update creates an infinite loop, but this pattern can cause repeated
requests and race conditions.

**Tip:** Render should describe UI, not start network requests.

## 4. Dependency arrays: the exact rule

```tsx
useEffect(() => {
  // synchronize an external system
}, [userId]);
```

React compares each dependency with its previous value using
**`Object.is`**.

Form When it runs

---

`useEffect(fn)` After every commit
`useEffect(fn, [])` Setup on mount, cleanup on unmount
`useEffect(fn, [userId])` On mount and when `userId` changes

You **declare the reactive values** read by the Effect (props, state,
and values created in the component). The array does not pass those
values _into_ the Effect. Omitting a real dependency risks a stale
closure.

In development, **Strict Mode** may run an additional setup → cleanup →
setup cycle to reveal bugs. So `[]` does not guarantee "exactly once."

**Tip:** Ask "Which changed value requires resynchronization?" rather
than "How do I run this only once?"

## 5. Function identity and repeated Effects

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const loadOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  };
  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);
  return <OrderList orders={orders} />;
}
```

A function defined **inside the component body** is a new function
object on each render:

```tsx
const a = () => {};
const b = () => {};
Object.is(a, b); // false
```

New function identity → changed `[loadOrders]` dependency → Effect
reruns → new state → rerender → another function identity.

**Important correction:** The issue is not merely that the function is
"outside the dependency array." It is that the component recreates it on
each render. A function declared at module scope behaves differently.

**Tip:** Identical function code does not imply identical function
identity.

## 6. Solution A --- Move the function inside the Effect

```tsx
function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const res = await fetch(
        `/api/orders?userId=${encodeURIComponent(userId)}`,
      );
      if (!res.ok) throw new Error("Failed to load orders");
      setOrders(await res.json());
    }
    void loadOrders();
  }, [userId]);

  return <OrderList orders={orders} />;
}
```

No component-scoped function identity is needed as a dependency. This is
a **conceptual example**; it still needs complete error handling and
cancellation.

**Tip:** Prefer this simple structure when the helper is used only by
the Effect.

## 7. Solution B --- Stabilize identity with `useCallback`

```tsx
const loadOrders = useCallback(async () => {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to load orders");
  setOrders(await res.json());
}, [userId]);

useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

`useCallback` reuses a function reference while its dependencies are
unchanged. When `userId` changes, the callback changes and the Effect
resynchronizes. It **does not cache API responses or prevent duplicate
network requests by itself**.

---

Criterion Function inside Effect `useCallback`

---

Best for Effect-only helper Reused by a refresh
button or other code

Dependencies Effect: `[userId]` Callback: `[userId]`;
Effect: `[loadOrders]`

Benefit Simpler dependency Stable reusable
model reference

Tradeoff Not directly reusable Additional complexity
elsewhere

---

**Tip:** Do not wrap every function in `useCallback` automatically.

## 8. Effect vs event handler --- the key correction from Question 4

**Scenario A:** Opening the orders page or changing `userId` requires
loading the relevant orders. This is synchronization with the displayed
page state, so an Effect can be appropriate.

**Scenario B:** Clicking **Cancel order** should initiate a
cancellation. This is a user action, so use an event handler.

**Incorrect rule:** GET/receive → Effect; POST/send → event handler.

**Correct rule:** Is the operation required by the component's
presence/reactive values, or by a particular user action?

```tsx
async function handleCancel(orderId: number) {
  const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
  if (!res.ok) throw new Error("Cancellation failed");
}
<button onClick={() => void handleCancel(1001)}>Cancel order</button>;
```

A search button can trigger a GET request; an Effect may also send data
to an external system. HTTP direction is not the deciding factor.
Framework data loaders or query libraries can be preferable to manual
Effects.

**Tip:** Ask "Why should this happen _now_?"

## 9. Safer order fetching: cleanup, loading, and errors

```tsx
import { useEffect, useState } from "react";

type Order = { id: number; productName: string };

function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      setOrders([]);
      try {
        const res = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Order[] = await res.json();
        if (!controller.signal.aborted) setOrders(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, [userId]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>{order.productName}</li>
      ))}
    </ul>
  );
}
```

This is an educational example, not a full production architecture. Add
authentication and server-side authorization, caching, retries, logging,
response validation, and accessibility as appropriate. **Never authorize
access solely from a client-provided `userId` query parameter.**

**Tip:** Cleanup is for ending or invalidating previous synchronization,
not for forcing an Effect to run only once.

## 10. Review of the four questions

| Question   | Answer | Core reason                                                                                 | Key refinement                                                                                 |
| ---------- | :----: | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Question 1 |   ①    | API call during render → state update → possible repeated rendering                         | React rendering **must be pure**.                                                              |
| Question 2 |   ②    | React compares previous and current `userId` with `Object.is` and resynchronizes the Effect | Dependencies **declare values to compare**; they do not pass values into the Effect.           |
| Question 3 |   ②    | New function reference on each render → changed dependency → Effect reruns                  | Consider **when the function is created and its identity**, not just its declaration location. |
| Question 4 |   ②    | Page-state synchronization uses an Effect; user clicks use event handlers                   | Decide by **what triggers the operation**, not GET versus POST.                                |

### Self-check

1.  Why is `loadOrders()` during render risky?
2.  How do `[]` and `[userId]` differ?
3.  Why does a component-scoped function change identity?
4.  Why does order cancellation belong in a click handler?
5.  What does cleanup actually clean up?

**One-sentence takeaway:** Render computes UI; Effects synchronize
external systems; event handlers respond to user actions.
