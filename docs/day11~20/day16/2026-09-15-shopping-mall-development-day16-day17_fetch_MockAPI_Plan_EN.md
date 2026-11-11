# Day 17 — `fetch()` and Mock API — Step-by-Step Study Plan



Turn the HTTP/API theory from Day 16 into real `fetch()` code and Mock API-based order CRUD.



```text
Before
React → useOrders → localStorage

After
React → useOrders → fetch() → Mock API
```


> **Tip**
>
> At every Step, translate the code back into Day 16 terms: Method, URL, Headers, Body, Response, Status Code, and JSON.


---
## STEP 01. Compare localStorage and API access


### Goal
Compare `React → localStorage` with `React → fetch() → API` and identify what stays the same.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 02. What exactly is fetch()?


### Goal
Understand `fetch()` as a Browser JavaScript Web API rather than HTTP itself, and connect it to Promise.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 03. First GET Request


### Goal
Understand how `fetch('/orders')` corresponds to Day 16's `GET /orders`.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.

```js
const response = await fetch("/orders");
```


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 04. The Response object


### Goal
Understand that `response` represents an HTTP Response rather than the final order array.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 05. response.json()


### Goal
Consume and parse a JSON Response Body into a JavaScript value.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.

```js
const data = await response.json();
```


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 06. response.ok and HTTP errors


### Goal
Separate 4xx/5xx HTTP statuses from network/Promise rejection and understand `response.ok`.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.

```js
if (!response.ok) {
  throw new Error("Request failed");
}
```


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 07. GET + try/catch


### Goal
Combine async/await, response.ok, throw, response.json(), and try/catch into a GET pattern.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 08. Mock API


### Goal
Understand why a Mock API is useful for practicing HTTP and asynchronous UI without a production backend.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 09. /orders API contract


### Goal
Define the Orders API contract for GET, POST, PATCH, and DELETE practice.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 10. GET orders in React


### Goal
Connect retrieved orders to `setOrders()` and implement `Response → State → UI`.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 11. Loading State


### Goal
Separate in-progress requests from empty data and model the Loading lifecycle.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 12. Error State


### Goal
Connect HTTP/network failure to Error State and user-facing UI.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 13. GET one order


### Goal
Turn the `/orders/:id` route template into a concrete ``/orders/${id}`` request.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 14. Create with POST


### Goal
Map POST Method, Headers, Content-Type, Body, and JSON.stringify() to Day 16 theory.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.

```js
const response = await fetch("/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newOrder),
});
```


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 15. Handle createdOrder


### Goal
Separate client input `newOrder` from server-returned `createdOrder` and synchronize State from the server result.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 16. Update with PATCH


### Goal
Implement PATCH as Target in the URL plus partial Changes in the Body.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.

```js
await fetch(`/orders/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(changes),
});
```


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 17. Delete with DELETE


### Goal
Handle DELETE and 204 No Content without blindly calling `response.json()`.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.

```js
const response = await fetch(`/orders/${id}`, { method: "DELETE" });
```


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 18. Refactor useOrders to HTTP


### Goal
Keep the existing CRUD interface while replacing localStorage access inside `useOrders` with HTTP calls.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 19. API Layer


### Goal
Recognize repeated fetch/status/body/error logic and understand why an `ordersApi` layer can help.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## STEP 20. Integration and final review


### Goal
Explain the full Day 17 flow from user action through Mock API, Response, Data/Loading/Error State, and UI.


### Study Points
```text
Request → Mock API → Response → React State → UI
```

For this Step, identify the HTTP meaning of the code, the asynchronous waiting point, and how success/failure eventually affects React State.


> **Tip**
>
> Do not memorize syntax in isolation; explain it again using a concrete order CRUD scenario.


---
## Final Flow

The final target is to explain `User → React → useOrders → fetch() → HTTP Request → Mock API → HTTP Response → Data/Loading/Error State → UI` end to end.