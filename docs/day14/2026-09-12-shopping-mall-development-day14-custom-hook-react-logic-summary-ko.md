# Day 14 학습 기록 --- Custom Hook & React 로직 분리

## 1. 오늘의 학습 목표

Day 14의 핵심 목표는 **컴포넌트 안에 섞여 있던 React 상태와 상태 변경
로직을 Custom Hook으로 분리하는 것**이었다.

Day 13에서는 `AdminOrdersPage` 안의 UI를 `OrderCard`, `OrderItemList`로
분리하면서 **UI 책임 분리**를 연습했다. Day 14에서는 한 단계 더 나아가
`AdminOrdersPage`에 남아 있던 `orders` 상태와 주문 상태 변경 로직을
`useOrders`라는 Custom Hook으로 옮겼다.

최종적으로 역할은 다음처럼 정리되었다.

``` text
AdminOrdersPage
→ 페이지 UI 조립

OrderCard
→ 주문 카드 UI + 사용자 이벤트 전달

OrderItemList
→ 주문 상품 목록 UI

useOrders
→ orders 상태 관리 + 주문 상태 변경 로직

types/order.ts
→ 주문 관련 TypeScript 타입
```

------------------------------------------------------------------------

## 2. UI와 로직 구분하기

처음에는 `AdminOrdersPage` 안에 UI와 React 로직이 함께 있었다.

``` tsx
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function handleStatusChange(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return (
    // UI
  );
}
```

여기에는 두 가지 책임이 섞여 있다.

### UI

사용자에게 무엇을 보여줄지 결정하는 부분이다.

``` tsx
return (
  <main>
    {orders.map((order) => (
      <OrderCard
        key={order.id}
        order={order}
        onStatusChange={handleStatusChange}
      />
    ))}
  </main>
);
```

`map()`이라는 문법 자체가 UI 또는 로직으로 고정되는 것은 아니다. 위
코드에서는 `OrderCard`를 반복 렌더링하기 위해 사용하므로 UI 쪽이다.

### React 로직

React state를 저장하고 변경하는 부분이다.

``` tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

그리고:

``` tsx
setOrders(
  orders.map(...)
);
```

처럼 기존 주문 데이터를 가공하여 state를 변경하는 것도 React 로직에
해당한다.

> 판단 기준: 화면을 그리는가? → UI / state를 저장하거나 변경하는가? →
> React 로직

**팁**

코드를 볼 때 문법 이름보다 **그 코드가 무엇을 하기 위해 존재하는지**를
기준으로 판단한다.

------------------------------------------------------------------------

## 3. UI 로직, React 로직, 비즈니스 로직

### UI 로직

화면의 표시 상태나 사용자 인터랙션을 다루는 로직이다.

예:

``` tsx
const [isOpen, setIsOpen] = useState(false);
```

모달 열기/닫기, 선택된 탭, 드롭다운 표시 여부 등이 여기에 가깝다.

### React 로직

React의 상태와 생명주기 메커니즘을 이용하는 로직이다.

예:

``` tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

`useState`, `useEffect`, Custom Hook 등 React의 기능을 이용해 상태와
렌더링을 연결한다.

### 비즈니스 로직

React와 관계없이 서비스 자체에 존재하는 규칙이다.

예:

``` tsx
function canCancelOrder(order: Order) {
  return order.status !== "배송완료";
}
```

React가 없어도 "배송 완료된 주문은 취소할 수 없다"는 규칙은 여전히
존재한다.

> React가 사라져도 이 규칙이 필요한가? 그렇다면 비즈니스 로직일 가능성이
> 높다.

**팁**

Day 14에서는 이 세 가지를 완벽하게 분리하려고 하기보다
`AdminOrdersPage = UI`, `useOrders = 주문 관련 React 상태/로직` 정도의
경계를 확실하게 이해하는 것이 중요하다.

------------------------------------------------------------------------

## 4. 일반 함수와 Custom Hook의 차이

