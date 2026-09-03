# Day 7 Theory Master Summary — STEP 1 to STEP 8

## STEP 1 — Dynamic Route `[id]`

In the Next.js App Router, a folder such as `app/orders/[id]/page.tsx` creates a Dynamic Route.

```text
app/orders/[id]/page.tsx
↓
/orders/123
/orders/456
/orders/999
```

`id` is the parameter name, not a fixed value.

```text
/orders/123
        ↓
       id = "123"
```

The same `page.tsx` can handle many different values.

> **Tip**
>
> Think of `[id]` as a variable slot in the URL, not as a page made only for one specific ID.

---

## STEP 2 — Put the Order ID into the URL with `Link`

From the order history page, use Next.js `Link` to navigate to a detail page.

```tsx
<Link href={`/orders/${order.id}`}>View Details</Link>
```

If:

```ts
order.id = 123;
```

the generated path is:

```text
/orders/123
```

`Link` does not directly pass the whole order object.

```text
order.id
↓
embedded into URL
↓
/orders/123
```

The detail page later reads the ID from the URL.

> **Tip**
>
> Remember the pair: `Link` writes the ID into the URL, `useParams()` reads it back.

---

## STEP 3 — Read the URL Parameter with `useParams()`

In a Client Component:

```tsx
const params = useParams();
```

For:

```text
/orders/123
```

you can think of the result as:

```ts
params = {
  id: "123",
};
```

So:

```tsx
params.id
```

returns `"123"`.

The important point is that route parameters are string-like URL values.

```text
params.id
→ "123"
→ string
```

> **Tip**
>
> The dynamic folder name becomes the parameter key: `[id] → params.id`, `[slug] → params.slug`.

---

## STEP 4 — Load `orders[]` from `localStorage`

The URL tells us which order we want, but the actual order data must come from somewhere else.

In this project, orders are stored under `"orders"` in `localStorage`.

```tsx
const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders: Order[] = JSON.parse(savedOrders);
    setOrders(parsedOrders);
  }
}, []);
```

Flow:

```text
localStorage
↓
JSON string
↓
JSON.parse()
↓
Order[]
↓
setOrders()
↓
state update
↓
re-render
```

`localStorage` is a browser Web API, so this project reads it as a browser-side external-system effect.

> **Tip**
>
> The URL answers “which order?” while `localStorage` supplies “all stored orders.”

---

## STEP 5 — Convert the String ID with `Number()`

`params.id` is a string:

```text
"123"
```

If `Order.id` is a number:

```text
123
```

then strict equality gives:

```ts
"123" === 123 // false
```

So convert the route parameter first:

```tsx
const orderId = Number(params.id);
```

Flow:

```text
"123"
↓
Number()
↓
123
```

Invalid input:

```text
Number("abc")
↓
NaN
```

You can detect that with:

```ts
Number.isNaN(orderId);
```

> **Tip**
>
> Convert IDs only when the data model requires it. A string-based ID should normally remain a string.

---

## STEP 6 — Find One Order with `find()`

Now connect `orderId` with the full `orders[]` collection.

```tsx
const order = orders.find((order) => order.id === orderId);
```

Meaning:

```text
orders[]
↓
check each order
↓
order.id === orderId ?
↓
return the first matching Order
```

Example:

```text
orderId = 1002

1001 === 1002 → false
1002 === 1002 → true
↓
return that order
```

If no order matches, `find()` returns:

```ts
undefined
```

So conceptually:

```ts
Order | undefined
```

> **Tip**
>
> Whenever you use `find()`, always remember the “not found = undefined” case.

---

## STEP 7 — Render the Found `order` as Detail UI

Once one `Order` is found, its properties can be rendered:

```tsx
<p>Order ID: {order.id}</p>
<p>Name: {order.name}</p>
<p>Phone: {order.phone}</p>
<p>Address: {order.address}</p>
<p>Total: {order.totalPrice.toLocaleString()}</p>
```

Because an order can contain multiple items, use:

```tsx
order.items.map(...)
```

Each item contains data such as `productId` and `quantity`. To get the full product name and price, find the matching product:

```tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

Overall:

```text
orders[]
↓ find()
one Order
↓
order.items[]
↓ map()
each item
↓
products.find()
one Product
↓
name / price / quantity / subtotal
```

> **Tip**
>
> `find()` selects one item. `map()` transforms multiple items into UI.

---

## STEP 8 — Separate Loading / Not Found / Success

On the first render:

```text
orders = []
loading = true
order = undefined
```

Therefore, `order === undefined` does not automatically mean the order does not exist.

Use early returns:

```tsx
if (loading) {
  return <p>Checking order information...</p>;
}

if (!order) {
  return <p>Order not found.</p>;
}

return <OrderDetailUI />;
```

The three states are:

```text
Loading
→ data has not been fully checked yet

Not Found
→ loading finished + no matching order

Success
→ loading finished + matching order exists
```

Order matters:

```text
loading?
↓ yes
Loading

↓ no
order exists?
↓ no
Not Found

↓ yes
Success
```

> **Tip**
>
> In React, think in terms of “Given the current state, which UI should exist?”

---

# Day 7 Complete Mental Model

```text
Order History
↓
<Link href={`/orders/${order.id}`}>
↓
/orders/1002
↓
Dynamic Route [id]
↓
useParams()
↓
params.id = "1002"
↓
Number()
↓
orderId = 1002

At the same time:

localStorage
↓
JSON.parse()
↓
orders[]
↓
setOrders()
↓
re-render

Then:

orderId + orders[]
↓
find()
↓
Order | undefined
↓
Loading / Not Found / Success
↓
Order Detail UI
```

## Final Summary

The core of Day 7 is **connecting an order ID from the URL with the stored order array, selecting one matching order safely, and rendering a detail page with proper loading and failure states**.

> **Tip**
>
> If you can explain STEP 1 through STEP 8 without looking at the code, you understand the basic architecture of a Dynamic Route detail page.
