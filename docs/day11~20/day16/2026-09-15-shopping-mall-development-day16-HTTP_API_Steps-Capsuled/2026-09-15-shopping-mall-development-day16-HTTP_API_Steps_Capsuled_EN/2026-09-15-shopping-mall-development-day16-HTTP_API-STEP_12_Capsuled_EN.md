# Day 16 --- STEP 12. HTTP Status Codes

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

A Status Code is a numeric result signal included in an HTTP Response.

``` text
Request
↓
Server processing
↓
Response
└─ Status Code
```

### 2xx --- Success

``` text
200 OK
→ successful processing

201 Created
→ resource successfully created

204 No Content
→ successful processing with no Response Body
```

200 is not "more successful" than 204.

### 4xx --- Request-side category

Important examples:

``` text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

`400` can be used when a Request does not meet API input requirements.

`401` is commonly associated with missing or invalid authentication
credentials. Despite the wording "Unauthorized," it is useful for
beginners to connect it primarily with authentication.

`403` is commonly used when the requested action is not permitted.

``` text
Authentication
→ Who are you?

Authorization
→ Are you allowed to do this?
```

`404` can mean that an API resource was not found; it is not limited to
missing web pages.

### 5xx --- Server-side processing category

`500 Internal Server Error` signals an unexpected problem during
server-side processing.

### Status + Body

An error Response can still have a JSON Body:

``` http
404 Not Found
Content-Type: application/json

{
  "code": "ORDER_NOT_FOUND",
  "message": "Order not found"
}
```

**Tip:** Do not translate `4xx` into "frontend developer fault" or `5xx`
into "backend developer fault." They are HTTP result categories, not
blame assignments.

## STEP 12 Key Sentence

A Status Code is the HTTP-level signal describing the Server's
processing result.
