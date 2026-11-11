# Day 17 복습 문제 + 정답

> 범위: Day 15 HTTP/API + Day 16 비동기 JavaScript + Day 17 `fetch()`,
> Mock API, React State 연결\
> 사용법: 먼저 문제에 답한 뒤 `<details>`를 열어 정답과 해설을 확인한다.

---

## PART 1 --- HTTP / API 기초

### 문제 1

기존 `localStorage` 기반 주문 관리와 HTTP API 기반 주문 관리의 가장 큰
차이는 무엇인가?

<details><summary>정답 보기</summary>

**정답:** 데이터에 접근하는 위치와 방식이 다르다.

```text
기존
React → useOrders → localStorage

HTTP
React → useOrders → fetch() → API
```

localStorage는 브라우저 내부 저장소에 직접 접근하지만, API 방식은
네트워크를 통해 HTTP Request를 보내고 Response를 받아야 한다.

**핵심:** 데이터가 브라우저 안에 있는지 네트워크 건너편에 있는지
구분한다.

</details>

---

### 문제 2

HTTP Request를 구성하는 핵심 요소 중 Day 17에서 반복해서 확인한 네
가지는 무엇인가?

<details><summary>정답 보기</summary>

**정답:**

1.  Method
2.  URL
3.  Headers
4.  Body

예:

```text
Method   POST
URL      /api/orders
Headers  Content-Type: application/json
Body     {"name":"김철수", ...}
```

</details>

---

### 문제 3

다음 HTTP Method를 주문 기능과 연결하라.

- GET
- POST
- PATCH
- DELETE

<details><summary>정답 보기</summary>

**정답:**

Method 주문 기능

---

GET 주문 조회
POST 주문 생성
PATCH 주문 일부 수정
DELETE 주문 삭제

</details>

---

### 문제 4

`GET /orders`와 `GET /orders/3`의 차이를 설명하라.

<details><summary>정답 보기</summary>

**정답:**

```text
GET /orders
→ 주문 Collection 조회
→ 성공 시 Order[]

GET /orders/3
→ ID가 3인 개별 Order 조회
→ 성공 시 Order
→ 존재하지 않으면 404 가능
```

</details>

---

### 문제 5

API Contract란 단순히 URL 목록을 의미하는가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

API Contract는 Client와 Server 사이의 Request/Response 약속이다.

예:

```text
Method
URL
Headers
Request Body
성공 Status Code
실패 Status Code
Response Body
```

Day 17 주문 API 예:

```text
GET /orders
→ 200 + Order[]

POST /orders
→ 201 + createdOrder

PATCH /orders/:id
→ 200 + updatedOrder

DELETE /orders/:id
→ 204
```

</details>

---

## PART 2 --- fetch()와 Response

### 문제 6

`fetch()`는 React가 제공하는 기능인가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

`fetch()`는 브라우저 환경에서 사용할 수 있는 Web API다. React와 함께
사용할 수 있지만 React 전용 기능은 아니다.

</details>

---

### 문제 7

다음 코드에서 `result`에는 주문 배열이 즉시 들어가는가?

```js
const result = fetch("/api/orders");
```

<details><summary>정답 보기</summary>

**정답:** 아니다.

`result`에는:

```text
Promise<Response>
```

가 들어간다.

네트워크 통신은 시간이 걸리므로 `fetch()`는 미래의 Response 결과를
나타내는 Promise를 즉시 반환한다.

</details>

---

### 문제 8

다음 코드의 `response`는 주문 데이터 자체인가?

```js
const response = await fetch("/api/orders");
```

<details><summary>정답 보기</summary>

**정답:** 아니다.

`response`는 HTTP Response를 표현하는 `Response` 객체다.

예:

```js
response.ok;
response.status;
response.headers;
```

실제 JSON Body를 읽으려면 별도의 처리가 필요하다.

</details>

---

### 문제 9

Response Body가 JSON일 때 실제 JavaScript 데이터로 읽는 코드를 작성하라.

<details><summary>정답 보기</summary>

**정답:**

```js
const data = await response.json();
```

`response.json()`도 Promise를 반환하므로 `await`가 필요하다.

</details>

---

### 문제 10

왜 다음 코드에는 `await`가 두 번 등장하는가?

```js
const response = await fetch("/api/orders");
const data = await response.json();
```

<details><summary>정답 보기</summary>

**정답:** 서로 다른 두 비동기 단계를 기다리기 때문이다.

