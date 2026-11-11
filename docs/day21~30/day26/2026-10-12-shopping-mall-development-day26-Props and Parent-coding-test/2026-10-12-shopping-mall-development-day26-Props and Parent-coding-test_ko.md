# Day 26 — 실전 코딩 테스트 (React · TypeScript · Next.js)

15문제 · 기초 5 / 응용 5 / 실전 5. 먼저 직접 구현하고 각 문제의 접이식 정답을 확인하세요. 정답 코드는 예시이며 동등한 구현도 정답입니다.

> 참고: 로컬 State 취소는 서버 주문 취소가 아닙니다. 실제 변경에는 API, 권한 검사, 오류 처리와 서버 데이터 동기화가 필요합니다.

## 1. 기초 — 1–5

**Tip:** Props의 입력 계약과 JSX에서 읽는 값을 구분하세요.

### 문제 1

`id`·`productName`·`price`·PAID/CANCELLED 상태를 가진 `Order` 타입과 `order`를 받는 `OrderCardProps` 타입을 정의하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
type Order = { id: number; productName: string; price: number; status: "PAID" | "CANCELLED" };
type OrderCardProps = { order: Order };
```

타입은 데이터 구조와 컴포넌트 계약을 구분해 정의합니다.

</details>

### 문제 2

`order`에서 상품명과 가격을 표시하는 `OrderCard`를 작성하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
function OrderCard({ order }: OrderCardProps) {
  return <article><h3>{order.productName}</h3><p>{order.price}</p></article>;
}
```

구조 분해 할당으로 받은 객체의 속성을 JSX에서 읽습니다.

</details>

### 문제 3

주문 ID를 받아 `void`를 반환하는 함수 Props를 추가하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (id: number) => void;
};
```

콜백의 인자 타입과 반환 타입을 명시합니다.

</details>

### 문제 4

버튼을 클릭했을 때만 현재 주문 ID로 콜백을 호출하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
<button onClick={() => onStatusChange(order.id)}>Cancel</button>
```

화살표 함수로 클릭 시점까지 실행을 미룹니다.

</details>

### 문제 5

취소된 주문의 Cancel 버튼을 비활성화하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
<button disabled={order.status === "CANCELLED"} onClick={() => onStatusChange(order.id)}>Cancel</button>
```

비교식이 true일 때 disabled가 적용됩니다.

</details>

## 2. 응용 — 6–10

**Tip:** 배열은 불변 방식으로 갱신하고 함수는 호출하지 말고 전달하세요.

### 문제 6

주문마다 `OrderCard`를 렌더링하고 안정적인 key와 콜백을 전달하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
{orders.map((order) => (
  <OrderCard key={order.id} order={order} onStatusChange={handleCancel} />
))}
```

map으로 각 주문의 컴포넌트를 만들고 key를 부여합니다.

</details>

### 문제 7

State를 직접 수정하지 않고 일치하는 주문만 CANCELLED로 변경하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id ? { ...order, status: "CANCELLED" } : order
    )
  );
}
```

map과 객체 전개로 기존 State를 직접 수정하지 않습니다.

</details>

### 문제 8

`orders` 배열에서 취소된 주문 개수를 계산하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
const cancelledCount = orders.filter((order) => order.status === "CANCELLED").length;
```

기존 State에서 계산할 수 있는 값은 별도 State 없이 파생할 수 있습니다.

</details>

### 문제 9

관리자 `OrderCard`에서 선택한 상태와 주문 ID를 콜백으로 전달하세요. `OrderStatus`에 선택지 값이 포함된다고 가정합니다.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
<select
  value={order.status}
  onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
>
  <option value="결제완료">결제완료</option>
  <option value="배송중">배송중</option>
</select>
```

select의 변경 이벤트에서 주문 ID와 선택 값을 전달합니다. 타입 단언은 런타임 검증이 아닙니다.

</details>

### 문제 10

`useOrders()`의 `updateOrderStatus`를 자식의 `onStatusChange`에 전달하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
<OrderCard
  key={order.id}
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

부모의 함수 참조를 자식 Props에 연결합니다.

</details>

## 3. 실전 — 11–15

**Tip:** 실제 관리자 페이지 구조와 Client Component 경계를 확인하세요.

### 문제 11

`@/types/order`에서 `Order`를 타입 전용 import로 가져오세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
import type { Order } from "@/types/order";
```

타입 전용 import는 런타임 값 import와 구분됩니다.

</details>

### 문제 12

목록 렌더링 전에 로딩·오류·빈 목록 상태를 순서대로 처리하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
if (isLoading) return <p>Loading orders...</p>;
if (error) return <p role="alert">{error}</p>;
if (orders.length === 0) return <p>No orders found.</p>;
```

조건에 따라 목록 대신 상태 메시지를 표시합니다.

</details>

### 문제 13

관리자 페이지에서 카드 JSX를 중복하지 않고 기존 `OrderCard`로 주문을 전달하세요. import와 로딩·오류 처리는 이미 있다고 가정합니다.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  return (
    <main>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={updateOrderStatus}
        />
      ))}
    </main>
  );
}
```

페이지는 목록을 관리하고 카드는 개별 주문 UI를 담당합니다.

</details>

### 문제 14

이미 취소된 주문은 `handleCancel`에서 변경하지 않도록 하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id && order.status !== "CANCELLED"
        ? { ...order, status: "CANCELLED" }
        : order
    )
  );
}
```

이미 취소된 주문은 변경하지 않습니다. UI disabled와 함께 방어적으로 처리합니다.

</details>

### 문제 15

`useState`와 클릭 이벤트를 사용하는 최소 Next.js App Router Client Component를 작성하세요.

<details>
<summary>정답 코드와 해설 보기</summary>

```tsx
"use client";

import { useState } from "react";

export default function AdminOrdersPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  return <button onClick={() => setSelectedId(101)}>{selectedId ?? "Select"}</button>;
}
```

이벤트와 State를 사용하는 파일에 적절한 클라이언트 경계를 둡니다.

</details>
