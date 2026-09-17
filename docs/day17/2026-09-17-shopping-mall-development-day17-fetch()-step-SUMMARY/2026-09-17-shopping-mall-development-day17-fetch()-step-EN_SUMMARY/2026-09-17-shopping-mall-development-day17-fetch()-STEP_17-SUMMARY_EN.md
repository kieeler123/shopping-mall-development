# Day 17 --- STEP 17. DELETE and 204

## Goal of This STEP

Understand a successful `204 No Content` Response with no Body and
remove the item from State with `filter()`.

## Core Flow

``` text
check response.ok → no JSON parse → setOrders(filter)
```

## Key Code / Expression

``` js
DELETE /orders/:id → 204 No Content
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

> Understand a successful `204 No Content` Response with no Body and
> remove the item from State with `filter()`.
