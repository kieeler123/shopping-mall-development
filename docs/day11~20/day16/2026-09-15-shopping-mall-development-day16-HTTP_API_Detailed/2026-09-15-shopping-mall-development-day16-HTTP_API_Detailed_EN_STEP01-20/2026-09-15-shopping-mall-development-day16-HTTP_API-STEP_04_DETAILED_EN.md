# Day 16 --- STEP 04. The Structure of an HTTP Request

> **Goal of This Step:** Break an HTTP Request into Method, URL,
> Headers, and Body and understand the responsibility of each part.

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

## 1. Direction of a Request

`Direction of a Request` should be understood as part of one end-to-end
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

## 2. Method

`Method` should be understood as part of one end-to-end communication
model rather than as an isolated definition.

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

## 3. URL

`URL` should be understood as part of one end-to-end communication model
rather than as an isolated definition.

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

## 4. Headers

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

## 5. Body

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

## 6. Breaking down POST /orders

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

## 7. Why typical GET APIs avoid Request Bodies

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

## 8. Body versus JSON

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

## 9. Headers versus Body

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

## 10. Reading a Request in natural language

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

## 11. Connecting the model to fetch options

Network communication takes time, so HTTP work naturally meets
JavaScript's asynchronous programming model.

``` text
fetch()
↓
Promise
↓
pending
↓
HTTP communication
↓
Response-related result or rejection
```

The precise distinction matters: **HTTP itself does not return a
Promise**. `fetch()` is a Browser Web API, and `fetch()` returns a
Promise. `await` waits for that Promise-based operation within the
current async function; it does not freeze the entire browser.

An HTTP `404` or `500` normally still arrives as a Response, so
`fetch()` does not reject merely because the HTTP status is
unsuccessful. A network or transport failure can instead reject the
Promise. This is why `response.ok` and `try/catch` solve different parts
of the problem.

> **Tip**
>
> Keep two failure layers separate: "The Server responded with an
> unsuccessful HTTP status" versus "The asynchronous/network operation
> rejected."

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

Do not reduce **The Structure of an HTTP Request** to a single memorized
keyword. In particular, keep these boundaries clear:

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

1.  What does **The Structure of an HTTP Request** mean in the order
    project?
2.  Where does it appear in the Request → Server → Response flow?
3.  How does it appear when reading orders?
4.  How does it appear when creating or changing an order?
5.  What common misconception could cause incorrect `fetch()` code?
6.  After the Response arrives, how does React State/UI become involved?

> **Tip**
>
> Try explaining each answer aloud before rereading the section. The
> place where your explanation stops is the place that needs review.

## STEP 04 Checklist

-   [ ] I can explain: Break an HTTP Request into Method, URL, Headers,
    and Body and understand the responsibility of each part.
-   [ ] I can demonstrate it with an Orders API example.
-   [ ] I can distinguish it from neighboring HTTP/API concepts.
-   [ ] I can place it inside Request → Server → Response → State → UI.
-   [ ] I can connect it to Day 15 asynchronous JavaScript or Day 17
    `fetch()` where relevant.

## STEP 04 Key Sentence

> **Break an HTTP Request into Method, URL, Headers, and Body and
> understand the responsibility of each part.**

## Bridge to the Next Step

Put this concept back into the full HTTP round trip before moving on.
The next Step will zoom into the next component using the same sequence:
**why it exists → exact role → order example → common confusion → React
connection**.
