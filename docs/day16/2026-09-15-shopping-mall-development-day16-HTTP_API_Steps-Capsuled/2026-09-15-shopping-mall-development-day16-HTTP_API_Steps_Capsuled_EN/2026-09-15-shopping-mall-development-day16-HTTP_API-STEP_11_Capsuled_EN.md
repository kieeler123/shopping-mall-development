# Day 16 --- STEP 11. HTTP Response Structure

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

An HTTP Response is the message the Server sends back to the Client.

``` text
Server
↓
HTTP Response
↓
Client
```

A simplified structure is:

``` text
Response
├─ Status Code
├─ Headers
└─ Body
```

Example:

``` http
200 OK
Content-Type: application/json

{
  "id": 10,
  "status": "shipping"
}
```

### Status Code

`200` is the HTTP-level signal describing the processing result.

### Response Headers

`Content-Type: application/json` is metadata. Here it describes the
media type of the Response Body.

### Response Body

The JSON content is the actual response content.

A Response does not always contain a Body. For example:

``` http
204 No Content
```

is a successful Response with no response body.

The important relationship is:

``` text
Response
├─ Status Code
├─ Headers
└─ Body
    └─ may use JSON
```

**Tip:** On Day 17, when you see `const response = await fetch(...)`, do
not immediately treat `response` as the order data. Think **HTTP
Response first**.

## STEP 11 Key Sentence

An HTTP Response is the Server → Client message containing Status Code,
Headers, and optionally a Body.
