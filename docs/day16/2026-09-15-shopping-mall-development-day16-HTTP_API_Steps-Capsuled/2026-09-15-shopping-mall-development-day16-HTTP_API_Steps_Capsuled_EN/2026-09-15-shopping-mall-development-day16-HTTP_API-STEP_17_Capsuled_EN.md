# Day 16 --- STEP 17. Success, Failure, and React State

## Learning Goal

Understand this concept as part of the React → HTTP → API/Server → React
flow, rather than memorizing terminology in isolation.

Receiving a Response does not automatically mean the operation
succeeded.

``` text
Request
↓
Response
├─ 2xx Success
└─ 4xx/5xx failure status
```

### Successful Read

``` text
GET /orders
↓
200 + JSON
↓
process Body
↓
orders data
↓
setOrders(...)
↓
UI
```

### Successful Create

``` text
POST /orders
↓
201 + createdOrder
↓
State update
↓
UI
```

### Successful Delete

``` text
DELETE /orders/10
↓
204 No Content
↓
no JSON Body required
↓
remove order from State
↓
UI
```

A successful Response does not always contain JSON.

### Failure

``` text
GET /orders/999
↓
404
↓
do not treat it as normal order data
↓
Error State
↓
Error UI
```

Server-backed UI often needs three conceptual states:

``` text
Data
Loading
Error
```

Example state shape:

``` js
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

An empty array after a successful request is different from a request
that has not completed yet.

``` text
200 + []
→ successful result with zero orders

pending Request
→ result is not known yet
```

`finally` is often useful later for cleanup such as ending loading
regardless of success or failure.

**Tip:** When designing API-driven UI, ask three questions:
`What data do I show? What do I show while waiting? What do I show on failure?`

## STEP 17 Key Sentence

API-driven React UI should model Data, Loading, and Error rather than
data alone.
