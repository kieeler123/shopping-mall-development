# Day 17 Review Quiz + Answers

> Scope: Day 15 HTTP/API + Day 16 asynchronous JavaScript + Day 17
> `fetch()`, Mock API, and React State integration
>
> Answer first, then open `<details>`.

## Question 1 --- localStorage vs API

What is the biggest difference between localStorage-based order
management and HTTP API-based order management?

<details><summary>Show answer</summary>

**Answer:** The location and access method of the data differ.
localStorage accesses browser storage directly; an API requires an HTTP
Request over the network and a Response.

</details>

---

## Question 2 --- HTTP Request

Name the four core HTTP Request elements repeatedly reviewed on Day 17.

<details><summary>Show answer</summary>

**Answer:** Method, URL, Headers, Body.

</details>

---

## Question 3 --- Methods

Match GET, POST, PATCH, and DELETE to order operations.

<details><summary>Show answer</summary>

**Answer:** GET = read, POST = create, PATCH = partial update, DELETE =
delete.

</details>

---

## Question 4 --- Collection vs resource

Explain the difference between `GET /orders` and `GET /orders/3`.

<details><summary>Show answer</summary>

**Answer:** `GET /orders` reads the collection and typically returns
`Order[]`; `GET /orders/3` reads one resource and may return `Order` or 404.

</details>

---

## Question 5 --- API Contract

Does an API Contract mean only a list of URLs?

<details><summary>Show answer</summary>

**Answer:** No. It is the Request/Response agreement: Method, URL,
Headers, Request Body, success/failure Status Codes, and Response Body.

</details>

---

## Question 6 --- fetch

Is `fetch()` a React feature?

<details><summary>Show answer</summary>

**Answer:** No. It is a Web API available in browser environments.

</details>

---

## Question 7 --- Promise`<Response>`{=html}

Does `const result = fetch('/api/orders')` immediately put the order
array in `result`?

<details><summary>Show answer</summary>

**Answer:** No. `result` is `Promise<Response>`.

</details>

---

## Question 8 --- Response

Is `const response = await fetch('/api/orders')` the order data itself?

<details><summary>Show answer</summary>

**Answer:** No. It is a `Response` object representing the HTTP
Response.

</details>

---

## Question 9 --- response.json

Write the code that reads a JSON Response Body as JavaScript data.

<details><summary>Show answer</summary>

**Answer:** `const data = await response.json();`

</details>

---

## Question 10 --- two awaits

Why are there two `await`s in `await fetch(...)` and
`await response.json()`?

<details><summary>Show answer</summary>

**Answer:** They wait for two different asynchronous stages: receiving
the Response and reading/parsing its Body.

</details>

---

## Question 11 --- 404 fetch

Does a 404 necessarily make the fetch Promise reject and jump to
`catch`?

<details><summary>Show answer</summary>

**Answer:** No. If an HTTP Response arrives, fetch can fulfill with a
Response. Check `response.ok` and throw when needed.

</details>

---

## Question 12 --- network vs HTTP

Explain network failure versus HTTP failure.

<details><summary>Show answer</summary>

**Answer:** A network failure can prevent communication and reject
fetch. An HTTP failure such as 404/500 is a received Response with
`response.ok === false`.

</details>

---

## Question 13 --- throw

What does `throw` do after `!response.ok`?

<details><summary>Show answer</summary>

**Answer:** It interrupts the normal path and transfers control into the
error/rejection flow handled by `catch`.

</details>

---

## Question 14 --- error flow

Fill the blank: HTTP non-2xx → response.ok false → (A) → catch.

<details><summary>Show answer</summary>

**Answer:** `throw`.

</details>

---

## Question 15 --- async return

What does an `async` function always return?

<details><summary>Show answer</summary>

**Answer:** A Promise.

</details>

---

## Question 16 --- async throw

What Promise state results from an uncaught `throw` inside an async
function?

<details><summary>Show answer</summary>

**Answer:** `rejected`.

</details>

---

## Question 17 --- catch recovery

If `catch` handles an error and returns a normal value, must the async
function remain rejected?

<details><summary>Show answer</summary>

**Answer:** No. It can recover and fulfill with the returned value.

</details>

---

## Question 18 --- stringify

Why use `JSON.stringify(input)` in a POST Body?

<details><summary>Show answer</summary>

**Answer:** To serialize a JavaScript object into a JSON string for the
HTTP Request Body.

</details>

---

## Question 19 --- createdOrder

Why use the server's `createdOrder` instead of blindly appending the
original input?

<details><summary>Show answer</summary>

**Answer:** The server may generate final fields such as an ID or
creation time; Request and Response bodies need not be identical.

</details>

---

## Question 20 --- PATCH

Must PATCH resend the entire order?

<details><summary>Show answer</summary>

