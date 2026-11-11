# Day 17 --- STEP 06. response.ok and HTTP Errors

## Goal of This STEP

Distinguish HTTP 404/500 responses from network-level fetch failures and
understand why `response.ok` must be checked.

## Core Flow

``` text
Response arrives → check response.ok → convert non-2xx to failure flow
```

## Key Code / Expression

``` js
if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
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

> Distinguish HTTP 404/500 responses from network-level fetch failures
> and understand why `response.ok` must be checked.