### 일반 함수

일반 함수는 React에 의존하지 않는 JavaScript/TypeScript 로직을 분리할 때
사용할 수 있다.

``` tsx
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

또는 주문 배열을 받아 새 배열을 반환하는 순수한 데이터 변환도 일반
함수로 만들 수 있다.

``` tsx
function changeOrderStatus(
  orders: Order[],
  orderId: number,
  newStatus: OrderStatus,
) {
  return orders.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        status: newStatus,
      };
    }

    return order;
  });
}
```

### Custom Hook

Custom Hook은 React Hook을 사용하면서 관련된 React 로직을 하나의
책임으로 묶는다.

``` tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

Custom Hook도 본질적으로 JavaScript 함수이지만 React Hook을 사용하고
Hook 규칙을 따른다.

``` text
Custom Hook
= JavaScript 함수
+ React Hook 사용
+ Hook 규칙
```

Hook 이름은 `useOrders`, `useCart`, `useProducts`처럼 `use`로 시작한다.

**팁**

"React 밖에서도 그대로 실행할 수 있는 계산인가?"라면 일반 함수를 먼저
떠올리고, `useState` 같은 React Hook이 필요하다면 Custom Hook을
떠올린다.

------------------------------------------------------------------------

## 5. `useOrders` 만들기 --- 먼저 state 이동

처음에는 `AdminOrdersPage`가 직접 state를 가지고 있었다.

``` tsx
const [orders, setOrders] = useState<Order[]>(initialOrders);
```

이를 `useOrders`로 옮겼다.

``` tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return {
    orders,
  };
}
```

그리고 페이지에서는:

``` tsx
const { orders } = useOrders();
```

로 사용했다.

이 시점에서 `setOrders`는 `useOrders` 함수 내부에만 존재한다. 따라서
기존 `handleStatusChange`가 `AdminOrdersPage`에 그대로 남아 있으면서
`setOrders`를 사용하면 scope 에러가 발생한다.

이것은 잘못된 리팩터링이 아니라 **state만 먼저 이동했기 때문에 생기는
자연스러운 중간 단계**였다.

**팁**

리팩터링은 한 번에 완성하려고 하지 말고 작은 단위로 옮긴 뒤 에러의
이유를 이해하면서 다음 단계로 넘어간다.

------------------------------------------------------------------------

## 6. 상태 변경 로직도 `useOrders`로 이동

state와 밀접하게 관련된 `handleStatusChange`도 Hook 안으로 옮겼다.

이때 이름을 `updateOrderStatus`로 변경했다.

``` tsx
function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

`handleStatusChange`는 이벤트 핸들러라는 느낌이 강한 이름이고,
`updateOrderStatus`는 "주문 상태를 변경한다"라는 데이터 작업의 의미가 더
명확하다.

페이지에서는 다음처럼 사용한다.

``` tsx
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

그리고 `OrderCard`에 callback prop으로 전달한다.

``` tsx
<OrderCard
  key={order.id}
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

**팁**

함수 이름은 구현 방식보다 **그 함수가 어떤 일을 하는지**를 표현하면
코드의 역할이 더 잘 보인다.

------------------------------------------------------------------------

## 7. Custom Hook의 `return`은 공개 인터페이스

`useOrders` 내부에는 다음 값들이 존재한다.

``` text
orders
setOrders
updateOrderStatus
```

하지만 외부에는 다음 두 개만 반환했다.

``` tsx
return {
  orders,
  updateOrderStatus,
};
```

따라서 `AdminOrdersPage`에서는:

``` tsx
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

만 사용할 수 있다.

`setOrders`는 Hook 내부에 숨겨져 있다.

이 `return` 객체를 **Custom Hook이 외부에 제공하는 공개 인터페이스**라고
생각할 수 있다.

``` text
useOrders 내부
├─ orders
├─ setOrders
└─ updateOrderStatus

외부 공개
├─ orders
└─ updateOrderStatus
```

