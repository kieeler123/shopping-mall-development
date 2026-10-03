# Day 22 --- React State Updates and Immutability

> **Today's topic:** How do we manage and change data in React after
> fetching it?

## Final Goal

By the end of today, you should be able to explain this code in your own
words:

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

A successful explanation would be:

> We pass an updater function to `setOrders`. React provides the latest
> `orders` State as `prevOrders`. We use `map()` to create a new array,
> replace only the order whose ID matches `updatedOrder.id`, keep the
> other existing order objects, and then set the new array as State so
> React can re-render.

------------------------------------------------------------------------

## 1. Continue from Day 21

Day 21 covered how asynchronous data reaches us:

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
↓
State changes
↓
re-render
↓
UI
```

Day 22 zooms in on what happens around and after `setOrders`.

``` text
Day 21 question:
How do we fetch data from an API?

↓ connection

Day 22 question:
How do we manage and change fetched data in React?
```

------------------------------------------------------------------------

## 2. Revisit `useState`

Real project code:

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

### `orders`

Used to read the current State value.

Initially:

``` ts
[]
```

After a successful API request:

``` ts
setOrders(data);
```

Conceptually:

``` text
initial
orders = []

↓ API succeeds

Order[]

↓ setOrders(data)

State update

↓ next render

orders = new Order[]
```

### `setOrders`

Instead of directly modifying `orders`, we ask React to update the
State.

``` ts
setOrders(newValue);
```

Flow:

``` text
setOrders(...)
↓
State update
↓
React re-renders
↓
JSX is calculated with new orders
↓
UI updates
```

> **Study tip:** Do not memorize `setOrders` as merely "a function that
> changes a value." Connect it to **State update → re-render → UI
> update**.

------------------------------------------------------------------------

## 3. Why Not Modify State Directly?

In plain JavaScript, this is possible:

``` ts
orders[0].status = "SHIPPED";
```

But with React State, we generally avoid directly mutating existing
State. Instead, we create a new value, array, or object and pass it to
the setter.

``` text
Do not directly mutate existing State

existing State
↓
create a new array/object
↓
setOrders(new value)
```

This introduces **immutability**.

------------------------------------------------------------------------

## 4. Immutability

At today's level:

> Do not directly rewrite existing State. Create a new
> value/array/object containing the change, then update State with it.

Example:

``` ts
const numbers = [1, 2, 3];

const newNumbers = [...numbers, 4];
```

Result:

``` text
numbers
→ [1, 2, 3]

newNumbers
→ [1, 2, 3, 4]
```

> **Scope:** We do not need deep functional-programming theory today.
> The goal is simply:
> `do not mutate existing State → create new State → pass it to the setter`.

------------------------------------------------------------------------

## 5. Three Common Array State Operations

``` text
Add
→ spread (...)

Update
→ map()

Delete
→ filter()
```

### Add

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

### Update

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

### Delete

``` ts
setOrders((prevOrders) =>
  prevOrders.filter((order) =>
    order.id !== deleteId
  ),
);
```

------------------------------------------------------------------------

## 6. Where Does `prevOrders` Come From?

A State setter can receive a value directly:

``` ts
setOrders(newOrders);
```

or an updater function:

``` ts
setOrders((prevOrders) => {
  return newOrders;
});
```

With the updater-function form, React calls the function and provides
the current State as its argument.

``` text
current orders
↓
React
↓
passed into updater function
↓
prevOrders
```

`prevOrders` is not a reserved keyword. It is only a parameter name.

``` ts
setOrders((currentOrders) => {
  // ...
});
```

would also be valid.

------------------------------------------------------------------------

## 7. Why Base the Update on Previous State?

Suppose the current orders are:

``` text
[
  order1,
  order2,
  order3
]
```

If only order2 changes, we need:

``` text
order1 → keep
order2 → replace
order3 → keep
```

So it is natural to receive the current array and create a new one from
it.

``` ts
setOrders((prevOrders) => {
  // create a new Order[] based on prevOrders
});
```

------------------------------------------------------------------------

## 8. Reading the Real `map()` Code

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

First:

``` ts
prevOrders.map(...)
```

checks every order in the current array while producing a new array.

Each element becomes:

``` ts
order
```

Then:

``` ts
order.id === updatedOrder.id
```

checks whether the current order is the one returned by the server after
being updated.

------------------------------------------------------------------------

## 9. Choosing the Updated Item with the Ternary Operator

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

means:

``` text
Do the IDs match?

YES
↓
updatedOrder

NO
↓
existing order
```

Example:

``` text
existing orders
[
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" }
]

updatedOrder
{ id: 2, status: "SHIPPED" }
```

Result:

``` text
[
  existing order1,
  updated order2,
  existing order3
]
```

------------------------------------------------------------------------

## 10. Why `map()` for Updates?

`map()` checks each element and creates a **new array**.

``` text
existing Order[]
↓
check each order
↓
target?
├─ YES → updatedOrder
└─ NO  → existing order
↓
new Order[]
```

This makes it a good fit for replacing one element while preserving the
rest.

> **Study tip:** Do not remember `map()` only as a JSX rendering tool.
> Its core purpose is transforming an array into a new array.

------------------------------------------------------------------------

## 11. Adding with Spread

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

``` text
existing
[order1, order2, order3]

↓ ...prevOrders

order1
order2
order3

↓ add newOrder

new array
[order1, order2, order3, order4]
```

------------------------------------------------------------------------

## 12. Deleting with `filter()`

``` ts
setOrders((prevOrders) =>
  prevOrders.filter(
    (order) => order.id !== deleteId
  )
);
```

If the deletion ID is 2:

``` text
id 1 !== 2 → true  → keep
id 2 !== 2 → false → remove
id 3 !== 2 → true  → keep
```

Result:

``` text
[
  order1,
  order3
]
```

------------------------------------------------------------------------

## 13. Connect Array State to CRUD

``` text
Create
add data
→ spread

Read
fetch data
→ fetch + setState

Update
modify existing data
→ map

Delete
remove existing data
→ filter
```

Real server CRUD also requires API requests, but this model explains how
Client State can be updated after receiving server results.

------------------------------------------------------------------------

## 14. Day 21 → Day 22

``` text
Day 21

API
↓
fetch
↓
Promise
↓
await
↓
Response
↓
json
↓
Order[]

        ↓

Day 22

Order[]
↓
State
↓
setOrders
↓
immutability
↓
prevState
↓
map / filter / spread
↓
new State
↓
re-render
↓
UI
```

------------------------------------------------------------------------

## Day 22 Completion Check

You are done when you can answer these in your own words:

1.  What are the roles of `orders` and `setOrders`?
2.  Why do we avoid directly mutating State?
3.  What is immutability?
4.  Who provides `prevOrders`?
5.  Why is `map()` useful for an update?
6.  Why compare `updatedOrder.id` with `order.id`?
7.  Why return the existing `order` for items that were not updated?
8.  Does `map()` produce the same array or a new array?
9.  Why is `filter()` suitable for deletion?
10. What does spread do when adding an item?

## Not Studying Today

``` text
deep useEffect
deep useCallback
Effect lifecycle details
React rendering internals
deep functional-programming theory
```

Today's completion criterion is simple:

> **I can explain `setOrders(prevOrders => prevOrders.map(...))`
> myself.**
