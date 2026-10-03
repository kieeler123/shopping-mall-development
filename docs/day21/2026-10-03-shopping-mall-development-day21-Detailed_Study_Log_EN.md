# Day 21 --- Async Data Flow Study Log (Detailed Conversational Edition)

> Today's goal was not simply to memorize `fetch` syntax, but to
> understand how **Promise → async/await → fetch → Response → JSON →
> typed data → React State → UI** actually connect in real code.

------------------------------------------------------------------------

## 1. Starting Point: Why Doesn't JavaScript Wait for `fetch()`?

We started with a very small example.

``` ts
console.log("A");
fetch("/api/products");
console.log("B");
```

The important question was:

> If `fetch()` is in the middle, why doesn't JavaScript wait for the
> request to finish before printing `"B"`?

`fetch()` performs a network request. A network response is not
guaranteed to arrive immediately. If JavaScript stopped everything until
the response arrived, other work and the UI could also be blocked.

So `fetch()` does not immediately return the final response data.
Instead, it returns a **Promise**.

``` ts
const result = fetch("/api/products");
```

At this point, `result` is not an array of products. Conceptually, it
is:

``` ts
Promise<Response>
```

The flow is:

``` text
fetch()
↓
request starts
↓
Promise<Response> is returned immediately
↓
JavaScript can continue with other code
```

### First Key Idea

What `fetch()` returns is **not the data itself, but a Promise
representing a Response that may arrive in the future**.

------------------------------------------------------------------------

## 2. What Is a Promise?

At first, the word Promise can feel abstract.

Today we treated it as:

> **An object representing an asynchronous operation that does not have
> a result yet, but will eventually succeed with a value or fail with an
> error.**

The main states are:

``` text
pending
↓
result not decided yet

fulfilled
↓
completed successfully

rejected
↓
failed with an error
```

Immediately after:

``` ts
fetch("/api/products")
```

the Promise may still be `pending`.

If the HTTP response is received successfully, the Promise becomes
`fulfilled` and its result is a `Response`.

If the request cannot be completed because of a network-level failure,
the Promise can become `rejected`.

------------------------------------------------------------------------

## 3. Is `await` a Promise?

This was one of the important confusing points.

``` ts
const response = await fetch("/api/products");
```

At first glance, `await` can look like the thing that creates the
asynchronous object.

But the key distinction is:

> **`fetch()` creates/returns the Promise. `await` waits for the result
> of that Promise.**

So:

``` text
fetch("/api/products")
↓
Promise<Response>
↓
await
↓
the current async function waits for the Promise result
↓
Response
↓
assigned to response
```

A useful way to read:

``` ts
const response = await fetch("/api/products");
```

is:

> "`fetch()` returns a `Promise<Response>`. `await` waits for it, and
> when it completes, the resulting `Response` is assigned to
> `response`."

Also, `await` does not mean that the entire JavaScript runtime stops. At
today's level, it is enough to understand that the continuation of the
current async function waits for that Promise.

------------------------------------------------------------------------

## 4. Why Is There Another `await` After We Already Waited?

This code can initially look strange:

``` ts
const response = await fetch("/api/products");
const products: Product[] = await response.json();
```

If the first line already waited, why wait again?

Because these are **two different asynchronous operations**.

First:

``` ts
fetch("/api/products")
```

returns:

``` ts
Promise<Response>
```

So:

``` ts
const response = await fetch("/api/products");
```

gives us a `Response`.

But the `Response` is not yet the `Product[]` itself.

We still need to read the response body and parse its JSON into
JavaScript data.

``` ts
response.json()
```

also returns a Promise.

Conceptually:

``` text
response.json()
↓
Promise<Data>
```

So we wait again:

``` ts
const products: Product[] = await response.json();
```

The full flow is:

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

### Very Important Point

The two `await`s are not waiting for the same thing twice.

The first waits for the **HTTP response**. The second waits for the
**response body to be read and parsed into JavaScript data**.

------------------------------------------------------------------------

## 5. Exactly When Does a Variable Receive Its Value?

Consider:

``` ts
const products: Product[] = await response.json();
```

If `response.json()` has not finished, `products` is not first assigned
some temporary value.

Conceptually:

``` text
response.json()
↓
Promise
↓
await waits
↓
Promise completes
↓
parsed data is produced
↓
only then is it assigned to products
```

