# Day 16 --- STEP 20. Day 16 Final Understanding Check

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

The goal is not to memorize an HTTP textbook. The goal is to be ready to
understand why `fetch()` contains URL, Method, Headers, Body, and
Response handling.

## Core Client-Server Flow

``` text
Client
↓ Request
Server
↓ Response
Client
```

Applied to the project:

``` text
User
↓
React (Client)
↓
HTTP Request
↓
Orders API / Server
↓
Database
↓
HTTP Response
↓
React State
↓
UI
```

## Request Structure

``` text
HTTP Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

Read it with questions:

``` text
Method  → What action?
URL     → Where?
Headers → What metadata?
Body    → What content?
```

## Response Structure

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

## CRUD-style Orders API

``` text
POST   /orders      → Create
GET    /orders      → Read collection
GET    /orders/:id  → Read one
PATCH  /orders/:id  → Update
DELETE /orders/:id  → Delete
```

These are common CRUD-style conventions, not a rule that every HTTP API
must follow exactly.

## Status Categories

``` text
2xx → Success
4xx → Request-side category
5xx → Server-side processing category
```

Important examples:

``` text
200 → success
201 → resource created
204 → success, no Body
400 → invalid/bad request situations
401 → authentication-related
403 → authorization/permission-related
404 → resource not found
500 → unexpected server processing error
```

## JSON Flow

``` text
JavaScript Value
↓ JSON.stringify()
JSON Text
↓ HTTP Request Body
Server
```

On the way back, a JSON Response Body can be parsed into a JavaScript
value.

``` text
JSON ≠ JavaScript Object
JSON ≠ HTTP
JSON ≠ Response
```

## Connect Day 15

``` text
fetch()
↓
Promise
↓
await
↓
HTTP Response
↓
check response.ok/status
↓
process Body
↓
Data
```

Remember:

``` text
HTTP 404/500
≠ automatic Promise rejection

Network/transport failure
→ may reject Promise
```

## Connect React UI

``` text
Request starts
↓
Loading
↓
Response
├─ Success → Data → State → UI
└─ Failure → Error State → Error UI
↓
Loading ends
```

## Preview Day 17 Code

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

Map it back to HTTP:

``` text
/orders          → URL
POST             → Method
headers          → Request Headers
Content-Type     → describes Body media type
body             → Request Body
JSON.stringify() → serialize JS value into JSON text
await            → wait for Promise-based async result
response         → object representing HTTP Response
```

If you understand *why* each of these pieces exists, Day 16 has achieved
its purpose.

**Tip:** Before Day 17, keep two formulas clear:

``` text
Request = Method + URL + Headers + Body
Response = Status Code + Headers + Body
```

## STEP 20 Key Sentence

You are ready for `fetch()` when its URL, Method, Headers, Body, and
Response handling can be explained using HTTP concepts.
