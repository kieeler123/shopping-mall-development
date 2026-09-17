# Day 17 --- STEP 02. What fetch() Is

## Goal of This STEP

Understand that `fetch()` is a Web API rather than a React feature and
returns `Promise<Response>`, not the data itself.

## Core Flow

``` text
fetch() → Promise<Response> → await → Response
```

## Key Code / Expression

``` js
const promise = fetch("/api/orders");
```

## Why It Matters

Do not memorize HTTP vocabulary separately from the code. Locate this
STEP inside the full **Request → Mock API → Response → React State →
UI** round trip.

## Day 15--17 Connection

-   Find Day 15 concepts---Method / URL / Headers / Body / Response /
    Status Code / JSON---in the code.
-   Connect Day 16 Promise / `async` / `await` / `try/catch` to waiting
    and failure handling.
-   Follow the Day 17 result all the way into React State and UI.

> **Tip** Instead of memorizing syntax, explain what is being awaited,
> which HTTP information is moving, and which State changes afterward.

## STEP Key Sentence

> Understand that `fetch()` is a Web API rather than a React feature and
> returns `Promise<Response>`, not the data itself.
