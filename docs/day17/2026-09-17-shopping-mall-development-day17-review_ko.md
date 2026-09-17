# Day 17 총정리 --- HTTP/API 이론에서 fetch()와 Mock API까지

## Day 17의 위치

Day 17은 독립된 주제 하나라기보다 **Day 15의 HTTP/API 기초 + Day 16의
비동기 JavaScript + 실제 `fetch()` 사용**을 하나로 연결한 날이다.

``` text
Day 15
HTTP / API
Method / URL / Headers / Body
Response / Status Code / JSON
        ↓
Day 16
Promise / async / await
try / catch / throw
        ↓
Day 17
fetch()
Response
response.json()
Mock API
GET / POST / PATCH / DELETE
React State 연결
```

Day 17의 핵심 목표는 문법 암기가 아니라 다음 흐름을 이해하는 것이다.

``` text
React
  ↓
fetch()
  ↓
HTTP Request
  ↓
API
  ↓
HTTP Response
  ↓
JSON
  ↓
React State
  ↓
UI
```

> **팁** Day 17을 복습할 때는 `fetch()`만 따로 보지 말고 Day 15의 HTTP와
> Day 16의 Promise가 어디에서 만나는지 추적한다.

------------------------------------------------------------------------

## STEP 01 --- localStorage에서 API로

기존 구조:

``` text
React → useOrders → localStorage
```

API 구조:

``` text
React → useOrders → fetch() → API
```

localStorage에서는 브라우저 내부에서 데이터를 읽었지만 API에서는
네트워크를 통해 서버에 Request를 보내고 Response를 받아야 한다.

> **팁** 가장 큰 변화는 데이터의 위치다. 데이터가 브라우저 안에 있는지
> 네트워크 건너편에 있는지부터 구분한다.

------------------------------------------------------------------------

## STEP 02 --- fetch()의 정체

`fetch()`는 React 기능이 아니라 브라우저가 제공하는 Web API다.

``` js
const promise = fetch("/api/orders");
```

`fetch()`가 즉시 반환하는 것은 주문 데이터가 아니라:

``` text
Promise<Response>
```

이다.

``` js
const response = await fetch("/api/orders");
```

`await`를 사용하면 HTTP Response를 나타내는 `Response` 객체를 얻는다.

> **팁** `fetch = 데이터 가져오기`보다
> `fetch = HTTP Request를 시작하고 Promise<Response>를 반환`이라고
> 기억한다.

------------------------------------------------------------------------

## STEP 03 --- GET Request

``` js
const response = await fetch("/api/orders");
```

기본 Method는 `GET`이다.

HTTP 관점:

``` text
Method  GET
URL     /api/orders
Headers 필요 시 사용
Body    없음
```

목적은 주문 목록 조회다.

> **팁** fetch 코드를 볼 때 항상 Method와 URL부터 찾는다.

------------------------------------------------------------------------

## STEP 04 --- Response는 데이터가 아니다

``` js
const response = await fetch("/api/orders");
```

`response`는 주문 배열이 아니라 HTTP Response 객체다.

대표적으로 확인할 수 있는 정보:

``` js
response.ok
response.status
response.headers
```

> **팁** `response`와 실제 데이터인 `orders`를 변수 이름부터 구분한다.

------------------------------------------------------------------------

## STEP 05 --- response.json()

Response Body가 JSON이라면:

``` js
const data = await response.json();
```

으로 읽는다.

`response.json()` 역시 비동기 작업이며 Promise를 반환한다.

``` text
fetch()
↓
Promise<Response>
↓ await
Response
↓
response.json()
↓
Promise<Data>
↓ await
JavaScript Data
```

> **팁** `await`가 두 번 등장하는 이유를 설명할 수 있어야 한다. Response
> 도착과 Body 파싱은 서로 다른 비동기 단계다.

------------------------------------------------------------------------

## STEP 06 --- response.ok와 HTTP Error

중요한 점:

``` text
404 / 500
≠
fetch Promise가 반드시 reject
```

서버로부터 HTTP Response가 정상적으로 도착하면 `fetch()`는 Response를 줄
수 있다.

따라서 직접 확인한다.

