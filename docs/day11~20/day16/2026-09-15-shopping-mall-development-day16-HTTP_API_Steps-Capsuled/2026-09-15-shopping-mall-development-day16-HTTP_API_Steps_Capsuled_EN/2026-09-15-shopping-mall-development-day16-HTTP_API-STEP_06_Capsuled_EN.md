# Day 16 --- STEP 06. Resource and API

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

A **Resource** is a domain concept or target exposed and managed through
an API.

In a shopping application, examples include:

``` text
products
users
orders
cart
reviews
```

`/orders` can represent an order collection, while `/orders/10` can
represent a particular order.

A Resource does not have to map one-to-one to a database table.

An **API (Application Programming Interface)** is an interface that
allows one program to use another program's functionality or data.

An Orders API might expose:

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

An API is broader than a single URL. Its contract may define:

``` text
Methods
Endpoints
required Headers
Request Body schemas
Response Body schemas
Status Codes
Authentication
Error formats
```

HTTP and API are different concepts:

``` text
HTTP
→ communication protocol

API
→ interface exposing functionality/data

HTTP API
→ an API that uses HTTP for communication
```

APIs are not limited to HTTP. Browser features such as `localStorage`
are also exposed through Web APIs.

**Tip:** Ask two separate questions: `HTTP → How do we communicate?` and
`API → What functionality/data is made available?`

## STEP 06 Key Sentence

A Resource is a domain target; an API is the interface through which
another program uses functionality or data.
