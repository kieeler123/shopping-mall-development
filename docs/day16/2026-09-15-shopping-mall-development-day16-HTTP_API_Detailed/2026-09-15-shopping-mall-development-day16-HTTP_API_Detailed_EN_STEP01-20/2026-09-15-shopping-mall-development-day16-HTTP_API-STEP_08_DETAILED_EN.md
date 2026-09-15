# Day 16 --- STEP 08. POST and Create

> **Goal of This Step:** Understand order creation through POST, Request
> Bodies, server validation, 201 Created, and non-idempotency.

------------------------------------------------------------------------

## 0. Where This Step Fits

Day 16 is not a list of unrelated vocabulary. Each Step zooms into one
part of the same architecture.

``` text
User
↓
React Client
↓
HTTP Request
↓
API / Server
↓
Database
↓
HTTP Response
↓
React State
↓
UI
```

The most useful first question for every new term is: **Where does this
concept live in this flow, and what problem does it solve?**

> **Tip**
>
> Before memorizing a definition, classify the concept: Client-side,
> Server-side, Request, Response, data representation, or a larger
> communication rule.

## 1. POST has broader semantics than Create

In a CRUD-style Orders API, creation is commonly expressed with
`POST /orders`.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

The Client's `newOrder` is input, not necessarily the authoritative
final Resource. The Server can validate the product and quantity,
calculate authoritative values, create an ID, choose an initial status,
write to the Database, and return a `createdOrder`.

``` text
newOrder
↓ POST
Server
↓
createdOrder
```

`201 Created` is a common success status for resource creation, but it
is not the only possible successful contract. POST is not safe and is
generally not idempotent; retrying a creation request can create
duplicates unless the API has additional safeguards.

> **Tip**
>
> Separate "what the Client asked to create" from "what the Server
> confirms was created."

## 2. Why CRUD APIs often use POST for Create

In a CRUD-style Orders API, creation is commonly expressed with
`POST /orders`.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

The Client's `newOrder` is input, not necessarily the authoritative
final Resource. The Server can validate the product and quantity,
calculate authoritative values, create an ID, choose an initial status,
write to the Database, and return a `createdOrder`.

``` text
newOrder
↓ POST
Server
↓
createdOrder
```

`201 Created` is a common success status for resource creation, but it
is not the only possible successful contract. POST is not safe and is
generally not idempotent; retrying a creation request can create
duplicates unless the API has additional safeguards.

> **Tip**
>
> Separate "what the Client asked to create" from "what the Server
> confirms was created."

## 3. Why POST /orders

In a CRUD-style Orders API, creation is commonly expressed with
`POST /orders`.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

The Client's `newOrder` is input, not necessarily the authoritative
final Resource. The Server can validate the product and quantity,
calculate authoritative values, create an ID, choose an initial status,
write to the Database, and return a `createdOrder`.

``` text
newOrder
↓ POST
Server
↓
createdOrder
```

`201 Created` is a common success status for resource creation, but it
is not the only possible successful contract. POST is not safe and is
generally not idempotent; retrying a creation request can create
duplicates unless the API has additional safeguards.

> **Tip**
>
> Separate "what the Client asked to create" from "what the Server
> confirms was created."

## 4. What belongs in the Request Body

This concept becomes much easier when you separate **a runtime value**,
**its representation**, and **its position inside an HTTP message**.

``` text
JavaScript value
↓ serialization
JSON text
↓
HTTP Body

HTTP Body containing JSON
↓ parsing
JavaScript value
```

Headers are metadata about the message; they are not the message content
itself. JSON is one possible representation that can appear in a Body.
`Content-Type: application/json` describes the media type of the current
message Body.

A common beginner mistake is to call every object-looking value "JSON."
In JavaScript, `{ id: 10 }` can simply be a runtime object. Only after
serialization are we dealing with JSON text for transmission or storage.

> **Tip**
>
> Whenever you see braces in code, ask: "Is this a JavaScript runtime
> value, serialized JSON text, or content inside an HTTP Body?"

## 5. newOrder is not yet the authoritative Resource

`newOrder is not yet the authoritative Resource` should be understood as
part of one end-to-end communication model rather than as an isolated
definition.

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

The same Path can represent different operations when the Method
changes, and the same endpoint can produce different responses depending
on authentication, input, resource existence, or server processing. HTTP
therefore needs to be read as a combination of message direction,
semantics, destination, metadata, content, and result.

