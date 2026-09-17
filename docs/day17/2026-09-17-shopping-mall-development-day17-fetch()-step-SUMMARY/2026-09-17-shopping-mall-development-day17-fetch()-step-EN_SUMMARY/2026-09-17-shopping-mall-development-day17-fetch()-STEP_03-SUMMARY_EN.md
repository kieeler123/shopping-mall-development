# Day 17 --- STEP 03. GET Request

## Goal of This STEP

Read a basic GET request through Method, URL, Headers, and Body and
connect it to reading the order list.

## Core Flow

``` text
Method: GET / URL: /api/orders / Body: none
```

## Key Code / Expression

``` js
const response = await fetch("/api/orders");
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

> Read a basic GET request through Method, URL, Headers, and Body and
> connect it to reading the order list.
