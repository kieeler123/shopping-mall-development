# Day 14 복습문제

## STEP 1

**Q1. Day 14의 핵심 학습 목표는 무엇인가요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A1.** `AdminOrdersPage` 안에 섞여 있던 React state와 상태 변경 로직을
`useOrders`라는 Custom Hook으로 분리하는 것이다.

Day 13에서 `OrderCard`, `OrderItemList`로 UI 책임을 나눴다면, Day
14에서는 `orders`, `setOrders`, `updateOrderStatus`처럼 주문 상태와
관련된 React 로직의 책임을 분리했다.

**팁:** `Component = 무엇을 보여줄지`,
`Custom Hook = React 상태와 관련 동작을 어떻게 관리할지`라고 구분한다.

</details>

## STEP 2

**Q2. UI와 React 로직은 어떻게 구분하나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A2.** 화면을 렌더링하는 목적이라면 UI에 가깝고, state를 저장하거나
변경하는 목적이라면 React 로직에 가깝다.

```tsx
orders.map((order) => <OrderCard key={order.id} order={order} />);
```

위 `map()`은 `OrderCard`를 화면에 반복해서 보여주므로 UI 렌더링이다.

```tsx
setOrders(
  orders.map((order) =>
    order.id === orderId ? { ...order, status: newStatus } : order,
  ),
);
```

이 `map()`은 데이터를 변경하기 위해 사용되므로 로직이다.

**팁:** `map()` 자체를 UI 또는 로직으로 외우지 말고 코드의 목적을 본다.

</details>

## STEP 3

**Q3. UI 로직, React 로직, 비즈니스 로직은 어떻게 다른가요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A3.** UI 로직은 모달 열기/닫기나 선택된 탭처럼 화면 상호작용을 다룬다.
React 로직은 `useState`, `useEffect`, Custom Hook처럼 React의 상태 및
렌더링 메커니즘을 사용한다. 비즈니스 로직은 React가 없어도 존재하는
서비스 규칙이다.

```tsx
function canCancelOrder(order: Order) {
  return order.status !== "배송완료";
}
```

`배송완료 주문은 취소할 수 없다`는 규칙은 React가 없어도 필요하므로
비즈니스 로직에 가깝다.

**팁:** `React가 사라져도 이 규칙이 필요한가?`를 기준으로 생각해본다.

</details>

## STEP 4

**Q4. 일반 함수와 Custom Hook의 차이는 무엇인가요?**

<details><summary><strong>정답 및 해설 보기`</strong></summary>

**A4.** 일반 함수는 React에 의존하지 않는 계산이나 데이터 처리를 담당할
수 있다.

```tsx
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

Custom Hook은 React Hook을 사용하여 React state와 관련 로직을 묶는다.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  return { orders };
}
```

Custom Hook도 JavaScript 함수지만 React Hook을 사용하고 Hook 규칙을
따르며 이름을 `use`로 시작한다.

**팁:** React 밖에서도 그대로 실행할 수 있으면 일반 함수, `useState`
같은 Hook이 필요하면 Custom Hook을 떠올린다.

</details>

## STEP 5

**Q5. 왜 `orders` state를 `useOrders`로 옮겼나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A5.** `AdminOrdersPage`가 UI 렌더링뿐 아니라 주문 state 관리까지 모두
책임지고 있었기 때문이다.

```tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return { orders };
}
```

페이지에서는 다음처럼 사용한다.

```tsx
const { orders } = useOrders();
```

이제 주문 state 관리 책임이 `useOrders`로 이동했다.

**팁:** 컴포넌트가 너무 많은 일을 한다면 state와 그 state에 밀접한
로직을 Custom Hook으로 묶을 수 있는지 확인한다.

</details>

## STEP 6

**Q6. state만 먼저 `useOrders`로 옮겼을 때 왜 `setOrders` 에러가
발생했나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A6.** JavaScript의 함수 scope 때문이다. `setOrders`가 `useOrders`
내부로 이동했기 때문에 `AdminOrdersPage`에 남아 있던
`handleStatusChange`에서는 더 이상 `setOrders`에 접근할 수 없었다.

따라서 상태 변경 함수도 `useOrders` 안으로 옮기는 것이 자연스러운 다음
단계였다.

**팁:** 리팩터링 중 에러가 발생하면
`관련된 책임 중 아직 같이 옮기지 않은 것이 있는가?`를 확인한다.

</details>

## STEP 7

**Q7. 왜 `handleStatusChange`를 `updateOrderStatus`로 바꿨나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A7.** `handleStatusChange`는 UI 이벤트 핸들러처럼 들리지만, Hook 안의
함수는 실제로 주문 상태 데이터를 변경하는 기능을 담당하기 때문이다.

```tsx
function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  // 주문 상태 변경
}
```

**팁:** 함수 이름은 구현 방법보다 `무엇을 하는 함수인지`가 드러나도록
짓는다.

</details>

## STEP 8

**Q8. `return { orders, updateOrderStatus }`는 왜 필요한가요?**

<details><summary><strong>정답 및 해설 보기`</strong></summary>

