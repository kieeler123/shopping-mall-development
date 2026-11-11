# Day 16 --- STEP 06. Resource and API

> **Goal of This Step:** Understand Resources, APIs, and Endpoints
> hierarchically instead of treating an API as merely a URL.

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

## 1. What is a Resource?

`What is a Resource?` should be understood as part of one end-to-end
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

## 2. The orders collection

`The orders collection` should be understood as part of one end-to-end
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

## 3. An individual Resource

`An individual Resource` should be understood as part of one end-to-end
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

## 4. Resource versus Database table

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

## 5. What is an API?

`What is an API?` should be understood as part of one end-to-end
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

## 6. What an API contract can define

`What an API contract can define` should be understood as part of one
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

## 7. Example Orders API

`Example Orders API` should be understood as part of one end-to-end
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

## 8. API versus Endpoint

`API versus Endpoint` should be understood as part of one end-to-end
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

## 9. API versus Server

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

## 10. What HTTP API means

`What HTTP API means` should be understood as part of one end-to-end
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

## 11. Why localStorage is also an API

`Why localStorage is also an API` should be understood as part of one
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

## 12. A brief note about REST

`A brief note about REST` should be understood as part of one end-to-end
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

Do not reduce **Resource and API** to a single memorized keyword. In
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

1.  What does **Resource and API** mean in the order project?
2.  Where does it appear in the Request → Server → Response flow?
3.  How does it appear when reading orders?
4.  How does it appear when creating or changing an order?
5.  What common misconception could cause incorrect `fetch()` code?
6.  After the Response arrives, how does React State/UI become involved?

> **Tip**
>
> Try explaining each answer aloud before rereading the section. The
> place where your explanation stops is the place that needs review.

## STEP 06 Checklist

-   [ ] I can explain: Understand Resources, APIs, and Endpoints
    hierarchically instead of treating an API as merely a URL.
-   [ ] I can demonstrate it with an Orders API example.
-   [ ] I can distinguish it from neighboring HTTP/API concepts.
-   [ ] I can place it inside Request → Server → Response → State → UI.
-   [ ] I can connect it to Day 15 asynchronous JavaScript or Day 17
    `fetch()` where relevant.

## STEP 06 Key Sentence

> **Understand Resources, APIs, and Endpoints hierarchically instead of
> treating an API as merely a URL.**

## Bridge to the Next Step

Put this concept back into the full HTTP round trip before moving on.
The next Step will zoom into the next component using the same sequence:
**why it exists → exact role → order example → common confusion → React
connection**.
