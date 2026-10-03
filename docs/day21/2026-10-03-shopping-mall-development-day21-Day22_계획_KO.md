# Day 22 --- React State 업데이트와 불변성

> **오늘의 주제:** 가져온 데이터를 React에서 어떻게 관리하고 변경하는가?

## 오늘의 최종 목표

오늘 공부가 끝났을 때 아래 코드를 자기 말로 설명할 수 있는 것을 목표로
한다.

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

최종적으로 다음처럼 설명할 수 있으면 된다.

> `setOrders`에 updater 함수를 전달하고, React가 최신 `orders`를
> `prevOrders`로 넘겨주면, `map()`으로 새로운 배열을 만들면서 수정된
> 주문과 ID가 같은 요소만 `updatedOrder`로 교체하고 나머지는 기존 객체를
> 유지한다. 그리고 새로운 배열을 State로 설정하여 재렌더링한다.

------------------------------------------------------------------------

## 1. Day 21에서 이어지는 출발점

Day 21에서는 비동기 데이터를 가져오는 흐름을 배웠다.

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
↓
State 변경
↓
재렌더링
↓
UI
```

Day 22에서는 이 흐름 중 `setOrders` 이후를 확대해서 본다.

``` text
Day 21의 질문
API에서 데이터를 어떻게 가져오는가?

↓ 연결

Day 22의 질문
가져온 데이터를 React에서 어떻게 관리하고 변경하는가?
```

------------------------------------------------------------------------

## 2. `useState` 다시 이해하기

실제 프로젝트 코드:

``` ts
const [orders, setOrders] = useState<Order[]>([]);
```

### `orders`

현재 State 값을 읽을 때 사용한다.

처음에는:

``` ts
[]
```

API 요청이 성공하면:

``` ts
setOrders(data);
```

를 실행한다.

``` text
처음
orders = []

↓ API 요청 성공

Order[]

↓ setOrders(data)

State 업데이트

↓ 다음 렌더링

orders = 새로운 Order[]
```

### `setOrders`

`orders`를 직접 수정하는 대신 React에게 State 업데이트를 요청한다.

``` ts
setOrders(새로운값);
```

흐름:

``` text
setOrders(...)
↓
State 업데이트
↓
React 재렌더링
↓
새로운 orders로 JSX 계산
↓
UI 업데이트
```

> **학습 포인트:** `setOrders`를 단순히 값을 바꾸는 함수로만 외우지
> 않고, **State 업데이트 → 재렌더링 → UI 갱신**까지 연결해서 이해한다.

------------------------------------------------------------------------

## 3. 왜 State를 직접 수정하지 않는가?

JavaScript만 생각하면 다음처럼 객체를 직접 변경할 수 있다.

``` ts
orders[0].status = "SHIPPED";
```

하지만 React State에서는 기존 State를 직접 수정하기보다 새로운 값, 배열,
객체를 만들어 setter에 전달하는 방식을 사용한다.

``` text
기존 State 직접 수정 X

기존 State
↓
새로운 배열/객체 생성
↓
setOrders(새로운 값)
```

여기서 **불변성(Immutability)** 개념이 등장한다.

------------------------------------------------------------------------

## 4. 불변성

오늘 단계에서 불변성은 다음처럼 이해한다.

> 기존 State를 직접 뜯어고치지 않고, 변경 결과를 반영한 새로운
> 값/배열/객체를 만들어 State를 업데이트한다.

예:

``` ts
const numbers = [1, 2, 3];

const newNumbers = [...numbers, 4];
```

결과:

``` text
numbers
→ [1, 2, 3]

newNumbers
→ [1, 2, 3, 4]
```

> **학습 범위:** 함수형 프로그래밍 이론까지 깊게 들어가지 않는다.
> `기존 State 직접 수정 X → 새로운 State 생성 → setter 전달`을 이해하는
> 것이 목표다.

------------------------------------------------------------------------

## 5. 배열 State를 변경하는 대표적인 세 가지

``` text
추가
→ spread (...)

수정
→ map()

삭제
→ filter()
```

### 추가

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

### 수정

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

### 삭제

``` ts
setOrders((prevOrders) =>
  prevOrders.filter((order) =>
    order.id !== deleteId
  ),
);
```

------------------------------------------------------------------------

## 6. `prevOrders`는 어디서 오는가?

State setter에는 값을 직접 전달할 수도 있고 updater 함수를 전달할 수도
있다.

``` ts
setOrders(newOrders);
```

또는:

``` ts
setOrders((prevOrders) => {
  return newOrders;
});
```

두 번째 형태에서는 React가 updater 함수를 실행하면서 현재 State 값을
인자로 전달한다.

``` text
현재 orders
↓
React
↓
updater 함수에 전달
↓
prevOrders
```

`prevOrders`는 예약어가 아니다. 매개변수 이름일 뿐이다.

``` ts
setOrders((currentOrders) => {
  // ...
});
```

처럼 다른 이름을 사용해도 된다.

------------------------------------------------------------------------

## 7. 왜 이전 State를 기반으로 업데이트하는가?

현재 주문이:

``` text
[
  주문1,
  주문2,
  주문3
]
```

이고 주문2만 수정하려면:

``` text
주문1 → 유지
주문2 → 변경
주문3 → 유지
```

해야 한다.

그래서 현재 배열을 받아 새로운 배열을 만드는 형태가 자연스럽다.

``` ts
setOrders((prevOrders) => {
  // prevOrders를 기반으로 새로운 Order[] 생성
});
```

------------------------------------------------------------------------

## 8. 실제 `map()` 코드 해석

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order,
  ),
);
```

