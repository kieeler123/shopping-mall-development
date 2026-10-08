# Day 25 — Integrated Data Flow Learning Plan

> **Project:** E-commerce order history and cancellation  
> **Goal:** Connect asynchronous operations, State, Events, and Effects from Days 21–24 in one feature.  
> **Estimated duration:** 90–120 minutes  
> **Prerequisites:** `async/await`, `fetch`, `useState`, event handlers, `useEffect`, dependency arrays

## 1. Key question

**How does server data become UI, and how does a user action update both the server and UI?**

```text
[Initial load]
Page renders → useEffect → fetch(GET) → server response
→ setOrders(new data) → rerender → orders UI

[Cancellation]
Cancel click → event handler → fetch(POST)
→ server cancels order → fetch updated orders
→ setOrders(updated data) → rerender → updated UI
```

**Tip:** Identify the **source (server)**, **storage (State)**, **presentation (UI)**, and **trigger (Event)**.

## 2. Connecting Days 21–24

| Previous day | Role today | Example |
|---|---|---|
| Day 21 — Async | Wait for API responses and handle failures | `async/await`, `fetch` |
| Day 22 — State | Store orders, loading, and errors | `useState` |
| Day 23 — Events | Respond to cancellation clicks | `onClick`, `handleCancel` |
| Day 24 — Effects | Load orders when the page/user changes | `useEffect`, `[userId]` |

**Tip:** Label each meaningful line of code as Async, State, Event, or Effect.

## 3. Feature requirements

1. Fetch the current user's orders when the page opens.
2. Display a loading message during the request.
3. Render the order list.
4. Show Cancel for eligible orders.
5. Send a cancellation request only after a click.
6. Refetch server data after successful cancellation.
7. Display errors without falsely claiming success.

**Assumed training API:**
- `GET /api/orders?userId=...` → `Order[]`
- `POST /api/orders/:orderId/cancel` → 2xx on success

These endpoints and response shapes are **educational assumptions**. Adapt them to your project. The server must enforce authentication and authorization instead of trusting a client-supplied `userId`.

**Tip:** Write down the request, response, and error contract before coding.

## 4. Study schedule

| Phase | Time | Exercise | Completion check |
|---|---:|---|---|
| 1. Map flows | 10 min | Draw load and cancellation flows | Different triggers identified |
| 2. Types & State | 15 min | Define `Order`, `orders`, `loading`, `error` | Explain each state |
| 3. Initial fetch | 20 min | GET inside an Effect | Orders appear on entry |
| 4. Cancel event | 20 min | POST in `handleCancel` | POST only on click |
| 5. Resynchronize UI | 15 min | Refetch after success | UI matches server |
| 6. Handle failures | 15 min | Errors, loading, duplicate clicks | Clear feedback |
| 7. Review | 10 min | Explain the entire flow | Can trace code verbally |

**Tip:** Test each phase in the browser before moving on.

## 5. Integrated exercise (React + TypeScript)

```tsx
import { useEffect, useState } from "react";

type OrderStatus = "PAID" | "CANCELLED";
type Order = {
  id: number;
  productName: string;
  status: OrderStatus;
};

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Day 24: synchronize on user change or successful cancellation
  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      setOrders([]);

      try {
        // Day 21: asynchronous API request
        const response = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to load orders.");

        const data: Order[] = await response.json();
        if (!controller.signal.aborted) {
          // Day 22: state update triggers rerender
          setOrders(data);
        }
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
  }, [userId, refreshKey]);

  // Day 23: explicit user action
  async function handleCancel(orderId: number) {
    if (cancellingId !== null) return;
    setCancellingId(orderId);
    setError(null);

    try {
      // Day 21: asynchronous mutation
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to cancel the order.");

      // Request a fresh server snapshot
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section>
      <h1>Order history</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.productName} — {order.status}
              {order.status === "PAID" && (
                <button
                  disabled={cancellingId !== null}
                  onClick={() => void handleCancel(order.id)}
                >
                  {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

### Step-by-step walkthrough

1. React renders the page and commits it.
2. The Effect loads orders for the current `userId` and `refreshKey`.
3. `setOrders` stores the response and React rerenders the list.
4. A Cancel click invokes **`handleCancel`, not the Effect**.
5. After the server confirms cancellation, `refreshKey` increments.
6. The Effect refetches the **latest server state**.
7. `setOrders` updates the UI.

**Note:** `refreshKey` is a simple **learning-oriented refetch signal**. Production apps often use query invalidation or router revalidation. The old list may remain visible briefly until the refetch completes.

**Tip:** `setRefreshKey` does not cancel anything. The **event handler mutates**; the **Effect resynchronizes**.

## 6. Verification checklist

- [ ] GET runs when the page opens.
- [ ] Changing `userId` loads the new user's orders.
- [ ] POST never runs without clicking Cancel.
- [ ] Successful cancellation is followed by a GET.
- [ ] Failed cancellation does not pretend to succeed.
- [ ] Loading and error messages appear.
- [ ] Duplicate cancellation clicks are blocked.
- [ ] The previous GET is aborted on cleanup.

**Tip:** Inspect the Network tab for **GET → POST → GET**. Development Strict Mode may cause additional Effect checks and requests.

## 7. Knowledge check

**Q1.** Where should the initial GET be initiated?  
① Render body ② `useEffect` ③ Cancel button's `onClick`

**Q2.** When should the cancellation POST run?  
① Every render ② Every `userId` change ③ When the user clicks Cancel

**Q3.** What does `setOrders(data)` primarily do?  
① Directly edit the server database ② Update State and trigger UI rerender ③ Close the network connection

**Q4.** Why increment `refreshKey` after a successful cancellation?  
① Trigger the Effect to fetch fresh orders ② Automatically repeat the POST ③ Shut down React

**Q5.** Which rule is correct?  
① GET always belongs in an Effect. ② POST belongs in render. ③ Distinguish Effects and handlers by **what triggers the operation**.

### Answer key and explanations

1. **②** — The page needs synchronization with external data.
2. **③** — Cancellation is an explicit user action.
3. **②** — Updating State requests a rerender.
4. **①** — A changed dependency reruns the Effect.
5. **③** — HTTP method does not determine the correct location.

**Tip:** Explain why each wrong option is wrong, not just why the correct one is right.

## 8. Definition of done

- [ ] Explain `API → fetch → Data → State → UI`.
- [ ] Explain `UI → Event → API mutation → updated Data → State → UI`.
- [ ] Distinguish an Effect from an event handler.
- [ ] Handle failures without showing false success.
- [ ] Identify where Days 21–24 concepts appear in the example.

**Final takeaway:** Synchronize server data through an Effect, render it from State, mutate the server in response to a user event, and synchronize the latest data again.

**Tip:** Without looking at code, narrate **GET → State → UI → click → POST → refetch → State → UI**.
