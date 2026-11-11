# Day 22 --- React State 업데이트와 불변성

> **오늘의 주제:** 가져온 데이터를 React에서 어떻게 관리하고 변경하는가?

## 오늘의 최종 목표

다음 코드를 자기 말로 설명할 수 있다.

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

핵심 설명:

> `setOrders`에 updater 함수를 전달하고, React가 이전 State인
> `Order[]`를 `prevOrders`로 전달한다. `map()`은 배열의 각 `Order`
> 객체를 `order`로 받아 하나씩 확인한다. `order.id`와
> `updatedOrder.id`가 같으면 수정 대상이므로 `updatedOrder`를 반환하고,
> 다르면 기존 `order`를 반환한다. `map()`은 이 반환값들을 모아 새로운
> 배열을 만들고, updater 함수가 그 배열을 반환하면 React가 이를 다음
> State로 사용한다. State가 업데이트되면 컴포넌트가 재렌더링되고 새로운
> State를 기준으로 JSX가 계산되어 UI에 반영된다.

------------------------------------------------------------------------

## 1. Day 21 → Day 22 연결

Day 21:

``` text
API
↓
fetch()
↓
Promise<Response>
↓
await
↓
Response
↓
response.json()
↓
await
↓
Order[]
↓
setOrders(data)
```

Day 22:

``` text
Order[]
↓
State
↓
setOrders
↓
불변성
↓
prevState
↓
spread / map / filter
↓
새 State
↓
재렌더링
↓
UI
```

Day 21이 **데이터를 어떻게 가져오는가**였다면, Day 22는 **가져온
데이터를 React State에서 어떻게 관리하고 변경하는가**에 집중한다.

------------------------------------------------------------------------

## 2. `useState`와 `orders`, `setOrders`

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

### `orders`

현재 렌더링에서 사용하는 State 값이다.

타입:

``` ts
Order[]
```

초기값:

``` ts
[]
```

### `setOrders`

React에게 `orders` State 업데이트를 요청하는 setter 함수다.

``` ts
setOrders(newOrders);
```

흐름:

``` text
setOrders 실행
↓
State 업데이트
↓
컴포넌트 재렌더링
↓
새 State를 기준으로 JSX 계산
↓
UI 반영
```

> **팁:** `setOrders`를 단순히 값을 바꾸는 함수로 외우지 말고
> `State 업데이트 요청 → 재렌더링 → UI 반영`까지 연결한다.

------------------------------------------------------------------------

## 3. 불변성(Immutability)

React State를 업데이트할 때 기존 State를 직접 수정하지 않고, 변경 결과가
반영된 새로운 배열이나 객체를 만들어 setter에 전달한다.

직접 수정:

``` ts
orders[0].status = "SHIPPED";
```

State 업데이트에서는 이런 직접 변경을 피한다.

``` text
기존 State
↓
직접 수정하지 않음
↓
변경 결과가 반영된 새 값 생성
↓
setter에 전달
```

예:

``` ts
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];
```

``` text
numbers
→ [1, 2, 3]

newNumbers
→ [1, 2, 3, 4]
```

> **팁:** 불변성 =
> `기존 것 직접 수정 X → 새로운 것 생성 → setter에 전달`

------------------------------------------------------------------------

## 4. updater 함수와 `prevOrders`

State setter에는 새로운 값을 직접 전달할 수도 있다.

``` ts
setOrders(newOrders);
```

또는 updater 함수를 전달할 수 있다.

``` ts
setOrders((prevOrders) => {
  return newOrders;
});
```

React가 updater 함수를 호출하면서 이전 State 값을 인자로 전달한다.

``` text
현재/이전 orders
↓
React
↓
updater 함수 호출
↓
prevOrders로 전달
```

`prevOrders`는 예약어가 아니다.

``` ts
setOrders((currentOrders) => {
  return [...currentOrders, newOrder];
});
```

처럼 다른 이름을 사용해도 된다.

### 타입 구분

``` ts
prevOrders // Order[]
order      // Order
newOrder   // Order
updatedOrder // Order
```

