# Day 16 — HTTP & API Foundations Study Plan

> Day 16 connects the `Promise`, `async`, `await`, and `try/catch` concepts from Day 15 to real server communication.  
> The goal is not to implement `fetch()` in depth yet. The goal is to build a clear mental model of **HTTP requests, responses, and APIs**.

---

## STEP 1 — Why Do We Need HTTP and APIs?

### Learning Goal

Understand the difference between browser-only data and data managed by a real server.

```text
Until now

React
↓
useOrders
↓
localStorage

Going forward

React
↓
HTTP Request
↓
API
↓
Server
↓
Database
```

The central question is:

```text
How does a browser communicate
with a server outside the browser?
```

HTTP provides the core communication rules.

**Tip**

Do not begin by memorizing terminology. Begin with the problem: `How can my React app retrieve order data stored somewhere else?`

---

## STEP 2 — Understand Client and Server

### Learning Goal

Identify who sends the request and who sends the response.

```text
Client
↓ Request
Server

Client
↑ Response
Server
```

In the shopping project, the React application is the Client and a backend providing order data will be the Server.

```text
React
"Give me the orders"
        ↓
      Server
        ↓
"Here are the orders"
```

Core concepts:

- Client: requests a service or data
- Server: receives and processes requests
- Request: information sent from Client to Server
- Response: information returned from Server to Client

**Tip**

Memorize the flow rather than isolated words: `Client → Request → Server → Response → Client`.

---

## STEP 3 — What Is HTTP?

### Learning Goal

Understand HTTP as a communication protocol between Client and Server.

```text
Client
↓
HTTP Request
↓
Server
↓
HTTP Response
↓
Client
```

For Day 16, focus on four questions:

```text
Where is the request going?
What is being requested?
How is it being requested?
What comes back?
```

**Tip**

Do not treat HTTP as the Internet itself. Think of it as a set of rules used to exchange information on the web.

---

## STEP 4 — Understand an HTTP Request

### Learning Goal

Learn the high-level structure of a request.

```text
Request

Method
URL
Headers
Body
```

Example:

```text
POST /orders

Content-Type: application/json

{
  "name": "Kim",
  "totalPrice": 50000
}
```

Conceptually:

```text
Method  → What action?
URL     → Where?
Headers → Additional information about the request
Body    → Actual data being sent
```

Not every request has a Body.

**Tip**

Read a request as four pieces: `action + destination + metadata + data`.

---

## STEP 5 — URL and Endpoint

### Learning Goal

Understand where an API request is sent.

```text
https://example.com/api/orders
```

Conceptually:

```text
Server address
+
API path
```

Examples:

```text
GET    /orders
GET    /orders/10
POST   /orders
PATCH  /orders/10
DELETE /orders/10
```

**Tip**

Do not memorize endpoints as arbitrary strings. Ask which resource each path represents.

---

## STEP 6 — Resource and API

### Learning Goal

Understand the relationship between application resources and an API.

Possible resources in the shopping application:

```text
products
users
orders
cart
```

An API can be understood as an interface through which a Client accesses server data or functionality.

```text
React
↓
Orders API
↓
Order Data
```

Examples:

```text
/orders
/products
/users
```

**Tip**

An API is not merely a server URL. Focus on the idea of an interface exposed to the Client.

---

## STEP 7 — HTTP Method: GET

### Learning Goal

Connect reading data to GET.

```text
Read all orders
↓
GET /orders
```

Specific order:

```text
GET /orders/10
```

CRUD connection:

```text
READ
↓
GET
```

**Tip**

Instead of memorizing `GET`, connect it to the Read operation you already understand.

---

## STEP 8 — HTTP Method: POST

### Learning Goal

Connect creating new data to POST.

```text
Create a new order
↓
POST /orders
```

Example request body:

```json
{
  "name": "Kim",
  "phone": "010-0000-0000",
  "totalPrice": 50000
}
```

CRUD connection:

```text
CREATE
↓
POST
```

**Tip**

With POST, always ask both `What are we creating?` and `What data must the server receive?`

---

## STEP 9 — HTTP Method: PATCH

### Learning Goal

Connect partial updates to PATCH.

For example, changing only an order status:

```text
PATCH /orders/10
```

```json
{
  "status": "shipping"
}
```

CRUD connection:

```text
UPDATE
↓
PATCH
```

**Tip**

Do not go too deeply into PATCH versus PUT yet. For Day 16, connect PATCH to updating part of an existing order.

---

## STEP 10 — HTTP Method: DELETE

### Learning Goal

Connect deletion to DELETE.

```text
DELETE /orders/10
```

CRUD summary:

```text
Create → POST
Read   → GET
Update → PATCH
Delete → DELETE
```

**Tip**

Learn the methods through the CRUD features you already built rather than as four unrelated definitions.

---

## STEP 11 — Understand an HTTP Response

### Learning Goal

Understand what the Server returns after processing a Request.

A Response can contain:

```text
Response

Status Code
Headers
Body
```

Example:

```text
Status: 200

{
  "id": 10,
  "status": "shipping"
}
```

The Client uses the Response to determine the result and obtain data.

**Tip**

Treat Request and Response as a pair. Never stop your mental trace at `request sent`; ask what came back.

---

## STEP 12 — HTTP Status Code Basics

### Learning Goal

Understand that status codes describe the result of request processing.

Important examples for Day 16:

