# Day 16 --- STEP 09. PATCH and Update

> **Goal of This Step:** Understand partial modification by separating
> the target Resource from the requested changes.

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

## 1. The purpose of PATCH

PATCH is commonly used for partial modification. Read the URL and Body
as two different questions.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

``` text
/orders/10 → Which Resource?
Body       → What should change?
```

Partial does not mean "exactly one field." The Server may also reject a
syntactically valid update because a business rule forbids the requested
state transition.

PATCH itself does not guarantee idempotency. "Set status to shipping"
may have an idempotent effect, while "increment quantity by one" may
not.

> **Tip**
>
> Remember PATCH as **Target + Changes**, not as "one-field update."

## 2. Reading PATCH /orders/10

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

## 3. Path equals target

`Path equals target` should be understood as part of one end-to-end
communication model rather than as an isolated definition.

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

## 4. Body equals changes

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

## 5. What partial update means

PATCH is commonly used for partial modification. Read the URL and Body
as two different questions.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

``` text
/orders/10 → Which Resource?
Body       → What should change?
```

Partial does not mean "exactly one field." The Server may also reject a
syntactically valid update because a business rule forbids the requested
state transition.

PATCH itself does not guarantee idempotency. "Set status to shipping"
may have an idempotent effect, while "increment quantity by one" may
not.

> **Tip**
>
> Remember PATCH as **Target + Changes**, not as "one-field update."

## 6. Partial does not mean exactly one field

`Partial does not mean exactly one field` should be understood as part
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

## 7. Server validation

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

## 8. Business rules for state transitions

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

## 9. Returning the updated Resource

PATCH is commonly used for partial modification. Read the URL and Body
as two different questions.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

``` text
/orders/10 → Which Resource?
Body       → What should change?
```

Partial does not mean "exactly one field." The Server may also reject a
syntactically valid update because a business rule forbids the requested
state transition.

PATCH itself does not guarantee idempotency. "Set status to shipping"
may have an idempotent effect, while "increment quantity by one" may
not.

> **Tip**
>
> Remember PATCH as **Target + Changes**, not as "one-field update."

## 10. Response contracts can vary

`Response contracts can vary` should be understood as part of one
end-to-end communication model rather than as an isolated definition.

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

## 11. PATCH and PUT without overcomplicating it

PATCH is commonly used for partial modification. Read the URL and Body
as two different questions.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

``` text
/orders/10 → Which Resource?
Body       → What should change?
```

Partial does not mean "exactly one field." The Server may also reject a
syntactically valid update because a business rule forbids the requested
state transition.

PATCH itself does not guarantee idempotency. "Set status to shipping"
may have an idempotent effect, while "increment quantity by one" may
not.

> **Tip**
>
> Remember PATCH as **Target + Changes**, not as "one-field update."

## 12. PATCH does not guarantee idempotency

PATCH is commonly used for partial modification. Read the URL and Body
as two different questions.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

``` text
/orders/10 → Which Resource?
Body       → What should change?
```

Partial does not mean "exactly one field." The Server may also reject a
syntactically valid update because a business rule forbids the requested
state transition.

PATCH itself does not guarantee idempotency. "Set status to shipping"
may have an idempotent effect, while "increment quantity by one" may
not.

> **Tip**
>
> Remember PATCH as **Target + Changes**, not as "one-field update."

## 13. Set versus increment

`Set versus increment` should be understood as part of one end-to-end
communication model rather than as an isolated definition.

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

## 14. Updating React State

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

Do not reduce **PATCH and Update** to a single memorized keyword. In
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

1.  What does **PATCH and Update** mean in the order project?
2.  Where does it appear in the Request → Server → Response flow?
3.  How does it appear when reading orders?
4.  How does it appear when creating or changing an order?
5.  What common misconception could cause incorrect `fetch()` code?
6.  After the Response arrives, how does React State/UI become involved?

> **Tip**
>
> Try explaining each answer aloud before rereading the section. The
> place where your explanation stops is the place that needs review.

## STEP 09 Checklist

-   [ ] I can explain: Understand partial modification by separating the
    target Resource from the requested changes.
-   [ ] I can demonstrate it with an Orders API example.
-   [ ] I can distinguish it from neighboring HTTP/API concepts.
-   [ ] I can place it inside Request → Server → Response → State → UI.
-   [ ] I can connect it to Day 15 asynchronous JavaScript or Day 17
    `fetch()` where relevant.

## STEP 09 Key Sentence

> **Understand partial modification by separating the target Resource
> from the requested changes.**

## Bridge to the Next Step

Put this concept back into the full HTTP round trip before moving on.
The next Step will zoom into the next component using the same sequence:
**why it exists → exact role → order example → common confusion → React
connection**.
