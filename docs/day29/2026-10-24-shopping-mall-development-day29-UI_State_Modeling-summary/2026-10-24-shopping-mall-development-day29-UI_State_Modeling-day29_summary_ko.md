# Day 29 — UI 상태 모델링과 조건부 렌더링 — 총정리

오늘 학습한 React/TSX의 핵심은 Loading → Error → Empty → Success 상태를 정확히 구분하는 것입니다.

## Core concepts / 핵심 개념 / 重要ポイント

### 1
`useOrders()`가 객체를 반환한다면 `{ orders, isLoading, error }`를 사용합니다. `useState()`처럼 배열을 반환할 때만 `[]`를 사용합니다.

**실전 팁:** `useOrders()`가 객체를 반환한다면 `{ orders, isLoading, error }`를 사용합니다. `useState()`처럼 배열을 반환할 때만 `[]`를 사용합니다.

### 2
`&&`는 JSX 안에서 조건이 참일 때만 오른쪽 요소를 표시합니다. JSX 전체는 반드시 컴포넌트의 `return`에 포함해야 합니다.

**실전 팁:** `&&`는 JSX 안에서 조건이 참일 때만 오른쪽 요소를 표시합니다. JSX 전체는 반드시 컴포넌트의 `return`에 포함해야 합니다.

### 3
Early Return은 `Loading → Error → Empty → Success` 순서로 검사합니다. Hook은 조건부 반환보다 먼저 호출합니다.

**실전 팁:** Early Return은 `Loading → Error → Empty → Success` 순서로 검사합니다. Hook은 조건부 반환보다 먼저 호출합니다.

### 4
Success 조건은 `!isLoading && !error && orders.length > 0`입니다. `error`를 넣으면 오류 상황에서 목록이 나타나는 버그가 생깁니다.

**실전 팁:** Success 조건은 `!isLoading && !error && orders.length > 0`입니다. `error`를 넣으면 오류 상황에서 목록이 나타나는 버그가 생깁니다.

### 5
`<OrderList orders={orders} />`에서 컴포넌트명, Props 이름, 자체 종료 태그를 모두 정확히 작성합니다.

**실전 팁:** `<OrderList orders={orders} />`에서 컴포넌트명, Props 이름, 자체 종료 태그를 모두 정확히 작성합니다.

### 6
GET 실패(`fetchError`)와 PATCH 실패(`updateError`)를 구분하면 수정 오류가 나도 기존 주문 목록을 유지할 수 있습니다.

**실전 팁:** GET 실패(`fetchError`)와 PATCH 실패(`updateError`)를 구분하면 수정 오류가 나도 기존 주문 목록을 유지할 수 있습니다.

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

**실전 팁:** Build the entire component, not only a JSX fragment, when a task requests the full component.
