# Day 28 — Custom Hook 코딩 테스트 15문제

> 복습 3문제 · 변형 3문제 · 신규 기초 4문제 · 실전 응용 3문제 · 오류 수정 2문제

각 문제의 정답은 접혀 있습니다. 먼저 풀고 펼쳐 보세요. 실제 `useOrders` 구현에 맞춰 검증하세요.

## 01. Props 타입 복습

**Review · 2 points**

**문제:** 부모가 전달한 `order`와 `onStatusChange`를 구조 분해 할당하고 타입을 지정하는 `OrderCard` 함수 시그니처를 작성하세요.

**힌트:** `Order`, `OrderStatus` 타입을 사용하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
type Props = {
  order: Order;
  onStatusChange: (id: number, status: OrderStatus) => void;
};
function OrderCard({ order, onStatusChange }: Props) {
  return <div>{order.id}</div>;
}
```

**해설:** 구조 분해된 매개변수 뒤에 `: Props`를 붙입니다. 함수 본문은 예시입니다.

</details>

---

## 02. 목록 렌더링 복습

**Review · 2 points**

**문제:** `orders.map()`으로 `OrderCard` 목록을 렌더링하세요.

**힌트:** `key`, `order`, `onStatusChange`를 전달하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))}
```

**해설:** `key`는 각 항목을 구분하며 콜백은 실행하지 않고 전달합니다.

</details>

---

## 03. 상품 목록 복습

**Review · 2 points**

**문제:** `items.map()`으로 상품명, 수량, 가격을 출력하세요.

**힌트:** `key`와 `toLocaleString()`을 사용하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
{items.map((item) => (
  <div key={item.id}>
    {item.name} · {item.quantity}개 · {item.price.toLocaleString()}원
  </div>
))}
```

**해설:** 각 상품에 고유 `id`와 `price`가 있다고 가정합니다. 실제 `OrderItem` 타입에 맞춰 조정하세요.

</details>

---

## 04. 상태 타입 변형

**Variation · 2 points**

**문제:** `Order[]`를 초기값 `[]`로 저장하는 상태를 선언하세요.

**힌트:** `useState<Order[]>([])` 형태를 고려하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

**해설:** 제네릭 타입으로 배열 요소의 타입을 지정합니다.

</details>

---

## 05. 로딩 상태 변형

**Variation · 2 points**

**문제:** 초기값이 `true`인 `isLoading` 상태와 setter를 선언하세요.

**힌트:** boolean 타입을 명시하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
const [isLoading, setIsLoading] = useState<boolean>(true);
```

**해설:** 이 예시에서는 로딩의 초기값을 `true`로 설정합니다.

</details>

---

## 06. 오류 상태 변형

**Variation · 2 points**

**문제:** 문자열 또는 `null`을 저장하는 `error` 상태를 선언하세요.

**힌트:** union 타입을 사용하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
const [error, setError] = useState<string | null>(null);
```

**해설:** 유니언 타입으로 오류 메시지와 오류 없음 상태를 모두 표현합니다.

</details>

---

## 07. Hook 반환값

**Basics · 2 points**

**문제:** `useOrders()`가 반환한 네 값을 구조 분해 할당하세요.

**힌트:** `orders`, `isLoading`, `error`, `updateOrderStatus`.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
const {
  orders,
  isLoading,
  error,
  updateOrderStatus,
} = useOrders();
```

**해설:** 객체 구조 분해 할당으로 Hook의 반환값을 받습니다.

</details>

---

## 08. 로딩 UI

**Basics · 2 points**

**문제:** 로딩 중에만 안내 문구를 렌더링하세요.

**힌트:** 조건부 JSX를 사용하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
{isLoading && <p>주문을 불러오는 중입니다.</p>}
```

**해설:** `isLoading`이 참일 때만 문구를 렌더링합니다.

</details>

---

## 09. 빈 목록 UI

**Basics · 2 points**

**문제:** 로딩과 오류가 없고 주문이 0건일 때만 문구를 렌더링하세요.

**힌트:** 세 조건을 모두 검사하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
{!isLoading && !error && orders.length === 0 && <p>주문이 없습니다.</p>}
```

