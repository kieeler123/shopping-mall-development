# Day 16 --- STEP 05. URL, Path, Endpoint, and Query Parameters

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

A URL identifies the destination of a Request.

``` text
https://api.myshop.com/orders/10
```

For beginner-level analysis:

``` text
https://api.myshop.com + /orders/10
└──── Base URL ─────┘   └─ Path ─┘
```

An API exposes concrete request points often called **Endpoints**.

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

In documentation, `:id` is a placeholder:

``` text
/orders/:id   ← route template
/orders/10    ← actual path
/orders/53    ← actual path
```

A URL can also contain a Query String:

``` http
GET /orders?status=shipping
```

Here:

``` text
/orders
→ Path

?status=shipping
→ Query String
```

Multiple query parameters are commonly joined with `&`:

``` text
/orders?status=shipping&page=2
```

A path segment often identifies a particular resource, while query
parameters commonly express filters, search terms, sorting, pagination,
or other options. The API contract determines the exact meaning.

**Tip:** Use `Path = which resource?` and
`Query = under what conditions/options?` as a beginner mental model, but
always follow the actual API documentation.

## STEP 05 Key Sentence

The URL identifies the destination; an Endpoint is a concrete API
request point, and Query Parameters can express conditions/options.
