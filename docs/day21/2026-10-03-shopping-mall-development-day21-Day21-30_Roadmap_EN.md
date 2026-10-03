# Day 21--30 --- Long-Term React / Next.js Data Flow Study Plan

> **Main goal:** Understand how data enters from an API, becomes State,
> changes through user events, moves between components, and is
> eventually organized into a complete feature.

------------------------------------------------------------------------

# Big Picture

``` text
Day 21–25
Behavior and mechanics
"How does data move?"

        ↓

Day 26–30
Structure
"How should an app using that data be organized?"
```

------------------------------------------------------------------------

## Day 21 --- Asynchronous Data Flow

**Core question:** How do we fetch data from an API?

Topics:

``` text
Promise
async
await
fetch
Response
response.ok
response.json()
throw
try / catch / finally
```

Core flow:

``` text
API
↓
fetch()
↓
Promise<Response>
↓
await
↓
Response
↓
response.ok
↓
response.json()
↓
Promise<Data>
↓
await
↓
Data
```

**Completion goal:** Explain
`fetch → Promise → await → Response → json → await → Data` in your own
words.

------------------------------------------------------------------------

## Day 22 --- React State Updates and Immutability

**Core question:** How do we manage and change fetched data in React?

Topics:

``` text
useState
setState
re-render
immutability
prevState
spread
map
filter
```

Core flow:

``` text
Data
↓
State
↓
setState
↓
create new State
↓
re-render
↓
UI
```

**Completion goal:** Explain the
`setOrders(prevOrders => prevOrders.map(...))` pattern yourself.

------------------------------------------------------------------------

## Day 23 --- Events and State

**Core question:** How does a user start a State change?

Topics:

``` text
onClick
onChange
event
event handler
function call
State update
```

Core flow:

``` text
user
↓
onClick / onChange
↓
Event
↓
function executes
↓
State changes
↓
re-render
↓
UI changes
```

Project connection:

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

Understand how a browser event reaches the State-changing function.

------------------------------------------------------------------------

## Day 24 --- `useEffect` and External-System Synchronization

**Core question:** When does a component synchronize with an external
system?

Topics:

``` text
render
Effect
useEffect
dependency array
external system
API call
```

Core flow:

``` text
render
↓
useEffect
↓
synchronize with external system
↓
API
↓
State update
↓
re-render
```

Project connection:

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

Do not memorize `useEffect = fetch`. Understand the broader
synchronization role.

------------------------------------------------------------------------

## Day 25 --- Integrating the Data Flow

**Core question:** How do the concepts from Day 21--24 connect inside
one feature?

``` text
API
↓
fetch
↓
Data
↓
State
↓
UI
↓
user Event
↓
function
↓
API update request
↓
updated Data
↓
State update
↓
re-render
↓
UI update
```

**Goal:** Connect async work, State, Events, and Effects as one data
flow rather than isolated concepts.

Day 25 should focus on integration rather than adding many new concepts.

------------------------------------------------------------------------

# After Day 21--25

The main question so far has been:

> **How does data move?**

``` text
API
↓
async work
↓
Data
↓
State
↓
Event
↓
State change
↓
UI
```

Starting Day 26, the question becomes:

> **How should we structure the code that uses this flow?**

------------------------------------------------------------------------

## Day 26 --- Props and Parent/Child Data Flow

**Core question:** How do data and functions move between components?

Topics:

``` text
Parent
Child
Props
passing data
passing functions
child events
```

Flow:

``` text
Parent
↓
data / function
↓
props
↓
Child
```

Then:

``` text
user Event in Child
↓
call function passed by Parent
↓
State changes
↓
re-render
```

Project connection:

``` tsx
<OrderCard
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

Explain why both `order` and `updateOrderStatus` are passed as props.

------------------------------------------------------------------------

## Day 27 --- Component Separation and Responsibility

**Core question:** Which component should own which code?

Topics:

``` text
component responsibility
page
list
card
item
UI separation
```

Example:

``` text
AdminOrdersPage
│
├─ overall page structure
│
├─ OrderCard
│   └─ display one order
│
└─ OrderItemList
    └─ display items in an order
