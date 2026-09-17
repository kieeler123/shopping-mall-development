# Day 17 --- STEP 13. GET a Specific Order

## Goal of This STEP

Understand Collection `/orders` versus individual Resource
`/orders/:id`, including 200 and 404 responses.

## Core Flow

``` text
exists → 200 + Order / missing → 404
```

## Key Code / Expression

``` js
GET /orders/3
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

> Understand Collection `/orders` versus individual Resource
> `/orders/:id`, including 200 and 404 responses.
