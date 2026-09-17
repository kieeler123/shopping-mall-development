# Day 17 --- STEP 04. Response

## Goal of This STEP

Distinguish the HTTP `Response` object returned after `await fetch()`
from the actual order data.

## Core Flow

``` text
HTTP Response → before reading the Body as application data
```

## Key Code / Expression

``` js
response.ok / response.status / response.headers
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

> Distinguish the HTTP `Response` object returned after `await fetch()`
> from the actual order data.
