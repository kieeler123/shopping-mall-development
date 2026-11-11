# Day 33 --- HTTP Status Codes and Error Handling

> Shopping mall project \| `Request` / `Response`, `response.ok`, `200/400/404/500`, `try/catch`

## Learning objectives

-   Select appropriate HTTP status codes for success and failure.
-   Handle HTTP errors with `response.ok` and exceptions with `try/catch`.
-   Display error messages and a retry action in the UI.

## 1. Status code reference

  Status   Meaning                 Shopping mall example
  -------- ----------------------- -----------------------------
  200      OK                      Orders retrieved
  400      Bad Request             Invalid order ID
  404      Not Found               Order does not exist
  500      Internal Server Error   Unexpected server exception

**Tip:** 400 usually indicates invalid client input; 500 indicates a server-side failure. Authentication and authorization failures often use 401 and 403.

## 2. Improve the GET API

File: `app/api/orders/route.ts`

``` ts
const orders = [
  { id: 1, product: "Wireless keyboard", price: 59000 },
  { id: 2, product: "Gaming mouse", price: 35000 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const id = Number(idParam);
      if (!Number.isInteger(id) || id <= 0) {
        return Response.json(
          { success: false, error: "Invalid order ID" },
          { status: 400 }
        );
      }
      const order = orders.find((item) => item.id === id);
      if (!order) {
        return Response.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }
      return Response.json({ success: true, order }, { status: 200 });
    }

    return Response.json(
      { success: true, count: orders.length, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order lookup failed:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Tip:** A 500 response should represent a real server error. Do not ship intentionally crashing test endpoints to production.

## 3. Fetch with `response.ok` and `try/catch`

File: `lib/orders.ts`

``` ts
export type Order = { id: number; product: string; price: number };

export async function fetchOrders(): Promise<Order[]> {
  let response: Response;
  try {
    response = await fetch("/api/orders");
  } catch {
    throw new Error("Could not connect to the server.");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body: { error?: string } = await response.json();
      if (body.error) message = body.error;
    } catch {
      // A non-JSON error response is possible.
    }
    throw new Error(message);
  }

  try {
    const data: { orders: Order[] } = await response.json();
    if (!Array.isArray(data.orders)) throw new Error("Invalid response");
    return data.orders;
  } catch {
    throw new Error("Unable to read the orders response.");
  }
}
```

**Important:** `fetch()` generally resolves even for HTTP 404 and 500. Check `response.ok`; `try/catch` handles network failures, parsing errors, and explicitly thrown errors.

## 4. UI error state and retry

File: `app/orders/page.tsx`

``` tsx
"use client";

import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../../lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchOrders();
        if (active) setOrders(result);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [retry]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return (
    <div role="alert">
      <p>{error}</p>
      <button onClick={() => setRetry((n) => n + 1)}>Retry</button>
    </div>
  );
  return <ul>{orders.map((order) => (
    <li key={order.id}>{order.product} — {order.price}</li>
  ))}</ul>;
}
```

**Tip:** The relative import assumes root-level `app/orders/page.tsx` and `lib/orders.ts`. Adjust for your project structure.

## 5. Test scenarios

  Request                       Expected result
  ----------------------------- -----------------------
  `/api/orders`                 200: all orders
  `/api/orders?id=1`            200: existing order
  `/api/orders?id=abc`          400: invalid ID
  `/api/orders?id=999`          404: order not found
  Stop server, then reload UI   Network error message

A 500 response requires an actual server exception; do not mistake client errors for server errors.

## 6. Multiple-choice questions

**Q1. What happens when `fetch()` receives HTTP 404?** - A. It always throws automatically - B. It resolves with `response.ok === false` - C. The browser closes - D. It changes to 200

**Q2. What status is appropriate for an absent order with a valid ID?** - A. 200 - B. 400 - C. 404 - D. 500

**Q3. What status is appropriate for an unexpected server exception?** - A. 500 - B. 200 - C. 301 - D. 404

## 7. Written and coding questions

**S1.** Explain the difference between `response.ok` and `try/catch`.

**S2.** Why should `id=abc` produce 400 while `id=999` produces 404?

**S3.** Describe the loading → fetch → error → retry UI flow.

**S4.** Write a `fetch("/api/orders")` call that checks the status and handles errors.

## 8. Answers and explanations

-   Q1 **B** --- HTTP error status alone does not normally reject a fetch promise.
-   Q2 **C** --- A valid identifier can still refer to a missing resource.
-   Q3 **A** --- Unexpected server failures use 500.
-   S1 sample: `response.ok` tests whether the HTTP status is in the 2xx range. `try/catch` catches network, parsing, and explicitly thrown errors.
-   S2 sample: `abc` is invalid input (400); `999` is well-formed but absent (404).
-   S3 sample: Set loading → fetch → check status → show data or error → offer retry.
-   S4 sample:

``` ts
try {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log(data);
} catch (error) {
  console.error(error);
  // Update the UI's error state in React.
}
```

## 9. Completion checklist

-   [ ] Distinguish 200, 400, 404, and 500.
-   [ ] Return appropriate success/error responses.
-   [ ] Apply `response.ok` and `try/catch`.
-   [ ] Verify error UI and retry behavior.
-   [ ] Answer the multiple-choice and written questions.
