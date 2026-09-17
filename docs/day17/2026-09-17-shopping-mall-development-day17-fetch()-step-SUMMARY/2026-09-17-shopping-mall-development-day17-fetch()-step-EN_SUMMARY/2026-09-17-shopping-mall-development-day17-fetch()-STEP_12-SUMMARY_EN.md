# Day 17 --- STEP 12. Error State

## Goal of This STEP

Store HTTP/network failures in React State and connect them to Error UI
while distinguishing Loading/Error/Empty/Data.

## Core Flow

``` text
Failure → Error State → Re-render → Error UI
```

## Key Code / Expression

``` js
catch (error) → setError(...)
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

> Store HTTP/network failures in React State and connect them to Error
> UI while distinguishing Loading/Error/Empty/Data.
