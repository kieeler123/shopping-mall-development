# Day 17 — `fetch()`와 Mock API — STEP별 학습 계획



Day 16의 HTTP/API 이론을 실제 `fetch()` 코드와 Mock API 기반 주문 CRUD로 연결한다.



```text
Before
React → useOrders → localStorage

After
React → useOrders → fetch() → Mock API
```


> **팁**
>
> 각 STEP에서 코드를 Day 16의 Method / URL / Headers / Body / Response / Status Code / JSON 용어로 다시 설명해본다.


---
## STEP 01. localStorage 방식과 API 방식 비교


### 목표
기존 `React → localStorage`와 `React → fetch() → API`를 비교하고 유지되는 흐름과 달라지는 부분을 찾는다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 02. fetch()의 정체


### 목표
`fetch()`를 HTTP 자체가 아닌 Browser JavaScript Web API로 이해하고 Promise와 연결한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 03. 첫 GET Request


### 목표
`fetch('/orders')`가 Day 16의 `GET /orders`를 어떻게 실행하는지 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.

```js
const response = await fetch("/orders");
```


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 04. Response object


### 목표
`response`가 주문 배열이 아니라 HTTP Response를 나타내는 object라는 점을 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 05. response.json()


### 목표
Response Body의 JSON을 읽고 parse하여 JavaScript value로 만드는 과정을 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.

```js
const data = await response.json();
```


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 06. response.ok와 HTTP Error


### 목표
4xx/5xx HTTP 상태와 Network/Promise rejection을 구분하고 `response.ok`의 역할을 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.

```js
if (!response.ok) {
  throw new Error("Request failed");
}
```


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 07. GET + try/catch


### 목표
`async/await`, `response.ok`, `throw`, `response.json()`, `try/catch`를 하나의 조회 패턴으로 연결한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 08. Mock API


### 목표
실제 Backend 없이도 HTTP Request/Response와 비동기 UI를 연습하는 Mock API의 목적을 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 09. /orders API Contract


### 목표
`GET /orders`, `POST /orders`, `PATCH`, `DELETE` 등 주문 API Contract를 연습 대상으로 확정한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 10. React 주문 목록 GET


### 목표
API에서 받은 주문 데이터를 `setOrders()`와 연결하여 `Response → State → UI` 흐름을 구현한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 11. Loading State


### 목표
Request 진행 중 상태를 Empty Data와 분리하고 Loading lifecycle을 설계한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 12. Error State


### 목표
HTTP/Network 실패를 Error State와 사용자용 UI로 연결한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 13. 특정 주문 GET


### 목표
`/orders/:id` Route Template을 실제 ``/orders/${id}`` Request로 바꾼다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 14. POST 주문 생성


### 목표
POST options의 Method, Headers, Content-Type, Body, `JSON.stringify()`를 Day 16 이론과 연결한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.

```js
const response = await fetch("/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newOrder),
});
```


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 15. createdOrder 처리


### 목표
Client의 `newOrder`와 Server가 반환한 `createdOrder`를 구분하고 Server 결과를 State에 반영한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 16. PATCH 주문 수정


### 목표
URL=Target, Body=Changes라는 PATCH의 partial modification 구조를 구현한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.

```js
await fetch(`/orders/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(changes),
});
```


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 17. DELETE 주문 삭제


### 목표
DELETE Request와 204 No Content를 처리하고 무조건 `response.json()`을 호출하면 안 되는 이유를 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.

```js
const response = await fetch(`/orders/${id}`, { method: "DELETE" });
```


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 18. useOrders HTTP 리팩터링


### 목표
기존 CRUD interface를 유지하면서 `useOrders` 내부의 localStorage 접근을 HTTP API로 교체한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 19. API Layer


### 목표
반복되는 fetch/status/body/error 코드를 발견하고 `ordersApi` 같은 API Layer의 필요성을 이해한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## STEP 20. 전체 통합과 점검


### 목표
User action부터 Mock API, Response, Data/Loading/Error State, UI까지 Day 17 전체 흐름을 설명한다.


### 학습 포인트
```text
Request → Mock API → Response → React State → UI
```

이 STEP에서는 현재 코드가 어떤 HTTP 의미를 가지는지, 비동기 대기 지점이 어디인지, 성공/실패가 State에 어떻게 반영되는지를 확인한다.


> **팁**
>
> 문법만 외우지 말고 주문 조회·생성·수정·삭제 중 하나의 실제 상황으로 다시 설명한다.


---
## Final Flow

최종적으로 `User → React → useOrders → fetch() → HTTP Request → Mock API → HTTP Response → Data/Loading/Error State → UI` 전체를 설명할 수 있는 상태를 목표로 한다.