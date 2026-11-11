# Day 17 --- STEP 17. DELETE와 204 --- 최대한 풀어쓴 버전

> **Day 17 큰 주제:** Day 15 HTTP/API + Day 16 비동기 JavaScript를
> `fetch()`와 React State에 연결하기\
> **STEP 17 핵심 목표:** DELETE 성공의 `204 No Content`처럼 Body가 없는
> Response를 이해하고 성공 후 `filter()`로 State에서 제거한다.

------------------------------------------------------------------------

## 0. 먼저 이 STEP이 전체 흐름에서 어디인지 본다

Day 17 전체를 한 줄로 보면 다음과 같다.

``` text
React Component
      ↓
useOrders
      ↓
fetch()
      ↓
HTTP Request
      ↓
Mock API
      ↓
HTTP Response
      ↓
Response 처리
      ↓
JavaScript Data
      ↓
React State
      ↓
Re-render
      ↓
UI
```

이번 STEP의 중심 흐름은 다음이다.

``` text
response.ok 확인 → JSON 파싱 없이 → setOrders(filter)
```

이 한 줄을 먼저 잡아두면 새로운 문법이 나와도 전체 과정에서 그 문법이
담당하는 위치를 잃지 않게 된다.

> **팁** Day 17에서는 코드 한 줄을 볼 때마다
> `지금 Request를 만드는 중인가? Response를 확인하는 중인가? Body를 읽는 중인가? State를 바꾸는 중인가?`라고
> 분류한다.

------------------------------------------------------------------------

## 1. 이번 STEP의 목표

DELETE 성공의 `204 No Content`처럼 Body가 없는 Response를 이해하고 성공
후 `filter()`로 State에서 제거한다.

여기서 중요한 것은 새로운 문법 하나를 외우는 것이 아니다. 이전 단계에서
브라우저 내부 데이터만 다루던 흐름이 HTTP 경계를 만나면서 어떤 작업이
추가되는지 이해하는 것이다.

기존 localStorage 중심 사고는 대체로 다음과 같았다.

``` text
사용자 행동
↓
JavaScript 함수
↓
localStorage 또는 React State
↓
UI
```

HTTP가 들어오면 중간에 기다려야 하는 외부 시스템이 생긴다.

``` text
사용자 행동
↓
JavaScript 함수
↓
HTTP Request
↓
외부 API 처리
↓
HTTP Response
↓
JavaScript 처리
↓
React State
↓
UI
```

따라서 Day 15의 HTTP와 Day 16의 비동기 JavaScript가 Day 17에서 실제로
만난다.

------------------------------------------------------------------------

## 2. 핵심 코드/표현

이 STEP을 대표하는 코드 또는 표현은 다음과 같다.

``` js
DELETE /orders/:id → 204 No Content
```

이 코드를 단순히 문법으로 읽지 않고 층별로 읽어본다.

### JavaScript 관점

함수 호출, 객체, 조건문, 배열 처리 등 JavaScript 자체가 어떤 일을 하는지
본다.

### 비동기 관점

Promise가 만들어지는지, `await`가 무엇을 기다리는지, 실패가 `throw` 또는
rejection으로 어떻게 이동하는지 본다.

### HTTP 관점

다음 항목을 가능한 범위에서 찾는다.

``` text
Method
URL
Headers
Body
Response
Status Code
JSON
```

### React 관점

최종 결과가 State를 변경하는지, 그 State 변경이 Re-render와 UI로
이어지는지 확인한다.

> **팁** TS나 Next.js 코드로 나중에 구현하더라도 이 네 층의 원리는
> 바뀌지 않는다. 먼저 React + JavaScript 수준에서 흐름을 설명할 수
> 있어야 한다.

------------------------------------------------------------------------

## 3. Day 15\~17 연결

### Day 15 --- HTTP/API

Day 15에서는 Client와 Server가 Request와 Response를 주고받는 규칙을
배웠다.

``` text
Client
↓ Request
Server
↓ Response
Client
```

그때 배운 Method / URL / Headers / Body / Status Code / JSON이 Day
17에서는 실제 `fetch()` 코드의 구성 요소가 된다.

### Day 16 --- Promise와 async/await

Network 통신은 즉시 끝나지 않는다.

``` text
Request 전송
↓
Network 이동
↓
Server 처리
↓
Response 이동
```

그래서 결과가 나중에 도착한다. 이 시간 차이를 JavaScript에서 다루기 위해
Promise와 `async` / `await`가 사용된다.

### Day 17 --- React와 연결

HTTP 결과를 받는 것으로 끝나지 않는다.

``` text
Response
↓
JavaScript Data
↓
setState
↓
Re-render
↓
UI
```

즉 Day 17은 Day 15와 Day 16을 React 애플리케이션의 데이터 흐름으로
완성하는 단계다.