After that line completes, `products` can be used as the resulting data.

------------------------------------------------------------------------

## 6. Why Does an async Function Return a Promise Even If It Returns an Array?

Consider:

``` ts
async function getProducts() {
  const response = await fetch("/api/products");
  const products: Product[] = await response.json();

  return products;
}
```

Inside the function, we clearly write:

``` ts
return products;
```

so it can look like the function simply returns `Product[]`.

But an important rule is:

> **An async function always returns a Promise.**

Therefore:

``` ts
const result = getProducts();
```

gives, conceptually:

``` ts
Promise<Product[]>
```

But:

``` ts
const products = await getProducts();
```

waits for that Promise and gives:

``` ts
Product[]
```

Inside the function:

``` text
return Product[]
↓
because the function is async
↓
Promise<Product[]> fulfilled
```

At the call site:

``` text
getProducts()
↓
Promise<Product[]>
↓ await
Product[]
```

------------------------------------------------------------------------

## 7. How Are `.then()` and `await` Related?

`await` is not the only way to handle Promises.

For example:

``` ts
fetch("/api/products")
  .then((response) => {
    return response.json();
  })
  .then((products) => {
    console.log(products);
  });
```

The first `.then()` receives the `Response`.

``` text
fetch()
↓
Promise<Response>
↓
first then
↓
Response
```

When it returns:

``` ts
return response.json();
```

the Promise returned by `response.json()` is chained forward.

Then the next `.then()` receives the parsed data.

``` text
response.json()
↓
Promise<Data>
↓
next then
↓
Data
```

With `async/await`, the same general flow can be written in a more
top-to-bottom style:

``` ts
const response = await fetch("/api/products");
const products = await response.json();
```

------------------------------------------------------------------------

## 8. Arrow Function `return` Also Mattered

While reading `.then()`, we also looked at this difference.

``` ts
.then((response) => response.json())
```

An arrow function with an expression body implicitly returns the
expression.

But:

``` ts
.then((response) => {
  response.json();
})
```

uses braces and has no explicit `return`.

That means the next `.then()` may receive `undefined`.

To return the Promise explicitly:

``` ts
.then((response) => {
  return response.json();
})
```

------------------------------------------------------------------------

## 9. `.catch()` and Error Flow

A rejected Promise can be handled with `.catch()`.

``` ts
fetch("/api/products")
  .then(...)
  .catch((error) => {
    console.error(error);
  });
```

With `async/await`, a related pattern is:

``` ts
try {
  // await ...
} catch (error) {
  // handle error
}
```

------------------------------------------------------------------------

## 10. Does `fetch()` Automatically Fail on 404 or 500?

We corrected an important misconception here.

A 404 or 500 response does not generally mean that the `fetch()` Promise
itself becomes `rejected`.

If an HTTP response was successfully received, we can still get a
`Response` object.

That is why code commonly checks:

``` ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("Failed to fetch products");
}
```

`response.ok` is generally `true` for HTTP status codes from 200 through
299.

``` text
fetch()
↓
Response received
↓
check response.ok
├─ true  → continue normal flow
└─ false → throw manually
```

A network-level failure is a typical situation where the `fetch()`
Promise itself may reject.

------------------------------------------------------------------------

## 11. `new Error()` and `throw` Have Different Jobs

This line contains two separate operations:

``` ts
throw new Error("Failed to fetch products");
```

First:

``` ts
new Error("Failed to fetch products")
```

creates an `Error` object.

Then:

``` ts
throw
```

throws that Error into the error flow.

``` text
new Error(...)
↓
create Error object

throw
↓
throw that Error
```

With `try/catch`:

``` ts
try {
  throw new Error("Failed");
} catch (error) {
  console.log(error);
}
```

the error can be caught by `catch`.

------------------------------------------------------------------------

## 12. What Happens When an async Function Throws?

Suppose the error is not caught inside the function:

``` ts
async function getProducts() {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
}
```

If `throw` runs:

``` text
async function
↓
throw
↓
returned Promise
↓
rejected
```

So the success/failure of an async function connects directly to the
state of its returned Promise.

``` text
return value
→ fulfilled

uncaught throw
→ rejected
```

------------------------------------------------------------------------

## 13. `try / catch / finally`

The real project used this structure:

