# Day 22 --- React State Updates and Immutability

> **Today's topic:** How do we manage and modify fetched data in React?

## Today's Final Goal

Be able to explain the following code in your own words:

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

### Core Explanation

Pass an updater function to `setOrders`. React provides the previous
`orders` State, an `Order[]`, to that updater as `prevOrders`. `map()`
processes each `Order` object as `order`. If `order.id` is equal to
`updatedOrder.id`, the callback returns `updatedOrder`; otherwise, it
returns the existing `order`. `map()` collects those return values into
a new array. The updater returns that array, React uses it as the next
State, the component re-renders, JSX is recalculated using the new
State, and the UI is updated.

**Tip:** Read the code as a data flow: previous State → inspect each
item → build a new array → next State → re-render → UI.

------------------------------------------------------------------------

## 1. Connecting Day 21 to Day 22

### Day 21

``` text
API
↓
fetch()
↓
Promise<Response>
↓
await
↓
Response
↓
response.json()
↓
await
↓
Order[]
↓
setOrders(data)
```

### Day 22

``` text
Order[]
↓
State
↓
setOrders
↓
Immutability
↓
Previous State
↓
spread / map / filter
↓
New State
↓
Re-render
↓
UI
```

Day 21 focused on **how to fetch data**. Day 22 focuses on **how to
manage and modify that data in React State**.

**Tip:** Think of Day 21 as "getting the data" and Day 22 as "managing
the data after it arrives."

------------------------------------------------------------------------

## 2. `useState`, `orders`, and `setOrders`

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

### `orders`

`orders` is the current State value used by the current render.

Its type is:

``` ts
Order[]
```

Its initial value is:

``` ts
[]
```

### `setOrders`

`setOrders` is the setter function used to request an update to the
`orders` State.

``` ts
setOrders(newOrders);
```

Typical flow:

``` text
Call setOrders
↓
State is updated
↓
Component re-renders
↓
JSX is recalculated using the new State
↓
UI is updated
```

**Tip:** Do not think of `setOrders` as ordinary variable assignment.
Think: "request a State update."

------------------------------------------------------------------------

## 3. Immutability

When updating React State, do not directly mutate the existing State.
Instead, create a new array or object that contains the desired changes
and use that new value as the next State.

Avoid direct mutation such as:

``` ts
orders[0].status = "SHIPPED";
```

Use this mental model:

``` text
Existing State
↓
Do not mutate it directly
↓
Create a new value containing the changes
↓
Pass or return the new value through the setter
```

Example:

``` ts
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];
```

``` text
numbers
→ [1, 2, 3]

newNumbers
→ [1, 2, 3, 4]
```

**Tip:** Immutability can be remembered as: "do not change the old
value; create the next value."

------------------------------------------------------------------------

## 4. Updater Functions and `prevOrders`

A State setter can receive a new value directly:

``` ts
setOrders(newOrders);
```

It can also receive an updater function:

``` ts
setOrders((prevOrders) => {
  return newOrders;
});
```

When you provide an updater function, React calls it and passes the
previous State value as its argument.

``` text
Current/previous orders State
↓
React
↓
Calls the updater function
↓
Passes the State value as prevOrders
```

`prevOrders` is not a reserved word. It is only a parameter name.

This is also valid:

``` ts
setOrders((currentOrders) => {
  return [...currentOrders, newOrder];
});
```

### Type Distinctions

``` ts
prevOrders   // Order[]
order        // Order
newOrder     // Order
updatedOrder // Order
```

`prevOrders` is the entire array. `order` is one object from that array.

**Tip:** Plural `orders` usually means an array; singular `order`
usually means one item.

------------------------------------------------------------------------

## 5. Three Common Array State Updates

``` text
Create
→ spread

Update
→ map()

Delete
→ filter()
```

These tools are useful because they allow us to produce new arrays
instead of directly mutating the existing State array.

### Create --- spread

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

`...prevOrders` expands the elements of the existing array into a new
array.

``` text
prevOrders
[Order1, Order2, Order3]

↓ ...prevOrders

Order1, Order2, Order3

↓ place newOrder after them

New array
[Order1, Order2, Order3, NewOrder]
```

Important points:

-   spread itself is not an "add method."
-   spread expands the existing elements.
-   the new item is added because `newOrder` is written after the spread
    elements.
-   the existing `prevOrders` array is not directly mutated.

**Tip:** `[...prevOrders]` creates a new array containing the existing
elements. `[...prevOrders, newOrder]` creates a new array and also
places the new item at the end.

------------------------------------------------------------------------

## 6. Update --- `map()`

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

### The Core Idea of `map()`

`map()` processes each element of an array and builds a **new array**
from the values returned by the callback.

``` text
Existing array
↓
Receive one element at a time
↓
Decide what to return for each element
↓
Collect all return values
↓
New array
```

Example:

``` ts
const prevOrders = [
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" },
];
```

The callback runs three times:

``` text
1st call → order = { id: 1, status: "PAID" }
2nd call → order = { id: 2, status: "PREPARING" }
3rd call → order = { id: 3, status: "SHIPPED" }
```

`map()` does not create the `order` parameter object. Each existing
array element is passed into the callback as `order`.

