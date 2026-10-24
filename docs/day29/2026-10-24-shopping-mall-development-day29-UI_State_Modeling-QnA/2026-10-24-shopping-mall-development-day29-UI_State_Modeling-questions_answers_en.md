# Day 29 — UI State Modeling and Conditional Rendering — Questions and Answers

Today’s focus was modeling Loading → Error → Empty → Success correctly in React/TSX.

## Q1. Fix object destructuring for useOrders().

### Solution

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();
  return <p>{orders.length}</p>;
}
```

**Practical tip:** When `useOrders()` returns an object, use `{ orders, isLoading, error }`. Use `[]` for array-returning hooks such as `useState()`.

## Q2. Add the missing return in WelcomePage.

### Solution

```tsx
function WelcomePage() {
  return (
    <main>
      <h1>Welcome</h1>
    </main>
  );
}
```

**Practical tip:** `&&` conditionally renders its right-hand JSX expression. The entire JSX tree still needs to be returned by the component.

## Q3. Render Loading with &&.

### Solution

```tsx
function LoadingPage({ isLoading }: { isLoading: boolean }) {
  return <main>{isLoading && <p>Loading...</p>}</main>;
}
```

**Practical tip:** With early returns, check `Loading → Error → Empty → Success`. Call hooks before conditional returns.

## Q4. Render Error and Empty with &&.

### Solution

```tsx
function StatePage({ orders, isLoading, error }: {
  orders: Order[]; isLoading: boolean; error: string | null;
}) {
  return (
    <main>
      {!isLoading && error && <p>Error: {error}</p>}
      {!isLoading && !error && orders.length === 0 && <p>Empty</p>}
    </main>
  );
}
```

**Practical tip:** The Success condition is `!isLoading && !error && orders.length > 0`; using `error` instead of `!error` reverses the intended behavior.

## Q5. Combine all four UI states using &&.

### Solution

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();

  return (
    <main>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>Error: {error}</p>}
      {!isLoading && !error && orders.length === 0 && <p>Empty</p>}
      {!isLoading && !error && orders.length > 0 && (
        <OrderList orders={orders} />
      )}
    </main>
  );
}
```

**Practical tip:** Use the exact component name, prop name, and closing syntax: `<OrderList orders={orders} />`.

## Additional question — Early Return

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>Empty</p>;
  return <OrderList orders={orders} />;
}
```

## Additional question — Separate fetch and update errors

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, fetchError, updateError, updateOrderStatus } = useOrders();

  if (isLoading) return <p>Loading...</p>;
  if (fetchError) return <p>Fetch error: {fetchError}</p>;

  return (
    <main>
      {updateError && <p role="alert">Update error: {updateError}</p>}
      {orders.length === 0 ? <p>Empty</p> : (
        <div>
          {orders.map(order => (
            <OrderCard key={order.id} order={order}
              onStatusChange={updateOrderStatus} />
          ))}
        </div>
      )}
    </main>
  );
}
```

## Common mistakes

- `const [orders, isLoading, error] = useOrders()` is incorrect **for this object-returning hook**.
- JSX written inside a function but outside `return` is not rendered.
- `return {q.code}` is not the JSX component requested by the exercise.
- `err` is not interchangeable with `error`.
- An opening `(` in JSX conditions needs a closing `)`.

## Test history

| Assessment | Result |
|---|---:|
| `&&` vs Early Return retest | 17/30 |
| React/TSX syntax correction | 12/25 |
| JSX return + `&&` focused retest | 16/25 |