**팁**

Custom Hook의 `return`을 볼 때 "이 Hook을 사용하는 컴포넌트에게 어떤
기능을 허용할 것인가?"라고 생각한다.

------------------------------------------------------------------------

## 8. `setOrders`를 숨기는 것과 캡슐화

만약 다음처럼 `setOrders`까지 반환한다면:

``` tsx
return {
  orders,
  setOrders,
  updateOrderStatus,
};
```

외부에서 다음처럼 주문 state를 직접 변경할 수 있다.

``` tsx
setOrders([]);
```

그러면 `useOrders`가 주문 상태 변경을 책임진다는 경계가 약해진다.

반면:

``` tsx
return {
  orders,
  updateOrderStatus,
};
```

처럼 필요한 기능만 공개하면 외부에서는 정해진 방법으로 상태를 변경한다.

``` tsx
updateOrderStatus(1, "배송중");
```

즉:

``` text
setOrders
→ 내부 구현 수단

updateOrderStatus
→ 외부에 공개하는 의미 있는 기능
```

내부 구현을 숨기고 외부에는 정해진 사용 방법만 제공하는 것이 캡슐화와
연결된다.

**팁**

캡슐화를 단순히 "숨긴다"라고 외우기보다 **내부 구현은 보호하고 필요한
통로만 공개한다**라고 이해한다.

------------------------------------------------------------------------

## 9. `setOrders`를 호출해도 현재 `orders`가 바로 바뀌지 않는 이유

React state는 현재 렌더링에서 하나의 snapshot처럼 생각할 수 있다.

``` tsx
console.log(orders);

setOrders(newOrders);

console.log(orders);
```

위 코드에서 두 번째 `console.log(orders)`도 현재 렌더링의 기존
`orders`를 볼 수 있다.

`setOrders()`는 현재 변수 자체를 즉시 수정하는 함수라기보다 **다음 state
업데이트와 재렌더링을 요청하는 함수**로 이해하는 것이 좋다.

흐름은 다음과 같다.

``` text
현재 렌더링
↓
현재 orders 사용
↓
setOrders(...) 호출
↓
React가 state 업데이트 처리
↓
AdminOrdersPage 재렌더링
↓
useOrders 다시 실행
↓
새로운 orders 사용
```

`const`라서 값이 안 바뀌는 것이 아니다. 렌더링마다 해당 렌더링이
바라보는 state snapshot이 있기 때문이다.

**팁**

`setState` 계열 함수를 볼 때 "지금 변수 수정"보다 **다음 렌더링에 사용할
state를 요청한다**라고 생각한다.

------------------------------------------------------------------------

## 10. `useOrders` 안의 `useState`와 재렌더링

중요한 점은 `useOrders` 자체가 별도의 컴포넌트처럼 재렌더링되는 것이
아니라는 것이다.

렌더링 흐름은 다음과 같다.

``` text
React
↓
AdminOrdersPage 실행
↓
useOrders() 실행
↓
useState() 호출
↓
orders 반환
↓
AdminOrdersPage가 JSX 생성
```

사용자가 주문 상태를 변경하면:

``` text
사용자 select 변경
↓
OrderCard
↓
onStatusChange(order.id, newStatus)
↓
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
새 orders를 이용해 UI 생성
```

`map()` 자체가 재렌더링을 발생시키는 것이 아니다. `setOrders()`를 통한
state 업데이트가 React에게 다시 렌더링해야 한다는 신호를 준다.

또한 재렌더링 때 `useState(initialOrders)`가 다시 코드상 호출되더라도
`initialOrders`로 매번 초기화되는 것이 아니라 React가 해당 Hook 위치에
보관한 현재 state를 돌려준다.

**팁**

Custom Hook을 독립적인 작은 컴포넌트라고 생각하지 말고 **컴포넌트가
렌더링될 때 함께 실행되는 React 로직 묶음**이라고 생각한다.

