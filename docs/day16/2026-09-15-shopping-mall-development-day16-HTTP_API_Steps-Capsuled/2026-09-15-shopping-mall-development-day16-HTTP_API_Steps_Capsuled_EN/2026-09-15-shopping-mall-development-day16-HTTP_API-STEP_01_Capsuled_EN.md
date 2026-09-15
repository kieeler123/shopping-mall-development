# Day 16 --- STEP 01. Why HTTP and APIs Are Needed

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

The existing React shopping project stores order data in the browser
through `localStorage`.

``` text
React → useOrders → localStorage
```

This works without communicating with another computer. Once order data
moves to a backend system, the architecture changes.

``` text
React → HTTP Request → API → Server → Database
Database → Server → HTTP Response → React → State → UI
```

The important question is now: **How can a browser application exchange
data with a server?**

HTTP provides communication rules, while an API exposes functionality
and data that the client can use. This is why HTTP and APIs become
necessary when moving from browser-local storage to server-managed data.

A server-backed architecture also introduces waiting time and additional
failure conditions: the network may fail, authentication may be
required, validation may reject input, or the server may encounter an
error. This connects directly to Promise, `async`, `await`, and error
handling from Day 15.

### localStorage vs Server API

  -----------------------------------------------------------------------
  Topic                   localStorage            Server API
  ----------------------- ----------------------- -----------------------
  Data location           Browser                 Server/Database side

  Network communication   No                      Yes

  Typical timing          Synchronous API         Asynchronous network
                                                  flow

  HTTP                    Not used                Commonly used

  Shared data             Local to browser        Can be shared through
                          context                 server

  Failure cases           Relatively limited      Network, auth,
                                                  validation, server
                                                  errors, etc.
  -----------------------------------------------------------------------

**Tip:** Do not think of this as throwing away the old React
application. Think of it as changing the **data-access path** from
`localStorage` to a remote server.

## STEP 01 Key Sentence

Moving from `localStorage` to server-managed data introduces HTTP
communication and an API boundary.
