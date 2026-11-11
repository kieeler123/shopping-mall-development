# Day 16 --- STEP 12. HTTP Status Codes

> **Goal of This Step:** Understand 2xx/4xx/5xx and the core codes 200,
> 201, 204, 400, 401, 403, 404, and 500 in context.

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

## 1. Purpose of Status Codes

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

## 2. The 2xx category

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

## 3. 200 OK

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

## 4. 201 Created

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

## 5. 204 No Content

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

## 6. The 4xx category

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

## 7. Why 4xx does not mean frontend developer fault

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

## 8. 400 Bad Request

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

## 9. 401 Unauthorized

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

## 10. 403 Forbidden

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

## 11. Authentication versus Authorization

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

## 12. 404 Not Found

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

## 13. The 5xx category

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

## 14. 500 Internal Server Error

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

## 15. One Endpoint can return different statuses

`One Endpoint can return different statuses` should be understood as
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

## 16. Status versus Body

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

## 17. Connecting status to React UI

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

Do not reduce **HTTP Status Codes** to a single memorized keyword. In
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

1.  What does **HTTP Status Codes** mean in the order project?
2.  Where does it appear in the Request → Server → Response flow?
3.  How does it appear when reading orders?
4.  How does it appear when creating or changing an order?
5.  What common misconception could cause incorrect `fetch()` code?
6.  After the Response arrives, how does React State/UI become involved?

> **Tip**
>
> Try explaining each answer aloud before rereading the section. The
> place where your explanation stops is the place that needs review.

## STEP 12 Checklist

-   [ ] I can explain: Understand 2xx/4xx/5xx and the core codes 200,
    201, 204, 400, 401, 403, 404, and 500 in context.
-   [ ] I can demonstrate it with an Orders API example.
-   [ ] I can distinguish it from neighboring HTTP/API concepts.
-   [ ] I can place it inside Request → Server → Response → State → UI.
-   [ ] I can connect it to Day 15 asynchronous JavaScript or Day 17
    `fetch()` where relevant.

## STEP 12 Key Sentence

> **Understand 2xx/4xx/5xx and the core codes 200, 201, 204, 400, 401,
> 403, 404, and 500 in context.**

## Bridge to the Next Step

Put this concept back into the full HTTP round trip before moving on.
The next Step will zoom into the next component using the same sequence:
**why it exists → exact role → order example → common confusion → React
connection**.