------------------------------------------------------------------------

## 4. 실제 쇼핑몰에서 생각하기

관리자 주문 화면을 기준으로 생각한다.

``` text
AdminOrdersPage
↓
useOrders
↓
HTTP
↓
Orders API
```

관리자 화면은 `주문 목록을 보여준다`, `주문 상태를 변경한다` 같은 사용자
기능에 집중해야 한다.

반면 HTTP 쪽에서는:

``` text
어떤 Method인가?
어떤 URL인가?
Body가 필요한가?
성공 Status는 무엇인가?
Response Body가 있는가?
실패하면 어떻게 처리하는가?
```

를 결정해야 한다.

이 둘을 연결하는 과정에서 이번 STEP의 개념이 필요해진다.

현재 단계에서는 아직 API Layer 같은 추가 Architecture를 먼저 만들지
않는다. `useOrders`에서 실제 HTTP 세부사항을 경험한 뒤 반복과 책임
혼합이 보일 때 다음 단계에서 분리한다.

------------------------------------------------------------------------

## 5. 자주 헷갈리는 지점

### 혼동 1 --- HTTP 용어와 JavaScript 문법을 같은 것으로 생각하기

`GET`, `404`, Headers는 HTTP 개념이다. `await`, `throw`, `try/catch`는
JavaScript 개념이다. `useState`, `useEffect`는 React 개념이다.

실제 코드에서는 함께 보이지만 출처와 역할은 다르다.

### 혼동 2 --- Response와 Data를 같은 것으로 생각하기

HTTP Response 객체와 Response Body를 파싱한 JavaScript Data는 구분해야
한다.

### 혼동 3 --- 성공/실패와 Promise 상태를 무조건 1:1로 생각하기

HTTP 404/500이 왔다고 해서 `fetch()`가 항상 reject되는 것은 아니다.
반대로 Network 자체가 실패하면 Response를 받지 못하고 Promise가 reject될
수 있다.

### 혼동 4 --- State 변경 없이 서버 결과가 UI에 자동 반영된다고 생각하기

React에서는 서버 결과를 State에 반영해야 Re-render를 통해 화면이 바뀐다.

> **팁** 헷갈릴 때는 `HTTP / JavaScript / React` 세 칸을 종이에 만들고
> 현재 보고 있는 코드가 어느 칸의 책임인지 적어본다.

------------------------------------------------------------------------

## 6. 확인 질문

다음 질문에 코드를 보지 않고 답해본다.

1.  이 STEP은 전체 Request → Response → State → UI 흐름 중 어디에
    위치하는가?
2.  이 STEP에서 Day 15의 HTTP 개념은 무엇이 사용되는가?
3.  Day 16의 Promise/async/await와 어떤 관계가 있는가?
4.  성공했을 때 React State 또는 UI에는 어떤 변화가 생기는가?
5.  실패했을 때 어떤 경로로 처리해야 하는가?
6.  실제 Next.js + TypeScript 프로젝트로 옮기더라도 변하지 않는 핵심
    원리는 무엇인가?

답을 정확한 문장으로 외울 필요는 없다. 데이터가 어디서 출발해서 어디로
가는지를 자신의 말로 설명할 수 있으면 된다.

------------------------------------------------------------------------

## 7. React + JS → TypeScript → Next.js 연결

Day 18 이후에는 이 개념을 다음 순서로 다시 연결한다.

``` text
① React + JavaScript
이번 STEP의 원리를 가장 단순한 코드로 이해
↓
② React + TypeScript
같은 코드에 어떤 Type이 추가되는지 즉시 비교
↓
③ Next.js + TypeScript
현재 쇼핑몰의 실제 파일과 API 구조에 적용
↓
④ Browser / Network / State / UI 검증
```

예를 들어 실제 프로젝트에서 `Order`, `OrderStatus`, `Promise<Order[]>`
같은 Type이 붙어도 HTTP의 Request/Response 원리는 그대로다.

Next.js의 Route Handler가 등장해도 `GET`, `PATCH`, Status Code,
JSON이라는 HTTP 개념 자체는 그대로다.

> **팁** JavaScript 버전과 TypeScript 버전을 며칠 간격으로 따로 배우지
> 않는다. 원리를 JS로 확인한 직후 TS 표현을 보고, 실제 저장할 코드는
> Next.js + TypeScript 프로젝트 코드로 만든다.

------------------------------------------------------------------------

## 8. STEP 핵심 문장

``` text
response.ok 확인 → JSON 파싱 없이 → setOrders(filter)
```

> DELETE 성공의 `204 No Content`처럼 Body가 없는 Response를 이해하고
> 성공 후 `filter()`로 State에서 제거한다.

이 문장을 코드 없이 설명할 수 있다면 STEP 17의 핵심을 이해한 것이다.