**해설:** 세 조건을 모두 검사해 로딩 중 빈 목록 메시지가 나타나지 않도록 합니다.

</details>

---

## 10. Effect 기본

**Basics · 2 points**

**문제:** 컴포넌트 마운트 시 주문 조회 함수 `loadOrders`를 호출하는 Effect를 작성하세요.

**힌트:** 의존성 및 함수 참조 안정성을 고려해 설명하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
useEffect(() => {
  // Assume loadOrders is defined inside this Effect or stable.
  void loadOrders();
}, [loadOrders]);
```

**해설:** `loadOrders`가 매 렌더마다 새로 생성된다면 `useCallback`으로 안정화하거나 Effect 내부에 정의합니다. 의존성 경고를 무시하지 마세요.

</details>

---

## 11. fetch 응답 검사

**Application · 4 points**

**문제:** `fetch('/api/orders')` 결과가 실패 상태면 오류를 발생시키는 비동기 함수를 작성하세요.

**힌트:** `response.ok`를 검사하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Order[];
}
```

**해설:** API가 `Order[]`를 직접 반환한다고 가정합니다. 런타임 데이터 검증은 별도 문제입니다.

</details>

---

## 12. Hook 책임 판단

**Application · 4 points**

**문제:** `AdminOrdersPage`에 들어 있는 fetch 코드를 `useOrders`로 옮기는 최소 설계를 의사코드로 작성하세요.

**힌트:** UI와 데이터 책임을 분리하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
// useOrders: owns fetching and state
function useOrders() {
  // state + Effect + fetch + update logic
  return { orders, isLoading, error, updateOrderStatus };
}
// AdminOrdersPage: calls Hook and renders JSX
```

**해설:** 실행 코드가 아닌 설계 의사코드입니다. fetch는 Hook에, 화면 표현은 페이지에 둡니다.

</details>

---

## 13. 상태 변경 콜백

**Application · 4 points**

**문제:** `OrderCard`의 select가 `onStatusChange(order.id, status)`를 호출하도록 작성하세요.

**힌트:** `OrderStatus` 타입을 사용하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
<select
  value={order.status}
  onChange={(e) =>
    onStatusChange(order.id, e.target.value as OrderStatus)
  }
>
  <option value="결제완료">결제완료</option>
  <option value="상품준비중">상품준비중</option>
  <option value="배송중">배송중</option>
  <option value="배송완료">배송완료</option>
</select>
```

**해설:** 옵션 값이 `OrderStatus`와 일치한다는 전제의 타입 단언입니다. 외부 값이라면 검증이 필요합니다.

</details>

---

## 14. 오류 수정

**Debugging · 4 points**

**문제:** 다음 잘못된 코드를 고치세요: `function OrderCard({order: Order}) { return <p>{order.id}</p> }`

**힌트:** 타입 위치와 구조 분해 할당을 구분하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
function OrderCard({ order }: { order: Order }) {
  return <p>{order.id}</p>;
}
```

**해설:** `{ order: Order }`는 타입 지정이 아니라 변수 이름 변경입니다. 타입은 매개변수 구조 분해 뒤에 선언합니다.

</details>

---

## 15. 실전 흐름 설명

**Debugging · 4 points**

**문제:** 주문 상태 선택부터 `updateOrderStatus`, API/상태 반영, 재렌더링까지 흐름을 코드 또는 단계별 의사코드로 표현하세요.

**힌트:** 실제 프로젝트 구현을 확인하지 못한 부분은 가정으로 표시하세요.

**코드·설명 작성란:**

```tsx
// TODO
```

<details>
<summary>정답 및 상세 해설 보기</summary>

```tsx
// 1. User selects a status in OrderCard.
// 2. onStatusChange(order.id, selectedStatus) runs.
// 3. AdminOrdersPage passes through updateOrderStatus.
// 4. useOrders updates via API and/or local state.
// 5. State change triggers React re-render.
// Exact request/optimistic-update order depends on implementation.
```

**해설:** API 성공 후 반영하는지 낙관적 업데이트인지 실제 Hook을 보기 전에는 확정할 수 없습니다.

</details>

---

## 권장 채점

기본 문법·타입 정확성, 책임 분리, 기존 기능 보존을 기준으로 평가합니다.