```text
fetch()
↓
HTTP Response를 기다림
↓
Response

response.json()
↓
Response Body를 읽고 JSON을 파싱
↓
JavaScript Data
```

따라서:

```text
Promise<Response>
↓ await
Response
↓
Promise<Data>
↓ await
Data
```

가 된다.

</details>

---

## PART 3 --- 오류 처리

### 문제 11

서버가 `404 Not Found`를 반환하면 `fetch()`는 반드시 rejected Promise가
되어 `catch`로 이동하는가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

HTTP Response 자체가 정상적으로 도착했다면 `fetch()`는 Response 객체를
반환할 수 있다.

따라서 직접:

```js
if (!response.ok) {
  throw new Error("HTTP Error");
}
```

처럼 확인한다.

</details>

---

### 문제 12

네트워크 오류와 HTTP 오류의 차이를 설명하라.

<details><summary>정답 보기</summary>

**정답:**

**네트워크 오류**

Request/Response 통신 자체에 문제가 발생한 경우다. `fetch()` Promise가
reject될 수 있다.

**HTTP 오류**

Server가 Response를 보냈지만 Status Code가 `404`, `500` 등 성공 범위가
아닌 경우다.

```text
Network Failure
→ fetch 자체 실패 가능

HTTP 404 / 500
→ Response 도착
→ response.ok === false
```

</details>

---

### 문제 13

다음 코드에서 `throw`의 역할은 무엇인가?

```js
if (!response.ok) {
  throw new Error("주문 조회 실패");
}
```

<details><summary>정답 보기</summary>

**정답:** 정상 실행 흐름을 실패 흐름으로 전환한다.

```text
response.ok === false
↓
throw
↓
현재 정상 흐름 중단
↓
catch에서 처리
```

`async` 함수 관점에서는 처리되지 않은 `throw`가 Promise의 rejected
흐름과 연결된다.

</details>

---

### 문제 14

다음 흐름의 빈칸을 채워라.

```text
HTTP non-2xx
↓
response.ok === false
↓
( A )
↓
catch
```

<details><summary>정답 보기</summary>

**정답:** `(A) = throw`

```text
HTTP non-2xx
↓
response.ok === false
↓
throw
↓
catch
```

</details>

---

## PART 4 --- Promise / async / await

### 문제 15

`async` 함수는 항상 무엇을 반환하는가?

<details><summary>정답 보기</summary>

**정답:** Promise를 반환한다.

```js
async function example() {
  return 10;
}
```

개념적으로:

```text
Promise fulfilled with 10
```

이다.

</details>

---

### 문제 16

다음 함수의 Promise는 fulfilled와 rejected 중 어느 상태가 되는가?

```js
async function example() {
  throw new Error("실패");
}
```

<details><summary>정답 보기</summary>

**정답:** `rejected`

함수 내부에서 처리되지 않은 `throw`가 발생했기 때문이다.

</details>

---

### 문제 17

`async` 함수 내부의 `catch`에서 오류를 처리하고 정상 값을 `return`하면
반드시 rejected 상태가 유지되는가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

`catch`에서 오류를 처리하고 정상 값을 반환하면 함수는 정상적인 fulfilled
결과로 회복할 수 있다.

**핵심:** 오류를 잡았다고 항상 다시 실패하는 것은 아니다. `catch` 이후
무엇을 하느냐가 중요하다.

</details>

---

## PART 5 --- GET / POST / PATCH / DELETE

### 문제 18

다음 주문 생성 Request에서 `JSON.stringify(input)`이 필요한 이유는
무엇인가?

```js
fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(input),
});
```

<details><summary>정답 보기</summary>

**정답:** JavaScript 객체인 `input`을 JSON 문자열 형태의 Request Body로
직렬화하기 위해서다.

```text
JavaScript Object
↓
JSON.stringify()
↓
JSON 문자열
↓
HTTP Request Body
```

</details>

---

### 문제 19

POST 성공 후 Client가 보냈던 `input`을 그대로 State에 추가하지 않고
서버가 반환한 `createdOrder`를 사용하는 이유는 무엇인가?

<details><summary>정답 보기</summary>

**정답:** 서버가 ID, 생성 시간 등 최종 Resource의 값을 결정할 수 있기
때문이다.

```text
Client input
↓
POST
↓
Server가 Resource 생성
↓
createdOrder
↓
Client State
```

따라서 Request Body와 최종 Response Body가 항상 같다고 가정하면 안 된다.

</details>

---

### 문제 20

PATCH는 주문 전체를 반드시 다시 보내야 하는 Method인가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