> **팁:** 복수형 `orders`는 배열, 단수형 `order`는 객체 하나라고
> 구분하면 코드를 읽기 쉽다.

------------------------------------------------------------------------

## 5. 배열 State의 대표적인 세 가지 변경

``` text
추가(Create)
→ spread

수정(Update)
→ map()

삭제(Delete)
→ filter()
```

### 추가 --- spread

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

`...prevOrders`는 기존 배열의 요소들을 새로운 배열 안에 펼친다.

``` text
prevOrders
[Order1, Order2, Order3]

↓ ...prevOrders

Order1, Order2, Order3

↓ newOrder를 뒤에 추가

새 배열
[Order1, Order2, Order3, NewOrder]
```

중요:

-   spread 자체가 '추가 기능'인 것은 아니다.
-   spread는 기존 요소를 펼친다.
-   그 뒤에 `newOrder`를 작성했기 때문에 새 요소가 추가된다.
-   기존 `prevOrders`는 직접 수정되지 않는다.

> **팁:** `[...prevOrders]`는 복사된 새 배열,
> `[...prevOrders, newOrder]`는 기존 요소를 펼친 뒤 새 요소까지 넣은 새
> 배열이다.

------------------------------------------------------------------------

## 6. 수정 --- `map()`

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

### `map()`의 핵심

`map()`은 기존 배열의 각 요소를 하나씩 받아 처리하고, 각 실행의
반환값들을 모아 **새로운 배열**을 만든다.

``` text
기존 배열
↓
각 요소를 하나씩 받음
↓
각 요소마다 반환값 결정
↓
반환값들을 모음
↓
새 배열
```

예:

``` ts
const prevOrders = [
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" },
];
```

`map()`은 세 번 실행된다.

``` text
1회차 → order = { id: 1, status: "PAID" }
2회차 → order = { id: 2, status: "PREPARING" }
3회차 → order = { id: 3, status: "SHIPPED" }
```

`map()`이 `order` 객체를 새로 만드는 것이 아니다. 기존 배열의 각 요소를
`order` 매개변수로 받는다.

> **팁:** `map = 수정`으로 외우지 말고
> `각 요소의 반환값으로 새 배열 생성`이라고 이해한다.

------------------------------------------------------------------------

## 7. ID 비교와 삼항 연산자

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

의미:

``` text
현재 보고 있는 주문이 수정 대상인가?

YES
→ updatedOrder 반환
→ 수정된 주문으로 교체

NO
→ 기존 order 반환
→ 기존 주문 유지
```

예:

``` ts
const updatedOrder = {
  id: 2,
  status: "SHIPPED",
};
```

``` text
id 1 === id 2 → false → 기존 order
id 2 === id 2 → true  → updatedOrder
id 3 === id 2 → false → 기존 order
```

결과:

``` ts
[
  { id: 1, status: "PAID" },
  { id: 2, status: "SHIPPED" },
  { id: 3, status: "SHIPPED" },
]
```

### 왜 ID를 비교하는가?

`status`는 여러 주문이 같은 값을 가질 수 있다. 반면 `id`는 각 주문을
식별하는 고유한 값으로 사용되므로 어떤 주문을 수정해야 하는지 찾는 데
적합하다.

### `===`

`===`는 값과 타입이 모두 같은지 비교한다.

``` ts
2 === 2   // true
2 === "2" // false
```

> **팁:** `order.id === updatedOrder.id`를
> `지금 보고 있는 주문이 수정하려는 바로 그 주문인가?`라고 읽는다.

------------------------------------------------------------------------

## 8. 왜 수정하지 않는 주문은 `order`를 반환하는가?

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

수정 대상이 아닌 주문까지 바꾸고 싶지 않기 때문에 기존 `order`를 그대로
반환한다.

``` text
Order1 → 유지
Order2 → 교체
Order3 → 유지
```

`map()`은 반환값을 새 배열의 요소로 사용하므로, 기존 요소를 유지하려면
그 `order`를 반환해야 한다.

