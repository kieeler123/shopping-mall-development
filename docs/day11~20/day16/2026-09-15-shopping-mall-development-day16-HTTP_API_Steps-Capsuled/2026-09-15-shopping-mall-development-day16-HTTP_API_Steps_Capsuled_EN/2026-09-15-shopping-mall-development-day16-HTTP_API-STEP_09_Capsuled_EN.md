# Day 16 --- STEP 09. PATCH and Update

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

PATCH is commonly used for partial modification of a Resource.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

Read it as:

> Change the `status` of order 10 to `shipping`.

The URL and Body have different responsibilities:

``` text
/orders/10
→ Which resource should be changed?

Body
→ What should be changed?
```

A partial update can contain one or several fields. It does not
necessarily mean exactly one field.

Before updating the Database, a Server may perform:

``` text
Authentication
Authorization
Resource existence check
Body validation
Business-rule checks
Database update
```

For example, a business rule may reject an invalid order-state
transition.

PATCH itself does not guarantee idempotency. A patch meaning "set status
to shipping" may have an idempotent effect, while "increment quantity by
one" may not.

**Tip:** Read PATCH as **Target + Changes**: the URL identifies the
target and the Body describes the requested changes.

## STEP 09 Key Sentence

PATCH is commonly used for partial updates: the URL identifies the
target and the Body describes changes.
