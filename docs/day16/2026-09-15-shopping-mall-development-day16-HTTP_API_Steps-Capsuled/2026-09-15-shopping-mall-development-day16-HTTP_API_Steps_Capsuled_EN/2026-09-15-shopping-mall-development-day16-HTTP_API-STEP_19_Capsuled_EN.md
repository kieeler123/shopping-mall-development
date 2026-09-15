# Day 16 --- STEP 19. Distinguish the Core HTTP/API Terms

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

The goal of this step is to place similar-looking terms in their correct
positions.

## Full map

``` text
React Client
│
│ HTTP Request
│ ├─ Method
│ ├─ URL / Endpoint
│ ├─ Headers
│ └─ Body (possibly JSON)
▼
API / Server
│
│ processing
▼
Database
│
▼
Server
│
│ HTTP Response
│ ├─ Status Code
│ ├─ Headers
│ └─ Body (possibly JSON)
▼
React
```

### HTTP

Answers: **How do Client and Server communicate?**

It is the communication protocol.

### API

Answers: **What functionality/data is exposed for another program to
use?**

It is the interface/contract.

### Request

The Client → Server message.

### Response

The Server → Client message.

### Method

The action semantics of a Request: GET, POST, PATCH, DELETE, etc.

### Endpoint

A concrete request point exposed by the API. Terminology varies; API
documentation often identifies an operation using Method + URL/path.

### JSON

A text-based data representation. It can be used in a Request Body or
Response Body.

### Status Code

The numeric processing-result signal in a Response.

## Comparison

  Concept       Question it answers
  ------------- ----------------------------------------
  HTTP          How do they communicate?
  API           What functionality/data is exposed?
  Request       What did the Client send?
  Method        What action is requested?
  Endpoint      Where is it sent?
  Header        What metadata accompanies the message?
  Body          What is the actual message content?
  JSON          How is the data represented?
  Response      What did the Server return?
  Status Code   What was the processing result?

## One Request

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3
}
```

``` text
POST         → Method
/orders      → Path/Endpoint target
Content-Type → Header
JSON         → Body representation
whole thing  → HTTP Request
```

Response:

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3
}
```

``` text
201          → Status Code
Content-Type → Response Header
JSON         → Response Body representation
whole thing  → HTTP Response
```

**Tip:** Instead of memorizing definitions separately, label every
component inside one real Request/Response example.

## STEP 19 Key Sentence

HTTP, API, Request, Response, Method, Endpoint, JSON, and Status Code
each occupy different roles in the communication model.
