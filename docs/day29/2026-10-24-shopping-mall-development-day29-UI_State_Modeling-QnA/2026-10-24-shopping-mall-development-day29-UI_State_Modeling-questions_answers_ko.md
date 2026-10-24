# Day 29 — UI 상태 모델링과 조건부 렌더링 — 문제와 정답

오늘 학습한 React/TSX의 핵심은 Loading → Error → Empty → Success 상태를 정확히 구분하는 것입니다.

## Q1. 객체 구조 분해를 올바르게 작성하세요.

### Solution

```tsx
function AdminOrdersPage() {
  const { orders, isLoading, error } = useOrders();
  return <p>{orders.length}</p>;
}
```

**실전 팁:** `useOrders()`가 객체를 반환한다면 `{ orders, isLoading, error }`를 사용합니다. `useState()`처럼 배열을 반환할 때만 `[]`를 사용합니다.

## Q2. WelcomePage에 빠진 return을 추가하세요.

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

**실전 팁:** `&&`는 JSX 안에서 조건이 참일 때만 오른쪽 요소를 표시합니다. JSX 전체는 반드시 컴포넌트의 `return`에 포함해야 합니다.

## Q3. Loading 상태를 &&로 표시하세요.

### Solution

```tsx
function LoadingPage({ isLoading }: { isLoading: boolean }) {
  return <main>{isLoading && <p>Loading...</p>}</main>;
}
```

**실전 팁:** Early Return은 `Loading → Error → Empty → Success` 순서로 검사합니다. Hook은 조건부 반환보다 먼저 호출합니다.

## Q4. Error와 Empty 상태를 &&로 표시하세요.

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

**실전 팁:** Success 조건은 `!isLoading && !error && orders.length > 0`입니다. `error`를 넣으면 오류 상황에서 목록이 나타나는 버그가 생깁니다.

## Q5. 네 가지 UI 상태를 &&로 통합하세요.

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

**실전 팁:** `<OrderList orders={orders} />`에서 컴포넌트명, Props 이름, 자체 종료 태그를 모두 정확히 작성합니다.

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