**Tip:** Do not memorize "map = update." Understand it as "return one
value for each element, then collect those values into a new array."

------------------------------------------------------------------------

## 7. ID Comparison and the Ternary Operator

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

Read it as:

``` text
Is the current order the order we want to update?

YES
→ return updatedOrder
→ replace this item

NO
→ return the existing order
→ keep this item unchanged
```

Example:

``` ts
const updatedOrder = {
  id: 2,
  status: "SHIPPED",
};
```

``` text
id 1 === id 2 → false → existing order
id 2 === id 2 → true  → updatedOrder
id 3 === id 2 → false → existing order
```

Result:

``` ts
[
  { id: 1, status: "PAID" },
  { id: 2, status: "SHIPPED" },
  { id: 3, status: "SHIPPED" },
]
```

### Why Compare IDs?

A value such as `status` may be shared by multiple orders. An `id` is
used to identify a specific order, so it is appropriate for finding the
exact item that should be updated.

### `===`

Strict equality compares both value and type.

``` ts
2 === 2   // true
2 === "2" // false
```

**Tip:** Read `order.id === updatedOrder.id` as: "Is the order I am
looking at right now the exact order I want to update?"

------------------------------------------------------------------------

## 8. Why Return `order` for Unchanged Items?

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

We return the existing `order` when it is not the update target because
that item should remain unchanged.

``` text
Order1 → keep
Order2 → replace
Order3 → keep
```

Because `map()` uses callback return values as elements of the new
array, returning the existing `order` preserves that item in the result.

### What If We Return `null`?

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : null
);
```

`null` does not mean "return nothing." It is an actual returned value.

The result would look like:

``` ts
[
  null,
  updatedOrder,
  null,
]
```

**Tip:** With `map()`, ask: "What was returned?" That returned value
becomes an element of the new array.

------------------------------------------------------------------------

## 9. New Arrays and Existing Objects

``` ts
const newOrders = prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

The `newOrders` array returned by `map()` is a different array from
`prevOrders`.

``` ts
newOrders === prevOrders
// false
```

However, unchanged elements can still be the same existing objects
because the callback returns the original `order` for those elements.

``` text
prevOrders → [Order1, OldOrder2, Order3]
                        ↓
                      map()
                        ↓
newOrders  → [Order1, NewOrder2, Order3]
```

Therefore:

-   the array itself is new;
-   unchanged objects may be reused;
-   the target object is replaced with `updatedOrder`.

**Tip:** "New array" does not mean "every object inside the array must
also be a new object."

------------------------------------------------------------------------

## 10. Delete --- `filter()`

``` ts
setOrders((prevOrders) =>
  prevOrders.filter(
    (order) => order.id !== deleteId
  ),
);
```

`filter()` creates a new array containing only the elements whose
condition evaluates to `true`.

If:

``` ts
deleteId = 2;
```

then:

``` text
id 1 !== 2 → true  → keep
id 2 !== 2 → false → exclude
id 3 !== 2 → true  → keep
```

Result:

``` ts
[
  { id: 1, status: "PAID" },
  { id: 3, status: "SHIPPED" },
]
```

`filter()` does not directly remove an element from the existing array.
It creates a **new array** that excludes the target item.

**Tip:** Instead of memorizing "filter = delete," remember: "filter
keeps elements whose condition is true."

------------------------------------------------------------------------

## 11. CRUD and Array State

  CRUD     State Technique    Core Idea
  -------- ------------------ ------------------------------------------------
  Create   spread             new array containing existing items + new item
  Read     fetch + setState   store server data in State
  Update   `map()`            new array with the target item replaced
  Delete   `filter()`         new array with the target item excluded

The common principle is:

``` text
Do not directly mutate existing State
↓
Build a new array from the existing State
↓
Pass it to the setter / return it from the updater
↓
State is updated
↓
Component re-renders
↓
JSX is recalculated using the new State
↓
UI is updated
```

**Tip:** The syntax changes between Create, Update, and Delete, but the
shared idea is always "compute a new State instead of directly mutating
the old State."

------------------------------------------------------------------------

# Final Review Card

## State

``` text
orders
→ current State

setOrders
→ setter that requests a State update
```

## Immutability

``` text
Do not directly mutate existing State
→ create a new array/object
→ use it as the next State
```

## Updater

``` text
setOrders((prevOrders) => ...)
              ↑
React passes the previous State
```

## Types

``` text
prevOrders   → Order[]
order        → Order
newOrder     → Order
updatedOrder → Order
```

## Create

``` ts
[...prevOrders, newOrder]
```

``` text
Expand existing elements
+
Add the new element
→ new array
```

## Update

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

``` text
Target item → replace
Other items → keep
→ new array
```

## Delete

``` ts
prevOrders.filter(
  (order) => order.id !== deleteId
);
```

``` text
true → keep
false → exclude
→ new array
```

## Day 22 in One Sentence

> **When working with array State in React, do not directly mutate the
> existing State. Use techniques such as spread, `map()`, and `filter()`
> to create a new array containing the desired changes, then use that
> array as the next State.**

------------------------------------------------------------------------

## Completion Criteria

You have completed Day 22 when you can explain the following code in
your own words without looking at the explanation:

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```
