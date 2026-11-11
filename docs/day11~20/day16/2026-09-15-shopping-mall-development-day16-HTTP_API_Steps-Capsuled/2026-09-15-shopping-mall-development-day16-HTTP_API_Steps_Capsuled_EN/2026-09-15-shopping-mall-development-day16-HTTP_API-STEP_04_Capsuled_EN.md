# Day 16 --- STEP 04. HTTP Request Structure

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

An HTTP Request is a message sent from the Client to the Server.

``` text
Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

Example:

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

### Method

`POST` expresses the intended action. In a CRUD-style API, POST is
commonly used for creation.

### URL

`/orders` identifies where the Request should be sent.

### Headers

`Content-Type: application/json` is metadata describing the media type
of the Request Body.

### Body

The JSON content contains the actual order input that the Client wants
the Server to process.

Not every Request has a Body. A typical retrieval request can simply be:

``` http
GET /orders
```

A useful reading formula is:

``` text
Method  → What action?
URL     → Where?
Headers → With what metadata?
Body    → With what content/data?
```

**Tip:** When `fetch(url, options)` appears on Day 17, map its pieces
back to these HTTP Request components instead of memorizing JavaScript
syntax in isolation.

## STEP 04 Key Sentence

An HTTP Request contains information such as Method, URL, Headers, and
optionally a Body.