The shopping-order project gives us a concrete reference point: instead
of memorizing a term, ask where it appears during order retrieval,
creation, modification, or deletion.

> **Tip**
>
> After reading this section, explain it using one concrete order
> scenario without looking at the definition.

## 6. Why the Server should not trust a client price

The browser Client and the Server sit on different sides of a trust
boundary. A user can inspect or manipulate Client-side behavior, so
important business rules cannot rely only on React code.

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

The Server and Database are also different roles. The Database stores
and retrieves data; the Server interprets requests, applies rules,
coordinates data access, and constructs responses. Not every endpoint
performs every step above, but this model explains why a Server is more
than "remote localStorage."

> **Tip**
>
> Client-side validation is valuable for UX, but it does not replace
> server-side validation or authorization.

## 7. Parsing

This concept becomes much easier when you separate **a runtime value**,
**its representation**, and **its position inside an HTTP message**.

``` text
JavaScript value
↓ serialization
JSON text
↓
HTTP Body

HTTP Body containing JSON
↓ parsing
JavaScript value
```

Headers are metadata about the message; they are not the message content
itself. JSON is one possible representation that can appear in a Body.
`Content-Type: application/json` describes the media type of the current
message Body.

A common beginner mistake is to call every object-looking value "JSON."
In JavaScript, `{ id: 10 }` can simply be a runtime object. Only after
serialization are we dealing with JSON text for transmission or storage.

> **Tip**
>
> Whenever you see braces in code, ask: "Is this a JavaScript runtime
> value, serialized JSON text, or content inside an HTTP Body?"

## 8. Validation

The browser Client and the Server sit on different sides of a trust
boundary. A user can inspect or manipulate Client-side behavior, so
important business rules cannot rely only on React code.

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

The Server and Database are also different roles. The Database stores
and retrieves data; the Server interprets requests, applies rules,
coordinates data access, and constructs responses. Not every endpoint
performs every step above, but this model explains why a Server is more
than "remote localStorage."

> **Tip**
>
> Client-side validation is valuable for UX, but it does not replace
> server-side validation or authorization.

## 9. Business Logic

The browser Client and the Server sit on different sides of a trust
boundary. A user can inspect or manipulate Client-side behavior, so
important business rules cannot rely only on React code.

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

The Server and Database are also different roles. The Database stores
and retrieves data; the Server interprets requests, applies rules,
coordinates data access, and constructs responses. Not every endpoint
performs every step above, but this model explains why a Server is more
than "remote localStorage."

> **Tip**
>
> Client-side validation is valuable for UX, but it does not replace
> server-side validation or authorization.

## 10. Database creation

The browser Client and the Server sit on different sides of a trust
boundary. A user can inspect or manipulate Client-side behavior, so
important business rules cannot rely only on React code.

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

The Server and Database are also different roles. The Database stores
and retrieves data; the Server interprets requests, applies rules,
coordinates data access, and constructs responses. Not every endpoint
performs every step above, but this model explains why a Server is more
than "remote localStorage."

> **Tip**
>
> Client-side validation is valuable for UX, but it does not replace
> server-side validation or authorization.

## 11. 201 Created

A Status Code is not the whole Response. It is the HTTP-level result
signal contained inside a Response.

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

A `404` Response may still contain a JSON error Body. A `204` is
successful but intentionally has no response Body. This is why
application code must not assume that every successful Response should
be parsed as JSON.

It is also useful to pair the two directions: the **Method** expresses
what the Client is asking for, while the **Status Code** reports how the
Server processed that request.

> **Tip**
>
> Do not memorize status numbers in isolation. Attach each code to a
> concrete order scenario and ask what the React UI should do with that
> result.

## 12. Why createdOrder can differ from newOrder

`Why createdOrder can differ from newOrder` should be understood as part
of one end-to-end communication model rather than as an isolated
definition.

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

The same Path can represent different operations when the Method
changes, and the same endpoint can produce different responses depending
on authentication, input, resource existence, or server processing. HTTP
therefore needs to be read as a combination of message direction,
semantics, destination, metadata, content, and result.

The shopping-order project gives us a concrete reference point: instead
of memorizing a term, ask where it appears during order retrieval,
creation, modification, or deletion.

> **Tip**
>
> After reading this section, explain it using one concrete order
> scenario without looking at the definition.

## 13. Why POST is not safe

In a CRUD-style Orders API, creation is commonly expressed with
`POST /orders`.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