Day 17에서는 주문의 일부 속성, 예를 들어 `status`만 변경하는 용도로
사용했다.

```js
body: JSON.stringify({
  status: newStatus,
});
```

</details>

---

### 문제 21

서버가 PATCH 후 `updatedOrder`를 반환했다. 기존 배열에서 해당 주문만
교체할 때 주로 어떤 배열 메서드를 사용할 수 있는가?

<details><summary>정답 보기</summary>

**정답:** `map()`

```js
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  ),
);
```

</details>

---

### 문제 22

DELETE 성공 후 주문을 State에서 제거할 때 주로 어떤 배열 메서드를 사용할
수 있는가?

<details><summary>정답 보기</summary>

**정답:** `filter()`

```js
setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
```

</details>

---

### 문제 23

`204 No Content` 응답에서 다음 코드를 무조건 실행하면 안 되는 이유는
무엇인가?

```js
await response.json();
```

<details><summary>정답 보기</summary>

**정답:** `204 No Content`는 성공 Response지만 Response Body가 없기
때문이다.

Body가 없는데 JSON을 읽으려고 하면 문제가 발생할 수 있다.

**핵심:** 성공했다고 항상 JSON Body가 존재하는 것은 아니다.

</details>

---

## PART 6 --- React State와 UI

### 문제 24

서버에서 주문 배열을 받았다고 React 화면이 자동으로 변경되는가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

받은 데이터를 React State에 반영해야 한다.

```js
const data = await response.json();
setOrders(data);
```

```text
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
UI 갱신
```

</details>

---

### 문제 25

서버 데이터를 사용하는 화면에서 고려했던 네 가지 대표 UI 상태는
무엇인가?

<details><summary>정답 보기</summary>

**정답:**

```text
Loading
Error
Empty
Data
```

</details>

---

### 문제 26

Loading State가 필요한 이유를 설명하라.

<details><summary>정답 보기</summary>

**정답:** HTTP Request는 즉시 완료되지 않기 때문이다.

Request가 진행 중인 동안 사용자에게 현재 상태를 표현해야 한다.

```text
Request 시작
↓
Loading
↓
성공 또는 실패
↓
Data / Error
```

</details>

---

## PART 7 --- useEffect

### 문제 27

왜 다음 코드는 피해야 하는가?

```js
useEffect(async () => {
  // ...
}, []);
```

<details><summary>정답 보기</summary>

**정답:** `async` 함수는 항상 Promise를 반환하지만 Effect callback은
cleanup 함수 또는 아무것도 반환하는 형태가 기대되기 때문이다.

대신:

```js
useEffect(() => {
  async function load() {
    // ...
  }

  load();
}, []);
```

처럼 일반 callback 안에서 비동기 작업을 실행한다.

</details>

---

### 문제 28

`useEffect` cleanup은 Component가 unmount될 때만 실행되는가?

<details><summary>정답 보기</summary>

**정답:** 아니다.

대표적으로:

```text
1. dependency 변경으로 Effect가 다시 실행되기 전
2. Component가 unmount될 때
```

실행된다.

개발 환경 Strict Mode에서는 Effect 문제를 찾기 위한 추가 setup/cleanup
실행이 보일 수도 있다.

</details>

---

## PART 8 --- Custom Hook과 프로젝트 구조

### 문제 29

다음 구조에서 `useOrders`의 내부 저장 방식을 localStorage에서 HTTP로
변경해도 Component 인터페이스를 유지할 수 있는 이유는 무엇인가?

```text
Component
↓
useOrders
↓
Data Source
```

<details><summary>정답 보기</summary>

**정답:** Component는 Hook이 공개하는 State와 함수만 사용하고 내부 구현
세부사항을 몰라도 되도록 분리할 수 있기 때문이다.

예:

```js
const { orders, updateOrderStatus } = useOrders();
```

Hook 내부가:

```text
localStorage
```

에서:

```text
fetch → HTTP API
```

로 바뀌어도 외부 인터페이스를 유지할 수 있다.

</details>

---

### 문제 30

Day 17 실제 프로젝트 연결 과정에서 발견된 `Order` 타입 문제는
무엇이었는가?

<details><summary>정답 보기</summary>

**정답:** 서로 다른 위치에 중복된 `Order` 타입이 존재했고 `items`의 타입
정의도 달랐다.

```text
src/types/order.ts
→ Order.items = CartItem[]

app/admin/orders/type.tsx
→ Order.items = OrderItem[]
```

