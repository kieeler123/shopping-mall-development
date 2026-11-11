# Day 16 --- HTTP & API Fundamentals

> Goal: Before implementing `fetch()`, understand HTTP
> requests/responses and API structure, then connect the existing React
> order CRUD flow to a server API.

## Big Picture

``` text
User → React (Client) → HTTP Request → API/Server → Database
    ← React State/UI ← HTTP Response ←
```

------------------------------------------------------------------------

## STEP 1. Why Do We Need HTTP and APIs?

The earlier project stored data inside the browser:

``` text
React → useOrders → localStorage
```

With a server and database, the architecture changes:

``` text
React → HTTP Request → API → Server → Database
Database → Server → HTTP Response → React → State → UI
```

The key question is: **How does the browser exchange data with a
server?** HTTP and APIs appear at this boundary.

**Tip:** Think of this transition as changing the data-access path from
`localStorage` to a server, rather than replacing the entire React
application.

## STEP 2. Client and Server

A Client sends requests. A Server receives requests, processes them, and
sends responses. In this project, React plays the Client role.

``` text
Client → Request → Server
Client ← Response ← Server
```

A Server may access a database and perform authentication,
authorization, validation, and business logic. A Server and a Database
are not the same thing.

**Tip:** Start with three roles: `Client=requests`,
`Server=processes/responds`, `Database=stores/retrieves data`.

## STEP 3. What Is HTTP?

HTTP (Hypertext Transfer Protocol) is a **communication protocol** used
for exchanging messages between clients and servers. HTTP is not the
Internet itself, a server, or an API.

Important HTTP concepts include Request, Response, Method, Headers,
Body, and Status Code.

**Tip:** Remember HTTP as the **rules for exchanging data**, not the
data itself.

## STEP 4. HTTP Request Structure

An HTTP Request is a message sent from a Client to a Server.

``` text
Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

Example:

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

-   Method: what action to perform
-   URL: where to send the request
-   Headers: metadata about the message
-   Body: the actual content being sent

Not every request has a Body.

**Tip:** Read a request as `Action → Destination → Metadata → Data`.

## STEP 5. URL and Endpoint

A URL identifies the destination of a request.

``` text
https://api.myshop.com + /orders/10
└─ Base URL             └─ Path
```

Example Orders API operations:

``` text
GET    /orders
GET    /orders/10
POST   /orders
PATCH  /orders/10
DELETE /orders/10
```

In documentation, `/orders/:id` is a route template. `:id` is replaced
by a real value such as `/orders/10`.

A query string is also part of a URL:

``` text
GET /orders?status=shipping
```

A path segment often identifies a resource, while query parameters
commonly express filters, search conditions, sorting, pagination, or
other options. Exact semantics are defined by the API contract.

**Tip:** Think `Path = what resource?` and
`Query = under what conditions/options?`

## STEP 6. Resource and API

A Resource is a domain object or concept managed through an API.

``` text
products
users
orders
cart
```

An API (Application Programming Interface) is an interface that allows
one program to use another program's functionality or data.

An API is not merely one URL. An API contract may define Methods,
Endpoints, Headers, Request Bodies, Responses, Status Codes, and
authentication requirements.

``` text
Orders API
├─ GET /orders
├─ POST /orders
├─ PATCH /orders/:id
└─ DELETE /orders/:id
```

An HTTP API is an API exposed through HTTP. Not every API is an HTTP
API.

**Tip:** Use the mental model `API = broader interface`,
`Endpoint = a concrete request point inside it`.

## STEP 7. GET --- Read

GET is used to retrieve a representation of a Resource.

``` http
GET /orders
GET /orders/10
```

Typical APIs avoid relying on a GET request body and use paths and query
parameters for retrieval inputs.

In HTTP semantics, GET is **safe** and **idempotent**.

-   Safe: the request semantics do not ask the server to change resource
    state.
-   Idempotent: repeating the same request has the same intended effect
    on server state as making it once.

This does not mean every GET response must contain identical data.

**Tip:** Connect GET with `Read + Safe + Idempotent`, but do not
interpret "safe" as security.

## STEP 8. POST --- Create

In CRUD-style APIs, POST is commonly used to create a new Resource.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

The Server may authenticate, validate, apply business logic, and then
persist data rather than blindly saving the request body. Successful
resource creation commonly uses `201 Created`.

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid"
}
```

POST is generally not safe and is not guaranteed to be idempotent.
Repeating a creation request may create duplicates.

**Tip:** Distinguish the Request Body from the Resource returned by the
Server. Values such as `id` may be generated server-side.

## STEP 9. PATCH --- Update

PATCH is commonly used for partial modification of a Resource.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

