# Day 17 --- STEP 18. HTTP Refactor of useOrders

## Goal of This STEP

Understand responsibility separation when the internal data source
changes from localStorage to HTTP while preserving the component-facing
interface.

## Core Flow

``` text
The page expresses what; the Hook handles how data is read/changed
```

## Key Code / Expression

``` js
Component → useOrders → fetch → API
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

> Understand responsibility separation when the internal data source
> changes from localStorage to HTTP while preserving the
> component-facing interface.