**A8.** `useOrders` 내부의 값과 함수 중 외부 컴포넌트에서 사용할 것을
공개하기 위해서다.

```tsx
return {
  orders,
  updateOrderStatus,
};
```

페이지에서는 다음처럼 구조 분해 할당한다.

```tsx
const { orders, updateOrderStatus } = useOrders();
```

**팁:** Custom Hook의 `return`을 그 Hook의 공개 인터페이스라고 생각한다.

</details>

## STEP 9

**Q9. 왜 `setOrders`는 반환하지 않고 `updateOrderStatus`만 반환하나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A9.** 내부 구현 수단인 `setOrders`를 숨기고 외부에는 의미 있는 기능만
제공하기 위해서다.

```text
setOrders
→ 내부 구현 수단

updateOrderStatus
→ 외부에 공개하는 기능
```

이렇게 하면 컴포넌트가 state를 임의로 변경하기보다 Hook이 제공한
방법으로 주문 상태를 변경하게 할 수 있다.

**팁:** 캡슐화는 단순히 숨기는 것이 아니라
`내부 구현을 보호하고 필요한 통로만 공개하는 것`으로 이해한다.

</details>

## STEP 10

**Q10. `setOrders()`를 호출하면 `orders`가 왜 즉시 바뀌지 않나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A10.** 현재 렌더링의 `orders`는 그 렌더링에서 사용하는 state
snapshot이기 때문이다.

```tsx
console.log(orders);
setOrders(newOrders);
console.log(orders);
```

`setOrders()`는 현재 변수 자체를 즉시 수정한다기보다 React에게 다음
state 업데이트와 재렌더링을 요청한다.

**팁:** `setOrders()`를 `지금 변수 변경`이 아니라
`다음 렌더링에 사용할 state 업데이트 요청`으로 이해한다.

</details>

## STEP 11

**Q11. `useOrders` 안의 `useState`는 어떻게 재렌더링으로 연결되나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A11.** `useOrders`가 독립적으로 재렌더링되는 것이 아니라
`AdminOrdersPage` 렌더링 과정에서 함께 실행된다.

```text
AdminOrdersPage 실행
↓
useOrders() 실행
↓
useState() 호출
↓
orders 반환
↓
JSX 생성
```

상태가 변경되면:

```text
updateOrderStatus()
↓
setOrders()
↓
state 업데이트
↓
AdminOrdersPage 재렌더링
↓
useOrders() 다시 실행
↓
새로운 orders 사용
```

**팁:** Custom Hook을 독립 컴포넌트가 아니라
`컴포넌트 렌더링 과정에서 실행되는 React 로직 묶음`으로 생각한다.

</details>

## STEP 12

**Q12. `OrderCard`는 왜 `updateOrderStatus`의 내부 구현을 몰라도
되나요?**

<details><summary><strong>정답 및 해설 보기`</strong></summary>

**A12.** `OrderCard`는 callback prop인 `onStatusChange`를 어떻게
호출할지만 알면 되기 때문이다.

```tsx
onStatusChange(order.id, newStatus);
```

페이지에서는:

```tsx
<OrderCard order={order} onStatusChange={updateOrderStatus} />
```

처럼 연결한다.

**팁:** 자식 컴포넌트는 callback 내부 구현보다
`어떤 인자를 전달해야 하는가`를 알면 된다.

</details>

## STEP 13

**Q13. 주문 상태를 변경할 때 전체 데이터 흐름은 어떻게 되나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A13.**

```text
사용자가 select 변경
↓
OrderCard의 onChange
↓
onStatusChange(order.id, newStatus)
↓
updateOrderStatus()
↓
useOrders 내부 setOrders()
↓
orders state 변경
↓
AdminOrdersPage 재렌더링
↓
새로운 orders가 OrderCard로 전달
↓
변경된 상태가 화면에 표시
```

**팁:** React 코드가 복잡해지면 함수 하나씩만 보지 말고 데이터 흐름을
화살표로 그려본다.

</details>

## STEP 14

**Q14. 컴포넌트 분리와 로직 분리는 어떻게 다른가요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A14.** Day 13의 컴포넌트 분리는 UI 책임을 나누는 작업이었다.

```text
AdminOrdersPage
↓
OrderCard
↓
OrderItemList
```

Day 14의 로직 분리는 React 상태와 상태 변경 책임을 나누는 작업이다.

```text
AdminOrdersPage
↓
useOrders
↓
useState
```

**팁:** 기본적으로 `Component = UI 책임`,
`Custom Hook = React 로직 책임`으로 구분하고 필요할 때 더 세밀하게
나눈다.

</details>

## STEP 15

**Q15. 로직 분리와 파일 분리는 같은 것인가요?**

<details><summary><strong>정답 및 해설 보기</strong>

</summary>

**A15.** 아니다. 같은 `page.tsx` 안에서도 `useOrders`와
`AdminOrdersPage`의 책임을 나눴다면 이미 로직 분리는 이루어진 것이다.

```text
책임 분리
↓
동작 확인
↓
파일 분리
```

**팁:** 처음부터 파일을 많이 만들기보다 먼저 책임의 경계를 찾는다.

</details>

## STEP 16

**Q16. 최종 파일 구조와 각 파일의 역할은 무엇인가요?**

<details><summary><strong>정답 및 해설 보기</strong>

</summary>

**A16.**

```text
app/admin/orders/
├─ page.tsx
├─ components/
│  ├─ OrderCard.tsx
│  └─ OrderItemList.tsx
└─ hooks/
   └─ useOrders.ts

