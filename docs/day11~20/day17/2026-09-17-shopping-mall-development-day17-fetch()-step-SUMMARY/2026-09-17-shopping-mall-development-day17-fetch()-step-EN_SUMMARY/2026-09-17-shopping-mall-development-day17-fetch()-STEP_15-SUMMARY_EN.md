# Day 17 --- STEP 15. createdOrder

## Goal of This STEP

Understand why State should use the resource actually created and
returned by the server rather than blindly reusing client input.

## Core Flow

``` text
input → Server generates final fields → createdOrder → append to State
```

## Key Code / Expression

``` js
const createdOrder = await response.json();
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

> Understand why State should use the resource actually created and
> returned by the server rather than blindly reusing client input.
