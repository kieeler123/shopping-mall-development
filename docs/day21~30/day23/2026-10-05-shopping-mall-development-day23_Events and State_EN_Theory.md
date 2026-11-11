# Day 23 --- Events and State

## Complete Theory Review

### Core Question

> How does a user's action initiate a State change?

``` text
User Action
↓
Event
↓
onClick / onChange
↓
Event Handler
↓
Function Call
↓
State Setter
↓
State Update
↓
Component Re-render
↓
JSX Recalculation
↓
UI Update
```

> **Tip:** Trace React event code as
> `User → Event → Handler → Setter → State → UI`.

------------------------------------------------------------------------

### 1. onClick

``` tsx
onClick={handleClick}          // pass the function
onClick={handleClick()}        // call immediately
onClick={() => handleClick()}  // pass an arrow function
```

`onClick={handleClick}` passes the function itself. React calls it when
the user clicks.

`onClick={handleClick()}` calls the function during rendering.

An arrow function is commonly used when an argument must be supplied:

``` tsx
onClick={() => handleStatusChange("completed")}
```

> **Tip:** `handleClick` means the function itself. `handleClick()`
> means calling the function.

------------------------------------------------------------------------

### 2. onChange and Event

``` tsx
<select onChange={(e) => {
  console.log(e.target.value);
}}>
```

``` text
e → Event object
e.target → Element that triggered the event
e.target.value → Current value of that element
```

For:

``` tsx
<option value="completed">Complete</option>
```

selecting `Complete` gives:

``` text
e.target.value = "completed"
```

> **Tip:** Distinguish the displayed text from the actual `value`.

------------------------------------------------------------------------

### 3. Arguments and Parameters

``` tsx
const handleStatusChange = (
  orderId: number,
  newStatus: string
) => {};

handleStatusChange(7, "cancelled");
```

-   `orderId`, `newStatus` → Parameters
-   `7`, `"cancelled"` → Arguments

> **Tip:** Parameters appear in the function definition; arguments are
> the actual values supplied during a call.

------------------------------------------------------------------------

### 4. State Update

``` text
handleStatusChange("completed")
↓
newStatus = "completed"
↓
setStatus("completed")
↓
State Update
↓
Component Re-render
↓
JSX Recalculation
↓
UI Update
```

The handler does not directly modify React State. The setter such as
`setStatus()` requests the update.

> **Tip:** Look for setters such as `setStatus()` and `setOrders()` to
> find where State updates begin.

------------------------------------------------------------------------

### 5. Updating Array State

``` tsx
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === orderId
      ? { ...order, status: newStatus }
      : order
  )
);
```

For:

``` tsx
handleStatusChange(20, "cancelled");
```

the comparisons are:

``` text
10 === 20 → false → keep existing order
20 === 20 → true  → update status
30 === 20 → false → keep existing order
```

Result:

``` tsx
[
  { id: 10, status: "pending" },
  { id: 20, status: "cancelled" },
  { id: 30, status: "completed" },
]
```

> **Tip:** Keep `orderId` fixed and process each `order.id` one at a
> time.

------------------------------------------------------------------------

### 6. Spread Syntax

``` tsx
{ ...order, status: newStatus }
```

copies the existing properties and overwrites only `status`.

> **Tip:** Remember the pattern
> `{ ...existingObject, property: newValue }`.

------------------------------------------------------------------------

### 7. `as OrderStatus`

``` tsx
e.target.value as OrderStatus
```

does not change the runtime value. It tells TypeScript to treat the
value as `OrderStatus`. This is a **Type Assertion**.

> **Tip:** Think TypeScript type information, not runtime value
> conversion.

------------------------------------------------------------------------

### 8. Complete Project Flow

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

``` text
User changes selection
↓
onChange
↓
Event object e
↓
e.target.value
↓
Order ID + new status
↓
onStatusChange(...)
↓
State update function
↓
State setter
↓
State update
↓
Re-render
↓
JSX recalculation
↓
UI update
```

> **Tip:** Replace variables with concrete values such as
> `order.id → 20` and `e.target.value → "cancelled"`.

------------------------------------------------------------------------

## Quick Summary

``` text
User
→ Event
→ Handler
→ Function
→ Setter
→ State
→ Re-render
→ JSX
→ UI
```