``` ts
try {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  const data: Order[] = await response.json();

  setOrders(data);
} catch (error: unknown) {
  setError(getErrorMessage(error));
} finally {
  setIsLoading(false);
}
```

On success:

``` text
try
↓
fetch
↓
check response.ok
↓
json()
↓
Order[]
↓
setOrders(data)
↓
finally
↓
setIsLoading(false)
```

On failure:

``` text
try
↓
error or throw
↓
catch
↓
setError(...)
↓
finally
↓
setIsLoading(false)
```

`finally` is useful for cleanup that should happen whether the request
succeeds or fails.

------------------------------------------------------------------------

## 14. A Problem in the First getProducts Shape

A first attempt could look like this:

``` ts
async function getProducts() {
  const res = await fetch("/api/products");

  if (res.ok) {
    const products: Product[] = await res.json();
    return products;
  }
}
```

The issue is what happens when `res.ok` is `false`.

In that path, the function does not explicitly return a value, so
`undefined` becomes possible.

A clearer structure is:

``` ts
async function getProducts() {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("Failed to fetch product data.");
  }

  const products: Product[] = await res.json();

  return products;
}
```

Now the function either succeeds with `Product[]` or moves into the
error flow.

------------------------------------------------------------------------

## 15. How Product\[\] Reaches the Actual UI

We then connected the theory to a Next.js page.

``` tsx
type Product = {
  id: number;
  title: string;
  price: number;
};

async function getProducts() {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("Product request failed");
  }

  const products: Product[] = await res.json();

  return products;
}

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

The complete flow is:

``` text
API
↓
fetch
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Product[]>
↓ await
Product[]
↓
return
↓
getProducts() returns Promise<Product[]>
↓ await
Product[]
↓
products.map()
↓
JSX
↓
UI
```

This is where today's asynchronous theory connected to actual Next.js
rendering.

------------------------------------------------------------------------

## 16. Server Components and Client Components

We also looked at the Server/Client distinction in Next.js.

For today, the practical mental model was:

### Think Server First When

The data is needed for the initial page and can be fetched while
rendering on the server.

``` text
enter product page
↓
need product data
↓
fetch on server
↓
create HTML/UI
```

### Client Is Needed for Browser Interaction

For example:

``` tsx
<button onClick={...}>Add to Cart</button>
```

or:

``` tsx
<select onChange={...}>
```

Client Hooks such as `useState` and `useEffect` also require Client-side
execution.

Using `Link` or `Image` by itself does not automatically make the
component a Client Component.

------------------------------------------------------------------------

## 17. Comparing ProductCard and OrderCard

`ProductCard` mainly received product data and displayed it.

``` tsx
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <h2>{product.name}</h2>
        <span>{product.salePrice.toLocaleString()}</span>
        <p>{product.description}</p>
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
        />
      </Link>
    </li>
  );
}
```

It did not itself contain browser interaction such as `onClick`,
`onChange`, or local `useState`.

`OrderCard`, however, had:

``` tsx
<select
  value={order.status}
  onChange={(e) => {
    onStatusChange(order.id, e.target.value as OrderStatus);
  }}
>
```

`onChange` runs when the user changes a selection in the browser, so it
must operate in the Client environment.

An important nuance was that this does **not necessarily mean the
OrderCard file itself must always contain `"use client"`**. If a Client
Component parent imports it, it can already be part of that Client
module graph.

------------------------------------------------------------------------

## 18. The Actual AdminOrdersPage

The parent page looked like:

``` tsx
"use client";

export default function AdminOrdersPage() {
  const { orders, isLoading, error, updateOrderStatus } = useOrders();

  // ...
}
```

It already has `"use client"`.

The hook provides:

``` ts
const { orders, isLoading, error, updateOrderStatus } = useOrders();
```

Then each order is rendered:

``` tsx
orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))
```

------------------------------------------------------------------------

## 19. Finding Today's Theory Inside the Real useOrders Hook

The real project code initially looked different from the simple theory
examples.

But if we temporarily remove the surrounding React details, the same
structure appears:

``` ts
const response = await fetch("/api/orders");

if (!response.ok) {
  throw new Error(`Failed to fetch orders: ${response.status}`);
}

const data: Order[] = await response.json();

setOrders(data);
```

Compare that with the theory example:

``` ts
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("Product request failed");
}

const products: Product[] = await response.json();

return products;
```

The mapping is:

``` text
theory                         real project

