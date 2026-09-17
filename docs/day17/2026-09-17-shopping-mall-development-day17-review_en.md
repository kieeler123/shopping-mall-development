# Day 17 Comprehensive Review --- From HTTP/API Theory to fetch() and a Mock API

## Where Day 17 Fits

Day 17 is not a completely isolated topic. It connects **Day 15 HTTP/API
fundamentals + Day 16 asynchronous JavaScript + practical `fetch()`
usage**.

``` text
Day 15
HTTP / API
Method / URL / Headers / Body
Response / Status Code / JSON
        ↓
Day 16
Promise / async / await
try / catch / throw
        ↓
Day 17
fetch()
Response
response.json()
Mock API
GET / POST / PATCH / DELETE
React State integration
```

The main goal is not memorizing syntax, but understanding this flow:

``` text
React
  ↓
fetch()
  ↓
HTTP Request
  ↓
API
  ↓
HTTP Response
  ↓
JSON
  ↓
React State
  ↓
UI
```

> **Tip** Do not review `fetch()` in isolation. Trace where Day 15 HTTP
> concepts meet Day 16 Promises.

------------------------------------------------------------------------

## STEP 01 --- From localStorage to an API

Previous structure:

``` text
React → useOrders → localStorage
```

API structure:

``` text
React → useOrders → fetch() → API
```

With localStorage, data is read inside the browser. With an API, the
browser sends a Request across the network and receives a Response.

> **Tip** Start with the location of the data: inside the browser or
> across the network.

------------------------------------------------------------------------

## STEP 02 --- What fetch() Actually Is

`fetch()` is a browser Web API, not a React feature.

``` js
const promise = fetch("/api/orders");
```

It immediately returns:

``` text
Promise<Response>
```

not the order data.

``` js
const response = await fetch("/api/orders");
```

After `await`, `response` represents the HTTP Response.

> **Tip** Remember `fetch()` as "start an HTTP request and return
> Promise`<Response>`{=html}," not simply "get data."

------------------------------------------------------------------------

## STEP 03 --- GET Request

``` js
const response = await fetch("/api/orders");
```

The default Method is `GET`.

``` text
Method  GET
URL     /api/orders
Headers when needed
Body    none
```

Its purpose here is to retrieve the order list.

> **Tip** When reading fetch code, identify Method and URL first.

------------------------------------------------------------------------

## STEP 04 --- Response Is Not the Data

``` js
const response = await fetch("/api/orders");
```

`response` is an HTTP Response object, not an array of orders.

Examples:

``` js
response.ok
response.status
response.headers
```

> **Tip** Keep names such as `response` and `orders` distinct so the
> HTTP layer and application data do not blur together.

------------------------------------------------------------------------

## STEP 05 --- response.json()

When the Response Body contains JSON:

``` js
const data = await response.json();
```

`response.json()` is also asynchronous and returns a Promise.

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
JavaScript Data
```

> **Tip** Be able to explain why there are two `await`s: waiting for the
> Response and reading/parsing its Body are separate asynchronous
> stages.

------------------------------------------------------------------------

## STEP 06 --- response.ok and HTTP Errors

An important distinction:

``` text
404 / 500
≠
fetch Promise must reject
```

If an HTTP Response arrives, `fetch()` can still fulfill with a Response
object.

Therefore check it explicitly:

``` js
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status}`);
}
```

> **Tip** Do not treat network failure and HTTP failure as the same
> thing.

------------------------------------------------------------------------

## STEP 07 --- try / catch and throw

``` js
try {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  const orders = await response.json();
} catch (error) {
  console.error(error);
}
```

Flow:

``` text
HTTP non-2xx
↓
response.ok === false
↓
throw
↓
async failure path
↓
catch
```

> **Tip** `throw` does more than print an error; it changes normal
> control flow into failure flow.

------------------------------------------------------------------------

## STEP 08 --- Mock API

A Mock API is not merely a fake array. It is a practice API that behaves
like a server by accepting Requests and returning Responses.

Purposes:

-   Practice real HTTP communication
-   Practice API contracts
-   Develop frontend behavior before a real server/database is complete
-   Verify GET/POST/PATCH/DELETE flows

> **Tip** Treat Method, URL, Status Code, and Response Body seriously
> even with a Mock API.

------------------------------------------------------------------------

