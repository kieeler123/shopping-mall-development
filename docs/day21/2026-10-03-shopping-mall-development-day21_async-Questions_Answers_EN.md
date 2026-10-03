# Day 21 --- Async Data Flow Review Questions & Answers

> Try each question first, then open `<details>` to check the answer and
> explanation.

---

## Question 1

In the following code, is `result` a `Product[]` or a
`Promise<Product[]>`?

```ts
async function getProducts() {
  return [{ id: 1, title: "Sneakers", price: 59000 }];
}

const result = getProducts();
```

<details><summary>Show answer and explanation</summary>

### Answer

`Promise<Product[]>`

### Explanation

An `async` function always returns a Promise. Even though `Product[]` is
returned inside the function, calling `getProducts()` without `await`
gives a `Promise<Product[]>`.

```ts
const result = await getProducts();
```

With `await`, `result` becomes the actual `Product[]`.

</details>

---

## Question 2

Explain the roles/types of `response` and `products`.

```ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

<details><summary>Show answer and explanation</summary>

### Answer

- `response` → `Response`
- `products` → `Product[]`

### Explanation

```text
fetch()
→ Promise<Response>
→ await
→ Response
```

Then:

```text
response.json()
→ Promise
→ await
→ JavaScript data
→ Product[]
```

It is important to distinguish the `Response` object from the final
product data.

</details>

---

## Question 3

Why are there two `await`s?

```ts
const response = await fetch("/api/products");
const products = await response.json();
```

<details><summary>Show answer and explanation</summary>

### Answer

Because both `fetch()` and `response.json()` return Promises.

### Explanation

The first `await` waits for `Promise<Response>`. The second waits for
the asynchronous JSON parsing result.

</details>

---

## Question 4

Why should `response.ok` be checked even when the server responded?

```ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("Failed to fetch products");
}
```

<details><summary>Show answer and explanation</summary>

### Answer

Because HTTP error statuses such as 404 or 500 can still produce a
`Response` object.

### Explanation

`response.ok` lets us detect an unsuccessful HTTP status and explicitly
move to the error flow with `throw`.

</details>

---

## Question 5

What happens if `throw` runs inside this async function and there is no
internal `catch`?

```ts
async function getProducts() {
  throw new Error("Failed");
}
```

<details><summary>Show answer and explanation</summary>

### Answer

The Promise returned by `getProducts()` becomes `rejected`.

### Explanation

```text
async function
↓
throw Error
↓
no internal catch
↓
Promise rejected
```

The caller can handle it with `try/catch` around `await getProducts()`.

</details>

---

## Question 6

Explain the difference between A and B.

### A

```ts
const products: Product[] = await response.json();
return products;
```

### B

```ts
const orders: Order[] = await response.json();
setOrders(orders);
```

<details><summary>Show answer and explanation</summary>

### Answer

A returns data to the caller. B stores data in React State.

### Explanation

A:

```text
Product[]
→ return
→ caller
```

B:

```text
Order[]
→ setOrders
→ State changes
→ re-render
→ UI updates
```

The asynchronous flow up to `response.json()` is the same.

</details>

---

## Question 7

What happens in React after `setOrders(data)` runs?

<details><summary>Show answer and explanation</summary>

### Answer

The `orders` State is updated, and React re-renders using the new state.

```text
setOrders(data)
↓
orders State changes
↓
re-render
↓
new orders value
↓
orders.map()
↓
OrderCard
```

</details>

---

## Question 8

Classify these features by the Server/Client role learned today.

1.  Fetching product data needed when the page first opens
2.  An Add to Cart button's `onClick`
3.  Changing quantity with `+ / -` buttons
4.  Rendering the initial product list

<details><summary>Show answer and explanation</summary>

### Answer

- 1 → consider Server first
- 2 → Client
- 3 → Client
- 4 → consider Server first when based on initial data

### Explanation

Browser interaction and client-side State changes require Client
behavior. Initial page data can often be handled on the Server side
first.

</details>

---

## Question 9

What role does this `useEffect` play in the current project?

```ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

<details><summary>Show answer and explanation</summary>

### Answer

After rendering, it calls `loadOrders()` to start loading order data.

### Explanation

```text
render
↓
useEffect
↓
loadOrders()
↓
fetch("/api/orders")
↓
Order[]
↓
setOrders()
↓
re-render
```

`[loadOrders]` indicates that the Effect depends on `loadOrders`.

</details>

---

## Question 10

Fill in the blanks.

```text
fetch("/api/orders")
↓
( ① )
↓ await
Response
↓
response.json()
↓
( ② )
↓ await
Order[]
↓
( ③ )
↓
State changes
↓
( ④ )
↓
orders.map()
↓
OrderCard
```

<details><summary>Show answer and explanation</summary>

### Answer

1.  `Promise<Response>`
2.  `Promise<Order[]>` as the conceptual asynchronous JSON result
3.  `setOrders(data)`
4.  React re-render

Full flow:

```text
fetch("/api/orders")
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Order[]>
↓ await
Order[]
↓
setOrders(data)
↓
State changes
↓
re-render
↓
orders.map()
↓
OrderCard
```

</details>

---

## Final Self-Check

If you can explain these without looking at code, today's goal is
complete:

- Why does `fetch()` return a Promise?
- What do you get after `await fetch()`?
- Why does `response.json()` need another `await`?
- How do `return` and `throw` inside an async function relate to
  Promise states?
- Why check `response.ok`?
- How does `Product[]` or `Order[]` reach the UI?
- Why does the screen change after `setOrders(data)`?
- How do you distinguish Server and Client roles?
- Why does the current project's `useEffect` call `loadOrders()`?