------------------------------------------------------------------------

## 11. Callback Props와 Custom Hook 연결

`OrderCard`는 다음 callback prop을 받는다.

``` tsx
type OrderCardProps = {
  order: Order;
  onStatusChange: (
    orderId: number,
    newStatus: OrderStatus,
  ) => void;
};
```

그리고 사용자가 `<select>`를 변경하면:

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus,
  );
}}
```

를 실행한다.

중요한 점은 `OrderCard`가 `onStatusChange`의 실제 구현 위치를 몰라도
된다는 것이다.

페이지에서:

``` tsx
<OrderCard
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

라고 전달했기 때문에 실제로는 `useOrders` 안의 `updateOrderStatus`가
실행된다.

``` text
OrderCard
→ 상태 변경 요청만 함

useOrders
→ 실제 orders state 변경
```

**팁**

자식 컴포넌트는 callback 함수의 내부 구현보다 **어떤 인자를 넘겨
호출해야 하는지**만 알면 된다.

------------------------------------------------------------------------

## 12. 전체 데이터 흐름

Day 14가 끝난 현재 주문 상태 변경의 전체 흐름은 다음과 같다.

``` text
1. 사용자가 OrderCard의 select를 변경한다.
        ↓
2. OrderCard의 onChange가 실행된다.
        ↓
3. onStatusChange(order.id, newStatus)를 호출한다.
        ↓
4. 전달받았던 updateOrderStatus가 실행된다.
        ↓
5. useOrders 내부에서 setOrders를 호출한다.
        ↓
6. 새로운 orders state가 만들어진다.
        ↓
7. AdminOrdersPage가 재렌더링된다.
        ↓
8. 새로운 orders를 이용해 OrderCard를 다시 렌더링한다.
        ↓
9. 변경된 주문 상태가 화면에 반영된다.
```

이 흐름은 **state → UI → 사용자 이벤트 → callback → state update →
rerender → 새로운 UI**의 React 기본 흐름과 연결된다.

**팁**

코드가 복잡해졌을 때는 함수 하나씩 보지 말고 "데이터가 어디에서 시작해서
어디로 이동하는가?"를 화살표로 그려본다.

------------------------------------------------------------------------

## 13. 컴포넌트 분리와 로직 분리의 차이

### Day 13 --- 컴포넌트/UI 책임 분리

``` text
AdminOrdersPage
↓
OrderCard
↓
OrderItemList
```

주로 배운 개념:

-   컴포넌트 책임
-   Props
-   Parent / Child
-   Callback Props
-   UI 분리

### Day 14 --- React 로직 책임 분리

``` text
AdminOrdersPage
↓
useOrders
↓
useState
```

주로 배운 개념:

-   Custom Hook
-   React state 책임
-   상태 변경 함수
-   Hook return 값
-   캡슐화
-   컴포넌트와 Hook의 역할 차이

**팁**

`Component`는 주로 **무엇을 보여줄지**, `Custom Hook`은 주로 **React
상태와 관련 동작을 어떻게 관리할지**에 집중한다고 생각하면 현재 단계에서
이해하기 쉽다.

------------------------------------------------------------------------

## 14. 로직 분리와 파일 분리는 같은 것이 아니다

처음 `useOrders`를 만들었을 때는 같은 `page.tsx` 안에 있어도 이미 책임
분리가 시작된 상태였다.

``` tsx
function useOrders() {
  // React logic
}

export default function AdminOrdersPage() {
  // UI
}
```

즉 **로직 분리 = 반드시 파일 분리**는 아니다.

책임을 먼저 나눈 다음 동작을 확인했고, 이후 파일까지 분리했다.

최종적으로는 다음과 같은 구조를 만들었다.

``` text
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

**팁**

리팩터링 순서는 **책임 분리 → 동작 확인 → 파일 분리**로 진행하면 문제가
생겼을 때 원인을 찾기 쉽다.

------------------------------------------------------------------------

## 15. 파일별 최종 책임

### `page.tsx`

페이지 전체 UI를 조립한다.

핵심 코드는 매우 단순해졌다.

``` tsx
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

