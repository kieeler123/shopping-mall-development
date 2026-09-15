# Day 16 --- STEP 02. Client and Server

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

Before studying HTTP messages, identify the two sides of the
communication.

A **Client** sends a Request. In this project, the React application
running in the browser is the Client.

``` text
React (Client)
↓
Request
↓
Server
```

A **Server** receives the Request, performs the required work, and sends
a Response.

``` text
Server
├─ interpret request
├─ authenticate when necessary
├─ authorize the operation
├─ validate input
├─ execute business logic
├─ access a database
└─ create a response
```

A Server is not the same thing as a Database. The Database stores,
searches, updates, and deletes data. The Server decides how a request
should be processed and may use the Database as part of that work.

For example:

``` text
GET /orders/10
↓
Server
↓
identify user
↓
check permission
↓
query Database
↓
shape response data
↓
Response
```

The most important directional rule is:

``` text
Client → Request → Server
Client ← Response ← Server
```

**Tip:** Whenever Request and Response become confusing, draw the arrows
first. Direction solves much of the terminology confusion.

## STEP 02 Key Sentence

The Client sends Requests; the Server processes them and returns
Responses.
