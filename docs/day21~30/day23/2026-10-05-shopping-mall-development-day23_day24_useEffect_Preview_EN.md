# Day 24 --- `useEffect` and Synchronizing with External Systems

## Core Question

> When does a component synchronize with an external system?

## Topics

``` text
render
Effect
useEffect
dependency array
external systems
API calls
```

## Core Concept

Do not memorize `useEffect` simply as:

``` text
useEffect = fetch
```

Instead, understand it as:

``` text
useEffect
=
a React Hook used to synchronize a component
with an external system
```

Examples of external systems include:

``` text
APIs
servers
browser APIs
timers
event listeners
third-party libraries
network connections
```

> **Tip:** Before asking what belongs inside `useEffect`, ask what
> external system the component needs to synchronize with.

------------------------------------------------------------------------

## Core Flow

``` text
Component Render
↓
Effect Runs
↓
Synchronize with External System
↓
API Call
↓
Receive Data
↓
State Update
↓
Component Re-render
↓
UI Update
```

> **Tip:** Compare Day 23's `Event → State → UI` with Day 24's
> `Render → Effect → External System → State → UI`.

------------------------------------------------------------------------

## Render vs Effect

### Render

Rendering calculates what the UI should look like based on the current
Props and State.

``` text
Props + State
↓
Component Execution
↓
JSX Calculation
↓
UI
```

### Effect

An Effect is used to synchronize the component with something outside
React.

``` text
Render
↓
Effect
↓
Synchronization with External System
```

> **Tip:** Ask whether the code calculates UI or connects React to
> something outside React.

------------------------------------------------------------------------

## Basic `useEffect`

``` tsx
useEffect(() => {
  console.log("Effect runs");
}, []);
```

General structure:

``` tsx
useEffect(() => {
  // Effect logic
}, [dependencies]);
```

The second argument is called the **dependency array**.

> **Tip:** Focus on when synchronization needs to happen again rather
> than memorizing syntax first.

------------------------------------------------------------------------

## Dependency Array

``` tsx
useEffect(() => {
  // ...
}, [value]);
```

When reactive values used by the Effect change, React may need to run
the synchronization again.

Instead of only memorizing:

``` text
[] = once
[value] = when value changes
```

ask:

``` text
Which reactive values does this Effect depend on?
```

> **Tip:** Connect the dependency array to the values actually used by
> the Effect.

------------------------------------------------------------------------

## API Calls and Effects

``` tsx
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

Read the flow as:

``` text
Component renders
↓
Effect runs
↓
loadOrders() runs
↓
Communicate with external API
↓
Receive order data
↓
Update State
↓
Re-render
↓
Update order UI
```

> **Tip:** Do not think `useEffect = API call`; think
> `the API is an external system that the component needs to synchronize with`.

------------------------------------------------------------------------

## Project Connection

``` tsx
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

The important idea is:

``` text
React Component
↕
External System
```

`useEffect` helps synchronize the two.

An API call is only one example of synchronization with an external
system.

> **Tip:** When reading project code, also trace which State is
> eventually updated by `loadOrders()`.

------------------------------------------------------------------------

## Day 24 Goal

When you see:

``` tsx
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

you should be able to explain:

``` text
The component renders.
↓
The Effect synchronizes with an external system.
↓
loadOrders() retrieves the order data.
↓
The data is stored in State.
↓
The State update causes a re-render.
↓
The updated order data appears in the UI.
```

> **Tip:** The key Day 24 question is: **Why does this work belong in an
> Effect rather than during rendering?**