그리고:

``` tsx
{orders.map((order) => {
  return (
    <OrderCard
      key={order.id}
      order={order}
      onStatusChange={updateOrderStatus}
    />
  );
})}
```

페이지는 `setOrders`나 주문 상태를 변경하는 세부 구현을 알 필요가 없다.

### `hooks/useOrders.ts`

주문 state와 상태 변경 로직을 담당한다.

``` tsx
export default function useOrders() {
  const [orders, setOrders] =
    useState<Order[]>(initialOrders);

  function updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
  ) {
    setOrders(
      orders.map((currentOrder) => {
        if (currentOrder.id === orderId) {
          return {
            ...currentOrder,
            status: newStatus,
          };
        }

        return currentOrder;
      }),
    );
  }

  return {
    orders,
    updateOrderStatus,
  };
}
```

### `components/OrderCard.tsx`

하나의 주문 정보를 화면에 보여주고 상태 변경 이벤트를 전달한다.

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus,
  );
}}
```

### `components/OrderItemList.tsx`

주문에 포함된 상품 배열을 받아 상품 목록 UI를 렌더링한다.

### `types/order.ts`

주문과 관련된 공통 타입을 관리한다.

``` tsx
export type OrderStatus =
  | "결제완료"
  | "상품준비중"
  | "배송중"
  | "배송완료";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
};
```

**팁**

각 파일을 열고 한 문장으로 역할을 설명할 수 있는지 확인한다. 설명이 너무
길어진다면 책임이 다시 섞였는지 점검해볼 수 있다.

------------------------------------------------------------------------

## 16. 파일 분리 중 만난 TypeScript 자동 import 문제

파일을 분리하면서 다음 오류를 만났다.

``` text
Object literal may only specify known properties,
and 'id' does not exist in type 'CartItem'.
```

처음에는 `initialOrders` 데이터나 `OrderItem` 타입 문제처럼 보였지만
실제 `OrderItem`에는 `id`가 정상적으로 존재했다.

``` tsx
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

원인은 **자동 import 과정에서 의도한 타입이 아닌 다른 타입을 참조하고
있었던 것**이었다.

이 경험으로 얻은 디버깅 기준:

``` text
분명 타입에 속성이 존재하는데
TypeScript가 없다고 말한다.
        ↓
에러 메시지에 등장하는 타입 이름 확인
        ↓
현재 import 확인
        ↓
Ctrl + 클릭으로 실제 타입 정의 위치 확인
```

특히 에러 메시지에 예상하지 못한 `CartItem`이라는 이름이 나온 것이
중요한 단서였다.

**팁**

자동 import를 그대로 신뢰하지 말고 import가 추가된 직후 경로와 타입
이름을 한 번 확인한다. 같은 이름 또는 비슷한 구조의 타입이 많아질수록
중요하다.

------------------------------------------------------------------------

## 17. `import type`도 학습

TypeScript 타입만 가져올 경우:

``` tsx
import type {
  Order,
  OrderStatus,
} from "@/types/order";
```

처럼 `import type`을 사용할 수 있다.

일반 import도 상황에 따라 동작하지만 `import type`은 해당 import가
런타임 값이 아니라 TypeScript 타입이라는 의도를 명확하게 표현한다.

**팁**

`Order`, `OrderStatus`, `OrderCardProps`처럼 타입으로만 사용하는 값은
`import type`으로 작성하는 습관을 들이면 import의 목적을 읽기 쉬워진다.

------------------------------------------------------------------------

## 18. 함수형 state 업데이트 --- 다음에 발전시킬 부분

현재 코드는 다음과 같다.

``` tsx
setOrders(
  orders.map((currentOrder) => {
    // ...
  }),
);
```

