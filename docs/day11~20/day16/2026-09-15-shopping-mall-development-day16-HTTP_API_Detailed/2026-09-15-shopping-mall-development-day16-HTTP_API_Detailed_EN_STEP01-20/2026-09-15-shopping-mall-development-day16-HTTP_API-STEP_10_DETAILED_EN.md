# Day 16 --- STEP 10. DELETE and Delete

> **Goal of This Step:** Understand deletion semantics, 204/200
> Responses, authorization checks, and DELETE idempotency.

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

## 1. Reading DELETE /orders/10

In a CRUD-style Orders API, GET commonly expresses a Read operation.

``` http
GET /orders
```

can represent reading the order collection, while:

``` http
GET /orders/10
```

can represent reading one order. GET should not be equated directly with
a database `SELECT`: the Server may authenticate the caller, check
permissions, process query options, apply business logic, query several
data sources, and shape the final response.

Under HTTP semantics GET is safe and idempotent. "Safe" does not mean
cybersecurity-safe, and "idempotent" does not require an identical
Response every time.

> **Tip**
>
> When you see GET, ask both "What is being read?" and "Does this
> request semantics ask the Server to change Resource state?"

## 2. Method and Path can express the intent

`Method and Path can express the intent` should be understood as part of
one end-to-end communication model rather than as an isolated
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

## 3. A precise note about DELETE Bodies

DELETE expresses a request to remove a Resource.

``` http
DELETE /orders/10
```

For simple deletion, Method + Path often express enough intent that no
Request Body is needed, although an API contract may define otherwise.
Successful deletion might return `204 No Content`, or an API might use
`200 OK` with a Body.

DELETE is not safe because it requests a state change. Under HTTP
semantics it is idempotent: the first request might return 204 and a
repeated request 404, while the intended final state remains "the
Resource is absent."

> **Tip**
>
> Idempotency is about the intended state effect, not identical Status
> Codes or identical Response Bodies.

## 4. Authentication

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

## 5. Authorization

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

## 6. Checking whether deletion is allowed

DELETE expresses a request to remove a Resource.

``` http
DELETE /orders/10
```

For simple deletion, Method + Path often express enough intent that no
Request Body is needed, although an API contract may define otherwise.
Successful deletion might return `204 No Content`, or an API might use
`200 OK` with a Body.

DELETE is not safe because it requests a state change. Under HTTP
semantics it is idempotent: the first request might return 204 and a
repeated request 404, while the intended final state remains "the
Resource is absent."

> **Tip**
>
> Idempotency is about the intended state effect, not identical Status
> Codes or identical Response Bodies.

## 7. 404 when the target is absent

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

## 8. 204 No Content

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

## 9. 200 with a Body

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

## 10. DELETE is not the same as 204

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

## 11. Why DELETE is not safe

DELETE expresses a request to remove a Resource.

``` http
DELETE /orders/10
```

For simple deletion, Method + Path often express enough intent that no
Request Body is needed, although an API contract may define otherwise.
Successful deletion might return `204 No Content`, or an API might use
`200 OK` with a Body.

DELETE is not safe because it requests a state change. Under HTTP
semantics it is idempotent: the first request might return 204 and a
repeated request 404, while the intended final state remains "the
Resource is absent."

> **Tip**
>
> Idempotency is about the intended state effect, not identical Status
> Codes or identical Response Bodies.

## 12. Why DELETE is idempotent

DELETE expresses a request to remove a Resource.

``` http
DELETE /orders/10
```

For simple deletion, Method + Path often express enough intent that no
Request Body is needed, although an API contract may define otherwise.
Successful deletion might return `204 No Content`, or an API might use
`200 OK` with a Body.

DELETE is not safe because it requests a state change. Under HTTP
semantics it is idempotent: the first request might return 204 and a
repeated request 404, while the intended final state remains "the
Resource is absent."

> **Tip**
>
> Idempotency is about the intended state effect, not identical Status
> Codes or identical Response Bodies.

## 13. First 204 and later 404

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

## 14. Removing the item from React State

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

Do not reduce **DELETE and Delete** to a single memorized keyword. In
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

1.  What does **DELETE and Delete** mean in the order project?
2.  Where does it appear in the Request → Server → Response flow?
3.  How does it appear when reading orders?
4.  How does it appear when creating or changing an order?
5.  What common misconception could cause incorrect `fetch()` code?
6.  After the Response arrives, how does React State/UI become involved?

> **Tip**
>
> Try explaining each answer aloud before rereading the section. The
> place where your explanation stops is the place that needs review.

## STEP 10 Checklist

-   [ ] I can explain: Understand deletion semantics, 204/200 Responses,
    authorization checks, and DELETE idempotency.
-   [ ] I can demonstrate it with an Orders API example.
-   [ ] I can distinguish it from neighboring HTTP/API concepts.
-   [ ] I can place it inside Request → Server → Response → State → UI.
-   [ ] I can connect it to Day 15 asynchronous JavaScript or Day 17
    `fetch()` where relevant.

## STEP 10 Key Sentence

> **Understand deletion semantics, 204/200 Responses, authorization
> checks, and DELETE idempotency.**

## Bridge to the Next Step

Put this concept back into the full HTTP round trip before moving on.
The next Step will zoom into the next component using the same sequence:
**why it exists → exact role → order example → common confusion → React
connection**.