``` js
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status}`);
}
```

> **팁** 네트워크 실패와 HTTP 실패를 같은 것으로 생각하지 않는다.

------------------------------------------------------------------------

## STEP 07 --- try / catch와 throw

``` js
try {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("주문 조회 실패");
  }

  const orders = await response.json();
} catch (error) {
  console.error(error);
}
```

흐름:

``` text
HTTP non-2xx
↓
response.ok === false
↓
throw
↓
async 함수의 실패 흐름
↓
catch
```

> **팁** `throw`는 단순 메시지 출력이 아니라 정상 실행 흐름을 실패
> 흐름으로 전환한다.

------------------------------------------------------------------------

## STEP 08 --- Mock API

Mock API는 단순한 가짜 배열이 아니라 **실제 서버 API처럼 Request를 받고
Response를 반환하도록 만든 연습용 API**다.

목적:

-   실제 HTTP 통신 연습
-   API Contract 연습
-   서버/DB가 완성되기 전 Frontend 개발
-   GET/POST/PATCH/DELETE 흐름 확인

> **팁** Mock API에서도 Method, URL, Status Code, Response Body를 실제
> API처럼 다룬다.

------------------------------------------------------------------------

## STEP 09 --- `/orders` API Contract

Day 17에서 사용한 주문 API의 기본 계약:

  기능        Method   URL             성공
  ----------- -------- --------------- ------------------------
  목록 조회   GET      `/orders`       `200` + `Order[]`
  단건 조회   GET      `/orders/:id`   `200` + `Order`
  생성        POST     `/orders`       `201` + 생성된 `Order`
  수정        PATCH    `/orders/:id`   `200` + 수정된 `Order`
  삭제        DELETE   `/orders/:id`   `204`

존재하지 않는 주문은 대표적으로 `404`가 될 수 있다.

> **팁** API를 사용할 때 URL만 보지 말고 Request와 Response의 약속
> 전체를 본다.

------------------------------------------------------------------------

## STEP 10 --- React에서 주문 목록 GET

``` js
async function loadOrders() {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("주문 조회 실패");
  }

  const data = await response.json();
  setOrders(data);
}
```

전체 흐름:

``` text
GET
↓
Response
↓
JSON
↓
setOrders
↓
State 변경
↓
Re-render
↓
주문 목록 UI
```

> **팁** 서버 데이터를 받았다고 UI가 자동으로 바뀌는 것이 아니다. React
> State에 반영되는 순간 UI와 연결된다.

------------------------------------------------------------------------

## STEP 11 --- Loading State

네트워크 요청에는 시간이 필요하므로:

``` js
const [isLoading, setIsLoading] = useState(true);
```

같은 상태가 필요하다.

``` text
Request 시작
↓
isLoading = true
↓
Request 종료
↓
isLoading = false
```

> **팁** Loading은 부가 기능이 아니라 서버 데이터를 사용하는 UI의
> 정상적인 상태 중 하나다.

------------------------------------------------------------------------

## STEP 12 --- Error State

``` js
const [error, setError] = useState(null);
```

실패하면:

``` js
catch (error) {
  setError(error.message);
}
```

처럼 React State에 반영할 수 있다.

따라서 서버 기반 UI는 보통:

``` text
Loading
Error
Empty
Data
```

상태를 고려한다.

> **팁** 성공 화면만 구현하지 말고 요청 중·실패·빈 데이터도 UI 상태로
> 생각한다.

------------------------------------------------------------------------

## STEP 13 --- 특정 주문 GET

``` text
GET /orders/3
```

처럼 Resource ID를 URL에 포함하여 특정 주문을 요청한다.

성공:

``` text
200 + Order
```

없음:

``` text
404
```

> **팁** `/orders`와 `/orders/:id`가 Collection과 개별 Resource를
> 표현한다는 차이를 본다.

------------------------------------------------------------------------

## STEP 14 --- POST

새 주문 생성:

``` js
const response = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(input),
});
```

HTTP 관점:

``` text
Method   POST
URL      /api/orders
Headers  Content-Type: application/json
Body     JSON
```

> **팁** POST에서는 Method뿐 아니라 Headers와 Body까지 함께 읽는 습관을
> 만든다.

------------------------------------------------------------------------

## STEP 15 --- createdOrder

POST 성공 후 서버가 생성한 주문을 반환하면:

``` js
const createdOrder = await response.json();

