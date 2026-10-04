# Day 22 --- Development Terms from Today's Lesson (English)

> A review glossary of the key development terms that appeared in
> today's React State updates and immutability lesson.

## Term一覧

### State

Data a component remembers and uses to render the UI.

**In Today's Code**

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

**Tip:** Do not memorize `State` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### useState

A React Hook used to create and manage State.

**In Today's Code**

``` ts
useState<Order[]>([])
```

**Tip:** Do not memorize `useState` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### setter function

A function that requests a State update from React. In today's code,
this is `setOrders`.

**In Today's Code**

``` ts
setOrders(newOrders);
```

**Tip:** Do not memorize `setter` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### setOrders

The setter function that updates the `orders` State.

**In Today's Code**

``` ts
setOrders((prevOrders) => [...prevOrders, newOrder]);
```

**Tip:** Do not memorize `setOrders` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### orders

The order-array State used by the current render.

**In Today's Code**

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

**Tip:** Do not memorize `orders` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Order

A type representing one order object.

**In Today's Code**

``` ts
order // Order
```

**Tip:** Do not memorize `Order` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Order\[\]

An array type containing multiple `Order` objects.

**In Today's Code**

``` ts
prevOrders // Order[]
```

**Tip:** Do not memorize `Order[]` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### initial value

The value State has when it is first created. In
`useState<Order[]>([])`, it is `[]`.

**In Today's Code**

``` ts
useState<Order[]>([])
// initial value: []
```

**Tip:** Do not memorize `initial value` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

### immutability

The principle of updating State by creating a new array or object
instead of directly mutating the existing State.

**In Today's Code**

``` ts
const next = [...prevOrders, newOrder];
```

**Tip:** Do not memorize `immutability` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

### mutation

Directly changing the contents of an existing array or object.

**In Today's Code**

``` ts
orders[0].status = "SHIPPED";
```

**Tip:** Do not memorize `mutation` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### updater function

A function that receives the previous State and returns the calculated
next State.

**In Today's Code**

``` ts
(prevOrders) => [...prevOrders, newOrder]
```

**Tip:** Do not memorize `updater function` as a word alone; explain
what role it plays in the code above.

------------------------------------------------------------------------

### prevOrders

The previous `orders` State passed by React to the updater function. Its
type is `Order[]`.

**In Today's Code**

``` ts
setOrders((prevOrders) => ...);
```

**Tip:** Do not memorize `prevOrders` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### parameter

A variable declared in a function definition to receive a value when the
function is called.

**In Today's Code**

``` ts
(prevOrders) => ...
```

**Tip:** Do not memorize `parameter` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### spread syntax

Syntax using `...` to expand existing array elements into a new array.

**In Today's Code**

``` ts
[...prevOrders, newOrder]
```

**Tip:** Do not memorize `spread syntax` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

### map()

An array method that processes each element and creates a new array from
the callback return values.

