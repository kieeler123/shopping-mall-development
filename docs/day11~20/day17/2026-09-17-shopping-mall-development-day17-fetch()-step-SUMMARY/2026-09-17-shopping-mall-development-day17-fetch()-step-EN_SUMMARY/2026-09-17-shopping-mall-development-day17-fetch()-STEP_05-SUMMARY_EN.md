# Day 17 --- STEP 05. response.json()

## Goal of This STEP

Understand the second asynchronous stage that reads/parses a JSON
Response Body into JavaScript data.

## Core Flow

``` text
Response → response.json() → Promise<Data> → await → Data
```

## Key Code / Expression

``` js
const data = await response.json();
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

> Understand the second asynchronous stage that reads/parses a JSON
> Response Body into JavaScript data.
