# Day 31 — Existing Project Audit and Server vs Client Responsibilities

**학습 시간 / 学習時間 / Study time:** 120 minutes

> Audit the existing Next.js + TypeScript shopping mall, explain file-by-file order data flow, and place browser-only logic behind the correct Client Component boundary.

## Learning sequence

Core theory 20 min → one multiple-choice question 5 min → project work 65 min → one coding challenge 20 min → checks and notes 10 min

### Core theory (20 minutes)
- **App Router:** Files and directories under `app/` define pages and API routes.
- **Server Components:** Default in the App Router. Do not directly use `useState`, `useEffect`, or browser APIs such as `localStorage`.
- **Client Components:** Marked with `"use client"`; handle interactions, React state, and browser-dependent behavior.
- **Route Handlers:** Files such as `app/api/orders/route.ts` that handle HTTP methods including `GET` and `PATCH`.
- **Important:** A Client Component can still be prerendered; avoid accessing browser globals during unsafe render phases.

**Tip:** When you find `localStorage`, identify where and when the code runs.

### One multiple-choice question (5 minutes)
**Q. Which statement best distinguishes Route Handlers from Client Components?**

A. Route Handlers run only in browsers.  
B. Route Handlers handle HTTP requests and responses, while Client Components handle UI interactions and browser state.  
C. Both must declare `"use client"`.  
D. Only Client Components can access a database.

<details><summary>Answer and explanation</summary>

**Answer: B.** Route Handlers implement server-side endpoints. Client Components support interactive UI; sensitive data access belongs on the server.

</details>

### Project implementation (65 minutes)
**0–10 min | Inspect the current structure**
Review `app/layout.tsx`, `app/cart/page.tsx`, `app/checkout/page.tsx`, `app/orders/page.tsx`, `app/orders/[id]/page.tsx`, `app/order-complete/page.tsx`, `app/admin/orders/hooks/useOrders.ts`, `app/api/orders/route.ts`, `src/hooks/useCartStorage.ts`, `src/hooks/useOrdersStorage.ts`, and `src/types/`. Note missing paths rather than recreating them.

**10–25 min | Classify responsibilities**
Label each file as Server Component, Client Component, Route Handler, Custom Hook, or Type/Data. Inspect `"use client"` directives and browser API calls.

**25–45 min | Trace the order flow**
Products → cart persistence → checkout snapshot (`name`, `price`, `quantity`) → order storage → confirmation/list/detail → admin API requests.

**45–55 min | Audit storage boundaries**
Check whether customer-facing `localStorage` orders and admin `/api/orders` responses use the same source of truth. Do not assume synchronization.

**55–65 min | Make one targeted improvement**
Move browser-only behavior to an appropriate Client boundary. Avoid large refactors today.

**Tip:** Also verify duplicate `{children}` rendering and nested `<main>` tags.

### One coding challenge (20 minutes)
**Task:** Fix a page that reads `localStorage` during server rendering. Reuse the existing `useCartStorage` hook.

```tsx
// Before
export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  return <p>Product types: {cart.length}</p>;
}
```

**Requirements:** Use `"use client"`, avoid direct `localStorage` reads during render, and account for hydration.

<details><summary>Reference solution (adapt to the real hook API)</summary>

```tsx
"use client";
import { useCartStorage } from "@/hooks/useCartStorage";

export default function CartPage() {
  const { cart, isReady } = useCartStorage();
  if (!isReady) return <p>Loading cart...</p>;
  return <p>Product types: {cart.length}</p>;
}
```

If your hook returns an array rather than an object, adapt the destructuring. Only use `isReady` if the hook actually exposes it.

</details>

**Tip:** Write the solution in VS Code first and inspect the hook's TypeScript signature.

### Checks and notes (10 minutes)
```powershell
cd H:\shopping-mall-development
npx tsc --noEmit
npx eslint .
```

- [ ] Classify responsibilities file by file
- [ ] Explain the order flow using actual file names
- [ ] Verify the relationship between localStorage and API data
- [ ] Answer one multiple-choice question
- [ ] Solve one coding challenge
- [ ] Record actual TypeScript and ESLint results

**Definition of done:** Explain the order data flow file by file.

**Assessment:** Multiple choice 20 + implementation and verification 50 + coding 30 = 100 points; suggested pass mark 80.

