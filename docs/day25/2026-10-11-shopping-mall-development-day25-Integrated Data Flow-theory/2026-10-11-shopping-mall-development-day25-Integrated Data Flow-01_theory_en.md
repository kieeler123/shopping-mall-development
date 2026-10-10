# Day 25 Theory Review (English)

## 1. Learning Goal
Build a shopping order list and cancellation flow with React and TypeScript: **user change → useEffect → GET → State update → render → cancel click → POST → refetch**.

## 2. Core Concepts

### TypeScript and useState
```tsx
type Order = { id: number; productName: string; status: "PAID" | "CANCELLED" };
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```
`Order[]` is an array of orders; `loading` tracks an in-flight request; `error` holds a message or `null`.
**Tip:** An empty array cannot distinguish “still loading” from “no orders.”

### Promises, async/await, and fetch
A Promise represents an eventual result: pending, fulfilled, or rejected. An `async` function returns a Promise. `await` suspends the continuation of the current async function, not the entire JavaScript runtime.
```ts
const response = await fetch("/api/orders");
if (!response.ok) throw new Error("Request failed");
const data: Order[] = await response.json();
setOrders(data);
```
The first `await` obtains an HTTP Response; the second reads and parses its body. HTTP 404/500 does not automatically reject `fetch`.
**Tip:** A TypeScript annotation does not validate an API response at runtime.

### Event Loop
```js
console.log("A");
Promise.resolve().then(() => console.log("B"));
setTimeout(() => console.log("C"), 0);
console.log("D");
// A, D, B, C
```
Synchronous statements run first, followed by Promise microtasks before this timer task.

### useEffect and dependencies
```tsx
useEffect(() => { /* fetch orders */ }, [userId, refreshKey]);
```
Changing `userId` fetches another user's orders; changing `refreshKey` triggers a refetch. With `[]`, the Effect is set up on mount (with additional checks possible in development Strict Mode); omitting the array runs the Effect after every commit.
**Tip:** Include reactive values read by an Effect in its dependency array.

### Cleanup and AbortController
```tsx
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, {
        signal: controller.signal,
      });
      if (!r.ok) throw new Error("Request failed");
      const data: Order[] = await r.json();
      if (!controller.signal.aborted) setOrders(data);
    } catch (e) {
      if (!controller.signal.aborted) setError("Could not load orders");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  void load();
  return () => controller.abort();
}, [userId]);
```
Cleanup runs before a changed Effect is set up and on unmount. Development Strict Mode may perform setup → cleanup → setup. Aborting a client request does not guarantee cancellation of server-side work.
**Tip:** Prevent stale responses from overwriting the current user's data.

### Closures and stale closures
A function retains access to its lexical environment. React renders have distinct State snapshots.
```tsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []); // May keep logging the initial count
```
Fix by declaring dependencies, using functional updates (`setCount(prev => prev + 1)`), or a suitable ref.
**Tip:** Ask which render created the callback.

### Event handlers and cancellation
```tsx
<button onClick={() => void handleCancel(order.id)}>Cancel</button>
```
`onClick={handleCancel(order.id)}` invokes the function during render.
```tsx
async function handleCancel(orderId: number) {
  try {
    const r = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
    if (!r.ok) throw new Error("Cancellation failed");
    setRefreshKey(prev => prev + 1);
  } catch {
    setCancelError("Could not cancel order");
  }
}
```
**Tip:** Updating local UI alone does not cancel an order on the server.

## 3. UI States
- Loading: show progress.
- Error: show an accessible error message.
- Empty: successful request with no orders.
- Success: render orders and action buttons.
- Cancelling: disable duplicate actions and show progress.

## 4. Production Checklist
Check `response.ok`; handle parsing errors; clean up requests; prevent cross-user stale data; prevent duplicate cancellations; distinguish cancellation success from refetch success; enforce server-side authentication, authorization, and ownership; validate untrusted API data.

## 5. Memory Aid
**Fetch in Effects; cancel in handlers; store results in State; clean up with cleanup; refetch with refreshKey.**