fetch("/api/products")    →    fetch("/api/orders")
await                     →    await
Response                  →    Response
response.ok               →    response.ok
throw                     →    throw
response.json()           →    response.json()
Product[]                 →    Order[]
return products           →    setOrders(data)
```

So today's asynchronous theory was already present in the actual Next.js
project.

------------------------------------------------------------------------

## 20. Why `return products` vs. `setOrders(data)` Felt Different

In the theory example:

``` ts
return products;
```

In the real Client code:

``` ts
setOrders(data);
```

But the data-fetching portion is the same:

``` text
fetch
↓
await
↓
Response
↓
json
↓
await
↓
Data
```

What changes is **what we do after obtaining the data**.

Plain data function:

``` text
Product[]
↓
return
↓
send to caller
```

React Client State:

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

## 21. Why Is `setOrders(data)` Needed?

React State is updated through its setter.

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

Here:

``` text
orders
→ read the current State

setOrders
→ request a State update
```

Receiving `Order[]` from the API alone does not automatically make the
React UI use it.

``` ts
const data: Order[] = await response.json();
setOrders(data);
```

updates the State.

Then:

``` text
Order[]
↓
setOrders(data)
↓
orders State changes
↓
React re-renders
↓
AdminOrdersPage reads the new orders
↓
orders.map()
↓
OrderCard
```

------------------------------------------------------------------------

## 22. Why Did `useEffect` Appear?

Defining `loadOrders` does not execute it.

``` ts
const loadOrders = async () => {
  // fetch...
};
```

A function must be called:

``` ts
loadOrders();
```

But blindly starting State-changing asynchronous work directly during
component rendering can create repeated-render problems.

The real code used:

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

At today's level, we understood `useEffect` as:

> **A React Hook for running work after rendering in order to
> synchronize the component with an external system.**

Here, the external system is the `/api/orders` API.

``` text
Client Component renders
↓
useEffect
↓
loadOrders()
↓
fetch()
↓
Order[]
↓
setOrders()
↓
re-render
```

The important thing is not to memorize `useEffect = fetch`. Fetching is
only one possible use of an Effect.

------------------------------------------------------------------------

## 23. What Does `[loadOrders]` Mean?

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

The Effect uses the external function `loadOrders`.

So the dependency array contains:

``` ts
[loadOrders]
```

For now, we understand this as:

> **A declaration that this Effect depends on `loadOrders`.**

------------------------------------------------------------------------

## 24. How Much `useCallback` Do We Need Today?

The real code also had:

``` ts
const loadOrders = useCallback(async (): Promise<void> => {
  // ...
}, []);
```

But today's central topic was Promise, async/await, fetch, JSON, and
data flow.

So we intentionally did not go deeply into `useCallback`.

For now:

> `useCallback` helps keep the `loadOrders` function reference stable
> across renders, and that function is used as a dependency of
> `useEffect`.

Deeper topics such as reference identity, optimization, and stale
closures can wait until they become necessary.

------------------------------------------------------------------------

## 25. What Does `void loadOrders()` Mean?

Because `loadOrders` is async, calling it returns a Promise.

``` ts
loadOrders();
```

Conceptually:

``` ts
Promise<void>
```

The Effect used:

``` ts
void loadOrders();
```

For today's purposes:

> It calls `loadOrders()` while explicitly indicating that the returned
> Promise value is not being used here.

Adding `void` does not turn `loadOrders` into a synchronous function.

------------------------------------------------------------------------

## 26. What Does `Promise<void>` Mean?

`loadOrders` performs asynchronous work but does not return the
`Order[]` to its caller.

``` ts
const loadOrders = async (): Promise<void> => {
  // ...
  setOrders(data);
};
```

So:

``` text
perform async work
↓
update State
↓
no data value returned
↓
Promise<void>
```

A function that returns product data would instead look like:

``` ts
async function getProducts(): Promise<Product[]> {
  return products;
}
```

------------------------------------------------------------------------

## 27. PATCH Appeared When Updating Order Status

The real project also updated an order rather than only reading orders.

``` ts
const response = await fetch(`/api/orders/${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status }),
});
```

We did not study PATCH deeply today, but the Promise flow remains the
same:

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.ok
↓
response.json()
↓ await
updatedOrder
```

The main difference is that the request asks the server to update part
of an order instead of only retrieving data.

------------------------------------------------------------------------

## 28. Replacing One Order in State

The project also contained:

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

We left the deeper explanation for a later step.

At a high level:

``` text
take existing Order[]
↓
map over every order
↓
if id matches updatedOrder.id
→ use updatedOrder

otherwise
→ keep existing order
↓
create a new Order[]
↓
setOrders
```

Why `prevOrders` and the functional State update are useful can be
studied in more detail later.

------------------------------------------------------------------------

# 29. Why the Real Code Felt More Confusing Than the Theory

Near the end, the feeling was:

> "The code I saw in theory and the code in the real Next.js project
> look different, so I get confused."

The reason is that the real code contains React concepts around the
asynchronous core.

It includes:

``` text
useState
useCallback
useEffect
Promise
async
await
fetch
try/catch
finally
setOrders
```

all at once.

But if we separate the layers:

``` text
React
│
├─ useEffect
│   ↓
│  call loadOrders
│
├─ async core
│   fetch
│   ↓
│   Promise<Response>
│   ↓ await
│   Response
│   ↓
│   json()
│   ↓ await
│   Order[]
│
└─ React
    setOrders
    ↓
    re-render
    ↓
    UI
```

the theory learned today is still sitting in the middle unchanged.

------------------------------------------------------------------------

# 30. How Should Development Be Studied?

At the end, we also discussed the learning process itself.

Both extremes can cause problems.

### Master All Theory Before Building Anything

If learning Promise immediately expands into:

``` text
Promise
Event Loop
Call Stack
Web APIs
Microtask Queue
ECMAScript internals
...
```

and everything must be mastered before writing code, progress can become
very slow.

### Build by Copying Without Understanding

On the other hand, repeatedly copying:

``` ts
const response = await fetch(url);
const data = await response.json();
setProducts(data);
```

without understanding why it works can cause problems when the code
shape changes even slightly.

### The Learning Loop We Settled On

A practical approach is:

``` text
shallow core theory
↓
small code example
↓
a "why?" question appears
↓
study the necessary theory one level deeper
↓
find it in the real project
↓
use it yourself
↓
review again
```

In other words:

> **theory → practice → theory → practice**

The same concept is revisited at increasing depth.

------------------------------------------------------------------------

# 31. Moving Beyond "I Don't Even Know What I Don't Know"

At first, asynchronous programming can feel like one giant confusing
block:

``` text
async?
Promise?
await?
fetch?
everything feels mixed together
```

As study progresses, the unknowns become more specific:

``` text
Promise       → partly understood
async         → partly understood
await         → partly understood
fetch         → partly understood
Response      → partly understood
json()        → partly understood
throw/catch   → partly understood
setState      → beginning to connect
useEffect     → just starting
useCallback   → not studied deeply yet
```

Progress is not only "having no unknowns."

> **Being able to describe exactly what you do not understand is also
> meaningful progress.**

------------------------------------------------------------------------

# 32. How Much Is Enough for Today?

The essential ideas to keep are:

``` text
fetch()
→ Promise<Response>

await fetch()
→ Response

response.json()
→ Promise<Data>

await response.json()
→ Data

async function
→ always returns a Promise

return inside async
→ fulfilled result

uncaught throw
→ rejected

response.ok
→ check HTTP success status

setOrders(data)
→ State changes
→ re-render
→ UI
```

For `useEffect`, today's level is:

> Run work after rendering to synchronize with an external system.

For `useCallback`:

> It is okay not to fully understand it yet.

That is enough for today.

------------------------------------------------------------------------

# 33. Final End-to-End Flow

Putting everything together:

``` text
user enters page
↓
component renders
↓
data-loading function runs at the appropriate time
↓
fetch("/api/...")
↓
Promise<Response>
↓
await
↓
Response
↓
check response.ok
↓
response.json()
↓
Promise<Data>
↓
await
↓
Product[] / Order[]
↓
on the Server: return/use for rendering
or
on the Client: setState(data)
↓
React uses the data
↓
map()
↓
components
↓
UI
```

## One-Sentence Summary

> **Fetching asynchronous data means following
> `fetch → Promise → await → Response → json → await → Data`, and in
> Next.js/React that data is then used for Server rendering or stored in
> Client State so it can reach the UI.**

Understanding this big picture is enough for today. The deeper details
can be learned one layer at a time when they become necessary.