### `null`을 반환하면?

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : null
);
```

`null`은 '아무것도 반환하지 않는다'가 아니다. `null`이라는 값을
반환한다.

결과:

``` ts
[
  null,
  updatedOrder,
  null,
]
```

> **팁:** `map()`에서는
> `무엇을 return했는가 → 그것이 새 배열의 요소가 된다`라고 생각한다.

------------------------------------------------------------------------

## 9. 새로운 배열과 기존 객체

``` ts
const newOrders = prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

`map()`의 결과인 `newOrders`는 `prevOrders`와 다른 새로운 배열이다.

``` ts
newOrders === prevOrders
// false
```

하지만 수정 대상이 아닌 요소는 기존 `order` 객체를 그대로 반환할 수
있다.

``` text
prevOrders → [Order1, OldOrder2, Order3]
                        ↓
                      map()
                        ↓
newOrders  → [Order1, NewOrder2, Order3]
```

즉:

-   배열 자체는 새 배열
-   수정하지 않은 객체는 기존 객체를 그대로 사용할 수 있음
-   수정 대상은 `updatedOrder`로 교체

> **팁:** `새 배열`과 `배열 안의 모든 객체가 전부 새 객체`는 같은 말이
> 아니다.

------------------------------------------------------------------------

## 10. 삭제 --- `filter()`

``` ts
setOrders((prevOrders) =>
  prevOrders.filter(
    (order) => order.id !== deleteId
  ),
);
```

`filter()`는 조건이 `true`인 요소만 남겨 새로운 배열을 만든다.

`deleteId = 2`라면:

``` text
id 1 !== 2 → true  → 유지
id 2 !== 2 → false → 제외
id 3 !== 2 → true  → 유지
```

결과:

``` ts
[
  { id: 1, status: "PAID" },
  { id: 3, status: "SHIPPED" },
]
```

`filter()`가 기존 배열에서 직접 요소를 뜯어내는 것이 아니다. 삭제 대상을
제외한 **새로운 배열**을 만든다.

> **팁:** `filter = 삭제`보다는
> `조건을 통과한 요소만 남긴 새 배열 생성`으로 기억한다.

------------------------------------------------------------------------

## 11. CRUD와 배열 State

  CRUD     State 처리         핵심
  -------- ------------------ -------------------------------
  Create   spread             기존 요소 + 새 요소로 새 배열
  Read     fetch + setState   서버 데이터를 State에 저장
  Update   `map()`            특정 요소만 교체한 새 배열
  Delete   `filter()`         특정 요소를 제외한 새 배열

공통 원칙:

``` text
기존 State 직접 수정 X
↓
기존 State를 기반으로 새 배열 생성
↓
setter에 전달 / updater에서 반환
↓
State 업데이트
↓
재렌더링
↓
새 State 기준 JSX 계산
↓
UI 반영
```

------------------------------------------------------------------------

------------------------------------------------------------------------

# 최종 암기 카드

## State

``` text
orders
→ 현재 State

setOrders
→ State 업데이트를 요청하는 setter
```

## 불변성

``` text
기존 State 직접 수정 X
→ 새로운 배열/객체 생성
→ setter에 전달
```

## updater

``` text
setOrders((prevOrders) => ...)
              ↑
React가 이전 State 전달
```

## 타입

``` text
prevOrders   → Order[]
order        → Order
newOrder     → Order
updatedOrder → Order
```

## Create

``` ts
[...prevOrders, newOrder]
```

``` text
기존 요소 펼치기
+
새 요소
→ 새 배열
```

## Update

``` ts
prevOrders.map((order) =>
  order.id === updatedOrder.id
    ? updatedOrder
    : order
);
```

``` text
수정 대상 → 교체
나머지 → 유지
→ 새 배열
```

## Delete

``` ts
prevOrders.filter(
  (order) => order.id !== deleteId
);
```

``` text
true → 유지
false → 제외
→ 새 배열
```

## Day 22 한 줄 결론

> **React 배열 State는 기존 State를 직접 수정하지 않고, spread / map /
> filter 등을 이용해 변경 결과가 반영된 새로운 배열을 만든 뒤 setter를
> 통해 업데이트한다.**

------------------------------------------------------------------------

## 완료 기준

아래 코드를 보지 않고 자기 말로 설명할 수 있으면 Day 22 완료.

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```
