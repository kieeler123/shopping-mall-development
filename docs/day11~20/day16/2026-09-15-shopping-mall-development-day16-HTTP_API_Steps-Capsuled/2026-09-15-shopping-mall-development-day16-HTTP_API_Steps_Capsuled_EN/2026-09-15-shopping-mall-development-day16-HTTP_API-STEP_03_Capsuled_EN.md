# Day 16 --- STEP 03. What Is HTTP?

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

HTTP stands for **Hypertext Transfer Protocol**. The key word is
*Protocol*: a set of rules used for communication.

``` text
Client
   │
   │ HTTP rules
   ▼
Server
```

HTTP is not the Internet itself, a Server, an API, or JSON.

``` text
HTTP ≠ Internet
HTTP ≠ Server
HTTP ≠ API
HTTP ≠ JSON
```

HTTP defines concepts used to exchange messages. On the Request side,
you will encounter Method, URL, Headers, and Body. On the Response side,
you will encounter Status Code, Headers, and Body.

A simplified order request looks like this:

``` text
React Client
↓
GET /orders
↓
HTTP Request
↓
Server
↓
200 OK + JSON
↓
HTTP Response
↓
React Client
```

HTTP provides the communication semantics and message structure behind
this exchange.

**Tip:** Remember HTTP as **the rules for exchanging messages**, not as
the data being exchanged.

## STEP 03 Key Sentence

HTTP is the communication protocol used to exchange Request and Response
messages.
