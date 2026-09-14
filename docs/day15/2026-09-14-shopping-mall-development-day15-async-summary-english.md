# Day 15 — JavaScript Asynchronous Programming Summary

## 1. Synchronous Execution

Basic JavaScript code runs from top to bottom.

```ts
console.log("A");
console.log("B");
console.log("C");
```

Output:

```text
A
B
C
```

The default rule is top-to-bottom execution. Asynchronous concepts become necessary when dealing with work whose result arrives later, such as timers or server requests.

> **Tip**
> When tracing execution order, always start with top-to-bottom execution and only change the flow where asynchronous behavior appears.

## 2. setTimeout and Asynchronous Execution

```ts
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

Output:

```text
A
C
B
```

`setTimeout()` itself is called immediately, but the callback you pass to it runs later.

> **Tip**
> `setTimeout execution ≠ callback execution`.

## 3. Callback

A callback is a function passed to another function so that it can be executed at a certain time or event.

```ts
const printOrder = () => {
  console.log("Order");
};

setTimeout(printOrder, 1000);
```

`printOrder` is the function value itself, while `printOrder()` calls the function immediately.

React uses the same idea.

```tsx
<button onClick={handleDelete}>Delete</button>
```

> **Tip**
> Think of `functionName` as the function itself and `functionName()` as calling it now.

## 4. return and undefined

```ts
function getStatus() {
  return "Shipping";
}
```

`return` sends a value back to the caller and ends the current function.

If there is no explicit `return`, the function returns `undefined`.

```ts
function getStatus() {
  console.log("Shipping");
}
```

> **Tip**
> `console.log()` prints a value. `return` gives a value back to the caller.

## 5. Why Ordinary return Is Not Enough for Delayed Results

```ts
function getOrder() {
  setTimeout(() => {
    return "Order data";
  }, 1000);
}

const order = getOrder();
console.log(order);
```

`getOrder()` finishes first and returns `undefined`. The later `return` belongs to the callback itself.

> **Tip**
> In asynchronous code, always ask which function a particular `return` belongs to.

## 6. Promise

A Promise is an object that represents the future result of an asynchronous operation.

```ts
function getOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Order data");
    }, 1000);
  });
}
```

`getOrder()` returns a Promise immediately, while the real result is decided later.

> **Tip**
> Distinguish the Promise object from the eventual value inside the Promise.

## 7. Promise States

| State | Meaning |
|---|---|
| `pending` | The result is not decided yet |
| `fulfilled` | Success |
| `rejected` | Failure |

State transitions:

```text
pending
  ├─→ fulfilled
  └─→ rejected
```

Once settled, a Promise does not change state again.

> **Tip**
> The first effective `resolve` or `reject` determines the final state.

## 8. resolve and reject

```ts
resolve("Order data");
```

This fulfills the Promise.

```ts
reject(new Error("Failed to load"));
```

This rejects the Promise.

Importantly, `resolve()` and `reject()` do not stop the current function.

> **Tip**
> `resolve/reject` settle a Promise; `return` exits the current function.

## 9. The Promise Executor Runs Immediately

```ts
console.log("A");

const promise = new Promise((resolve) => {
  console.log("B");
  resolve("Success");
  console.log("C");
});

console.log("D");
```

Output:

```text
A
B
C
D
```

Creating a Promise does not automatically make every line inside it asynchronous.

> **Tip**
> Do not think of Promise as a tool that automatically turns all code asynchronous.

## 10. async

An `async` function always returns a Promise.

```ts
async function getStatus() {
  return "Shipping";
}
```

This returns a fulfilled Promise.

```ts
async function getStatus() {
  throw new Error("Failed to load");
}
```

This returns a rejected Promise.

```text
return value → fulfilled Promise
throw error  → rejected Promise
```

> **Tip**
> The key definition of `async` is: it always returns a Promise.

## 11. await

`await` pauses the continuation of the current async function until a Promise settles, then gives you the fulfilled value.

```ts
const result = await getOrder();
```

The important point is that JavaScript as a whole does not stop. Only the continuation of the current async function waits.

> **Tip**
> Read `await getOrder()` as: call the function → get a Promise → await it → resume later.

## 12. Multiple await Expressions

```ts
const a = await getA();
const b = await getB();
```

This is sequential.

```text
getA starts
↓
A finishes
↓
getB starts
↓
B finishes
```

If the operations are independent, you can start them first.

```ts
const promiseA = getA();
const promiseB = getB();

