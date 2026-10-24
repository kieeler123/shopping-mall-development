# Day 29 — UI State Modeling and Conditional Rendering — Study Summary

Today’s focus was modeling Loading → Error → Empty → Success correctly in React/TSX.

## Core concepts / 핵심 개념 / 重要ポイント

### 1
When `useOrders()` returns an object, use `{ orders, isLoading, error }`. Use `[]` for array-returning hooks such as `useState()`.

**Practical tip:** When `useOrders()` returns an object, use `{ orders, isLoading, error }`. Use `[]` for array-returning hooks such as `useState()`.

### 2
`&&` conditionally renders its right-hand JSX expression. The entire JSX tree still needs to be returned by the component.

**Practical tip:** `&&` conditionally renders its right-hand JSX expression. The entire JSX tree still needs to be returned by the component.

### 3
With early returns, check `Loading → Error → Empty → Success`. Call hooks before conditional returns.

**Practical tip:** With early returns, check `Loading → Error → Empty → Success`. Call hooks before conditional returns.

### 4
The Success condition is `!isLoading && !error && orders.length > 0`; using `error` instead of `!error` reverses the intended behavior.

**Practical tip:** The Success condition is `!isLoading && !error && orders.length > 0`; using `error` instead of `!error` reverses the intended behavior.

### 5
Use the exact component name, prop name, and closing syntax: `<OrderList orders={orders} />`.

**Practical tip:** Use the exact component name, prop name, and closing syntax: `<OrderList orders={orders} />`.

### 6
Separate GET failures (`fetchError`) from PATCH failures (`updateError`) so an update failure does not hide the existing list.

**Practical tip:** Separate GET failures (`fetchError`) from PATCH failures (`updateError`) so an update failure does not hide the existing list.

## Example 1 — `&&` rendering

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

## Example 2 — Early Return

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>Empty</p>;
  return <OrderList orders={orders} />;
}
```

## Example 3 — GET / PATCH error separation

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

## Frequent errors / 반복 오류 / よくあるミス

| Wrong | Correct |
|---|---|
| `const [orders, isLoading, error] = useOrders()` | `const { orders, isLoading, error } = useOrders()` |
| `return {q.code}` | `return <OrderList orders={orders} />` |
| `<OrdersList order={orders}>` | `<OrderList orders={orders} />` |
| `error && orders.length > 0` for Success | `!error && orders.length > 0` |
| JSX expressions outside `return` | `return (<main>...</main>);` |

## Learning record

- Early Return branching and Loading priority were understood.
- Individual `&&` conditions for Loading, Error, and Empty were solved correctly in the final focused test.
- Remaining practice: assemble a complete component with `return`, use object destructuring, and write the Success condition correctly.
- Recorded focused-test results: 17/30, 12/25, and 16/25. These are separate assessments, not a combined grade.

**Practical tip:** Build the entire component, not only a JSX fragment, when a task requests the full component.
