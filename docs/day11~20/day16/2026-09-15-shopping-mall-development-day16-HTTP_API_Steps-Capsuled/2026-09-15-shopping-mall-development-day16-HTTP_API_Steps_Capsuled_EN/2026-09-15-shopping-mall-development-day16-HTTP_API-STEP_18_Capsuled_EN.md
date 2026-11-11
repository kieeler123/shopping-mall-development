# Day 16 --- STEP 18. Full Order Read and Create Round Trip

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

This step connects all concepts from user action to final UI.

## Scenario A: Read Orders

The user opens the order-history page.

``` text
User
↓
React
↓
GET /orders
```

The Request is conceptually:

``` text
Method → GET
Path   → /orders
Body   → normally none
```

If authentication is required, credentials may be carried through
appropriate headers or cookies depending on the architecture.

The Server may perform:

``` text
GET /orders
↓
Authentication / Authorization
↓
process request/query
↓
Business Logic
↓
Database query
```

A successful Response could be:

``` http
200 OK
Content-Type: application/json

[
  { "id": 10, "status": "shipping" },
  { "id": 11, "status": "paid" }
]
```

React then conceptually performs:

``` text
Response
↓
check status
↓
process Body
↓
JavaScript order data
↓
setOrders(data)
↓
rerender
↓
UI
```

Full flow:

``` text
User → React → GET /orders → HTTP Request
→ API/Server → Database
→ 200 + JSON → HTTP Response
→ React State → UI
```

## Scenario B: Create an Order

React may begin with:

``` js
const newOrder = {
  productId: 3,
  quantity: 2,
};
```

Before sending JSON:

``` text
JavaScript Value
↓
JSON.stringify()
↓
JSON Text
```

Request:

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Server processing:

``` text
Authentication / Authorization
↓
JSON Parsing
↓
Validation
↓
Business Logic
↓
Database Insert
```

Successful Response:

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

Then:

``` text
createdOrder
↓
React State
↓
rerender
↓
UI
```

**Tip:** Explain API communication as a complete round trip: **User →
React → Request → Server → Response → State → UI**.

## STEP 18 Key Sentence

HTTP communication is a full round trip from user action to Request,
Server processing, Response, State, and UI.
