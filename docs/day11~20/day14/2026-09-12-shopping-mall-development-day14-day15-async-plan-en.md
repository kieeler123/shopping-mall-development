# Day 15 --- Async / Await Foundations Study Plan

## Learning Goal

On Day 14, React state and related logic were separated into
`useOrders`. On Day 15, before moving directly into server
communication, learn what **asynchronous JavaScript** means through
small examples.

Core flow for today:

```text
synchronous vs asynchronous execution
↓
Promise
↓
async
↓
await
↓
try / catch
↓
explain the execution flow of an async function
```

> Day 15 does not focus on implementing real API communication yet.
> First, build a clear mental model of asynchronous JavaScript.

---

## STEP 1 --- Understand Synchronous Execution First

Start with the simple model of JavaScript executing statements in
written order.

```ts
console.log("1");
console.log("2");
console.log("3");
```

Result:

```text
1
2
3
```

Use this simple flow as a baseline, then compare what changes when an
operation takes time.

**Tip:** Before memorizing async concepts, predict what the output would
be if the code simply ran in order.

---

## STEP 2 --- Understand Why Asynchronous Processing Is Needed

Real applications contain operations that do not finish immediately.

```text
retrieve orders from a server
read a file
wait for a timer
wait for a save operation
```

If the whole application had to stop until such work finished, the user
experience could suffer.

On Day 15, think of asynchronous processing as a way to handle work
whose result becomes available later.

**Tip:** Do not reduce async to "doing many things at once." Think of it
as handling work whose result is not immediately available.

---

## STEP 3 --- Observe Execution Order with a Small Async Example

Use `setTimeout` to observe execution order.

```ts
console.log("start");

setTimeout(() => {
  console.log("runs later");
}, 1000);

console.log("end");
```

Expected result:

```text
start
end
runs later
```

Even though `setTimeout` appears in the middle of the code, its callback
runs later.

**Tip:** Write down the expected output order before running the code,
then compare it with the actual result.

---

## STEP 4 --- Understand the Role of a Promise

A `Promise` is a JavaScript object used to represent the result of an
asynchronous operation.

At first, focus on its three states rather than complex internals.

```text
pending
→ result not settled yet

fulfilled
→ operation succeeded

rejected
→ operation failed
```

Small example:

```ts
const orderPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("order data");
  }, 1000);
});
```

The key idea is:

`Promise = a representation of a future result that may succeed or fail`

**Tip:** Do not memorize all Promise syntax at once. First remember the
flow `pending → fulfilled/rejected`.

---

## STEP 5 --- Understand `async`

Adding `async` to a function makes it an async function, and an `async`
function always returns a Promise.

```ts
async function loadOrders() {
  return "order data";
}
```

Call:

```ts
const result = loadOrders();
console.log(result);
```

Inspect `result` as a Promise rather than as a plain string.

**Tip:** Do not memorize `async` as "wait." The waiting syntax is
`await`; `async` establishes a Promise-based async function.

---

## STEP 6 --- Understand `await`

`await` lets you pause the continuation of an `async` function until the
awaited Promise settles successfully, without blocking the entire
JavaScript thread.

```ts
function getOrder() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("order data");
    }, 1000);
  });
}

async function loadOrder() {
  const order = await getOrder();
  console.log(order);
}
```

Core structure:

```text
operation returning a Promise
↓
await
↓
resolved result
↓
next code
```

**Tip:** Whenever you see `await`, ask which Promise result the
expression is waiting for.

---

## STEP 7 --- Trace the `async / await` Execution Flow

First, predict the output order of the following code.

```ts
console.log("A");

async function loadOrders() {
  console.log("B");

  const result = await Promise.resolve("orders");

  console.log("C");
  return result;
}

loadOrders();

console.log("D");
```

Expected output:

```text
A
B
D
C
```

The goal is not simply to memorize the answer, but to observe how
execution changes around `await`.

Code before `await` runs immediately when `loadOrders()` is called. The
continuation after `await` runs later, after the current synchronous
work has finished.

**Tip:** Async code can be hard to visualize. Put `console.log()`
statements in several places and observe the execution order.

---

## STEP 8 --- Failed Async Work and `try / catch`

Asynchronous work such as server communication cannot be assumed to
always succeed.

```ts
async function loadOrders() {
  try {
    const orders = await getOrders();
    console.log(orders);
  } catch (error) {
    console.error("Failed to load orders.", error);
  }
}
```

Roles:

```text
try
→ attempt an operation that may succeed or fail

await
→ wait for the async result

catch
→ handle an error
```

If an awaited Promise rejects inside the `try` block, control moves to
the `catch` block.

**Tip:** Think of `try / catch` as a structure that separates the
success path from the failure path.

---

## STEP 9 --- Connect the Concept to the Shopping-Mall Project

Day 15 does not implement the API yet, but imagine that order data will
eventually come from a server.

```text
Current

useOrders
↓
local data / state
↓
AdminOrdersPage


Later

useOrders
↓
async order request
↓
Promise
↓
await
↓
update orders state
↓
AdminOrdersPage
```

This shows how the logic separation from Day 14 can later connect to
asynchronous data handling.

**Tip:** Do not rush into `fetch()`. Day 15 is about understanding how
to wait for and handle async results, not about APIs yet.

---

## STEP 10 --- Day 15 Final Practice

Create a small fake order-request function.

```ts
type SimpleOrder = {
  id: number;
  status: string;
};

function getOrders(): Promise<SimpleOrder[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, status: "payment completed" },
        { id: 2, status: "shipping" },
      ]);
    }, 1000);
  });
}

async function loadOrders() {
  try {
    console.log("order request started");

    const orders = await getOrders();

    console.log("order request completed");
    console.log(orders);
  } catch (error) {
    console.error("order request failed", error);
  }
}

loadOrders();
```

This exercise simulates a server response with `Promise + setTimeout`
instead of using a real server.

**Tip:** Do not just copy the code and stop there. Explain it line by
line: what `getOrders()` returns, what `await` is waiting for, where
execution goes when the operation succeeds, and where it goes when the
operation fails.

---

## Day 15 Completion Checklist

```text
[ ] Explain synchronous vs asynchronous execution in your own words

[ ] Explain why asynchronous processing is needed

[ ] Predict the execution order of a setTimeout example

[ ] Explain what a Promise represents

[ ] Distinguish pending / fulfilled / rejected

[ ] Understand that an async function returns a Promise

[ ] Explain the role of await

[ ] Explain why try / catch is needed

[ ] Handle a small Promise example with async / await

[ ] Explain how Day 14's useOrders could connect to a future async order request
```

**Tip:** Use your ability to explain
`Promise → async → await → try / catch` as the completion criterion
rather than memorizing every syntax detail.

---

## Day 15 in One Sentence

> **Asynchronous processing handles work whose result is not immediately
> available. A Promise represents that future result, `async / await`
> makes the flow easier to express, and `try / catch` handles
> failures.**

The next day will connect this foundation to HTTP and API concepts.