**Answer:** No. In Day 17 it was used for partial changes such as
`{ status: newStatus }`.

</details>

---

## Question 21 --- map

Which array method is useful for replacing only the updated order in
State?

<details><summary>Show answer</summary>

**Answer:** `map()`.

</details>

---

## Question 22 --- filter

Which array method is useful for removing a deleted order from State?

<details><summary>Show answer</summary>

**Answer:** `filter()`.

</details>

---

## Question 23 --- 204

Why should you not blindly call `response.json()` after
`204 No Content`?

<details><summary>Show answer</summary>

**Answer:** Because a 204 success has no Response Body to parse.

</details>

---

## Question 24 --- State

Does receiving an order array from the server automatically update the
React UI?

<details><summary>Show answer</summary>

**Answer:** No. Reflect it in State, e.g. `setOrders(data)`, which leads
to re-rendering.

</details>

---

## Question 25 --- UI states

Name the four representative server-data UI states reviewed.

<details><summary>Show answer</summary>

**Answer:** Loading, Error, Empty, Data.

</details>

---

## Question 26 --- Loading

Why is Loading State necessary?

<details><summary>Show answer</summary>

**Answer:** HTTP Requests take time, so the UI needs to represent the
in-progress period before success or failure.

</details>

---

## Question 27 --- effect async

Why avoid `useEffect(async () => { ... })`?

<details><summary>Show answer</summary>

**Answer:** An async function always returns a Promise, while an Effect
callback is expected to return a cleanup function or nothing.

</details>

---

## Question 28 --- cleanup

Does useEffect cleanup run only on unmount?

<details><summary>Show answer</summary>

**Answer:** No. It also runs before the Effect runs again after
dependency changes. Development Strict Mode may show extra
setup/cleanup.

</details>

---

## Question 29 --- Hook abstraction

Why can useOrders switch from localStorage to HTTP while preserving the
component-facing interface?

<details><summary>Show answer</summary>

**Answer:** The Component consumes the Hook's public State/actions and
does not need to know the internal data-source implementation.

</details>

---

## Question 30 --- duplicate Order

What `Order` type problem was found in the real project?

<details><summary>Show answer</summary>

**Answer:** Duplicate `Order` definitions existed, with `items` defined
as `CartItem[]` in one place and `OrderItem[]` in another, making them
incompatible.

</details>

---

## Question 31 --- CartItem vs OrderItem

Why should CartItem and OrderItem not automatically be merged?

<details><summary>Show answer</summary>

**Answer:** Their responsibilities and lifecycles differ: CartItem
references a current product and quantity; OrderItem preserves an
order-time product snapshot.

</details>

---

## Question 32 --- flow blanks

Fill the key flow: AdminOrdersPage → useOrders → (A) →
Promise`<Response>`{=html} → ... → (B) → response.json() → Order Data →
(C) → React State.

<details><summary>Show answer</summary>

**Answer:** (A) `fetch()`, (B) check `response.ok`, (C) `setOrders`.

</details>

---

## Question 33 --- status flow

Explain the full flow for changing an order status to `배송완료`.

<details><summary>Show answer</summary>

**Answer:** User action → `updateOrderStatus` → PATCH `/orders/:id` with
JSON status → Mock API updates → 200 + `updatedOrder` →
`response.json()` → `setOrders(map)` → re-rendered UI.

</details>

---

## Question 34 --- PATCH anatomy

Explain a PATCH fetch call using Method / URL / Headers / Body / Promise
/ Response.

<details><summary>Show answer</summary>

**Answer:** Method=PATCH; URL=`/api/orders/:id`;
Headers=`Content-Type: application/json`; Body=JSON status; fetch
returns `Promise<Response>`; after await you have `Response`.

</details>

---

## Question 35 --- one sentence

Explain Day 17 in one sentence.

<details><summary>Show answer</summary>

**Answer:** Day 17 connected Day 15 HTTP/API and Day 16 asynchronous
JavaScript through `fetch()`, forming the Request → API → Response →
JSON → React State → UI flow.

</details>

---

## Question 36 --- API Layer timing

Why postpone the `ordersApi` API Layer until after real GET/PATCH
implementation?

<details><summary>Show answer</summary>

**Answer:** To experience the problem first: repeated
fetch/status/json/headers/body handling and mixed Hook responsibilities.
Then the API Layer is introduced as a motivated solution.

</details>

---

# Self-Assessment

- **30--36:** Core Day 17 flow is strongly connected.
- **22--29:** Review only missed areas.
- **15--21:** Revisit Promise / HTTP / React State connections.
- **0--14:** Reconnect Day 15 HTTP → Day 16 Promise → Day 17 fetch.

> **Tip** The score is secondary. Try explaining each answer in your own
> words before opening `<details>`.
