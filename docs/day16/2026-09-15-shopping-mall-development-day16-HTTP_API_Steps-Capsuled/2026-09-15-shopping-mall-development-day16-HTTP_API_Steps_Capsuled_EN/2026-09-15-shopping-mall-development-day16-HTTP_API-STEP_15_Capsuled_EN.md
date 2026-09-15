# Day 16 --- STEP 15. HTTP with Promise, async, await, and try/catch

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

HTTP communication introduces waiting:

``` text
React
↓
send Request
↓
Network
↓
Server processing
↓
Database
↓
Response
```

JavaScript therefore handles APIs such as `fetch()` asynchronously.

A crucial distinction:

``` text
HTTP itself
→ is not a JavaScript function returning a Promise

fetch()
→ JavaScript Web API
→ returns a Promise
```

Conceptually:

``` text
fetch()
↓
Promise pending
↓
HTTP communication
↓
Promise settlement
↓
Response or rejection
```

### await

``` js
const response = await fetch("/orders");
```

`await` waits for the Promise-based operation inside the current async
function. It does not freeze the entire browser or UI thread.

### Response vs Data

``` text
response
→ object representing the HTTP Response

data
→ JavaScript value obtained by processing the Response Body
```

Conceptually:

``` js
const response = await fetch("/orders");
const data = await response.json();
```

Reading/parsing the body with `response.json()` is itself asynchronous.

### try/catch

`try/catch` handles thrown exceptions and rejected Promises in an
awaited flow.

However, HTTP error statuses and Promise rejection are not identical.

A server can successfully deliver:

``` text
404 Response
500 Response
```

and `fetch()` normally does not reject merely because of those HTTP
statuses. Therefore applications commonly inspect:

``` js
response.ok
```

or `response.status`.

A network/transport failure can instead cause the Promise to reject.

**Tip:** Separate two layers: `HTTP failure status → inspect Response`;
`network/Promise failure → rejection may reach catch`.

## STEP 15 Key Sentence

`fetch()` returns a Promise; HTTP error statuses and Promise rejection
are separate concepts.
