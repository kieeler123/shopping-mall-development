# Day 16 --- STEP 08. POST and Create

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

In a CRUD-style Orders API, POST is commonly used to create a new
Resource.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

In natural language:

> Create a new order using this input.

The target is usually the collection `/orders` because the new order may
not yet have a server-assigned ID.

The Server should not necessarily save every Client value blindly.

``` text
POST /orders
↓
Authentication
↓
Validation
↓
Business Logic
↓
Database
```

For example, the Server may calculate an authoritative price from
product data rather than trusting a `totalPrice` sent by the browser.

A successful creation commonly returns:

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

The Response may contain server-generated values such as `id`, `status`,
or `createdAt`.

POST is generally not safe and is not guaranteed to be idempotent.
Repeating a creation request may create duplicate resources.

**Tip:** Do not memorize `POST = 201`. POST is the Request Method; 201
is one common successful Response Status for resource creation.

## STEP 08 Key Sentence

POST is commonly used for creation in CRUD-style APIs, often sending
creation input in the Request Body.