이 때문에 같은 이름의 `Order`라도 TypeScript에서는 호환되지 않았다.

</details>

---

### 문제 31

`CartItem`과 `OrderItem`을 무조건 같은 타입으로 합치면 안 되는 이유를
설명하라.

<details><summary>정답 보기</summary>

**정답:** 역할과 데이터 생명주기가 다르기 때문이다.

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

```ts
type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
```

```text
CartItem
→ 현재 상품 참조 + 구매 수량

OrderItem
→ 주문 당시 상품 정보 Snapshot
```

</details>

---

## PART 9 --- 종합 흐름 문제

### 문제 32

다음 빈칸을 채워 Day 17의 전체 주문 조회 흐름을 완성하라.

```text
AdminOrdersPage
↓
useOrders
↓
( A )
↓
Promise<Response>
↓
HTTP Request
↓
Mock API
↓
HTTP Response
↓
( B )
↓
response.json()
↓
Order Data
↓
( C )
↓
React State
↓
Re-render
↓
OrderCard
```

<details><summary>정답 보기</summary>

**정답:**

```text
(A) fetch()
(B) response.ok 확인
(C) setOrders
```

전체:

```text
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

</details>

---

### 문제 33

주문 상태를 `"배송완료"`로 변경하는 전체 흐름을 설명하라.

<details><summary>정답 보기</summary>

**정답 예시:**

```text
사용자가 OrderCard에서 상태 변경
↓
updateOrderStatus(id, "배송완료")
↓
PATCH /orders/:id
↓
JSON Body {"status":"배송완료"}
↓
Mock API가 주문 수정
↓
200 + updatedOrder
↓
response.json()
↓
setOrders(map)
↓
React State 변경
↓
Re-render
↓
화면에 배송완료 표시
```

</details>

---

### 문제 34

다음 코드를 Day 15\~17 용어로 설명하라.

```js
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

<details><summary>정답 보기</summary>

**정답:**

```text
Method
→ PATCH

URL
→ /api/orders/:id

Headers
→ Content-Type: application/json

Body
→ {"status": newStatus}

fetch 반환
→ Promise<Response>

await 후
→ Response
```

이 Request의 목적은 특정 주문 Resource의 `status`를 부분 수정하는
것이다.

</details>

---

### 문제 35

Day 17을 한 문장으로 설명하라.

<details><summary>정답 보기</summary>

**정답 예시:**

Day 17은 **Day 15의 HTTP/API와 Day 16의 비동기 JavaScript를 `fetch()`로
연결하여, Request → API → Response → JSON → React State → UI로 이어지는
전체 흐름을 이해한 단계**다.

표현은 달라도 이 핵심 흐름이 포함되어 있으면 된다.

</details>

---

## BONUS --- 다음 단계 판단 문제

### 문제 36

왜 Day 17에서 바로 `ordersApi` 같은 API Layer를 만들지 않고 실제
GET/PATCH 구현 이후로 미루기로 했는가?

<details><summary>정답 보기</summary>

**정답:** API Layer가 해결하는 문제를 실제로 경험한 뒤 도입하기
위해서다.

먼저:

```text
useOrders
↓
fetch
↓
GET / PATCH
```

를 직접 구현한다.

그 과정에서:

```text
fetch 반복
response.ok 반복
response.json 반복
Headers 반복
JSON.stringify 반복
```

등이 나타나고 Hook이 React State 관리와 HTTP 세부사항을 함께 담당하는
문제가 보이면:

```text
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

로 분리한다.

**핵심:** Architecture를 먼저 외우는 것이 아니라 문제 → 필요성 → 해결
구조 순서로 학습한다.

</details>

---

# 자가 평가

- **30\~36문제 설명 가능:** Day 17 핵심 흐름이 상당히 연결되어 있음
- **22\~29문제 설명 가능:** 전체 흐름은 이해했으며 틀린 영역을
  선택적으로 복습
- **15\~21문제 설명 가능:** Promise/HTTP/React State 연결 부분을 다시
  확인
- **14문제 이하:** Day 15 HTTP → Day 16 Promise → Day 17 fetch 순으로
  핵심 개념을 다시 연결

점수보다 중요한 것은 **정답을 보고 이해하는 것과 정답을 보지 않고 자신의
말로 설명하는 것의 차이**다.

> **팁** 객관식처럼 답만 맞히지 말고, 가능하면 각 문제의 답을 소리 내어
> 설명한 뒤 `<details>`를 연다.
