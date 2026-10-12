# Day 26 --- Props와 부모·자식 데이터 흐름

React + TypeScript로 배운 개념을 기존 Next.js 관리자 주문 프로젝트와
연결한 학습 정리입니다.

> **학습 범위:** 로컬 State 실습과 실제 관리자 주문 화면의 구조를
> 구분합니다.

## 1. 학습 목표

부모·자식 컴포넌트, 데이터 Props, 함수 Props, 이벤트 콜백, State 소유권,
타입 정의를 이해한다.

## 2. 핵심 원리

부모가 `order`와 `onStatusChange`를 전달 → 자식이 클릭 시 콜백 호출 →
부모가 `setOrders`로 새 배열 생성 → React 재렌더링 → 새 Props 전달.

## 3. TypeScript Props 타입

`Order`는 주문 데이터 구조이고 `OrderCardProps`는 자식이 받을 Props의
계약이다. `status`의 유니언 타입은 허용된 문자열을 제한한다.

## 4. 데이터 Props와 함수 Props

`order`는 표시할 데이터, `onStatusChange`는 부모에게 변경을 요청하는
함수다. `onClick={() => onStatusChange(order.id)}`는 클릭 시 호출되며
렌더링 중 즉시 호출되지 않는다.

### OrderCard.tsx

``` tsx
type Order = {
  id: number;
  productName: string;
  price: number;
  status: "PAID" | "CANCELLED";
};

type OrderCardProps = {
  order: Order;
  onStatusChange: (id: number) => void;
};

function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <article>
      <h3>{order.productName}</h3>
      <p>{order.price}</p>
      <p>{order.status}</p>
      <button
        disabled={order.status === "CANCELLED"}
        onClick={() => onStatusChange(order.id)}
      >
        Cancel
      </button>
    </article>
  );
}
```

## 5. 부모 State와 불변 업데이트

`setOrders(prev => prev.map(...))`는 이전 배열에서 대상 주문만 새 객체로
바꾼다. `...order`는 다른 필드를 유지하고, 일치하지 않는 항목은 기존
`order`를 반환한다.

### Parent update example

``` tsx
function handleCancel(id: number) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? { ...order, status: "CANCELLED" }
        : order
    )
  );
}

// In the parent's JSX:
{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={handleCancel}
  />
))}
```

## 6. 이벤트와 disabled

`disabled={order.status === 'CANCELLED'}`는 취소된 주문의 버튼을
비활성화한다. 관리자 화면에서는 버튼 대신 `select`의 `onChange`로 상태를
선택한다.

## 7. Next.js 실제 프로젝트 연결

실제 `AdminOrdersPage`는 `useOrders()`에서 `orders`, `isLoading`,
`error`, `updateOrderStatus`를 받아 `OrderCard`에 `order={order}`와
`onStatusChange={updateOrderStatus}`를 전달한다. `OrderCard`는
`onStatusChange(order.id, e.target.value as OrderStatus)`를 호출한다.
고객 주문 내역 페이지는 별도 화면으로 유지한다.

``` tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
) )}
```

## 8. 주의할 점

Next.js App Router에서 `useState`/`useEffect`/브라우저 이벤트는 Client
Component 경계가 필요하다. `as OrderStatus`는 런타임 검증이 아니다. 로컬
State 취소는 실제 서버 주문 취소가 아니며, 서버 작업에는 권한
검사·요청·오류 처리·동기화가 필요하다. `useOrders` 내부 저장 방식은
제공되지 않아 확정할 수 없다.