types/
└─ order.ts
```

`page.tsx`는 페이지 UI 조립, `OrderCard.tsx`는 주문 카드 UI,
`OrderItemList.tsx`는 상품 목록 UI, `useOrders.ts`는 주문 state와 변경
로직, `types/order.ts`는 주문 관련 타입을 담당한다.

**팁:** 각 파일의 역할을 한 문장으로 설명할 수 있는지 확인한다.

</details>

## STEP 17

**Q17. 파일 분리 중 발생했던 `CartItem` 타입 에러의 원인은
무엇이었나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A17.** 실제 `OrderItem`에는 `id`가 있었지만 자동 import가 다른 타입인
`CartItem`을 참조하고 있었기 때문이다.

```text
Object literal may only specify known properties,
and 'id' does not exist in type 'CartItem'.
```

해결 흐름:

```text
에러 메시지의 타입 이름 확인
↓
import 확인
↓
실제 타입 정의 위치 확인
↓
잘못된 자동 import 수정
```

**팁:** 타입에 분명 속성이 있는데 없다고 나온다면 타입 정의를 수정하기
전에 `실제로 어떤 타입을 import했는지` 확인한다.

</details>

## STEP 18

**Q18. `import type`은 왜 사용할 수 있나요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A18.** TypeScript 타입만 가져온다는 의도를 명확하게 표현할 수 있기
때문이다.

```tsx
import type { Order, OrderStatus } from "@/types/order";
```

**팁:** 런타임 값이 아니라 타입으로만 사용하는 import라면
`import type`을 떠올린다.

</details>

## STEP 19

**Q19. 함수형 state 업데이트는 무엇이며 언제 유용한가요?**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A19.** 새 state가 이전 state에 의존할 때 이전 state를 함수 인자로 받아
다음 state를 계산하는 방식이다.

```tsx
setOrders((prevOrders) =>
  prevOrders.map((currentOrder) => {
    if (currentOrder.id === orderId) {
      return {
        ...currentOrder,
        status: newStatus,
      };
    }

    return currentOrder;
  }),
);
```

현재 방식도 동작하지만 이전 state를 기반으로 다음 state를 계산하는
상황에서는 함수형 업데이트가 유용하다.

**팁:** `다음 state = 이전 state를 이용한 계산`이라면
`setState(prev => ...)` 패턴을 떠올린다.

</details>

## STEP 20

**Q20. Day 14의 Custom Hook을 한 문장으로 설명해보세요.**

<details><summary><strong>정답 및 해설 보기</strong></summary>

**A20.** Custom Hook은 단순히 코드를 짧게 만드는 도구가 아니라, React
state와 그 state에 관련된 로직을 하나의 책임으로 분리하고 컴포넌트에
필요한 값과 기능만 공개하기 위한 구조다.

```tsx
const { orders, updateOrderStatus } = useOrders();
```

**팁:** `UI → Callback → Custom Hook → setState → 재렌더링 → UI` 흐름을
직접 설명할 수 있는지 확인한다.

</details>
```
## 최종 확인 문제

다음 흐름을 코드 없이 직접 설명해보자.

```text
사용자 상태 변경
↓
OrderCard
↓
Callback Prop
↓
updateOrderStatus
↓
setOrders
↓
재렌더링
↓
변경된 orders가 다시 UI로 전달
```

<details><summary><strong>정답 예시 보기</strong></summary>

사용자가 `OrderCard`의 `select`에서 주문 상태를 변경하면 `OrderCard`는
`onStatusChange(order.id, newStatus)`를 호출한다. 페이지가
`onStatusChange`에 `updateOrderStatus`를 전달했기 때문에 실제로는
`useOrders` 내부의 `updateOrderStatus`가 실행된다.

`updateOrderStatus`는 `setOrders`를 이용해 해당 주문의 상태를 변경한다.
state가 업데이트되면 `AdminOrdersPage`가 다시 렌더링되고 `useOrders()`도
렌더링 과정에서 다시 실행된다. 새 `orders`를 사용해 UI가 만들어지고
변경된 주문 정보가 다시 `OrderCard`에 전달된다.

즉 Day 14에서는 `AdminOrdersPage`가 주문 state의 내부 관리 방법을 직접
알 필요가 없도록 주문 관련 React 로직을 `useOrders`로 분리했다.

</details>
