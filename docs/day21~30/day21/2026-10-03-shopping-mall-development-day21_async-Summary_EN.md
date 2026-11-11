# Day 21 --- Async Data Flow Summary

> Learning goal: Understand the flow **Promise → async/await → fetch →
> Response → JSON → typed data → React State → UI**, and be able to
> identify it in real Next.js code.

------------------------------------------------------------------------

## 1. Core Flow

``` text
API
↓
fetch()
↓
Promise<Response>
↓ await
Response
↓
check response.ok
↓
response.json()
↓
Promise<Data>
↓ await
Data
↓
in React: setState
↓
re-render
↓
UI
```

This is the most important flow from today's study.

------------------------------------------------------------------------

## 2. Synchronous vs. Asynchronous

### Synchronous

The next task runs after the previous task finishes.

``` ts
console.log("A");
console.log("B");
```

Result:

``` text
A
B
```

### Asynchronous

For work such as `fetch()` whose result is not immediately available,
other code can continue while waiting for the operation to finish.

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

`console.log("B")` does not wait for `fetch()` to finish.

### Key Point

Because `fetch()` cannot immediately provide an HTTP response, it
returns a **Promise**.

------------------------------------------------------------------------

## 3. Promise

A Promise represents the future result of an asynchronous operation.

``` text
pending
  ↓
 ┌─────────────┐
 ↓             ↓
fulfilled    rejected
success       failure
```

Example:

``` ts
const result = fetch("/api/products");
```

`result` is not product data. It is:

``` ts
Promise<Response>
```

------------------------------------------------------------------------

## 4. async Functions

An `async` function always returns a Promise.

``` ts
async function getNames() {
  return ["Shoes", "Pants", "Hat"];
}
```

Inside the function, a `string[]` is returned, but:

``` ts
const a = getNames();
```

`a` is conceptually:

``` ts
Promise<string[]>
```

On the other hand:

``` ts
const b = await getNames();
```

`b` is:

``` ts
string[]
```

### Success and Failure

``` text
async function

return value
↓
Promise fulfilled
↓
value

throw Error
↓
Promise rejected
↓
Error
```

------------------------------------------------------------------------

## 5. await

`await` waits for the result of a Promise and lets you use that result.

``` ts
const response = await fetch("/api/products");
```

Flow:

``` text
fetch("/api/products")
↓
Promise<Response>
↓
await
↓
Response
↓
assigned to response
```

`await` itself is not a Promise.

Also, do not think of `await` as stopping the entire program. At this
stage, it is enough to understand that it waits for a Promise result
inside the current async function.

------------------------------------------------------------------------

## 6. fetch and Response

``` ts
const response = await fetch("/api/products");
```

`fetch()` returns:

``` ts
Promise<Response>
```

After `await`, you get:

``` ts
Response
```

A `Response` is not yet the `Product[]` data itself.

------------------------------------------------------------------------

## 7. response.ok

Receiving an HTTP response does not always mean the request was
successful.

``` ts
if (!response.ok) {
  throw new Error("Failed to fetch products");
}
```

`response.ok` is generally `true` when the HTTP status code is in the
**200--299** range.

Even if the server returns 404 or 500, you can still receive a
`Response` object. Therefore, checking `response.ok` is a common way to
detect unsuccessful HTTP status codes.

``` text
Response
↓
response.ok ?
├─ true  → continue
└─ false → throw Error
```

------------------------------------------------------------------------

## 8. Why response.json() Also Needs await

``` ts
const products: Product[] = await response.json();
```

`response.json()` also returns a Promise.

Therefore:

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Data>
↓ await
Data
```

That is why two `await`s often appear:

``` ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

The first waits for the HTTP response. The second waits for the response
body to be read and converted from JSON into JavaScript data.

------------------------------------------------------------------------

## 9. Connecting Product\[\] to the UI

``` ts
type Product = {
  id: number;
  title: string;
  price: number;
};
```

Data-fetching function:

``` ts
async function getProducts() {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await response.json();

  return products;
}
```

Calling it without `await`:

``` ts
const result = getProducts();
```

gives, conceptually:

``` ts
Promise<Product[]>
```

To get the actual array:

``` ts
const products = await getProducts();
```

Then `products` can be used as:

``` ts
Product[]
```

------------------------------------------------------------------------

## 10. Using It in a Next.js Server Component

In an App Router Server Component, you can wait for asynchronous data
and then render it.

``` tsx
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.price.toLocaleString()}</p>
        </div>
      ))}
    </main>
  );
}
```

