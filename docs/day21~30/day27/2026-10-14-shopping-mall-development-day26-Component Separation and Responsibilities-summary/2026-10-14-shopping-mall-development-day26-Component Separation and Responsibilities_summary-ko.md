# Day 27 — 컴포넌트 분리와 책임: 총정리

## 오늘의 핵심 결론
**컴포넌트는 무조건 작게 나누는 것이 아니라, 명확한 책임을 갖도록 나눈다.** 현재 관리자 주문 화면은 이미 적절하게 분리되어 있어 필수 리팩터링은 없다.

## 실제 프로젝트 구조
```text
AdminOrdersPage
└── OrderCard (주문마다 하나)
    └── OrderItemList (해당 주문의 상품 목록)

useOrders: 주문 데이터와 변경 함수 제공
```

| 구성 요소 | 담당하는 일 | 담당하지 않는 일 |
|---|---|---|
| AdminOrdersPage | 레이아웃, 로딩/오류/빈 목록, `orders.map`, 훅 연결 | 주문 카드의 세부 마크업 |
| OrderCard | 주문 한 건, 상태 변경 select, 상품 목록 연결, 총금액 | 전체 주문 관리, 실제 데이터 갱신 |
| OrderItemList | `items.map`, 상품명·수량·가격 | 주문 상태 변경 |
| useOrders | 주문 데이터, `updateOrderStatus` 제공 | 카드 디자인과 HTML |

## 데이터와 이벤트 흐름
```tsx
const { orders, isLoading, error, updateOrderStatus } = useOrders();

{orders.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    onStatusChange={updateOrderStatus}
  />
))}
```
`OrderCard`는 `onStatusChange(order.id, status)`를 호출하고 실제 갱신 로직은 `useOrders`에 둔다.

## 컴포넌트 분리 판단 기준 4가지
1. **의미:** 독립적으로 이름 붙일 수 있는 UI인가?
2. **반복:** 같은 JSX가 여러 곳에 나타나는가?
3. **변경 이유:** 다른 부분과 독립적으로 수정될 가능성이 있는가?
4. **Props 경계:** 필요한 데이터와 이벤트를 간결하게 전달할 수 있는가?

`OrderCustomerInfo`는 분리 후보이지만 지금 반드시 만들 필요는 없다. 이미 존재하는 `OrderItemList`를 중복 구현하지 않는다.

## Props 구조 분해 할당과 TypeScript 타입
**잘못된 예:**
```tsx
function UserCard({ name: string, age: number }) {}
```
이것은 타입 지정이 아니라 변수 이름을 `string`, `number`로 바꾸는 문법이다.

**올바른 예:**
```tsx
function UserCard({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return <div>{name} — {age}</div>;
}
```

함수 Props도 같은 원리다.
```tsx
function OrderStatusButton({
  orderId,
  onStatusChange,
}: {
  orderId: number;
  onStatusChange: (id: number, status: OrderStatus) => void;
}) {
  return <button onClick={() => onStatusChange(orderId, "배송중")}>배송 시작</button>;
}
```
`OrderStatus`는 `@/types/order`에서 import한다.

## JSX map 괄호 구조
```tsx
{items.map((item) => {
  return (
    <div key={item.id}>
      <p>{item.name}</p>
      <p>수량 {item.quantity}개</p>
      <p>{item.price.toLocaleString()}원</p>
    </div>
  );
})}
```
닫는 순서는 `}`(콜백 본문) → `)`(map 호출) → `}`(JSX 표현식)이다.

## 실제 코드에서 확인한 작은 개선점
`OrderCard`에서 `OrderItemList` 하나만 감싸는 바깥쪽 `space-y-3` 래퍼는 형제 요소 사이의 간격을 만들지 못한다. 상품 사이 간격은 `OrderItemList` 내부에서 담당하면 된다. 제거는 선택 사항이다.

## 검증 체크리스트
- `npm run lint`
- `npx tsc --noEmit` (프로젝트에 맞는 타입 검사 명령 사용)
- 주문 목록, 로딩/오류/빈 목록, 상태 선택, 상품 목록이 이전과 같은지 확인

**팁:** 코드마다 '페이지 전체 / 주문 한 건 / 상품 목록 / 데이터 동작' 중 무엇의 책임인지 질문하자.
