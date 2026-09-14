# Day 15 Review Questions — JavaScript Asynchronous Programming

> Open each `<details>` block to check the answer.

## STEP 1

**Q1. What is the output order of the following code?**

```ts
console.log("A");
console.log("B");
console.log("C");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A1.** `A → B → C`. Without asynchronous behavior, JavaScript executes top to bottom.

**Tip:** Start every execution-order problem with top-to-bottom execution.

</details>

## STEP 2

**Q2. What is the output order of the following code?**

```ts
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A2.** `A → C → B`. `setTimeout()` registers the callback for later and the current code continues.

**Tip:** Separate `setTimeout()` being called from its callback being executed.

</details>

## STEP 3

**Q3. What is the difference between `printOrder` and `printOrder()`?**

```ts
const printOrder = () => {
  console.log("주문");
};

setTimeout(printOrder, 1000);
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A3.** `printOrder` passes the function value itself. `printOrder()` calls the function immediately and uses its return value.

**Tip:** Remember: `functionName` is the function; `functionName()` calls it now.

</details>

## STEP 4

**Q4. What does a function without an explicit `return` return?**

```ts
function getStatus() {
  console.log("배송중");
}

const result = getStatus();
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A4.** `undefined`. Printing with `console.log()` and returning a value from a function are different operations.

**Tip:** `console.log = output`; `return = value returned to the caller`.

</details>

## STEP 5

**Q5. Why does `order` not contain `"Order data"`?**

```ts
function getOrder() {
  setTimeout(() => {
    return "주문 데이터";
  }, 1000);
}

const order = getOrder();
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A5.** The outer `getOrder()` finishes first and returns `undefined`. The later `return "Order data"` belongs to the timer callback, not to `getOrder()`.

**Tip:** Always identify which function a `return` belongs to.

</details>

## STEP 6

**Q6. What kind of object is a Promise?**

```ts
function getOrder() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("주문 데이터");
    }, 1000);
  });
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A6.** A Promise is an object representing the future result of an asynchronous operation.

**Tip:** Separate the Promise object from its eventual result.

</details>

## STEP 7

**Q7. Explain the three Promise states and valid state transitions.**

<details><summary><strong>Show answer and explanation</strong></summary>

**A7.** `pending`, `fulfilled`, and `rejected`. A Promise moves from `pending` to either `fulfilled` or `rejected`, and once settled it does not change again.

**Tip:** A Promise starts pending and settles only once.

</details>

## STEP 8

**Q8. Do `resolve()` and `reject()` terminate the current function?**

```ts
new Promise((resolve, reject) => {
  resolve("성공");
  console.log("A");
});
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A8.** No. They settle the Promise but do not automatically terminate the current function. Code after them can still execute if reachable.

**Tip:** `resolve/reject = settle Promise`; `return = exit function`.

</details>

## STEP 9

**Q9. What is the output order and final Promise state?**

```ts
console.log("A");

const promise = new Promise((resolve) => {
  console.log("B");
  resolve("성공");
  console.log("C");
});

console.log("D");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A9.** `A → B → C → D`. The Promise is `fulfilled` with the result `"Success"`. The Promise executor runs immediately during construction.

**Tip:** Creating a Promise does not automatically make all executor code asynchronous.

</details>

## STEP 10

**Q10. What does an `async` function return when it returns an ordinary value?**