Think:

``` text
/orders/10 → Which resource?
Body       → What should change?
```

The Server may check existence, permissions, validation rules, and
allowed state transitions before updating the database.

PATCH itself does not guarantee idempotency. "Set status to shipping"
may have an idempotent effect, while "increment quantity by 1" may not.

**Tip:** Read PATCH as **Target + Changes**: `URL=target`,
`Body=changes`.

## STEP 10. DELETE --- Delete

DELETE requests deletion of a Resource.

``` http
DELETE /orders/10
```

Simple deletion APIs often need no Body because Method + Path already
express the intent. This is not an absolute rule; follow the API
contract.

A successful response may be:

``` http
204 No Content
```

An API could instead return `200 OK` with a body. A missing resource may
produce `404 Not Found`.

DELETE is not safe, but it is idempotent under HTTP semantics. The first
request might return 204 and a repeated request 404; the intended final
resource state is still "absent."

**Tip:** Do not memorize `DELETE = 204`. DELETE is a request Method; 204
is one possible response.

## STEP 11. HTTP Response Structure

A Response is a message sent from the Server back to the Client.

``` text
Response
├─ Status Code
├─ Headers
└─ Body
```

Example:

``` http
200 OK
Content-Type: application/json

{
  "id": 10,
  "status": "shipping"
}
```

The Status Code signals the processing result, Headers provide metadata,
and the Body contains the actual response content.

A successful response can have no body, as with `204 No Content`.

**Tip:** `Response ≠ JSON`. JSON is only one possible representation
used in a Response Body.

## STEP 12. Status Codes

Important status codes:

  -----------------------------------------------------------------------
  Code                                Meaning
  ----------------------------------- -----------------------------------
  200 OK                              Successful processing

  201 Created                         Resource successfully created

  204 No Content                      Success with no response body

  400 Bad Request                     Request does not meet API
                                      requirements, etc.

  401 Unauthorized                    Authentication credentials are
                                      missing/invalid, etc.

  403 Forbidden                       The requested action is not
                                      permitted

  404 Not Found                       Target resource was not found

  500 Internal Server Error           Unexpected server-side processing
                                      problem
  -----------------------------------------------------------------------

Categories:

``` text
2xx → Success
4xx → Request-side category
5xx → Server-side processing category
```

These categories should not be interpreted as assigning blame to a
frontend or backend developer.

**Tip:** Separate `Method = client's requested action` from
`Status Code = server's processing result`.

## STEP 13. JSON

JSON (JavaScript Object Notation) is a text-based data representation
and interchange format.

JavaScript object:

``` js
const order = {
  id: 10,
  status: "shipping",
};
```

JSON:

``` json
{
  "id": 10,
  "status": "shipping"
}
```

They look similar but are not the same thing.

``` text
JavaScript Value
→ JSON.stringify()
→ JSON Text
→ HTTP Body
```

Conceptually in the other direction:

``` text
HTTP Body
→ JSON Text
→ Parsing
→ JavaScript Value
```

JSON supports strings, numbers, booleans, null, objects, and arrays.
`undefined` and functions are not JSON values.

**Tip:** Do not call every `{...}` JSON. Check whether it is a
JavaScript runtime value or JSON text.

## STEP 14. Headers and Content-Type

Headers contain metadata about an HTTP message.

Examples:

``` http
Content-Type: application/json
Authorization: Bearer ...
Accept: application/json
```

`Content-Type` describes the media type of the **current message body**.

``` text
Request Content-Type  → type of Request Body
Response Content-Type → type of Response Body
```

Messages without a Body may not need Content-Type. Behavior when
Content-Type is missing or incorrect depends on the server/API
implementation.

`Accept` expresses response media types the Client can accept or
prefers.

**Tip:** Keep these separate: `Headers=metadata`, `Body=content`,
`Content-Type=description of the body's media type`.

## STEP 15. HTTP with Promise / async / await / try-catch

Server communication takes time:

``` text
Request → wait → Response
```

JavaScript Web APIs such as `fetch()` represent asynchronous work with a
Promise.

``` text
fetch()
→ Promise
→ await
→ Response
```

HTTP itself does not return a Promise; `fetch()` does.

`await` does not freeze the entire browser. It pauses continuation of
the current async function until the awaited Promise settles.

Conceptual example:

``` js
async function loadOrders() {
  try {
    const response = await fetch("/orders");

    if (!response.ok) {
      throw new Error("Failed to load orders");
    }

    const data = await response.json();
    // update state
  } catch (error) {
    // handle error
  }
}
```

Crucially, `fetch()` normally does not reject merely because the server
returned HTTP 404 or 500. A Response was still received. Check
`response.ok` or the status. Network/transport failures can reject the
Promise.

