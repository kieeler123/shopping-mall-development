# Day 16 --- STEP 16. Translate Existing Order CRUD into HTTP

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

The earlier architecture:

``` text
React Component
↓
useOrders
↓
localStorage
```

can evolve into:

``` text
React Component
↓
useOrders
↓
HTTP Request
↓
Orders API
↓
Server
↓
Database
↓
HTTP Response
↓
useOrders
↓
React State
↓
UI
```

The `useOrders` abstraction does not necessarily disappear. Its internal
data-access mechanism can change.

### CRUD mapping

  Existing operation           HTTP
  ---------------------------- ----------------------
  `getOrders()`                `GET /orders`
  `getOrder(id)`               `GET /orders/:id`
  `addOrder(order)`            `POST /orders`
  `updateOrder(id, changes)`   `PATCH /orders/:id`
  `deleteOrder(id)`            `DELETE /orders/:id`

### Read

``` text
getOrders()
↓
GET /orders
↓
200 + JSON
↓
setOrders(data)
↓
UI
```

### Create

``` text
addOrder(newOrder)
↓
POST /orders
↓
Server creates resource
↓
201 + createdOrder
↓
reflect createdOrder in State
```

### Update

``` text
updateOrder(10, changes)
↓
PATCH /orders/10
↓
200 + updatedOrder
↓
update order 10 in State
```

### Delete

``` text
deleteOrder(10)
↓
DELETE /orders/10
↓
204
↓
remove order 10 from State
```

A Database change does not magically update React. The Client must
synchronize its State with the confirmed server result.

**Tip:** Do not abandon your CRUD mental model. Practice **translating**
get/add/update/delete operations into HTTP Requests.

## STEP 16 Key Sentence

Existing CRUD operations can be translated from localStorage access into
HTTP API Requests.