먼저:

``` ts
prevOrders.map(...)
```

현재 주문 배열의 모든 요소를 확인하면서 새로운 배열을 만든다.

각 주문은:

``` ts
order
```

에 들어온다.

그리고:

``` ts
order.id === updatedOrder.id
```

로 현재 주문이 서버에서 수정되어 돌아온 주문과 같은 주문인지 확인한다.

------------------------------------------------------------------------

## 9. 삼항 연산자로 수정 대상 선택하기

``` ts
order.id === updatedOrder.id
  ? updatedOrder
  : order
```

의 의미:

``` text
ID가 같은가?

YES
↓
updatedOrder

NO
↓
기존 order
```

예:

``` text
기존 주문
[
  { id: 1, status: "PAID" },
  { id: 2, status: "PREPARING" },
  { id: 3, status: "SHIPPED" }
]

updatedOrder
{ id: 2, status: "SHIPPED" }
```

`map()` 결과:

``` text
[
  기존 주문1,
  수정된 주문2,
  기존 주문3
]
```

------------------------------------------------------------------------

## 10. 왜 수정에는 `map()`을 사용하는가?

`map()`은 배열의 각 요소를 확인하면서 **새로운 배열**을 만든다.

``` text
기존 Order[]
↓
각 order 확인
↓
수정 대상?
├─ YES → updatedOrder
└─ NO  → 기존 order
↓
새 Order[]
```

따라서 기존 목록에서 특정 요소 하나를 교체하면서 새로운 배열을 만들기에
적합하다.

> **학습 포인트:** `map()`을 JSX 목록 출력 전용으로 기억하지 않는다.
> 기존 배열을 기반으로 새로운 배열을 만드는 메서드라는 점을 이해한다.

------------------------------------------------------------------------

## 11. 추가에는 spread

``` ts
setOrders((prevOrders) => [
  ...prevOrders,
  newOrder,
]);
```

``` text
기존
[주문1, 주문2, 주문3]

↓ ...prevOrders

주문1
주문2
주문3

↓ newOrder 추가

새 배열
[주문1, 주문2, 주문3, 주문4]
```

------------------------------------------------------------------------

## 12. 삭제에는 `filter()`

``` ts
setOrders((prevOrders) =>
  prevOrders.filter(
    (order) => order.id !== deleteId
  )
);
```

삭제 ID가 2라면:

``` text
id 1 !== 2 → true  → 유지
id 2 !== 2 → false → 제외
id 3 !== 2 → true  → 유지
```

결과:

``` text
[
  주문1,
  주문3
]
```

------------------------------------------------------------------------

## 13. CRUD와 배열 State 연결

``` text
Create
새 데이터 추가
→ spread

Read
데이터 조회
→ fetch + setState

Update
기존 데이터 수정
→ map

Delete
기존 데이터 삭제
→ filter
```

실제 서버 CRUD에서는 API 요청이 추가되지만, 서버 응답 이후 Client
State를 어떻게 변경하는지를 이해하기 위한 기본 구조다.

------------------------------------------------------------------------

## 14. Day 21 → Day 22 연결

``` text
Day 21

API
↓
fetch
↓
Promise
↓
await
↓
Response
↓
json
↓
Order[]

        ↓

Day 22

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
map / filter / spread
↓
새 State
↓
재렌더링
↓
UI
```

------------------------------------------------------------------------

## Day 22 완료 체크

다음 질문을 자기 말로 설명할 수 있으면 오늘 학습을 완료한 것으로 본다.

1.  `orders`와 `setOrders`의 역할은 무엇인가?
2.  State를 직접 수정하지 않는 이유는 무엇인가?
3.  불변성이란 무엇인가?
4.  `prevOrders`는 누가 전달하는가?
5.  왜 수정에 `map()`을 사용하는가?
6.  왜 `updatedOrder`와 기존 `order`의 ID를 비교하는가?
7.  수정하지 않는 주문은 왜 기존 `order`를 반환하는가?
8.  `map()`의 결과는 기존 배열인가, 새로운 배열인가?
9.  삭제에는 왜 `filter()`가 적합한가?
10. 추가할 때 spread는 어떤 역할을 하는가?

## 오늘 공부하지 않을 것

오늘은 범위를 넓히지 않는다.

``` text
useEffect 심화
useCallback 심화
Effect lifecycle 심화
React 내부 렌더링 구현
함수형 프로그래밍 심화
```

오늘의 완료 기준은 단 하나다.

> **`setOrders(prevOrders => prevOrders.map(...))` 코드를 내가 직접
> 설명할 수 있다.**
