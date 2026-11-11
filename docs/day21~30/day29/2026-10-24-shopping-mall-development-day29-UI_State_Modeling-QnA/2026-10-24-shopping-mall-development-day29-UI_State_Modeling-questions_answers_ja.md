# Day 29 — UI状態モデリングと条件付きレンダリング — 問題と模範解答

今日の中心テーマは、React/TSXで Loading → Error → Empty → Success の4状態を正確に扱うことです。

## Q1. useOrders() のオブジェクト分割代入を修正してください。

### Solution

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();
  return <p>{orders.length}</p>;
}
```

**実践のコツ:** `useOrders()` がオブジェクトを返す場合は `{ orders, isLoading, error }` を使います。`useState()` のように配列を返す場合は `[]` を使います。

## Q2. WelcomePage に不足している return を追加してください。

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

**実践のコツ:** `&&` は条件が真の場合に右側の JSX を表示します。ただし JSX 全体をコンポーネントの `return` で返す必要があります。

## Q3. && で Loading を表示してください。

### Solution

```tsx
function LoadingPage({ isLoading }: { isLoading: boolean }) {
  return <main>{isLoading && <p>Loading...</p>}</main>;
}
```

**実践のコツ:** Early Return は `Loading → Error → Empty → Success` の順で判定します。Hook は条件付き return より前に呼び出します。

## Q4. && で Error と Empty を表示してください。

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

**実践のコツ:** Success の条件は `!isLoading && !error && orders.length > 0` です。`!error` を忘れるとエラー時に一覧を表示する不具合につながります。

## Q5. && で4つのUI状態を統合してください。

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

**実践のコツ:** `<OrderList orders={orders} />` のコンポーネント名、Props 名、自己終了タグを正確に書きます。

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
