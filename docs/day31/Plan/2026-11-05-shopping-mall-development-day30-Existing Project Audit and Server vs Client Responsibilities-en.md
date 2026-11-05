# Day 31 Study Plan — Existing Project Audit and Server / Client Roles

**Duration / 학습 시간 / 学習時間:** 120 min
**Topics:** Next.js App Router · Server Components · Client Components · Route Handlers

## 1. Learning objectives
Map the e-commerce project file structure and order flow, and distinguish Client Component responsibilities from Route Handler responsibilities.

**Tip:** Before editing, document each file’s execution environment, data source, and responsibility.

## 2. Schedule
| Time | Activity | Deliverable |
|---|---|---|
| 00–20 min | Review concepts | 1 |
| 20–40 min | Audit file structure | 2 |
| 40–65 min | Trace order flow | 3 |
| 65–85 min | Analyze admin API | 4 |
| 85–105 min | Coding exercise | 5 |
| 105–120 min | Quiz and reflection | 6 |

## 3. Core concepts
Server Components fetch server-side data and compose UI. Client Components handle user interactions. Route Handlers process HTTP requests and perform server-side validation. Client Components can be pre-rendered on the server, so avoid assuming window/localStorage exists during rendering.

| Type | Responsibility |
|---|---|
| Server Component | Server-side data and UI composition |
| Client Component | Hooks, state, browser interactions |
| Route Handler | GET/PATCH, authorization, server data |

## 4. File structure audit
```text
app/
├── cart/page.tsx
├── checkout/page.tsx
├── orders/page.tsx
├── orders/[id]/page.tsx
├── order-complete/page.tsx
├── admin/orders/hooks/useOrders.ts
└── api/orders/
    ├── route.ts
    └── [id]/route.ts
hooks/
├── useCartStorage.ts
└── useOrdersStorage.ts
```
The two expected order API files were not found during the previous audit. Verify their current status.

- [ ] `app/cart/page.tsx`
- [ ] `app/checkout/page.tsx`
- [ ] `app/orders/page.tsx`
- [ ] `app/orders/[id]/page.tsx`
- [ ] `app/admin/orders/hooks/useOrders.ts`
- [ ] `app/api/orders/route.ts`
- [ ] `app/api/orders/[id]/route.ts`
- [ ] `useCartStorage` and `useOrdersStorage`

## 5. Order data flow
Cart → checkout → order storage → order history → admin API

1. `app/cart/page.tsx` → `useCartStorage()` → `localStorage["cart"]`
2. `app/checkout/page.tsx` → order snapshot → `localStorage["orders"]`
3. `app/order-complete/page.tsx` → show completed order; verify its ID
4. `app/orders/page.tsx` → `useOrdersStorage()`
5. `app/admin/orders/hooks/useOrders.ts` → `GET /api/orders` and `PATCH /api/orders/[id]`

### Architectural warning
Orders stored in browser localStorage are not automatically shared with server APIs.

## 6. Coding practice
### A. Reuse the existing cart Hook
```tsx
"use client";
import { useCartStorage } from "@/hooks/useCartStorage";
export default function CartCount() {
  const cart = useCartStorage();
  return <p>상품 종류: {cart.length}</p>;
}
```
### B. Explain Route Handler responsibilities
```ts
// Example only: this endpoint is NOT implemented yet.
import { NextResponse } from "next/server";
export async function GET() {
  // TODO: authorization and server-side order lookup
  return NextResponse.json({message:"Not implemented"}, {status:501});
}
```
HTTP 501 indicates an intentionally unimplemented exercise endpoint.

## 7. Knowledge check
1. How does a Route Handler differ from a Client Component?
2. Why can localStorage access be unsafe even with "use client"?
3. What does useSyncExternalStore solve?
4. Why can’t an admin API directly read customer localStorage?
5. Why might the last stored order not be the just-completed order?

## 8. Final deliverables
- [ ] File-by-file responsibility table
- [ ] Cart-to-order flow diagram
- [ ] Admin API and storage boundary analysis
- [ ] Hook reuse exercise
- [ ] Learning reflection

**Tip:** Before editing, document each file’s execution environment, data source, and responsibility.