## STEP 09 --- `/orders` API Contract

  Feature       Method   URL             Success
  ------------- -------- --------------- -------------------------
  List orders   GET      `/orders`       `200` + `Order[]`
  Get one       GET      `/orders/:id`   `200` + `Order`
  Create        POST     `/orders`       `201` + created `Order`
  Update        PATCH    `/orders/:id`   `200` + updated `Order`
  Delete        DELETE   `/orders/:id`   `204`

A missing order may return `404`.

> **Tip** An API contract is the complete Request/Response agreement,
> not just the URL.

------------------------------------------------------------------------

## STEP 10 --- GET Orders in React

``` js
async function loadOrders() {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  const data = await response.json();
  setOrders(data);
}
```

``` text
GET
↓
Response
↓
JSON
↓
setOrders
↓
State change
↓
Re-render
↓
Order list UI
```

> **Tip** Receiving server data does not automatically update the UI.
> The connection happens when the result is reflected in React State.

------------------------------------------------------------------------

## STEP 11 --- Loading State

Network requests take time:

``` js
const [isLoading, setIsLoading] = useState(true);
```

``` text
Request starts
↓
isLoading = true
↓
Request finishes
↓
isLoading = false
```

> **Tip** Loading is a normal UI state, not an optional decoration.

------------------------------------------------------------------------

## STEP 12 --- Error State

``` js
const [error, setError] = useState(null);
```

A failure can be reflected in State:

``` js
catch (error) {
  setError(error.message);
}
```

A server-driven screen commonly considers:

``` text
Loading
Error
Empty
Data
```

> **Tip** Design request-in-progress, failure, and empty states along
> with the success state.

------------------------------------------------------------------------

## STEP 13 --- GET a Specific Order

``` text
GET /orders/3
```

Success:

``` text
200 + Order
```

Not found:

``` text
404
```

> **Tip** Notice the distinction between the `/orders` collection and an
> individual `/orders/:id` resource.

------------------------------------------------------------------------

## STEP 14 --- POST

``` js
const response = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(input),
});
```

``` text
Method   POST
URL      /api/orders
Headers  Content-Type: application/json
Body     JSON
```

> **Tip** For POST, read Method, Headers, and Body together.

------------------------------------------------------------------------

## STEP 15 --- createdOrder

After a successful POST:

``` js
const createdOrder = await response.json();

setOrders((prevOrders) => [
  ...prevOrders,
  createdOrder,
]);
```

Use the order actually created and returned by the server rather than
assuming the original input is the final resource.

> **Tip** The server may generate IDs, timestamps, or other fields, so
> Request Body and Response Body are not necessarily identical.

------------------------------------------------------------------------

## STEP 16 --- PATCH

Update part of an order, such as its status:

``` js
const response = await fetch(`/api/orders/${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: newStatus,
  }),
});
```

After receiving `updatedOrder`:

``` js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order
  )
);
```

> **Tip** Think in a full round trip: change request → server processing
> → updated resource → State replacement.

------------------------------------------------------------------------

## STEP 17 --- DELETE and 204 No Content

``` js
const response = await fetch(`/api/orders/${id}`, {
  method: "DELETE",
});
```

A successful deletion may return:

``` text
204 No Content
```

so do not blindly call:

``` js
await response.json();
```

After success:

``` js
setOrders((prevOrders) =>
  prevOrders.filter((order) => order.id !== id)
);
```

> **Tip** Status Codes can also tell you whether a Response Body should
> exist.

------------------------------------------------------------------------

## STEP 18 --- Viewing useOrders as HTTP-Based

Before:

``` text
Component
↓
useOrders
↓
localStorage
```

After:

``` text
Component
↓
useOrders
↓
fetch()
↓
HTTP API
```

Keep the component-facing interface stable where practical while
changing the Hook's internal data source.

``` js
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

> **Tip** Separate what the Component needs to know from implementation
> details that belong inside the Hook.

------------------------------------------------------------------------

# Day 17 Deep Review 1 --- async Functions and Promise States

An `async` function always returns a Promise.

``` js
async function example() {
  return 10;
}
```

Conceptually:

``` text
Promise fulfilled with 10
```

An uncaught `throw` leads to rejection:

``` js
async function example() {
  throw new Error("Failure");
}
```

An internal `catch` can handle the error and return a normal value.

> **Tip** Connect `return` and `throw` inside async functions to Promise
> fulfillment and rejection.

------------------------------------------------------------------------

