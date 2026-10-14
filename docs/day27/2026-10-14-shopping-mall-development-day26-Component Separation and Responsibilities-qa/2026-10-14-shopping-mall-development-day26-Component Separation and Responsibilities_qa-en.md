# Day 27 — Questions, Answers, and Explanations

## Part 1: Responsibility classification (8 × 10 = 80 points)
Assign each snippet to `AdminOrdersPage`, `OrderCard`, `OrderItemList`, or `useOrders`.

| # | Snippet | Answer | Why |
|---|---|---|---|
| 1 | `orders.map(order => ...)` | AdminOrdersPage | Iterates the full order collection |
| 2 | `order.name / phone / address` | OrderCard | Displays one order's customer details |
| 3 | `items.map(item => ...)` | OrderItemList | Iterates items within one order |
| 4 | Loading message based on `isLoading` | AdminOrdersPage | Page-level state |
| 5 | `<select value={order.status}>` | OrderCard | UI for one order |
| 6 | Function that actually updates status | useOrders | Data behavior |
| 7 | Empty message when `orders.length === 0` | AdminOrdersPage | Entire list's empty state |
| 8 | `item.quantity / item.price` | OrderItemList | Individual item presentation |

## Part 2: Concept checks
**Q1.** Who displays “No orders”?  
**A.** `AdminOrdersPage`, because the entire collection is empty.

**Q2.** Should we create a second item-list component if `OrderItemList` already exists?  
**A.** No. Verify and reuse the existing separation.

**Q3.** Must every JSX block longer than ten lines be extracted?  
**A.** No. Consider meaning, repetition, independent changes, and Props boundaries.

**Q4.** Should `OrderCard` call `useOrders()` again?  
**A.** Not in this design. It receives `onStatusChange` from its parent.

**Q5.** Is `function User({ name: string })` a type annotation?  
**A.** No. It renames the `name` property to a local variable called `string`.

**Q6.** Is this correct?
```tsx
function User({ name, age }: { name: string; age: number }) {
  return <p>{name} {age}</p>;
}
```
**A.** Yes. The first object pattern destructures values; the second describes their types.

## Part 3: Self-check
- Explain why `orders.map` and `items.map` belong in different components.
- Explain that React's `key` identifies list elements; it does not display an ID.
- Distinguish calling an update callback from implementing the update.
- Explain why an optional extraction may be deferred.

**Tip:** Justify each answer by scope and reason to change rather than memorizing component names.