```text
200 OK
→ success

201 Created
→ resource created successfully

400 Bad Request
→ invalid request

401 Unauthorized
→ authentication is required or failed

403 Forbidden
→ insufficient permission

404 Not Found
→ requested resource not found

500 Internal Server Error
→ server-side failure
```

Useful categories:

```text
2xx → success
4xx → client/request-side problem
5xx → server-side problem
```

**Tip**

Do not memorize every HTTP code. Start with `200/201`, `400/401/403/404`, and `500`.

---

## STEP 13 — Understand JSON

### Learning Goal

Understand JSON as a common data-interchange format.

```json
{
  "id": 10,
  "name": "Kim",
  "status": "shipping",
  "totalPrice": 50000
}
```

Arrays can also be represented:

```json
[
  { "id": 1, "status": "paid" },
  { "id": 2, "status": "shipping" }
]
```

JSON resembles JavaScript object syntax, but it is a data format rather than a JavaScript object itself.

**Tip**

Avoid the shortcut `JSON = JavaScript object`. Their appearance is similar, but their roles are different.

---

## STEP 14 — Headers and Content-Type

### Learning Goal

Understand Headers as metadata about a Request or Response.

A common example:

```text
Content-Type: application/json
```

Conceptually:

```text
Body
→ actual data

Headers
→ information describing the communication/data
```

**Tip**

Do not memorize all possible headers. Understanding `Content-Type` is enough for this stage.

---

## STEP 15 — Connect HTTP to Day 15 Async JavaScript

### Learning Goal

Understand why Promise and async/await were learned before HTTP.

A server response is not guaranteed to arrive immediately.

```text
Send Request
↓
wait
↓
Receive Response
```

The future code flow will look conceptually like:

```text
HTTP Request
↓
Promise
↓
await
↓
Response
↓
success handling / failure handling
```

Day 15:

```text
Promise
async
await
try/catch
```

Day 16:

```text
HTTP
Request
Response
API
```

Day 17 will connect them through `fetch()`.

**Tip**

Connect the question `Why did we need await?` to the real situation of waiting for a server response.

---

## STEP 16 — Translate Order CRUD into HTTP

### Learning Goal

Express existing shopping-project operations using HTTP.

```text
Read all orders
→ GET /orders

Read one order
→ GET /orders/:id

Create order
→ POST /orders

Update order status
→ PATCH /orders/:id

Delete order
→ DELETE /orders/:id
```

Full application flow:

```text
UI action
↓
HTTP Request
↓
API
↓
Server processing
↓
HTTP Response
↓
React state update
↓
UI update
```

**Tip**

Do not create unrelated examples. Translate the order features you already know into HTTP language.

---

## STEP 17 — Model Success and Failure

### Learning Goal

Understand that API communication has both successful and unsuccessful paths.

Success:

```text
Request
↓
Server
↓
200 / 201
↓
Response Data
↓
state update
↓
UI
```

Failure:

```text
Request
↓
Server
↓
4xx / 5xx
↓
Error handling
↓
User feedback
```

This gives Day 15's `try/catch` a practical role.

**Tip**

Whenever you study an API flow, draw both the success path and the failure path.

---

## STEP 18 — Full Day 16 Communication Flow

### Learning Goal

Explain the complete HTTP/API picture.

```text
User requests orders
↓
React (Client)
↓
GET /orders
↓
HTTP Request
↓
API / Server
↓
process order data
↓
HTTP Response
↓
Status Code + JSON
↓
React
↓
state
↓
UI
```

For creation:

```text
User creates order
↓
POST /orders
↓
Request Body (JSON)
↓
Server
↓
201 Created
↓
Created Order Response
```

**Tip**

If you can explain these flows without code, you are ready to learn `fetch()`.

---

## STEP 19 — Distinguish Commonly Confused Concepts

### Learning Goal

Separate the terminology clearly.

```text
HTTP
→ communication rules between Client and Server

API
→ interface through which a Client uses server data/functions

Request
→ information sent from Client to Server

Response
→ information returned from Server to Client

Method
→ intended request action

Endpoint
→ target API path

JSON
→ data representation/interchange format

Status Code
→ code describing the request result
```

**Tip**

Instead of memorizing each term independently, locate every concept inside one example such as `GET /orders`.

---

## STEP 20 — Day 16 Review and Completion Criteria

### Final Checklist

```text
1. Explain Client and Server
2. Distinguish Request and Response
3. Explain why HTTP is needed
4. Explain the role of an API
5. Understand URL and Endpoint
6. Connect GET / POST / PATCH / DELETE to CRUD
7. Identify Method / URL / Headers / Body in a Request
8. Identify Status Code / Headers / Body in a Response
9. Understand common 2xx / 4xx / 5xx meanings
10. Explain JSON's role
11. Explain the basic meaning of Content-Type
12. Connect Day 15 async/await to HTTP
13. Express order CRUD as HTTP requests
14. Explain success and failure paths
15. Explain Request → Response → state → UI
```

### Day 16 Completion Standard

You are ready to finish Day 16 when you can explain:

```text
React
↓
HTTP Request
↓
API
↓
Server
↓
HTTP Response
↓
JSON + Status Code
↓
React state
↓
UI
```

Next:

```text
Day 16
HTTP + API Theory
↓
Day 17
fetch() + Mock API
```

**Tip**

The goal is not to become an HTTP expert. It is enough to understand why `fetch()` code contains a URL, method, headers, body, and response.
