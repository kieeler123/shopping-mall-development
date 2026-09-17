# Day 18 --- Review and Realignment: From React + JavaScript Theory to Next.js + TypeScript Practice

## Purpose of Day 18

Pause new material after Day 17 and review how the concepts learned so
far connect to the actual shopping-mall project.

The course originally started with Next.js + TypeScript because the
final goal is a **production-capable web application**. This provided
early exposure to real project structure and type safety, but it also
meant learning React/JavaScript fundamentals while simultaneously
dealing with type design, Next.js conventions, file structure, and
client/server boundaries.

From Day 18 onward, separate the learning layers:

> **Theory and principles → React + JavaScript**\
> **Final project implementation → Next.js + TypeScript**

The previously planned Day 17 STEP 19 (API Layer) and STEP 20 (full
integration) will not be rushed. They will be implemented gradually
after the need for them becomes visible in real code.

------------------------------------------------------------------------

## Shared Day 18 Rule --- Three-Stage Connected Learning

Whenever applicable, each Day 18 review step follows this sequence:

``` text
① React + JavaScript
Understand the principle in its simplest form
        ↓ immediately
② React + TypeScript
Compare what type information is added and why
        ↓ immediately
③ Next.js + TypeScript
Connect it to the real shopping-mall files, types, and structure
        ↓
④ Run and Verify
Confirm behavior in Browser / Network / State / UI
```

The goal is not to study JavaScript for a long period and later "switch"
to TypeScript. The TypeScript version is examined immediately after the
JavaScript principle so both remain one mental model.

Example:

``` js
// ① React + JavaScript — principle
const [orders, setOrders] = useState([]);
```

``` ts
// ② React + TypeScript — same principle + type information
const [orders, setOrders] = useState<Order[]>([]);
```

``` text
useState       → React
Order[]        → TypeScript + shopping-mall domain
Actual location → Next.js project
```

### Exception: Next.js-specific concepts

Do not force every topic into an artificial JavaScript-only version.

-   React-centered concepts such as State, Props, Events, Effects, and
    Custom Hooks → understand first with React + JavaScript
-   Next.js-specific concepts such as App Router, `page.tsx`,
    `layout.tsx`, Route Handlers, and Server/Client Components → learn
    directly in the real Next.js + TypeScript environment

> **Tip** When reading real TSX, separate four layers:
> `React logic / TypeScript types / Next.js conventions / project domain`.
> The Next.js + TypeScript project remains the source of truth;
> JavaScript examples are learning sketches used to expose the
> underlying principle.

------------------------------------------------------------------------

## Learning Flow Going Forward

``` text
Concept / Principle
React + JavaScript
        ↓
Small Example
Verify the mechanism
        ↓
Apply to the real project
Next.js + TypeScript
        ↓
Run the application
        ↓
Verify Browser / Network / State / UI
        ↓
Explain why the code works
```

------------------------------------------------------------------------

## STEP 01 --- Revisit the Overall Project Flow

### Goal

Explain the shopping-mall data flow without rebuilding every file.

``` text
Product
  ↓
Product UI
  ↓
Cart
  ↓
Checkout
  ↓
Order
  ↓
Admin Orders
```

### Review

-   Responsibility of each page and component
-   Where data is created and where it moves
-   How user events cause state changes
-   What data localStorage has been responsible for

> **Tip** Follow one user action through files and state instead of
> memorizing code.

------------------------------------------------------------------------

## STEP 02 --- Review Core JavaScript

### Goal

Separate the JavaScript used inside React from React itself.

### Topics

-   Variables and scope
-   Objects and arrays
-   Destructuring
-   Spread syntax
-   `map`, `filter`, `find`
-   Functions and callbacks
-   Module `import` / `export`
-   Conditions and ternary expressions

> **Tip** When reading React code, identify which parts are ordinary
> JavaScript.

------------------------------------------------------------------------

## STEP 03 --- Review Components and JSX

### Goal

Reconfirm what components are responsible for and how JSX represents UI.

### Questions

-   Why split UI into components?
-   What does it mean for a component function to run again?
-   How do JSX and JavaScript expressions interact?
-   Why is `key` needed when rendering lists with `map()`?

> **Tip** Think of a component as a function that receives input and
> describes UI, not merely as a file.

------------------------------------------------------------------------

## STEP 04 --- Review Props and One-Way Data Flow

### Goal

Explain how data and functions move between parent and child components.

``` text
Parent State
    ↓
   Props
    ↓
  Child

Child Event
    ↓
Callback Props
    ↓
Parent State Change
```