Flow:

``` text
getProducts()
↓
Promise<Product[]>
↓ await
Product[]
↓
products.map()
↓
each Product
↓
JSX
```

------------------------------------------------------------------------

## 11. Server Components and Client Components

For today, focus on their roles rather than every detailed rule.

### Consider a Server Component First When

-   data is needed when the page is initially rendered
-   product/order data can be fetched on the server
-   the UI does not need browser interaction

### Typical Cases Requiring a Client Component

-   Client Hooks such as `useState` and `useEffect`
-   user interactions such as `onClick` and `onChange`
-   browser-side state changes caused by user actions

``` text
Shopping Page
│
├─ Server Component
│   └─ fetch initial product data
│
└─ Client Component
    ├─ Add to Cart button
    ├─ quantity + / -
    └─ state changes
```

Instead of thinking that `"use client"` must be repeated in every child
file, understand it as an **entry point that creates a Client
boundary**.

------------------------------------------------------------------------

## 12. The Actual useOrders Flow

The project used these states:

``` ts
const [orders, setOrders] = useState<Order[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

  State         Role
  ------------- -----------------------------------
  `orders`      order data
  `isLoading`   whether data is currently loading
  `error`       error message

The core asynchronous code is almost the same as the learning example.

``` ts
const response = await fetch("/api/orders");

if (!response.ok) {
  throw new Error(`Failed to fetch orders: ${response.status}`);
}

const data: Order[] = await response.json();

setOrders(data);
```

Flow:

``` text
fetch("/api/orders")
↓
Promise<Response>
↓ await
Response
↓
response.ok
↓
response.json()
↓
Promise<Order[]>
↓ await
Order[]
↓
setOrders(data)
↓
orders state changes
↓
React re-renders
↓
orders.map()
↓
OrderCard
```

------------------------------------------------------------------------

## 13. return vs. setOrders

In a plain data function:

``` ts
const products: Product[] = await response.json();
return products;
```

The data is returned to the caller.

``` text
Product[]
↓
return
↓
caller
```

In React Client code:

``` ts
const data: Order[] = await response.json();
setOrders(data);
```

The data is stored in State.

``` text
Order[]
↓
setOrders(data)
↓
State changes
↓
re-render
↓
UI updates
```

------------------------------------------------------------------------

## 14. try / catch / finally

### try / catch

``` ts
try {
  // asynchronous work
} catch (error) {
  // handle error
}
```

If an error occurs or `throw` runs inside `try`, `catch` can handle it.

If an error inside an async function is not caught, the Promise returned
by that async function becomes `rejected`.

### finally

``` ts
finally {
  setIsLoading(false);
}
```

`finally` runs after success or failure, so it works well for
loading-state cleanup.

``` text
request starts
↓
isLoading = true
↓
success or failure
↓
finally
↓
isLoading = false
```

------------------------------------------------------------------------

## 15. useEffect --- Today's Required Depth

Actual code:

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

For today, understand this much:

-   Defining `loadOrders` does not execute it.
-   After the Client Component renders, the effect starts the
    order-loading work.
-   Effects are used to synchronize a component with external systems.
-   Here, the external system is the `/api/orders` API.
-   `[loadOrders]` means this Effect depends on `loadOrders`.

Do not memorize `useEffect = fetch`. Fetching is only one use case for
an Effect.

------------------------------------------------------------------------

## 16. useCallback --- Only This Much for Today

The actual code contained:

``` ts
const loadOrders = useCallback(async () => {
  // ...
}, []);
```

For today, remember:

> `useCallback` keeps the `loadOrders` function reference stable across
> renders, and that function is used as a dependency of `useEffect`.

The deeper optimization details and function-reference comparison are
outside today's core scope.

------------------------------------------------------------------------

# Final Core Memory

``` text
fetch()
→ Promise<Response>

await fetch()
→ Response

response.json()
→ Promise<Data>

await response.json()
→ Data

return inside async function
→ Promise fulfilled

uncaught throw inside async function
→ Promise rejected

setState(data)
→ State changes
→ React re-renders
→ UI updates
```

When reading real project code, trace it in this order:

``` text
1. Where is fetch?
2. What is each await waiting for?
3. Is response.ok checked?
4. What type comes from response.json()?
5. Is the data returned or stored in State?
6. Where is that State used in JSX?
```

------------------------------------------------------------------------

## Study Wrap-up

Today's priority is understanding the big picture of **how asynchronous
data travels from an API to the React UI**.
