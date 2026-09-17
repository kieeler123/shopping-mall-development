# Day 17 --- STEP 14. POST

## Goal of This STEP

Understand POST, JSON Headers, and `JSON.stringify()` when creating an
order.

## Core Flow

``` text
JavaScript Object → JSON Request Body → POST
```

## Key Code / Expression

``` js
fetch("/api/orders", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(input) })
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

> Understand POST, JSON Headers, and `JSON.stringify()` when creating an
> order.