### Project examples

-   `order={order}`
-   `onStatusChange={updateOrderStatus}`

> **Tip** For a Props error, compare what the parent passes with what
> the child expects.

------------------------------------------------------------------------

## STEP 05 --- Review State and Re-rendering

### Goal

Understand how State differs from ordinary variables and how it updates
UI.

``` text
User Action
  ↓
setState
  ↓
State Change
  ↓
Re-render
  ↓
New UI
```

### Topics

-   `useState`
-   Updates based on previous State
-   Array State immutability
-   `map`, `filter`, and spread for State updates

> **Tip** Whenever you see State, find the event or operation that
> changes it.

------------------------------------------------------------------------

## STEP 06 --- Review Events and Forms

### Goal

Trace user input into React data and application behavior.

``` text
User Input
   ↓
Event
   ↓
Handler
   ↓
State
   ↓
Submit
   ↓
Business Action
```

### Topics

-   `onClick`
-   `onChange`
-   Submit handling
-   Connecting input values to State
-   Passing functions as event handlers

> **Tip** For each handler, identify what happened and which State or
> function is affected.

------------------------------------------------------------------------

## STEP 07 --- Review Custom Hooks

### Goal

Understand Custom Hooks as boundaries for state and behavior, not merely
code extraction.

``` text
Component
   ↓
Custom Hook
   ↓
State + Actions
```

### Project connections

-   Cart-related Hooks
-   Order-related Hooks
-   `useOrders`

> **Tip** Start by checking what a Hook returns; that reveals its public
> interface.

------------------------------------------------------------------------

## STEP 08 --- Review the localStorage Data Flow

### Goal

Understand the role and limitations of the previous storage approach
before moving to HTTP APIs.

``` text
React State
    ↕
localStorage
```

### Topics

-   When data is saved
-   When data is loaded
-   JSON serialization/deserialization
-   Browser-storage limitations
-   React State versus persistent data

> **Tip** Do not treat localStorage as inherently bad; understand the
> scale and purpose for which it is appropriate.

------------------------------------------------------------------------

## STEP 09 --- Review the Product → Cart → Order Data Model

### Goal

Understand how core domain data changes as it moves through the shopping
flow.

``` text
Product
   ↓
CartItem
   ↓
Checkout
   ↓
Order
   ↓
OrderItem
```

### Topics

-   Product vs. CartItem
-   CartItem vs. OrderItem
-   Information that must be preserved at order time
-   `OrderStatus`
-   Duplicate domain types

> **Tip** Focus first on what the data means and when it is created,
> rather than only on type names.

------------------------------------------------------------------------

## STEP 10 --- Reframe TypeScript as a Safety Layer over JavaScript

### Goal

Treat TypeScript as type information added to JavaScript logic already
understood.

``` js
function updateStatus(id, status) {
  // JavaScript logic
}
```

``` ts
function updateStatus(
  id: number,
  status: OrderStatus
): void {
  // Same logic + type information
}
```

### Topics

-   Primitive types
-   Object types
-   Union types
-   Props types
-   Function parameter/return types
-   `Promise<T>`
-   Narrowing `unknown`

> **Tip** If TypeScript looks complex, temporarily ignore the
> annotations and read the underlying JavaScript flow first.

------------------------------------------------------------------------

## STEP 11 --- Clarify What Next.js Adds on Top of React

### Goal

Separate React principles from framework-specific features.

### React

-   Component
-   JSX
-   Props
-   State
-   Event
-   Hook
-   Effect

### Next.js

-   App Router
-   `page.tsx`
-   Layout
-   Routing
-   Client/server boundaries
-   Route Handlers
-   Project file conventions

> **Tip** When code is confusing, first classify the problem as React or
> Next.js.

------------------------------------------------------------------------

## STEP 12 --- Review Day 15 HTTP/API Fundamentals

### Goal

Explain the basic browser-server communication model.

``` text
Client
  ↓ Request
Server
  ↓ Response
Client
```

### Topics

-   Method
-   URL
-   Headers
-   Body
-   Response
-   Status Code
-   JSON
-   API Contract

> **Tip** Read HTTP requests in the order Method → URL → Headers → Body
> → Status → Response Body.

------------------------------------------------------------------------

## STEP 13 --- Review Day 16--17 Asynchronous JavaScript

### Goal

Reconnect Promise and async/await to network communication.

``` text
fetch()
  ↓
Promise<Response>
  ↓ await
Response
  ↓
response.json()
  ↓
Promise<Data>
  ↓ await
Data
```

### Topics