setOrders((prevOrders) => [
  ...prevOrders,
  createdOrder,
]);
```

클라이언트가 보낸 입력값을 임의로 State에 넣는 대신 **서버가 실제로
생성해서 반환한 결과**를 사용한다.

> **팁** 서버가 ID나 생성 시간 등을 결정할 수 있으므로 Request Body와
> Response Body가 항상 같다고 가정하지 않는다.

------------------------------------------------------------------------

## STEP 16 --- PATCH

주문의 일부 속성, 예를 들어 상태만 변경한다.

``` js
const response = await fetch(`/api/orders/${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: newStatus,
  }),
});
```

서버가 `updatedOrder`를 반환하면:

``` js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id
      ? updatedOrder
      : order
  )
);
```

> **팁** PATCH의 핵심은 변경 요청 → 서버 처리 → 수정된 결과 수신 → State
> 교체의 왕복 흐름이다.

------------------------------------------------------------------------

## STEP 17 --- DELETE와 204 No Content

``` js
const response = await fetch(`/api/orders/${id}`, {
  method: "DELETE",
});
```

삭제 성공 시:

``` text
204 No Content
```

처럼 Body가 없을 수 있다.

따라서 무조건:

``` js
await response.json();
```

을 호출하면 안 된다.

성공 후에는:

``` js
setOrders((prevOrders) =>
  prevOrders.filter((order) => order.id !== id)
);
```

처럼 State에서 제거할 수 있다.

> **팁** Status Code가 Response Body의 존재 여부와도 연결될 수 있다는
> 점을 기억한다.

------------------------------------------------------------------------

## STEP 18 --- useOrders를 HTTP 기반으로 바라보기

기존:

``` text
Component
↓
useOrders
↓
localStorage
```

변경:

``` text
Component
↓
useOrders
↓
fetch()
↓
HTTP API
```

중요한 점은 Component가 사용하는 인터페이스를 가능한 한 유지하면서 Hook
내부의 데이터 접근 방식을 변경하는 것이다.

예:

``` js
const {
  orders,
  updateOrderStatus,
} = useOrders();
```

Component는 주문 데이터를 어디에서 가져오는지 세부사항을 몰라도 된다.

> **팁** Custom Hook을 볼 때 Component가 알아야 하는 것과 Hook 내부에
> 숨길 것을 구분한다.

------------------------------------------------------------------------

# Day 17 심화 복습 1 --- async 함수와 Promise 상태

`async` 함수는 항상 Promise를 반환한다.

``` js
async function example() {
  return 10;
}
```

개념적으로 결과는:

``` text
Promise fulfilled with 10
```

이다.

반대로 처리되지 않은 `throw`는:

``` js
async function example() {
  throw new Error("실패");
}
```

Promise를 rejected 상태로 만든다.

내부 `catch`에서 처리하고 정상 값을 반환하면 다시 정상적인 결과로 회복할
수도 있다.

> **팁** async 함수 안의 `return`과 `throw`를 Promise의
> fulfilled/rejected와 연결해서 본다.

------------------------------------------------------------------------

# Day 17 심화 복습 2 --- useEffect 안에서 async를 직접 사용하지 않는 이유

피해야 할 형태:

``` js
useEffect(async () => {
  // ...
}, []);
```

Effect callback은 cleanup 함수 또는 아무것도 반환하지 않아야 하지만
`async` 함수는 항상 Promise를 반환한다.

따라서 일반 callback 안에서 비동기 함수를 호출한다.

``` js
useEffect(() => {
  async function load() {
    // ...
  }

  load();
}, []);
```

또는 외부의 비동기 함수를 호출한다.

> **팁** `useEffect`와 `async`가 함께 보이면 Effect callback의
> 반환값부터 생각한다.

------------------------------------------------------------------------

# Day 17 심화 복습 3 --- useEffect cleanup

cleanup은 대표적으로:

``` text
dependency 변경으로 Effect가 다시 실행되기 전
또는
Component가 unmount될 때
```

실행된다.

개발 환경의 React Strict Mode에서는 Effect 문제를 찾기 위해
setup/cleanup이 추가로 실행되는 것처럼 보일 수 있다.

> **팁** cleanup을 단순히 unmount 전용이라고 외우지 않는다.

------------------------------------------------------------------------

# Day 17에서 실제 프로젝트에 연결된 문제

실제 관리자 주문 코드로 이동하면서 다음과 같은 문제가 드러났다.

-   `src/types/order.ts`와 `app/admin/orders/type.tsx`에 중복 `Order`
    타입 존재
-   `CartItem[]`와 `OrderItem[]`의 의미가 다름
-   실제 Order ID는 `number`인데 일부 함수는 `string` 사용
-   `page.tsx`가 기대하는 `updateOrderStatus`와 Hook 인터페이스 불일치
-   default/named export 불일치 가능성
-   HTTP 전환 후 `initialOrders`가 불필요해짐

이 문제들은 `fetch()` 자체의 문제가 아니라 **기존 Domain 모델과 프로젝트
구조가 실제 HTTP 구현을 만나면서 드러난 문제**다.

> **팁** 타입 오류를 `as`로 덮기 전에 서로 다른 Domain 모델을 잘못 같은
> 타입으로 취급하고 있지 않은지 확인한다.

------------------------------------------------------------------------

# CartItem과 OrderItem

장바구니:

``` ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

주문 시점의 상품 Snapshot:

``` ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

둘은 비슷해 보여도 역할이 다르다.

``` text
CartItem
→ 현재 상품을 참조하며 구매 수량 관리

OrderItem
→ 주문 당시 상품 정보 보존
```

> **팁** 타입을 통합하기 전에 두 데이터의 생명주기와 책임이 같은지
> 확인한다.

------------------------------------------------------------------------

# Day 17 전체 흐름

``` text
AdminOrdersPage
      ↓
useOrders
      ↓
fetch()
      ↓
Promise<Response>
      ↓
HTTP Request
      ↓
Mock API
      ↓
HTTP Response
      ↓
response.ok
      ↓
response.json()
      ↓
Order Data
      ↓
setOrders
      ↓
React State
      ↓
Re-render
      ↓
OrderCard
```

상태 변경은:

``` text
User
↓
OrderCard
↓
updateOrderStatus
↓
PATCH Request
↓
Mock API
↓
updatedOrder Response
↓
setOrders(map)
↓
UI 갱신
```

------------------------------------------------------------------------

# Day 17 완료 기준

다음을 설명할 수 있으면 Day 17의 핵심 학습은 완료한 것으로 본다.

-   HTTP Request와 Response의 관계
-   Method / URL / Headers / Body의 역할
-   `fetch()`가 `Promise<Response>`를 반환하는 이유
-   `Response`와 실제 JSON 데이터의 차이
-   `response.json()`에 `await`가 필요한 이유
-   HTTP 404/500과 네트워크 오류의 차이
-   `response.ok` → `throw` → `catch` 흐름
-   GET / POST / PATCH / DELETE의 역할
-   `201 Created`와 `204 No Content`의 의미
-   서버 Response를 React State에 반영하는 이유
-   Loading / Error / Empty / Data 상태
-   `useEffect`와 비동기 함수의 관계
-   Custom Hook 내부 데이터 소스를 localStorage에서 HTTP로 바꿀 수 있는
    이유
-   CartItem과 OrderItem이 다른 Domain 데이터인 이유

------------------------------------------------------------------------

# Day 17에서 멈추는 지점

원래 계획에는 다음 단계가 있었다.

``` text
STEP 19 → API Layer (`ordersApi`)
STEP 20 → 전체 통합
```

하지만 Day 17에서는 여기까지 구현하지 않는다.

먼저 Day 18에서 지금까지의 JavaScript / React / TypeScript / Next.js /
HTTP 학습을 총복습한다.

그 이후 실제 프로젝트에서:

``` text
GET /api/orders
↓
PATCH /api/orders/:id
↓
실제 HTTP 왕복 확인
```

을 구현한다.

HTTP 코드의 반복과 Hook의 책임 증가를 직접 경험한 다음에:

``` text
Component
↓
useOrders
↓
ordersApi
↓
fetch
↓
API
```

형태의 API Layer를 학습한다.

> **팁** 구조를 먼저 외우지 말고 구조가 해결하는 문제를 실제 코드에서
> 먼저 경험한다.

------------------------------------------------------------------------

# Day 17 한 문장 정리

> **Day 17은 Day 15의 HTTP/API와 Day 16의 비동기 JavaScript를
> `fetch()`로 연결하여, 서버의 결과가 React State를 거쳐 UI가 되는 전체
> 왕복 흐름을 이해한 날이다.**

다음 Day 18에서는 새로운 기능을 급하게 추가하기보다 지금까지 배운 내용을
**React + JavaScript 원리 → 즉시 TypeScript 연결 → 실제 Next.js 프로젝트
연결** 방식으로 복습한다.
