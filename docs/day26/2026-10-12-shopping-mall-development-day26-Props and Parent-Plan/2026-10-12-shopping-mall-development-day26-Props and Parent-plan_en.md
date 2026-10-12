# Day 27 --- Component Separation and Responsibilities

**Core question:** Which component should own this code?

The goal is not to memorize design patterns. It is to decide where code
belongs in an existing Next.js admin orders screen.

## 1. Learning objectives

- Distinguish page, list, card, and item responsibilities.
- Extract meaningful UI from long or duplicated JSX.
- Explain the difference between data ownership and UI presentation.
- Inspect the existing admin order screen without breaking its
  behavior.

## 2. Scope

**In scope:** Component responsibilities, page/list/card/item, UI
extraction, Props boundaries.

**Out of scope:** Advanced design patterns, new state-management
libraries, server API redesign, in-depth lifting state up.

## 3. Project structure

```text
AdminOrdersPage
├── Overall page layout
├── Loading / error / empty states
└── OrderCard (one per order)
    ├── Order details
    ├── Status selection UI
    └── OrderItemList (items in that order)
        └── Individual order items
```

**Note:** `OrderItemList` is nested inside `OrderCard`; it is not a
direct child of `AdminOrdersPage`.

## 4. Responsibility Matrix

| Component                   | Owns                                                                           | Does Not Own                                 |
| --------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| `AdminOrdersPage`           | Page layout, order iteration, loading/error/empty states, and hook integration | Detailed card markup                         |
| `OrderCard`                 | One order's details, status UI, and `OrderItemList` composition                | Managing the entire order collection         |
| `OrderItemList`             | Displaying items belonging to one order                                        | Updating overall order status or page layout |
| `useOrders` (existing hook) | Providing order data and status-update logic                                   | Card styling and HTML markup                 |

## 5. 70-Minute Study Schedule

| Phase                  | Time   | Activity                                                 | Output               |
| ---------------------- | ------ | -------------------------------------------------------- | -------------------- |
| 1. Inspect             | 10 min | Read JSX and Props in the three components               | Responsibility map   |
| 2. Classify            | 15 min | Assign 8 code fragments to their owners                  | Classification sheet |
| 3. Evaluate extraction | 15 min | Check meaning, repetition, reasons for change, and Props | 1–2 candidates       |
| 4. Small refactor      | 20 min | Extract useful UI without changing behavior              | Updated code         |
| 5. Verify              | 10 min | Check types, screen behavior, and reasoning              | Completion checklist |

## 6. Step-by-step exercises

### Step 1 --- Inspect the current structure

Find `useOrders()` and `orders.map()` in `AdminOrdersPage`. In
`OrderCard`, locate the details and status `select`. Confirm where
`OrderItemList` receives its `items` Prop.

**Tip:** Do not overwrite existing project files with tutorial examples.
Record their current responsibilities first.

### Step 2 --- Assign responsibilities

Assign each fragment to `AdminOrdersPage`, `OrderCard`, `OrderItemList`,
or `useOrders`.

1.  `orders.map(order => ...)`
2.  Render `order.name`, `order.phone`, and `order.address`
3.  `items.map(item => ...)`
4.  Show a message while `isLoading`
5.  Render `<select value={order.status}>`
6.  Provide the function that updates order status
7.  Show an empty-state message when no orders exist
8.  Render each item's quantity and price

**Tip:** Ask: whole page, one order, order items, or data behavior?

### Step 3 --- Four extraction criteria

① **Meaning:** Can this UI be given a clear independent name?

② **Repetition:** Is the same JSX duplicated?

③ **Reason to change:** Would it evolve independently?

④ **Props boundary:** Can its data and callbacks be passed simply?

Do not extract code solely because it exceeds an arbitrary line count.

**Tip:** If extraction makes Props much harder to understand, keep the
UI together for now.

### Step 4 --- Minimal refactoring

**Exercise A:** Verify that the items UI is already in `OrderItemList`;
avoid duplicating it.

**Exercise B:** If the customer details form a cohesive region in
`OrderCard`, consider extracting an `OrderCustomerInfo` component. A new
file is optional.

**Exercise C:** Preserve `onStatusChange={updateOrderStatus}`.

**Tip:** Move one region at a time and check rendering and types
immediately.

### Step 5 --- Verification and reflection

Run `npm run lint` and the type-check command used by the project (for
example, `npx tsc --noEmit`). Confirm the admin order list, status
selection, and item list behave as before.

**Tip:** Success means clearer responsibilities, not simply more
components.

## 7. Responsibility sketch

The following is a **responsibility sketch**, not a drop-in replacement
for your project's real types or JSX.

```tsx
// AdminOrdersPage: page-level states and the order list
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{
  orders.map((order) => (
    <OrderCard
      key={order.id}
      order={order}
      onStatusChange={updateOrderStatus}
    />
  ));
}

// OrderCard: one order, including its item list
<OrderItemList items={order.items} />;

// OrderItemList: renders items for this one order
```

## 8. Self-check questions

1.  Where should the page-level loading conditional live?

2.  Who should render the status `select` for one order?

3.  Who should render each item's quantity and price?

4.  Should the implementation of `updateOrderStatus` move into
    `OrderCard`?

5.  Should you create another item-list component when `OrderItemList`
    already exists?

## 9. Answers and explanations

<details><summary>Show answer 1</summary>

`AdminOrdersPage`, because loading affects the page as a whole.

</details>

<details><summary>Show answer 2</summary>

`OrderCard`, because the status selector belongs to one order.

</details>

<details><summary>Show answer 3</summary>

`OrderItemList`, which presents the items for one order.

</details>

<details><summary>Show answer 4</summary>

No. Keep data-update logic in the existing `useOrders` hook and invoke
it via the card callback.

</details>

<details><summary>Show answer 5</summary>

No. Inspect the existing separation and improve only what is necessary.

</details>

## 10. Completion checklist

- [ ] I can explain page/card/item-list responsibilities.
- [ ] I located `orders.map`, `OrderCard`, and `OrderItemList` in the
      project.
- [ ] I classified all 8 fragments.
- [ ] I can justify a useful extraction and avoid unnecessary ones.
- [ ] Order list, status selection, and item list still work.

---

**One-sentence takeaway:** Separate components to give each a clear
responsibility, not merely to make every file smaller.