```

**Goal:** Instead of deep architecture patterns, practice asking:

> "Whose responsibility is this code?"

------------------------------------------------------------------------

## Day 28 --- Custom Hooks

**Core question:** How can UI be separated from State and related logic?

Topics:

``` text
Custom Hook
useOrders
State
Effect
fetch
update functions
separating UI and logic
```

Structure:

``` text
Component
→ UI

Custom Hook
→ State
→ Effect
→ API communication
→ update logic
```

Project connection:

``` ts
const {
  orders,
  isLoading,
  error,
  updateOrderStatus,
} = useOrders();
```

First explain why the existing `useOrders()` exists before trying to
create many new hooks.

------------------------------------------------------------------------

## Day 29 --- Modeling UI States

**Core question:** What UI states exist besides "data is available"?

Topics:

``` text
Loading
Error
Empty
Success
conditional rendering
```

Model:

``` text
request in progress
→ Loading

failure
→ Error

success + no data
→ Empty

success + data
→ Success
```

Project connection:

``` tsx
{isLoading && <p>Loading orders...</p>}

{error && <p>Error: {error}</p>}

{!isLoading && !error && orders.length === 0 && (
  <p>No orders.</p>
)}
```

Understand the UI as a system that represents multiple states.

------------------------------------------------------------------------

## Day 30 --- Practical Integration and Refactoring

**Core question:** Can I explain one real feature from beginning to end
using everything learned so far?

Avoid adding lots of new theory.

Analyze the complete order-management flow:

``` text
AdminOrdersPage
↓
useOrders
↓
useEffect
↓
loadOrders
↓
GET API
↓
Order[]
↓
setOrders
↓
re-render
↓
OrderCard
↓
onChange
↓
updateOrderStatus
↓
PATCH API
↓
updatedOrder
↓
setOrders(prev => ...)
↓
map
↓
new Order[]
↓
re-render
↓
UI changes
```

**Completion goal:** Do not merely memorize the code. Explain why each
part exists, where the data moves, and write parts of the feature
yourself.

------------------------------------------------------------------------

# Day 21--30 as One Story

``` text
Day 21
How do I fetch data?
        ↓
Day 22
How do I change fetched data?
        ↓
Day 23
How does the user initiate a change?
        ↓
Day 24
When do I synchronize with an external system?
        ↓
Day 25
How does all of this connect?
        ↓
Day 26
How do components pass data and functions?
        ↓
Day 27
Where should code be separated?
        ↓
Day 28
Where should State and logic live?
        ↓
Day 29
How do I represent Loading / Error / Empty / Success?
        ↓
Day 30
Can I explain and structure a complete real feature?
```

------------------------------------------------------------------------

# Two Chapters

## Part 1 --- Day 21--25: Mechanics

``` text
Async
↓
State
↓
Event
↓
Effect
↓
Integration
```

Question:

> **How does data move?**

## Part 2 --- Day 26--30: Structure

``` text
Props
↓
component responsibility
↓
Custom Hook
↓
UI state modeling
↓
practical refactoring
```

Question:

> **How do we organize an app that uses that data?**

------------------------------------------------------------------------

# Natural Next Step After Day 30

After learning mainly how the Client requests and uses data:

``` text
Client
↓
fetch("/api/orders")
↓
Where does that request go?
↓
Next.js Server / API
```

A later chapter can naturally expand into:

``` text
Route Handler
Request / Response
GET / POST / PATCH / DELETE
dynamic routes
HTTP
DB
complete Server / Client connection
```

------------------------------------------------------------------------

# Operating Principle

The amount studied each day is adjustable.

``` text
keep the overall direction
↓
study one day
↓
check understanding
↓
adjust the next day's depth
```

Especially while learning theory deeply for the first time, prioritize
finding yesterday's concepts again in real code rather than rushing
through the schedule.
