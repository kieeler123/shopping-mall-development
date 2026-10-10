# Days 21–25 Coding Assessment (English)

## Task
Complete a React + TypeScript order list and cancellation feature. Fill TODO 1–8, including loading, errors, duplicate-click protection, and request cleanup.

## Starter Code

```tsx
import { useEffect, useState } from "react";

type Order = {
  id: number;
  productName: string;
  status: "PAID" | "CANCELLED";
};

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        // TODO 1: GET orders using userId and controller.signal
        // TODO 2: check response.ok, parse JSON, update orders
      } catch (err) {
        // TODO 3: report errors only if not aborted
      } finally {
        // TODO 4: stop loading only if not aborted
      }
    }

    void loadOrders();
    // TODO 5: return cleanup
  }, [userId, refreshKey]);

  async function handleCancel(orderId: number) {
    // TODO 6: POST cancellation and check response.ok
    // TODO 7: increment refreshKey on success
    // TODO 8: prevent duplicate clicks and handle errors
  }

  return (
    <section>
      <h1>Orders</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <p>No orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.productName} — {order.status}
              <button
                type="button"
                disabled={order.status === "CANCELLED" || cancellingId !== null}
                onClick={() => void handleCancel(order.id)}
              >
                {cancellingId === order.id ? "Cancelling..." : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

## Rubric (100 points)
- GET request and AbortController signal: 20
- response.ok, JSON parsing, setOrders: 20
- try/catch/finally and guarding aborted requests: 20
- Effect cleanup: 10
- Cancellation POST and refreshKey update: 20
- Duplicate-click prevention and error display: 10

## Reference Solution

```tsx
import { useEffect, useRef, useState } from "react";

type Order = {
  id: number;
  productName: string;
  status: "PAID" | "CANCELLED";
};

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const cancelLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/orders?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await response.json();
        if (!controller.signal.aborted) {
          setOrders(data);
          setLoadedUserId(userId);
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

  async function handleCancel(orderId: number) {
    if (cancelLock.current || loadedUserId !== userId || loading) return;
    cancelLock.current = true;
    setCancellingId(orderId);
    setCancelError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      cancelLock.current = false;
      setCancellingId(null);
    }
  }

  const showLoading = loading || loadedUserId !== userId;
  return (
    <section>
      <h1>Orders</h1>
      {cancelError && <p role="alert">{cancelError}</p>}
      {showLoading && !error ? (
        <p>Loading...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              {order.productName} — {order.status}
              <button
                type="button"
                disabled={order.status === "CANCELLED" || cancellingId !== null || loading}
                onClick={() => void handleCancel(order.id)}
              >
                {cancellingId === order.id ? "Cancelling..." : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

## Notes
- HTTP 404/500 does not automatically reject fetch.
- Aborting a GET request is different from canceling an order.
- Avoid showing one user's orders while viewing another user.
- Endpoints are examples; a backend is required.
- Production code also needs server authorization, runtime response validation, and careful handling of user changes during cancellation.

**Tip:** Complete the TODOs before reading the reference solution.