The Client's `newOrder` is input, not necessarily the authoritative
final Resource. The Server can validate the product and quantity,
calculate authoritative values, create an ID, choose an initial status,
write to the Database, and return a `createdOrder`.

``` text
newOrder
↓ POST
Server
↓
createdOrder
```

`201 Created` is a common success status for resource creation, but it
is not the only possible successful contract. POST is not safe and is
generally not idempotent; retrying a creation request can create
duplicates unless the API has additional safeguards.

> **Tip**
>
> Separate "what the Client asked to create" from "what the Server
> confirms was created."

## 14. Why POST is generally not idempotent

In a CRUD-style Orders API, creation is commonly expressed with
`POST /orders`.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

The Client's `newOrder` is input, not necessarily the authoritative
final Resource. The Server can validate the product and quantity,
calculate authoritative values, create an ID, choose an initial status,
write to the Database, and return a `createdOrder`.

``` text
newOrder
↓ POST
Server
↓
createdOrder
```

`201 Created` is a common success status for resource creation, but it
is not the only possible successful contract. POST is not safe and is
generally not idempotent; retrying a creation request can create
duplicates unless the API has additional safeguards.

> **Tip**
>
> Separate "what the Client asked to create" from "what the Server
> confirms was created."

## 15. Reflecting the result in React State

A Server result does not automatically become visible UI. React renders
from its own State, so the Client must process the Response and
synchronize State.

``` text
HTTP Response
↓
check result / process Body
↓
React State
↓
rerender
↓
UI
```

Server-side persistent data and React State are not the same storage.
The Server may be the source of truth for persistent order data, while
React State is the Client-side representation currently driving the
interface.

This is also why server-backed UI often needs more than `orders`: it
needs to distinguish Data, Loading, and Error.

> **Tip**
>
> At the end of every API example, ask: "Which State changes, and what
> should the user see after that State change?"

------------------------------------------------------------------------

## Put It Back into the Complete Order Flow

``` text
React Client
      │
      │ HTTP Request
      │ ├─ Method
      │ ├─ URL / Endpoint
      │ ├─ Headers
      │ └─ Body
      ▼
Orders API / Server
      │
      ├─ Authentication
      ├─ Authorization
      ├─ Parsing
      ├─ Validation
      ├─ Business Logic
      └─ Database
      │
      ▼
HTTP Response
      │ ├─ Status Code
      │ ├─ Headers
      │ └─ Body
      ▼
React
      │
      ├─ Data
      ├─ Loading
      └─ Error
      ▼
State → rerender → UI
```

## Common Misconceptions to Check

Do not reduce **POST and Create** to a single memorized keyword. In
particular, keep these boundaries clear:

``` text
HTTP ≠ API
API ≠ Server
Server ≠ Database
Request ≠ Method
Response ≠ JSON
Body ≠ JSON
Status Code ≠ Response
fetch() ≠ HTTP
```

Not every line is the main topic of this Step, but keeping the complete
boundary map visible prevents one concept from silently replacing
another.

> **Tip**
>
> When two terms feel similar, write one question each term answers. For
> example: `Method → What action is requested?` and
> `Status Code → What was the processing result?`

## Explain It Yourself

Without looking back, answer these questions:

1.  What does **POST and Create** mean in the order project?
2.  Where does it appear in the Request → Server → Response flow?
3.  How does it appear when reading orders?
4.  How does it appear when creating or changing an order?
5.  What common misconception could cause incorrect `fetch()` code?
6.  After the Response arrives, how does React State/UI become involved?

> **Tip**
>
> Try explaining each answer aloud before rereading the section. The
> place where your explanation stops is the place that needs review.

## STEP 08 Checklist

-   [ ] I can explain: Understand order creation through POST, Request
    Bodies, server validation, 201 Created, and non-idempotency.
-   [ ] I can demonstrate it with an Orders API example.
-   [ ] I can distinguish it from neighboring HTTP/API concepts.
-   [ ] I can place it inside Request → Server → Response → State → UI.
-   [ ] I can connect it to Day 15 asynchronous JavaScript or Day 17
    `fetch()` where relevant.

## STEP 08 Key Sentence

> **Understand order creation through POST, Request Bodies, server
> validation, 201 Created, and non-idempotency.**

## Bridge to the Next Step

Put this concept back into the full HTTP round trip before moving on.
The next Step will zoom into the next component using the same sequence:
**why it exists → exact role → order example → common confusion → React
connection**.
