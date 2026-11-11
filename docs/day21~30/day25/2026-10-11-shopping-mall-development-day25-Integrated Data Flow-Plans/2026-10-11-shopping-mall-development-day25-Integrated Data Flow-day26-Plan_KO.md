# Day 26 — Props와 부모·자식 데이터 흐름

Day 21~25: 데이터는 어떻게 이동하는가? Day 26: 이 흐름을 사용하는 코드를 어떻게 구조화할까?

## 학습 목표

부모·자식 컴포넌트, 데이터 Props, 함수 Props, 자식 이벤트, State 소유권, TypeScript Props 타입

## 학습 일정

부모·자식 개념 15분; 데이터 Props 20분; 함수 Props 20분; 이벤트와 State 20분; 프로젝트 리팩터링 25분; 복습 15분

## 핵심 원리

```text
Parent (OrdersPage)
  | order + onStatusChange (props)
  v
Child (OrderCard)
  | user click -> callback(order.id)
  v
Parent updates State -> React re-renders -> new props
```

`order`는 화면 표시용 데이터이며 `onStatusChange`는 자식이 부모에 상태 변경을 요청하는 콜백이다. Props는 부모에서 자식으로 흐르고, State 변경은 부모가 수행한다.

## OrderCard.tsx

```tsx
type Order = { id: number; productName: string; status: "PAID" | "CANCELLED" };
type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: number) => void;
};
function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return <article>
    <h3>{order.productName}</h3>
    <p>{order.status}</p>
    <button disabled={order.status === "CANCELLED"}
      onClick={() => onStatusChange(order.id)}>Cancel</button>
  </article>;
}
```

## OrdersPage.tsx

```tsx
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 101, productName: "Keyboard", status: "PAID" },
    { id: 102, productName: "Mouse", status: "PAID" }
  ]);
  function updateOrderStatus(orderId: number) {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: "CANCELLED" } : order
    ));
  }
  return <section>{orders.map(order =>
    <OrderCard key={order.id} order={order}
      onStatusChange={updateOrderStatus} />
  )}</section>;
}
```

> This is a local-State demonstration. A real cancellation requires a server-side POST request, authorization checks, error handling, and refetching authoritative order data.

## 실습 과제

OrderCard 분리; Props 타입 작성; 부모의 주문 배열 map; 취소 버튼 클릭으로 콜백 호출; 부모에서 State 갱신; 취소 버튼 비활성화

## 확인 문제

Props는 어느 방향으로 전달될까?; 자식이 부모 State를 변경하려면?; onClick에 함수를 즉시 호출하면 왜 안 될까?

## 정답

부모에서 자식으로; 부모가 전달한 콜백을 호출; 렌더링 중 실행되기 때문

## 팁

API 연결 전 로컬 State로 Props 흐름을 확인하고, 이후 Day 25 POST 취소 API로 확장하자.

## Next

Day 27: Lifting State Up · Day 28: Reusable Components · Day 29: Custom Hooks
