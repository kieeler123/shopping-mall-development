# Day 16 --- STEP 14. Headers and Content-Type

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

Headers carry metadata about an HTTP message.

Examples:

``` http
Content-Type: application/json
Authorization: Bearer ...
Accept: application/json
```

The Body is the actual message content.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Here:

``` text
Content-Type: application/json
→ Header

JSON order content
→ Body
```

### Content-Type

`Content-Type` describes the **media type of the current message Body**.

For a Request:

``` text
Request Content-Type
→ describes Request Body
```

For a Response:

``` text
Response Content-Type
→ describes Response Body
```

The same Header name can therefore appear on both sides while describing
different message bodies.

If Content-Type is missing or incorrect, behavior depends on the API,
server, and framework. A server expecting JSON may reject an unsupported
media type, potentially with a status such as
`415 Unsupported Media Type`, but this is not guaranteed in every
implementation.

### Content-Type vs Accept

``` text
Content-Type
→ media type of this message's Body

Accept
→ response media types the Client can accept/prefer
```

A bodyless message may not need a Content-Type.

**Tip:** Keep three concepts separate: `Headers = metadata`,
`Body = actual content`,
`Content-Type = Header describing the Body's media type`.

## STEP 14 Key Sentence

`Content-Type` is a Header describing the media type of the current
message Body.
