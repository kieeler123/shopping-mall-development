# Day 28 — Data Flow and State Updates

Key question: How can UI components safely use state and functions from a Custom Hook and reflect updates?

**Stack:** Next.js · React · TypeScript  
**Duration:** 90 min

## 1. Learning goals

- Explain data flow through props and callbacks
- Trace calls to `updateOrderStatus` from `useOrders()` consumers
- Update arrays immutably with `map()`
- Explain API success/failure and UI synchronization
- Type callback props correctly in TypeScript

## 2. Scope

**In scope:** one-way data flow, callback props, immutable state, async updates, error handling, TypeScript.

**Out of scope:** new state libraries, API redesign, large refactors.

## 3. 90-minute schedule

| Stage                    |       Time | Activity                        |
| ------------------------ | ---------: | ------------------------------- |
| Days 27–28 review        |     10 min | Component/Hook responsibilities |
| Data flow                |     15 min | Props and callbacks             |
| State updates            |     15 min | Array/object immutability       |
| API update flow          |     15 min | Success and failure             |
| Project practice         |     15 min | Inspect existing function       |
| Concepts and coding test |     20 min | 15 questions                    |
| **Total**                | **90 min** |                                 |

## 4. Practice plan

1. **Trace callbacks:** `AdminOrdersPage` → `OrderCard` → `onStatusChange` → `updateOrderStatus`.
2. **Immutability:** compare direct mutation with `map()` and object spread.
3. **Async:** examine API failures and UI synchronization.
4. **Types:** review props destructuring and TypeScript annotations.

Avoid changes when the existing behavior is already correct.

### Reference code (illustrative)

```tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

<OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />;
```

```tsx
setOrders((prev) =>
  prev.map((order) =>
    order.id === targetId ? { ...order, status: newStatus } : order,
  ),
);
```

## 5. Coding test plan (15 questions)

| Category             | Questions |
| -------------------- | --------: |
| Prior lessons        |         3 |
| Variations           |         3 |
| New fundamentals     |         4 |
| Project applications |         3 |
| Debugging            |         2 |
| **Total**            |    **15** |

A separate HTML exercise will support editable answers, collapsible solutions, side-by-side comparison, and local autosave.

## 6. Completion criteria

- [ ] Explain callback/props flow
- [ ] Trace `updateOrderStatus`
- [ ] Explain why direct state mutation is problematic
- [ ] Write an immutable `map()` update
- [ ] Explain API error handling
- [ ] Type callback props
- [ ] Complete 15 questions
- [ ] Verify existing order management behavior

## 7. Study tip

**Tip:** Read the actual `useOrders()` implementation before changing code; confirm the order of server calls and local state updates.

## 8. Study tip
