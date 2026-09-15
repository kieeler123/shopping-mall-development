# Day 16 --- STEP 10. DELETE and Delete

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

DELETE requests deletion of a Resource.

``` http
DELETE /orders/10
```

Natural-language meaning:

> Delete order resource 10.

The Method expresses deletion and the Path identifies the target.

Simple deletion APIs often do not need a Request Body because Method +
Path already express the intent. However, do not memorize "DELETE can
never have a Body." Follow the API contract.

The Server may perform:

``` text
DELETE /orders/10
↓
Authentication
↓
Authorization
↓
Resource existence check
↓
Business-rule check
↓
Database operation
↓
Response
```

A common successful Response is:

``` http
204 No Content
```

An API could instead return:

``` http
200 OK
Content-Type: application/json

{
  "deletedId": 10
}
```

If the resource does not exist, `404 Not Found` may be returned.

DELETE is not safe because it requests a state change. It is, however,
idempotent under HTTP semantics. The first request may return 204 and a
repeated request 404, while the intended final state remains "the
resource is absent."

**Tip:** Idempotency does not require identical Status Codes. Focus on
the intended effect on server resource state.

## STEP 10 Key Sentence

DELETE requests resource deletion; it is not safe but is idempotent
under HTTP semantics.
