# Day 31 — Coding Challenge
> Existing Project Review and Server / Client Boundaries

**Date:** 2026-11-05  |  **Planned study time:** 120 min  |  **Score:** 94/100 (PASS)

## Question
```tsx
export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
  return <p>상품 종류: {cart.length}</p>;
}
```

## Requirements
- Declare "use client"
- Reuse the existing useCartStorage Hook
- Avoid reading localStorage during render
- Account for SSR and hydration

## Submitted code
```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  const cart = useCartStorage();
  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
    updateCart(updatedCart);
  };

  return <p>상품 종류: {cart.length}</p>;
}
```

## Scoring and feedback
**24 / 30** — 5/5 + 10/10 + 5/5 + 4/10

An unused updateCart function recursively calls itself without a base case. It does not fail immediately because it is never invoked, but would risk a stack overflow if called. Remove unused functions and imports.

## Corrected solution
```tsx
"use client";

import { useCartStorage } from "@/hooks/useCartStorage";

export default function CartPage() {
  const cart = useCartStorage();

  return <p>상품 종류: {cart.length}</p>;
}
```

Identify where code runs and where data is stored before making changes.
