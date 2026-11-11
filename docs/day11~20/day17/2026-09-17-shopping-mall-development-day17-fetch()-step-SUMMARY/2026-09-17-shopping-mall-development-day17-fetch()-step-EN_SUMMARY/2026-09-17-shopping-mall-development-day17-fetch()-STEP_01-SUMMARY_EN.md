# Day 17 --- STEP 01. localStorage vs API

## Goal of This STEP

Understand the difference between directly reading browser storage and
requesting data from a server API over the network.

## Core Flow

``` text
React → useOrders → fetch() → HTTP Request → Mock API → HTTP Response → React State → UI
```

## Key Code / Expression

``` js
React → useOrders → localStorage
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

> Understand the difference between directly reading browser storage and
> requesting data from a server API over the network.
