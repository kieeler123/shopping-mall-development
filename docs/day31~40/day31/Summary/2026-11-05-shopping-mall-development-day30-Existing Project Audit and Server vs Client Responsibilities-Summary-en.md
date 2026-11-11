# Day 31 — Complete Review
> Existing Project Review and Server / Client Boundaries

**Date:** 2026-11-05  |  **Planned study time:** 120 min  |  **Score:** 94/100 (PASS)

## Learning objective
Understand component boundaries in Next.js App Router and trace e-commerce order data.

## Core concepts
### Server Component
Default App Router component; supports server-side data access and rendering.

### Client Component
"use client" boundary for events, React state, and browser APIs.

### Route Handler
Handles GET, POST, PATCH in app/api/**/route.ts.

### useSyncExternalStore
Subscribes to external stores with SSR and hydration snapshots.

## File responsibilities
- `app/cart/page.tsx`
- `app/checkout/page.tsx`
- `app/order-complete/page.tsx`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`
- `src/hooks/useCartStorage.ts`
- `src/hooks/useOrdersStorage.ts`
- `app/admin/orders/hooks/useOrders.ts`

## Order data flow
1. Read product data from products.ts
2. Read cart from localStorage["cart"]
3. Create order snapshots of name, price, and quantity
4. Save to localStorage["orders"] and dispatch orders-updated
5. Clear cart and dispatch cart-updated
6. Navigate to order completion
7. Display history/details and handle cancellation

## Key findings
Two admin API Route Handlers are missing, while customer orders are stored in browser localStorage.

## Improvement backlog
- Design admin API and shared server-side persistence
- Use order IDs on the completion page
- Handle malformed JSON at checkout
- Expose a distinct cart readiness state
- Validate authorization and order state server-side
