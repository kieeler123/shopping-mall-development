# Day 17 --- STEP 09. /orders API Contract

## Goal of This STEP

Organize the Request/Response agreements for GET/POST/PATCH/DELETE on
the order resource.

## Core Flow

``` text
Method + URL + Headers + Body + Status + Response Body
```

## Key Code / Expression

``` js
GET /orders · GET /orders/:id · POST /orders · PATCH /orders/:id · DELETE /orders/:id
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

> Organize the Request/Response agreements for GET/POST/PATCH/DELETE on
> the order resource.