**In Today's Code**

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id ? updatedOrder : order
);
```

**Tip:** Do not memorize `map()` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### filter()

An array method that creates a new array containing only elements whose
condition is `true`.

**In Today's Code**

``` ts
prevOrders.filter((order) => order.id !== deleteId);
```

**Tip:** Do not memorize `filter()` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### callback function

A function executed by methods such as `map()` or `filter()` while
processing elements.

**In Today's Code**

``` ts
(order) => order.id !== deleteId
```

**Tip:** Do not memorize `callback` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### return value

The value a function gives back after execution. In `map()`, each
callback return value becomes an element of the new array.

**In Today's Code**

``` ts
order.id === updatedOrder.id ? updatedOrder : order
```

**Tip:** Do not memorize `return value` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

### strict equality

A comparison using `===` that requires both value and type to match.

**In Today's Code**

``` ts
order.id === updatedOrder.id
```

**Tip:** Do not memorize `strict equality` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

### strict inequality

A comparison using `!==` that is true when value or type differs.

**In Today's Code**

``` ts
order.id !== deleteId
```

**Tip:** Do not memorize `strict inequality` as a word alone; explain
what role it plays in the code above.

------------------------------------------------------------------------

### ternary operator

An operator in the form `condition ? valueIfTrue : valueIfFalse` that
selects a value based on a condition.

**In Today's Code**

``` ts
condition ? updatedOrder : order
```

**Tip:** Do not memorize `ternary operator` as a word alone; explain
what role it plays in the code above.

------------------------------------------------------------------------

### ID / identifier

A value used to distinguish a specific order from other orders.

**In Today's Code**

``` ts
order.id
```

**Tip:** Do not memorize `id` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### updatedOrder

A single `Order` object containing the updated data.

**In Today's Code**

``` ts
? updatedOrder : order
```

**Tip:** Do not memorize `updatedOrder` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

### newOrder

A single `Order` object to be added to the State array.

**In Today's Code**

``` ts
[...prevOrders, newOrder]
```

**Tip:** Do not memorize `newOrder` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### deleteId

The ID value used to identify the order to delete.

**In Today's Code**

``` ts
order.id !== deleteId
```

**Tip:** Do not memorize `deleteId` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### null

A value representing the absence of a value, but still an actual return
value. Returning it from `map()` places `null` in the result array.

**In Today's Code**

``` ts
return null;
```

**Tip:** Do not memorize `null` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### new array

A separate array created without directly changing the existing array.

**In Today's Code**

``` ts
const newOrders = prevOrders.map((order) => order);
```

**Tip:** Do not memorize `new array` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### reference

The relationship of pointing to the same object or array in memory. A
new array can reuse references to unchanged existing objects.

**In Today's Code**

``` ts
const newOrders = prevOrders.map((order) => order);
```

**Tip:** Do not memorize `reference` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### re-render

The process in which a component runs again after a State change to
calculate the UI.

**In Today's Code**

``` text
State update → re-render → JSX → UI
```

**Tip:** Do not memorize `re-render` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### JSX

Syntax used to describe UI structure in React. It is recalculated using
the new State during a re-render.

**In Today's Code**

``` tsx
{orders.map((order) => (...))}
```

**Tip:** Do not memorize `JSX` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### UI

The interface the user sees and interacts with on the screen.

**In Today's Code**

``` text
State → JSX → UI
```

**Tip:** Do not memorize `UI` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### CRUD

An acronym for Create, Read, Update, and Delete, the four basic data
operations.

**In Today's Code**

``` text
Create / Read / Update / Delete
```

**Tip:** Do not memorize `CRUD` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Create

In today's array State lesson, creating a new array containing existing
items plus a new item, typically with spread.

**In Today's Code**

``` ts
[...prevOrders, newOrder]
```

**Tip:** Do not memorize `Create` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Read

The operation of fetching or reading data. On Day 21, fetched data was
stored in State.

**In Today's Code**

``` ts
const data = await response.json();
setOrders(data);
```

**Tip:** Do not memorize `Read` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Update

In today's array State lesson, creating a new array with a specific item
replaced, typically using `map()`.

**In Today's Code**

``` ts
prevOrders.map(...)
```

**Tip:** Do not memorize `Update` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Delete

In today's array State lesson, creating a new array that excludes a
target item, typically using `filter()`.

**In Today's Code**

``` ts
prevOrders.filter(...)
```

**Tip:** Do not memorize `Delete` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### fetch()

A Web API used to request data from a server/API. It appeared in the Day
21-to-Day 22 connection.

**In Today's Code**

``` ts
const response = await fetch(url);
```

**Tip:** Do not memorize `fetch()` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Promise`<Response>`{=html}

A Promise type representing the asynchronous result returned immediately
by `fetch()`.

**In Today's Code**

``` ts
fetch(url) // Promise<Response>
```

**Tip:** Do not memorize `Promise<Response>` as a word alone; explain
what role it plays in the code above.

------------------------------------------------------------------------

### await

A keyword used to wait for a Promise to settle and obtain its resolved
value.

**In Today's Code**

``` ts
const response = await fetch(url);
```

**Tip:** Do not memorize `await` as a word alone; explain what role it
plays in the code above.

------------------------------------------------------------------------

### Response

An object representing the HTTP response to a `fetch()` request.

**In Today's Code**

``` ts
const response = await fetch(url);
```

**Tip:** Do not memorize `Response` as a word alone; explain what role
it plays in the code above.

------------------------------------------------------------------------

### response.json()

A method used to read a Response's JSON body as JavaScript data.

**In Today's Code**

``` ts
const data = await response.json();
```

**Tip:** Do not memorize `response.json()` as a word alone; explain what
role it plays in the code above.

------------------------------------------------------------------------

## Core Term Flow from Today's Lesson

``` text
State → setter → updater → prevOrders
                 ↓
      spread / map / filter
                 ↓
             new array
                 ↓
           State update
                 ↓
             re-render
                 ↓
             JSX → UI
```

**Tip:** After learning each term separately, use this flow to explain
how the terms connect to one another.