**Tip:** Think `response.ok = HTTP status check`, while
`try/catch = JavaScript exceptions and Promise rejection handling`.

## STEP 16. Convert Existing Order CRUD to HTTP

Mapping existing functions to HTTP:

  Function                     HTTP
  ---------------------------- ----------------------
  `getOrders()`                `GET /orders`
  `getOrder(id)`               `GET /orders/:id`
  `addOrder(order)`            `POST /orders`
  `updateOrder(id, changes)`   `PATCH /orders/:id`
  `deleteOrder(id)`            `DELETE /orders/:id`

Full architecture:

``` text
UI Action
→ useOrders
→ HTTP Request
→ API
→ Server
→ Database
→ HTTP Response
→ useOrders
→ React State
→ UI
```

The React state should be synchronized with the result actually
confirmed by the Server.

**Tip:** The CRUD concepts remain. What changes is the data-access path:
`localStorage → HTTP API`.

## STEP 17. Connect Success and Failure to React UI

With server data, think beyond Data and model Loading and Error too.

``` text
Request starts
→ Loading
→ Response
   ├─ Success → Data → State → UI
   └─ Error   → Error State → Error UI
→ Loading ends
```

Examples:

``` text
200 → display order data
400 → ask user to check input
401 → authentication/login handling
403 → permission-related UI
404 → order not found
500 → server problem / retry guidance
```

An empty result `[]` is different from "the result has not arrived yet."

**Tip:** Whenever you work with server data, ask about
`Data / Loading / Error`.

## STEP 18. Full Request → Response Round Trip

### Read Orders

``` text
User
→ Orders page
→ React
→ GET /orders
→ HTTP Request
→ API/Server
→ Database query
→ 200 + JSON
→ HTTP Response
→ React
→ Order data
→ State
→ UI
```

### Create an Order

``` text
User
→ Place order
→ React newOrder
→ JSON.stringify()
→ POST /orders
→ Content-Type: application/json
→ JSON Body
→ Server
→ Parsing / Validation / Business Logic
→ Database
→ 201 Created + created-order JSON
→ React
→ State
→ UI
```

**Tip:** Treat API communication as a complete round trip from user
action to final UI, not merely as "sending a request."

## STEP 19. Distinguish the Core Terms

  Concept       Core Meaning
  ------------- ---------------------------------------
  HTTP          Client-server communication protocol
  API           Interface exposing functionality/data
  Request       Client → Server message
  Response      Server → Client message
  Method        Action semantics of a Request
  Endpoint      Concrete request point in an API
  Header        HTTP message metadata
  Body          Actual HTTP message content
  JSON          Data representation format
  Status Code   Result of Server processing

Question-based memory:

``` text
HTTP        → How do they communicate?
API         → What functionality/data is exposed?
Request     → What did the Client ask?
Method      → What action?
Endpoint    → Where is the request sent?
JSON        → How is the data represented?
Response    → What did the Server return?
Status Code → What was the processing result?
```

**Tip:** Instead of memorizing definitions alone, locate each term
inside a real example such as `POST /orders → 201 + JSON`.

## STEP 20. Final Day 16 Review

HTTP Request:

``` text
Method + URL + Headers + Body
```

HTTP Response:

``` text
Status Code + Headers + Body
```

Order CRUD:

``` text
POST   /orders      → Create
GET    /orders      → Read
GET    /orders/:id  → Read one
PATCH  /orders/:id  → Update
DELETE /orders/:id  → Delete
```

Final flow:

``` text
React (Client)
→ HTTP Request
→ API
→ Server
→ Database
→ HTTP Response
→ Status/Headers/Body
→ React
→ Data / Loading / Error
→ State
→ UI
```

Day 17's `fetch()` is not magic. It is a JavaScript Web API used to
perform the HTTP flow studied today.

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

Mapping:

``` text
/orders          → URL
POST             → Method
headers          → Headers
Content-Type     → describes Body media type
body             → Request Body
JSON.stringify() → serialize JS value into JSON text
await            → wait for Promise-based async result
response         → HTTP Response
```

**Tip:** Before Day 17, remember two lines:\
`Request = Method + URL + Headers + Body`\
`Response = Status Code + Headers + Body`

------------------------------------------------------------------------

## Completion Check

You are ready for Day 17 if you can explain this flow in your own words:

``` text
React
→ HTTP Request
→ API/Server
→ processing and Database access
→ HTTP Response
→ JSON + Status Code
→ React State
→ UI
```

You should also be able to explain why URL, Method, Headers, Body, and
Response appear in `fetch()` code.