```ts
async function getStatus() {
  return "배송중";
}

const result = getStatus();
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A10.** A Promise. Returning `"Shipping"` from an async function produces a fulfilled Promise whose result is `"Shipping"`.

**Tip:** The key rule is: an async function always returns a Promise.

</details>

## STEP 11

**Q11. Does `await` stop all JavaScript execution?**

```ts
async function test() {
  const result = await getOrder();
  console.log(result);
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A11.** No. It pauses the continuation of the current async function; JavaScript as a whole can continue running other code.

**Tip:** Read it as call function → receive Promise → await → resume later.

</details>

## STEP 12

**Q12. Do these two operations run sequentially or start together by default?**

```ts
const a = await getA();
const b = await getB();
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A12.** Sequentially. `getB()` is not called until the first await has completed.

**Tip:** Ask whether the second task depends on the first result.

</details>

## STEP 13

**Q13. When should `Promise.all()` be used, and what happens if one Promise rejects?**

```ts
const [orders, users] = await Promise.all([
  getOrders(),
  getUsers(),
]);
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A13.** Use it for independent Promises that can run together. If one rejects, the Promise returned by `Promise.all()` rejects. Successful results preserve input order.

**Tip:** Check that the operations are independent before using `Promise.all()`.

</details>

## STEP 14

**Q14. If an awaited Promise rejects, what happens to the remaining code inside `try`?**

```ts
try {
  const orders = await getOrders();
  console.log(orders);
  console.log("완료");
} catch (error) {
  console.log("조회 실패");
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A14.** Normal execution of the `try` block stops at the rejected await and control moves to `catch`; later statements in that `try` block do not run.

**Tip:** Locate the exact statement where the failure occurs.

</details>

## STEP 15

**Q15. What is the important difference between `throw` and `reject()`?**

```ts
reject("실패");
console.log("A");

// 비교
throw new Error("실패");
console.log("B");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A15.** `reject()` settles a Promise as rejected but does not itself terminate the current function. `throw` raises an error and interrupts normal execution flow.

**Tip:** `reject = Promise state`; `throw = error + interrupted normal flow`.

</details>

## STEP 16

**Q16. Explain the roles of `new Error("Server connection failed")` and `throw`.**

```ts
throw new Error("서버 연결 실패");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A16.** `new Error(...)` creates an Error object; `throw` throws that object. Common properties include `name`, `message`, and `stack`.

**Tip:** Separate creating the Error object from throwing it.

</details>

## STEP 17

**Q17. How can you safely access `message` from a caught error in TypeScript?**

```ts
try {
  await getOrders();
} catch (error) {
  // ?
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A17.** Check it first, for example with `if (error instanceof Error) { console.log(error.message); }`.

**Tip:** If `error.message` causes a type issue, think `instanceof Error`.

</details>

## STEP 18

**Q18. When does `finally` run, and what is it useful for in React?**

```ts
setLoading(true);

try {
  const orders = await getOrders();
  setOrders(orders);
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A18.** `finally` runs after success or failure. It is useful for cleanup/finalization such as `setLoading(false)`.

**Tip:** Ask whether the cleanup must happen in both success and failure cases.

</details>

## STEP 19

**Q19. Determine the output order.**

```ts
async function getData() {
  console.log("2");
  throw new Error("실패");
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

<details><summary><strong>Show answer and explanation</strong></summary>

**A19.** `A → 1 → 2 → B → 3 → 4`. `getData()` runs synchronously until its throw; because it is async, that failure becomes a rejected Promise. `test()` pauses at await, outer `B` runs, then `test()` resumes in `catch`.

**Tip:** Trace: function call → Promise state → await → outer synchronous code → resume.

</details>

## STEP 20

**Q20. Explain the Day 15 concepts used in this code.**

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

<details><summary><strong>Show answer and explanation</strong></summary>

**A20.** `async` makes the function return a Promise; `Promise.all()` waits for independent Promises together; `await` pauses this function's continuation; `catch` handles failure; `finally` always ends loading. Read the flow as loading → requests → wait → success/failure → cleanup.

**Tip:** Read real code as a workflow, not only as individual syntax.

</details>

## STEP 21

**Q21. What is the output order with `setTimeout(..., 0)`?**

```ts
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A21.** `A → C → B`. Even with 0 ms, the callback gets its turn after the current synchronous code.

**Tip:** `0 ms` does not mean “execute immediately on this line.”

</details>

## STEP 22

**Q22. Does `return "Success"` from the executor fulfill the Promise?**

```ts
const promise = new Promise((resolve) => {
  return "Success";
});
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A22.** No. The executor's ordinary return value is ignored as the Promise result. Without `resolve()`, the Promise remains `pending`.

**Tip:** Promise settlement comes from `resolve/reject`, not the executor's return value.

</details>

## STEP 23

**Q23. What is the final Promise state?**

```ts
new Promise((resolve, reject) => {
  reject("Failure");
  resolve("Success");
});
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A23.** It is `rejected` with reason `"Failure"`. The first settlement determines the final state.

**Tip:** Once settled, later resolve/reject calls cannot change the Promise state.

</details>

## STEP 24

**Q24. What is the output order, and does `C` run?**

```ts
new Promise((resolve) => {
  console.log("A");
  resolve("Success");
  console.log("B");
  return;
  console.log("C");
});
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A24.** `A → B`. `resolve()` does not exit the function, but `return` does, so `C` never runs.

**Tip:** Separate `resolve = settle Promise` from `return = exit current function`.

</details>

## STEP 25

**Q25. Does merely declaring an async function execute its body?**

```ts
async function getOrder() {
  console.log("A");
}
console.log("B");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A25.** No. The function must be called. Only `B` is printed.

**Tip:** `async` changes return behavior; it does not execute a declaration.

</details>

## STEP 26

**Q26. What is the output order, and what is `result`?**

```ts
async function getStatus() {
  console.log("A");
  return "Shipping";
}
console.log("B");
const result = getStatus();
console.log("C");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A26.** `B → A → C`. `result` is a fulfilled Promise whose value is `"Shipping"`.

**Tip:** An async function starts running when called; its body is not automatically deferred.

</details>

## STEP 27

**Q27. Does `result` contain a Promise or the string value?**

```ts
async function getStatus() {
  return "Shipping";
}
async function test() {
  const result = await getStatus();
  console.log(result);
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A27.** It contains `"Shipping"`. `getStatus()` returns a Promise, while `await` gives its fulfilled value.

**Tip:** Separate `function call result = Promise` from `awaited result = fulfilled value`.

</details>

## STEP 28

**Q28. If `getOrder()` completes later, what is the key output order?**

```ts
async function printOrder() {
  console.log("A");
  const result = await getOrder();
  console.log("B");
}
console.log("C");
printOrder();
console.log("D");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A28.** `C → A → D → B`. `printOrder()` yields at await, allowing outer synchronous `D` to run first.

**Tip:** Split the async function into before-await and resumed-after-await sections.

</details>

## STEP 29

**Q29. If each `getOrder()` takes about 2 seconds, roughly how long does this take?**

```ts
await getOrder();
await getOrder();
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A29.** About 4 seconds. The second call starts only after the first await completes.

**Tip:** Check when the second function is actually called.

</details>

## STEP 30

**Q30. When do the two operations start here?**

```ts
const p1 = getOrder();
const p2 = getOrder();
await p1;
await p2;
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A30.** Both start before either await because both functions are called first. If each takes about 2 seconds, total time can be roughly 2 seconds.

**Tip:** For concurrency, look first at when the functions are called.

</details>

## STEP 31

**Q31. Is the result array ordered by completion or by input?**

```ts
const result = await Promise.all([
  getOrder1(), // 2 sec
  getOrder2(), // 1 sec
]);
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A31.** By input order. Even if the second Promise finishes first, results remain `[order1 result, order2 result]`.

**Tip:** Do not confuse completion order with result-array order.

</details>

## STEP 32

**Q32. Why should these not automatically be wrapped in `Promise.all()`?**

```ts
const user = await getUser();
const orders = await getOrders(user.id);
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A32.** `getOrders()` depends on `user.id`, so the second operation cannot start correctly without the first result.

**Tip:** Ask: can B start without A's result?

</details>

## STEP 33

**Q33. What is the output order?**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 Failure");
}
async function test() {
  try {
    console.log("B");
    await getOrder();
    console.log("C");
  } catch {
    console.log("D");
  }
  console.log("E");
}
test();
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A33.** `B → A → D → E`. `C` does not run. The async throw becomes a rejected Promise and the failed await transfers control to catch.

**Tip:** After a failed await, follow the catch path rather than the next normal line.

</details>

## STEP 34

**Q34. How do throws in regular and async functions differ to the caller?**

<details><summary><strong>Show answer and explanation</strong></summary>

**A34.** A regular-function throw raises an error synchronously during the call. An async-function throw rejects the Promise returned by that async function.

**Tip:** When you see throw, first check whether the containing function is async.

</details>

## STEP 35

**Q35. What is the output order?**

```ts
function getOrder() {
  console.log("A");
  throw new Error("조회 Failure");
}
async function test() {
  console.log("B");
  try {
    await getOrder();
  } catch {
    console.log("C");
  }
  console.log("D");
}
console.log("E");
test();
console.log("F");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A35.** `E → B → A → C → D → F`. The regular function throws synchronously during the call, and the surrounding try catches it immediately.

**Tip:** Even with `await`, the expression on its right is evaluated first.

</details>

## STEP 36

**Q36. What is the output order?**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 Failure");
}
async function test() {
  console.log("B");
  try {
    await getOrder();
  } catch {
    console.log("C");
  }
  console.log("D");
}
console.log("E");
test();
console.log("F");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A36.** `E → B → A → F → C → D`. `A` runs immediately, but the async throw rejects the returned Promise, so `test()` yields at await and outer `F` runs first.

**Tip:** Compare directly with the previous regular-function version.

</details>

## STEP 37

**Q37. Does `catch(error)` receive only the string message?**

```ts
try {
  throw new Error("조회 Failure");
} catch (error) {
  // What is error?
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A37.** No. Here it receives the entire thrown Error object; its `error.message` is `"Load failed"`.

**Tip:** `throw new Error(...)` throws the Error object, not only its message.

</details>

## STEP 38

**Q38. When does `finally` run: success or failure?**

```ts
try {
  await getOrders();
} catch (error) {
  console.error(error);
} finally {
  console.log("Cleanup");
}
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A38.** Both. It runs after success and also after failure/catch.

**Tip:** Use finally for cleanup that must happen in both cases.

</details>

## STEP 39

**Q39. Determine the exact output order.**

```ts
async function getOrder() {
  console.log("A");
  throw new Error("조회 Failure");
}
async function test() {
  console.log("B");
  try {
    console.log("C");
    await getOrder();
    console.log("D");
  } catch {
    console.log("E");
  } finally {
    console.log("F");
  }
  console.log("G");
}
console.log("H");
test();
console.log("I");
```

<details><summary><strong>Show answer and explanation</strong></summary>

**A39.** `H → B → C → A → I → E → F → G`. `A` runs during the async call, the throw rejects its Promise, and `test()` yields at await so `I` runs before catch/finally.

**Tip:** Trace: async body starts now + throw rejects + continuation after await resumes later.

</details>

## STEP 40

**Q40. Explain the whole Day 15 asynchronous flow in one sequence.**

<details><summary><strong>Show answer and explanation</strong></summary>

**A40.** `async work → Promise(pending) → resolve/reject → fulfilled/rejected → await → use success value or catch failure → finally cleanup`. In an async function, return becomes a fulfilled result and throw rejects the returned Promise.

**Tip:** Understand Day 15 through two axes: Promise state and execution order.

</details>