# Day 17 Deep Review 2 --- Why Not Make the useEffect Callback async?

Avoid:

``` js
useEffect(async () => {
  // ...
}, []);
```

An Effect callback is expected to return a cleanup function or nothing,
while an `async` function always returns a Promise.

Use a normal callback and call asynchronous work from inside it.

> **Tip** When `useEffect` and `async` appear together, think about the
> Effect callback's return value.

------------------------------------------------------------------------

# Day 17 Deep Review 3 --- useEffect Cleanup

Cleanup typically runs:

``` text
before an Effect runs again because dependencies changed
or
when the Component unmounts
```

In React Strict Mode during development, additional setup/cleanup
executions may be observed to help detect Effect problems.

> **Tip** Do not memorize cleanup as unmount-only behavior.

------------------------------------------------------------------------

# Issues Revealed in the Real Project

Connecting the theory to the admin-order code exposed several existing
issues:

-   Duplicate `Order` types in `src/types/order.ts` and
    `app/admin/orders/type.tsx`
-   Different meanings for `CartItem[]` and `OrderItem[]`
-   Real Order IDs are `number`, while some functions used `string`
-   `page.tsx` expected `updateOrderStatus`, but the Hook interface
    differed
-   Possible default/named export mismatch
-   `initialOrders` became unnecessary after moving toward HTTP

These are not problems with `fetch()` itself. They are domain-model and
project-structure issues revealed by introducing real HTTP boundaries.

> **Tip** Before hiding a type error with `as`, check whether two
> different domain concepts are being incorrectly treated as the same
> type.

------------------------------------------------------------------------

# CartItem vs. OrderItem

``` ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

``` ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

``` text
CartItem
→ references the current product and tracks purchase quantity

OrderItem
→ preserves product information at the time of the order
```

> **Tip** Before merging types, compare their responsibilities and
> lifecycles.

------------------------------------------------------------------------

# Complete Day 17 Flow

``` text
AdminOrdersPage
      ↓
useOrders
      ↓
fetch()
      ↓
Promise<Response>
      ↓
HTTP Request
      ↓
Mock API
      ↓
HTTP Response
      ↓
response.ok
      ↓
response.json()
      ↓
Order Data
      ↓
setOrders
      ↓
React State
      ↓
Re-render
      ↓
OrderCard
```

Status change:

``` text
User
↓
OrderCard
↓
updateOrderStatus
↓
PATCH Request
↓
Mock API
↓
updatedOrder Response
↓
setOrders(map)
↓
UI update
```

------------------------------------------------------------------------

# Day 17 Completion Criteria

You should be able to explain:

-   Relationship between HTTP Request and Response
-   Roles of Method / URL / Headers / Body
-   Why `fetch()` returns `Promise<Response>`
-   Difference between `Response` and parsed JSON data
-   Why `response.json()` needs `await`
-   Difference between HTTP 404/500 and network failure
-   `response.ok` → `throw` → `catch`
-   Roles of GET / POST / PATCH / DELETE
-   Meaning of `201 Created` and `204 No Content`
-   Why server Responses are reflected in React State
-   Loading / Error / Empty / Data states
-   Relationship between `useEffect` and asynchronous work
-   Why a Custom Hook can change its data source from localStorage to
    HTTP
-   Why CartItem and OrderItem are different domain data

------------------------------------------------------------------------

# Where Day 17 Stops

The original plan also contained:

``` text
STEP 19 → API Layer (`ordersApi`)
STEP 20 → Full Integration
```

Do not force these into Day 17.

Day 18 will first review the accumulated JavaScript / React / TypeScript
/ Next.js / HTTP knowledge.

Afterward, implement real project HTTP flows:

``` text
GET /api/orders
↓
PATCH /api/orders/:id
↓
Verify the actual HTTP round trip
```

Only after experiencing repeated HTTP details and growing Hook
responsibilities should the API Layer be introduced.

> **Tip** Experience the problem before memorizing the architecture that
> solves it.

------------------------------------------------------------------------

# Day 17 in One Sentence

> **Day 17 connected Day 15 HTTP/API fundamentals and Day 16
> asynchronous JavaScript through `fetch()`, completing the conceptual
> round trip from a server Response to React State and finally the UI.**

Day 18 will review the accumulated material using the pattern **React +
JavaScript principle → immediate TypeScript connection → real Next.js
project connection**.