const a = await promiseA;
const b = await promiseB;
```

> **Tip**
> Ask whether the second task depends on the first task's result.

## 13. Promise.all()

Use `Promise.all()` when you want to wait for several independent Promises together.

```ts
const [orders, users] = await Promise.all([
  getOrders(),
  getUsers(),
]);
```

The result order follows the input order, not the completion order.

If any Promise rejects, the Promise returned by `Promise.all()` rejects.

> **Tip**
> `Promise.all()` is best suited to operations that do not depend on one another.

## 14. try/catch

```ts
async function loadOrders() {
  try {
    const orders = await getOrders();
    console.log(orders);
  } catch (error) {
    console.log("Failed to load orders");
  }
}
```

If the awaited Promise rejects, normal execution in the `try` block stops and control moves to `catch`.

> **Tip**
> Find the exact line where failure occurs; the remaining statements in the `try` block will not run.

## 15. throw

`throw` raises an error and interrupts the normal execution flow.

```ts
console.log("A");
throw new Error("Failure");
console.log("B");
```

`B` does not run.

| Code | Role | Can later code run? |
|---|---|---|
| `return` | Ends current function | No |
| `resolve(value)` | Fulfills Promise | Yes |
| `reject(error)` | Rejects Promise | Yes |
| `throw error` | Raises an error | Normal flow stops |

> **Tip**
> `reject` changes Promise state; `throw` raises an error and interrupts normal execution.

## 16. Error Object

```ts
const error = new Error("Server connection failed");
```

Common properties:

```text
error.name
error.message
error.stack
```

`throw new Error("Failure")` first creates an Error object and then throws that object.

> **Tip**
> Separate `new Error(...)` from `throw` conceptually.

## 17. catch(error) in TypeScript

TypeScript may require you to confirm that a caught value is actually an Error object.

```ts
try {
  await getOrders();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

> **Tip**
> If TypeScript complains about `error.message`, think of `error instanceof Error`.

## 18. finally

`finally` runs whether the operation succeeds or fails.

```ts
async function loadOrders() {
  setLoading(true);

  try {
    const orders = await getOrders();
    setOrders(orders);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
```

> **Tip**
> `finally` is ideal for cleanup or final steps that must happen in both success and failure cases.

## 19. Execution Order Example

```ts
async function getData() {
  console.log("2");
  throw new Error("Failure");
}

async function test() {
  console.log("1");

  try {
    await getData();
  } catch {
    console.log("3");
  }

  console.log("4");
}

console.log("A");
test();
console.log("B");
```

Output:

```text
A
1
2
B
3
4
```

The key point is that the async function pauses after `await`, allowing outer synchronous code to continue first.

> **Tip**
> Trace execution as: function call → Promise state → await → outer code → resume.

## 20. Putting Everything Together

```ts
async function loadOrders() {
  setLoading(true);

  try {
    const [orders, users] = await Promise.all([
      fetchOrders(),
      fetchUsers(),
    ]);

    setOrders(orders);
    setUsers(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    setLoading(false);
  }
}
```

This example contains most of the core ideas from Day 15.

## Day 15 Concept Map

```text
Asynchronous operation
   ↓
Promise
   ↓
pending
 ├─ resolve → fulfilled
 └─ reject  → rejected
          ↓
         await
      ┌────┴────┐
      ↓         ↓
    success    failure
      ↓         ↓
 use result    catch
      └────┬────┘
           ↓
        finally
```

Inside an `async` function:

```text
return value → fulfilled Promise
throw Error  → rejected Promise
```

## Final 3 Key Sentences

1. A Promise represents a future result.
2. `await` pauses the continuation of the current async function, not all JavaScript.
3. Success leads to `fulfilled`, failure leads to `rejected`, and failures can be handled with `try/catch`.

**Day 15 — Asynchronous Programming Basics: Complete**
