# Day 16 --- STEP 07. GET and Read

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

In CRUD-style APIs, GET is commonly used to retrieve a representation of
a Resource.

``` http
GET /orders
```

means retrieving an order collection.

``` http
GET /orders/10
```

means retrieving a particular order.

Typical Web APIs avoid depending on a GET Request Body and instead use
Paths and Query Parameters.

``` http
GET /orders?status=shipping
```

The server-side work can be much more than a simple database SELECT:

``` text
GET /orders
↓
Server
↓
Authentication
↓
Authorization
↓
process query conditions
↓
Business Logic
↓
Database
↓
shape response data
```

### Safe

GET is **safe** under HTTP semantics. This means the request semantics
do not ask for a change to resource state. The Server may still perform
incidental work such as logging.

### Idempotent

GET is also **idempotent**. Repeating the same GET does not itself
request additional changes to server resource state.

Idempotent does not mean the Response data must always be identical.
Data may change independently between requests.

**Tip:** `Safe` does not mean "secure," and `idempotent` does not mean
"same response every time." Both concepts concern request semantics and
state effects.

## STEP 07 Key Sentence

GET is commonly used for Read operations and is safe and idempotent
under HTTP semantics.