현재 학습 코드에서는 동작하지만, 새 state가 이전 state를 기반으로
만들어질 때는 함수형 업데이트도 사용할 수 있다.

``` tsx
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

이 방식은 React가 전달하는 이전 state를 기준으로 다음 state를 계산한다.

**팁**

`새 state = 이전 state를 이용해서 계산` 형태라면 `setState(prev => ...)`
패턴을 떠올린다. 다만 Day 14의 핵심은 Custom Hook 분리이므로 별개의 심화
포인트로 기억한다.

------------------------------------------------------------------------

## 19. Day 14 완료 체크

-   [x] UI와 React 로직을 구분할 수 있다.
-   [x] UI 로직 / React 로직 / 비즈니스 로직의 차이를 학습했다.
-   [x] 일반 함수와 Custom Hook의 차이를 이해했다.
-   [x] `useOrders` Custom Hook을 만들었다.
-   [x] `orders` state를 `useOrders`로 이동했다.
-   [x] 주문 상태 변경 로직을 `updateOrderStatus`로 이동했다.
-   [x] Hook에서 `orders`를 반환했다.
-   [x] Hook에서 `updateOrderStatus`를 반환했다.
-   [x] `AdminOrdersPage`에서 반환값을 구조 분해 할당했다.
-   [x] `OrderCard`의 Callback Props와 `updateOrderStatus`를 연결했다.
-   [x] `setOrders`를 숨기는 것과 캡슐화의 관계를 학습했다.
-   [x] `setOrders` 호출 후 현재 렌더링의 state가 즉시 바뀌지 않는
    이유를 학습했다.
-   [x] state 업데이트와 재렌더링 흐름을 학습했다.
-   [x] 로직 분리와 파일 분리의 차이를 이해했다.
-   [x] `OrderCard`, `OrderItemList`, `useOrders`를 역할별 파일로
    분리했다.
-   [x] 주문 관련 타입을 별도 타입 파일로 관리했다.
-   [x] 자동 import로 잘못된 타입을 참조하는 TypeScript 오류를
    디버깅했다.
-   [x] 기존 주문 목록/상태 변경 동작을 유지했다.

------------------------------------------------------------------------

## 20. 오늘의 핵심 문장

> **Custom Hook은 단순히 코드를 짧게 만드는 도구가 아니다. React state와
> 그 state에 관련된 로직을 하나의 책임으로 분리하고, 컴포넌트에 필요한
> 값과 기능만 공개하기 위한 구조다.**

그리고 오늘 작성한 코드에서는 다음 한 줄이 그 구조를 가장 잘 보여준다.

``` tsx
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

`AdminOrdersPage`는 이제 주문 state가 내부에서 어떻게 저장되고
변경되는지 알 필요가 없다.

페이지는 `orders`를 받아 화면을 그리고, 상태를 변경해야 할 때
`updateOrderStatus`를 사용하면 된다.

------------------------------------------------------------------------

## 21. Day 14 이후 기억할 디버깅/설계 기준

``` text
화면을 그리는가?
→ UI / Component

React state를 저장하거나 변경하는가?
→ React logic / Custom Hook 후보

React가 없어도 존재하는 서비스 규칙인가?
→ Business logic 후보

Hook 내부의 무엇을 외부에서 사용해야 하는가?
→ return으로 공개

외부가 직접 건드릴 필요가 없는 구현인가?
→ Hook 내부에 숨김

파일 분리 후 이상한 타입 에러가 생겼는가?
→ import와 실제 타입 정의 위치 확인

리팩터링 후 에러가 없는가?
→ 실제 화면 동작까지 다시 테스트
```

**팁**

Day 15 이후 코드가 복잡해질 때도 이 기준을 반복해서 사용한다. 모든
코드를 처음부터 완벽하게 분류하는 것이 목표가 아니라, **코드가 커질 때
책임의 경계를 발견하고 개선할 수 있는 능력**을 만드는 것이 중요하다.
