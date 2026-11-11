# 문제·정답 — 2026-10-29

### 1. Why separate CartItem and OrderItem?

**Answer:** To preserve purchase-time product names and prices.

### 2. Why avoid synchronous setState in an Effect?

**Answer:** It may cause extra renders and lint warnings.

### 3. Why use string snapshots?

**Answer:** To avoid unstable references from fresh arrays.

### 4. How to notify same-tab storage updates?

**Answer:** Dispatch custom events.

### 5. Why use purchase-time prices?

**Answer:** To preserve historical order totals.

### 6. What does AbortController do?

**Answer:** Cancels obsolete requests.

### 7. What caused the duplicate homepage?

**Answer:** Rendering children twice in the layout.

### 8. What could cause the link text color issue?

**Answer:** A possible global CSS and Tailwind precedence conflict.
