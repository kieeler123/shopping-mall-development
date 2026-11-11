# Day 24 --- Questions, Answers, and Explanations (English)

> **4/4 choices correct.** Question 4's reasoning needs a more precise
> distinction.

## Question 1 --- Fetching during render

``` tsx
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  loadOrders();
  return <OrderList orders={orders} />;
}
```

**Question:** What can go wrong? - ① Every render may trigger a request,
and state updates may cause repeated rendering. - ② React cannot call
ordinary functions. - ③ `useState` cannot store API data.

**Your answer:** ① --- "Repeated rendering can occur."

**Result:** Correct. **Why:**
`loadOrders → setOrders → rerender → loadOrders` may form a cycle.
Render must remain pure. This does not mean every state update always
causes an infinite loop.

**Tip:** Trace the state update back to the render that initiated it.

## Question 2 --- `[userId]`

``` tsx
useEffect(() => { fetchOrders(userId); }, [userId]);
```

**Question:** What happens when `userId` changes from 1 to 2? - ① The
Effect never reruns. - ② After the commit, it reruns and requests the
new user's orders. - ③ The component must be deleted.

**Your answer:** ② --- "The Effect reruns after commit because `userId`
is in the dependency array."

**Result:** Correct. **Refinement:** React compares old and new
dependency values with `Object.is`. The array **declares** reactive
dependencies; it does not "pass `userId` into" the Effect.

**Tip:** Dependencies specify when synchronization needs updating.

## Question 3 --- Function identity

``` tsx
const loadOrders = async () => {
  const res = await fetch("/api/orders");
  setOrders(await res.json());
};
useEffect(() => { void loadOrders(); }, [loadOrders]);
```

**Question:** Why might requests repeat? - ① Calling an async function
inside an Effect is inherently wrong. - ② Each render creates a new
`loadOrders` function reference. - ③ Arrays cannot be state. - ④ The
dependency array automatically memoizes functions.

**Your answer:** ② --- "The function is recreated each render, so the
dependency appears changed."

**Result:** Correct. **Refinement:** The important fact is that the
function is **created in the component body on every render**, not
simply that it is outside the dependency array. Move it inside the
Effect or use `useCallback` when sharing it.

**Tip:** Same source code ≠ same function object.

## Question 4 --- Effect or event handler?

**A:** Fetch orders when the page opens. **B:** Cancel an order when the
user clicks Cancel. - ① Both Effects - ② A: Effect; B: event handler - ③
A: event handler; B: Effect - ④ Both during render

**Your answer:** ② --- "A receives data; B sends data."

**Result:** **Choice correct; explanation needs improvement.**

**Why the explanation is insufficient:** A GET request can be started by
a click, and an Effect can send data. Receiving versus sending is
**not** the rule.

**Model answer:** A synchronizes the page with the relevant orders when
it appears or `userId` changes, so an Effect is appropriate. B is
triggered by the user's explicit click, so an event handler is
appropriate.

**Tip:** Classify by **what triggers the operation**, not HTTP method or
direction.

## Final assessment

-   Correct choices: **4/4**
-   Strengths: render loops, dependency changes, function identity
-   Priority review: **Question 4 --- trigger vs data direction**
-   Next exercise: add `AbortController`, loading, and error state to an
    orders Effect.

**Memory aid:** `render = compute UI` ·
`Effect = external synchronization` · `event handler = user action`.
