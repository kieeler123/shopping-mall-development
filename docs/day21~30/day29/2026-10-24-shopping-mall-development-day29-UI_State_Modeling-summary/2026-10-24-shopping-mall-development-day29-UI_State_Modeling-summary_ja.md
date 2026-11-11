# Day 29 — UI状態モデリングと条件付きレンダリング — 総まとめ

今日の中心テーマは、React/TSXで Loading → Error → Empty → Success の4状態を正確に扱うことです。

## Core concepts / 핵심 개념 / 重要ポイント

### 1
`useOrders()` がオブジェクトを返す場合は `{ orders, isLoading, error }` を使います。`useState()` のように配列を返す場合は `[]` を使います。

**実践のコツ:** `useOrders()` がオブジェクトを返す場合は `{ orders, isLoading, error }` を使います。`useState()` のように配列を返す場合は `[]` を使います。

### 2
`&&` は条件が真の場合に右側の JSX を表示します。ただし JSX 全体をコンポーネントの `return` で返す必要があります。

**実践のコツ:** `&&` は条件が真の場合に右側の JSX を表示します。ただし JSX 全体をコンポーネントの `return` で返す必要があります。

### 3
Early Return は `Loading → Error → Empty → Success` の順で判定します。Hook は条件付き return より前に呼び出します。

**実践のコツ:** Early Return は `Loading → Error → Empty → Success` の順で判定します。Hook は条件付き return より前に呼び出します。

### 4
Success の条件は `!isLoading && !error && orders.length > 0` です。`!error` を忘れるとエラー時に一覧を表示する不具合につながります。

**実践のコツ:** Success の条件は `!isLoading && !error && orders.length > 0` です。`!error` を忘れるとエラー時に一覧を表示する不具合につながります。

### 5
`<OrderList orders={orders} />` のコンポーネント名、Props 名、自己終了タグを正確に書きます。

**実践のコツ:** `<OrderList orders={orders} />` のコンポーネント名、Props 名、自己終了タグを正確に書きます。

### 6
GET の失敗（`fetchError`）と PATCH の失敗（`updateError`）を分けると、更新失敗時も既存の注文一覧を維持できます。

**実践のコツ:** GET の失敗（`fetchError`）と PATCH の失敗（`updateError`）を分けると、更新失敗時も既存の注文一覧を維持できます。

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

**実践のコツ:** Build the entire component, not only a JSX fragment, when a task requests the full component.