-   Promise
-   fulfilled / rejected
-   `async`
-   `await`
-   `throw`
-   `try/catch`
-   Network errors vs. HTTP errors in fetch

> **Tip** Whenever you see `await`, identify the Promise returned by the
> expression immediately after it.

------------------------------------------------------------------------

## STEP 14 --- Review GET / POST / PATCH / DELETE

### Goal

Connect HTTP methods to actual shopping-mall actions.

  Action                Method
  --------------------- --------
  Read orders           GET
  Create an order       POST
  Change order status   PATCH
  Delete an order       DELETE

### Special points

-   JSON Body for POST
-   Partial changes with PATCH
-   DELETE `204 No Content`
-   `response.ok`

> **Tip** Practice translating user actions into HTTP operations instead
> of memorizing methods in isolation.

------------------------------------------------------------------------

## STEP 15 --- Connect HTTP Results to React State

### Goal

Connect the core Day 15--17 material into one UI flow.

``` text
Request
  ↓
API
  ↓
Response
  ↓
JSON
  ↓
React State
  ↓
Re-render
  ↓
UI
```

### UI states

-   Data
-   Loading
-   Error
-   Empty

> **Tip** For server-driven screens, Loading, Error, and Empty are part
> of the UI just as much as the data itself.

------------------------------------------------------------------------

## STEP 16 --- Review useEffect and External-System Synchronization

### Goal

Understand the role of Effects when a component synchronizes with an
API.

### Topics

-   Initial data loading
-   Why the effect callback itself should not be `async`
-   Cleanup
-   Dependencies
-   Additional development executions under Strict Mode

> **Tip** Remember `useEffect` as synchronization with external systems,
> not simply as an API-calling Hook.

------------------------------------------------------------------------

## STEP 17 --- Current Project Code Health Check

### Goal

Review existing code with current knowledge instead of rebuilding
everything.

### Check

-   Duplicate domain types
-   Unused code
-   Props type mismatches
-   State placement
-   Hook responsibilities
-   localStorage dependencies
-   Component responsibilities
-   Consistent import/export usage
-   `.ts` vs `.tsx`

### Rule

Keep code that is fine. Review unclear areas and minimally fix only
issues that block current work.

> **Tip** Do not turn review into a large-scale refactor.

------------------------------------------------------------------------

## STEP 18 --- Confirm Readiness for Real Implementation

### Goal

Confirm that the Day 17 HTTP theory is ready to be transferred into the
Next.js + TypeScript project.

### Flow to explain without code

``` text
AdminOrdersPage
      ↓
useOrders
      ↓
fetch()
      ↓
HTTP Request
      ↓
API
      ↓
HTTP Response
      ↓
React State
      ↓
OrderCard
```

Status update:

``` text
OrderCard
   ↓
updateOrderStatus
   ↓
PATCH
   ↓
API
   ↓
updatedOrder
   ↓
setOrders
   ↓
UI
```

> **Tip** If you can explain these flows without code, you are ready for
> implementation.

------------------------------------------------------------------------

## Completion Criteria for Day 18

Day 18 is about connecting existing knowledge rather than adding many
new features.

You should be able to explain:

-   JavaScript vs. React responsibilities
-   React vs. Next.js responsibilities
-   Relationship between JavaScript and TypeScript
-   Product → Cart → Order data flow
-   Props → Event → State → Re-render flow
-   localStorage architecture vs. HTTP API architecture
-   HTTP Request/Response structure
-   Why Promise and async/await are needed
-   How HTTP results become React State and UI

------------------------------------------------------------------------

## After Day 18

Do not force the previously planned Day 17 topics into Day 18.

``` text
Previously planned
STEP 19 → API Layer
STEP 20 → Full Integration
```

Implement them only after enough real HTTP code exists to reveal
repetition and mixed responsibilities inside `useOrders`.

The next implementation target is:

``` text
GET /api/orders
↓
Inspect the real Response
↓
Update React State
↓
Render the admin order list
↓
PATCH /api/orders/:id
↓
Verify status updates
```

Once the need is clear, introduce:

``` text
Component
   ↓
useOrders
   ↓
ordersApi
   ↓
fetch
   ↓
API
```

------------------------------------------------------------------------

## Learning Principle Going Forward

> **Keep principles simple; make implementation realistic.**

-   Theory: React + JavaScript
-   Small exercises: React + JavaScript
-   Real shopping-mall implementation: Next.js + TypeScript
-   New architecture: introduce it after experiencing the problem it
    solves
-   Completion: code works **and** its reason and data flow can be
    explained
