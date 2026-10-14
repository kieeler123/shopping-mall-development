# Day 27 — 문제·정답·해설

## Part 1. 책임 분류 8문제 (각 10점, 총 80점)
각 코드의 담당자를 `AdminOrdersPage`, `OrderCard`, `OrderItemList`, `useOrders` 중에서 고르자.

| 번호 | 문제 | 정답 | 해설 |
|---|---|---|---|
| 1 | `orders.map(order => ...)` | AdminOrdersPage | 전체 주문 순회 |
| 2 | `order.name / phone / address` | OrderCard | 주문 한 건의 고객 정보 |
| 3 | `items.map(item => ...)` | OrderItemList | 해당 주문의 상품 순회 |
| 4 | `isLoading` 안내 문구 | AdminOrdersPage | 페이지 전체 로딩 상태 |
| 5 | `<select value={order.status}>` | OrderCard | 주문 한 건의 상태 변경 UI |
| 6 | 실제 상태 변경 함수 | useOrders | 데이터 갱신 로직 |
| 7 | `orders.length === 0` 안내 문구 | AdminOrdersPage | 전체 목록의 빈 상태 |
| 8 | `item.quantity / item.price` | OrderItemList | 상품 단위 표시 |

## Part 2. 개념 확인 문제
**Q1.** 주문이 없다는 문구는 어디에 두는가?  
**정답:** `AdminOrdersPage`. 전체 목록의 상태이기 때문이다.

**Q2.** 이미 `OrderItemList`가 있으면 같은 컴포넌트를 새로 만드는가?  
**정답:** 아니다. 기존 분리가 적절한지 확인한다.

**Q3.** JSX가 10줄을 넘으면 무조건 분리해야 하는가?  
**정답:** 아니다. 의미·반복·변경 이유·Props 경계로 판단한다.

**Q4.** `OrderCard`에서 `useOrders()`를 다시 호출해야 하는가?  
**정답:** 현재 구조에서는 아니다. 부모가 전달한 `onStatusChange`를 호출한다.

**Q5.** `function User({ name: string })`은 타입 선언인가?  
**정답:** 아니다. `name`을 `string`이라는 변수로 바꾸는 구조 분해 별칭 문법이다.

**Q6.** 다음 코드는 올바른가?
```tsx
function User({ name, age }: { name: string; age: number }) {
  return <p>{name} {age}</p>;
}
```
**정답:** 올바르다. 앞부분은 값 추출, 뒷부분은 타입 선언이다.

## Part 3. 자가 점검
- `orders.map`과 `items.map`의 책임을 구분할 수 있다.
- `key`는 React 목록 식별용이지 화면에 ID를 표시하는 용도가 아님을 안다.
- 콜백 호출과 실제 데이터 갱신 로직을 구분할 수 있다.
- 분리가 가능해도 꼭 필요한 것이 아니면 유지할 수 있다.

**팁:** 정답을 암기하지 말고 '데이터의 범위'와 '코드가 변경되는 이유'를 설명해 보자.
