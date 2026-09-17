# Day 18 --- 복습과 재정비: React + JavaScript 이론에서 Next.js + TypeScript 실전으로

## Day 18의 목적

Day 17에서 새로운 진도를 잠시 멈추고, 지금까지 학습한 내용을 실제 코드와
연결하며 복습한다.

초기 학습은 최종 목표인 **실무 운영 가능한 웹 애플리케이션 개발**을
고려해 처음부터 Next.js + TypeScript로 진행했다. 이 방식은 실제 프로젝트
구조와 타입 안전성을 일찍 경험할 수 있다는 장점이 있었지만,
React/JavaScript의 핵심 원리를 배우는 단계에서도 타입 설계, Next.js
규칙, 파일 구조, Client/Server 경계 등을 동시에 고려해야 했다.

Day 18부터 학습 방식을 다음처럼 분리한다.

> **이론과 원리 → React + JavaScript**\
> **실제 프로젝트 최종 구현 → Next.js + TypeScript**

Day 17에서 예정했던 STEP 19(API Layer), STEP 20(전체 통합)은 서둘러
진행하지 않는다. API Layer가 필요한 이유를 실제 코드에서 충분히 경험한
뒤 다음 단계에서 천천히 구현한다.

------------------------------------------------------------------------

## Day 18 공통 진행 규칙 --- 3단 연결 학습

Day 18의 각 복습 STEP은 가능한 경우 다음 순서로 진행한다.

``` text
① React + JavaScript
원리와 동작을 가장 단순한 형태로 이해
        ↓ 즉시
② React + TypeScript
같은 코드에 어떤 타입이 왜 추가되는지 비교
        ↓ 즉시
③ Next.js + TypeScript
현재 쇼핑몰의 실제 파일·타입·구조에 연결
        ↓
④ 실행 및 검증
Browser / Network / State / UI에서 실제 동작 확인
```

이 방식의 목적은 JavaScript를 한동안 학습한 뒤 TypeScript로 '갈아타는'
것이 아니다. 같은 개념을 JavaScript로 이해한 직후 TypeScript 표현을
확인하여 두 코드가 머릿속에서 하나의 로직으로 연결되게 하는 것이다.

예:

``` js
// ① React + JavaScript — 원리 확인
const [orders, setOrders] = useState([]);
```

``` ts
// ② React + TypeScript — 같은 원리 + 타입
const [orders, setOrders] = useState<Order[]>([]);
```

``` text
useState   → React
Order[]    → TypeScript + 쇼핑몰 Domain
실제 위치  → Next.js 프로젝트
```

### 예외: Next.js 고유 기능

모든 내용을 억지로 JavaScript 버전으로 만들지는 않는다.

-   State, Props, Event, Effect, Custom Hook처럼 React 원리가 핵심인
    내용 → React + JS로 먼저 이해
-   App Router, `page.tsx`, `layout.tsx`, Route Handler, Server/Client
    Component처럼 Next.js 자체가 학습 대상인 내용 → 실제 Next.js +
    TypeScript 환경에서 설명

> **팁** 실제 TSX 코드를 볼 때
> `React 로직 / TypeScript 타입 / Next.js 규칙 / 프로젝트 Domain` 네
> 층으로 나눠 읽는다. 최종 프로젝트의 Source of Truth는 계속 Next.js +
> TypeScript이며, JS 코드는 원리를 선명하게 보기 위한 학습용 코드다.

------------------------------------------------------------------------

## 최종 학습 흐름

``` text
개념/원리
React + JavaScript
        ↓
작은 예제
동작 원리 확인
        ↓
현재 프로젝트에 적용
Next.js + TypeScript
        ↓
실제 실행
        ↓
Browser / Network / State / UI 검증
        ↓
왜 이렇게 작성했는지 설명
```

------------------------------------------------------------------------

## STEP 01 --- 지금까지 만든 프로젝트 전체 흐름 다시 보기

### 목표

파일 하나하나를 다시 작성하지 않고 쇼핑몰의 전체 데이터 흐름을 설명할 수
있는지 확인한다.

``` text
Product
  ↓
상품 UI
  ↓
Cart
  ↓
Checkout
  ↓
Order
  ↓
Admin Orders
```

### 확인할 내용

-   각 페이지와 컴포넌트의 역할
-   데이터가 어디서 생성되고 어디로 이동하는지
-   사용자 이벤트가 어떤 상태 변경으로 이어지는지
-   localStorage가 어떤 데이터를 담당했는지

> **팁** 코드를 외우지 말고 사용자 행동 하나가 어떤 파일과 상태를
> 지나가는지 추적한다.

------------------------------------------------------------------------

## STEP 02 --- JavaScript 핵심 문법 복습

### 목표

React 코드 안에서 사용했던 JavaScript 자체를 분리해서 이해한다.

### 복습 항목

-   변수와 스코프
-   객체와 배열
-   구조 분해 할당
-   spread 문법
-   `map`, `filter`, `find`
-   함수와 콜백
-   모듈 `import` / `export`
-   조건식과 삼항 연산자

> **팁** React 문법처럼 보이는 코드에서도 무엇이 순수 JavaScript인지
> 구분해본다.

------------------------------------------------------------------------

## STEP 03 --- Component와 JSX 복습

### 목표

컴포넌트가 무엇을 담당하고 JSX가 어떻게 UI를 표현하는지 다시 확인한다.

### 핵심 질문

-   왜 UI를 컴포넌트로 나누는가?
-   컴포넌트 함수가 다시 실행된다는 것은 무엇인가?
-   JSX와 JavaScript 표현식은 어떻게 연결되는가?
-   `map()`으로 여러 컴포넌트를 렌더링할 때 `key`는 왜 필요한가?

> **팁** 컴포넌트를 단순한 파일 단위가 아니라 입력을 받아 UI를 표현하는
> 함수라는 관점으로 본다.

------------------------------------------------------------------------

## STEP 04 --- Props와 단방향 데이터 흐름 복습

### 목표

부모와 자식 컴포넌트 사이에서 데이터와 함수가 어떻게 이동하는지
설명한다.

``` text
Parent State
    ↓
   Props
    ↓
  Child

Child Event
    ↓
Callback Props
    ↓
Parent State 변경
```

### 실제 프로젝트 연결

-   `order={order}`
-   `onStatusChange={updateOrderStatus}`

> **팁** Props 오류가 생기면 부모가 전달하는 값과 자식이 요구하는 값을
> 양쪽에서 비교한다.

------------------------------------------------------------------------

## STEP 05 --- State와 Re-render 복습

### 목표

State가 일반 변수와 무엇이 다른지 이해하고 UI 갱신 흐름을 설명한다.

``` text
사용자 행동
  ↓
setState
  ↓
State 변경
  ↓
Re-render
  ↓
새 UI
```

### 확인할 내용

-   `useState`
-   이전 State 기반 업데이트
-   배열 State의 불변성
-   `map`, `filter`, spread와 State 변경

> **팁** State를 볼 때 항상 어떤 이벤트가 이 State를 변경하는지 함께
> 찾는다.

------------------------------------------------------------------------

## STEP 06 --- Event와 Form 흐름 복습

### 목표

사용자 입력이 React 데이터로 변환되고 다시 동작으로 이어지는 흐름을
확인한다.

``` text
User Input
   ↓
Event
   ↓
Handler
   ↓
State
   ↓
Submit
   ↓
Business Action
```

### 확인할 내용

-   `onClick`
-   `onChange`
-   submit 처리
-   입력값과 State 연결
-   이벤트 핸들러에 함수 전달하기

> **팁** 이벤트 핸들러를 읽을 때 무엇이 발생했고 어떤 State 또는 함수가
> 영향을 받는지 추적한다.

------------------------------------------------------------------------

## STEP 07 --- Custom Hook 복습

### 목표

Custom Hook을 단순 코드 분리가 아니라 상태와 동작의 재사용/책임 분리
관점에서 이해한다.

``` text
Component
   ↓
Custom Hook
   ↓
State + Actions
```

### 실제 프로젝트 연결

-   Cart 관련 Hook
-   Order 관련 Hook
-   `useOrders`

> **팁** Hook을 볼 때 외부에 무엇을 반환하는지를 먼저 확인하면 그 Hook의
> 공개 인터페이스를 빠르게 파악할 수 있다.

------------------------------------------------------------------------

## STEP 08 --- localStorage 기반 데이터 흐름 복습

### 목표

HTTP API로 넘어가기 전 기존 저장 방식의 한계와 역할을 명확히 이해한다.

``` text
React State
    ↕
localStorage
```

### 확인할 내용

-   저장 시점
-   읽기 시점
-   JSON 직렬화/역직렬화
-   브라우저 저장소의 한계
-   React State와 영구 저장 데이터의 차이

> **팁** localStorage 자체를 나쁜 방식으로 보지 말고 어떤 규모와 목적에
> 적합한 저장소인지 구분한다.

------------------------------------------------------------------------

## STEP 09 --- Product → Cart → Order 데이터 모델 복습

### 목표

쇼핑몰의 핵심 Domain 데이터가 기능 사이에서 어떻게 변하는지 확인한다.

``` text
Product
   ↓
CartItem
   ↓
Checkout
   ↓
Order
   ↓
OrderItem
```

### 확인할 내용

-   Product와 CartItem의 차이
-   CartItem과 OrderItem의 차이
-   주문 시점에 보존해야 하는 정보
-   `OrderStatus`
-   중복된 Domain 타입이 없는지 확인

> **팁** 타입 이름보다 실제 데이터가 무엇을 의미하고 언제 생성되는지를
> 먼저 본다.

------------------------------------------------------------------------

## STEP 10 --- TypeScript는 JavaScript 위의 안전장치로 다시 보기

### 목표

TypeScript를 새로운 로직이 아니라 이미 이해한 JavaScript에 타입 정보를
추가하는 도구로 정리한다.

``` js
function updateStatus(id, status) {
  // JavaScript 로직
}
```

``` ts
function updateStatus(
  id: number,
  status: OrderStatus
): void {
  // 같은 로직 + 타입 정보
}
```

### 확인할 내용

-   primitive type
-   object type
-   union type
-   Props type
-   함수 parameter/return type
-   `Promise<T>`
-   `unknown` narrowing

> **팁** TS 코드가 복잡하면 타입 표기를 잠시 제외하고 내부 JavaScript
> 흐름부터 읽는다.

------------------------------------------------------------------------

## STEP 11 --- Next.js가 React 위에서 담당하는 역할 정리

### 목표

React 원리와 Next.js 프레임워크 기능을 구분한다.

### 구분

**React** - Component - JSX - Props - State - Event - Hook - Effect

**Next.js** - App Router - `page.tsx` - Layout - Routing - Client/Server
경계 - Route Handler - 프로젝트 파일 규칙

> **팁** 어떤 코드가 이해되지 않을 때 React 문제인지 Next.js 규칙
> 문제인지 먼저 분류한다.

------------------------------------------------------------------------

## STEP 12 --- Day 15 HTTP/API 핵심 복습

### 목표

브라우저와 서버가 HTTP로 통신하는 기본 구조를 다시 설명한다.

``` text
Client
  ↓ Request
Server
  ↓ Response
Client
```

### 확인할 내용

-   Method
-   URL
-   Headers
-   Body
-   Response
-   Status Code
-   JSON
-   API Contract

> **팁** HTTP 요청을 볼 때 항상 Method → URL → Headers → Body → Status →
> Response Body 순서로 읽는다.

------------------------------------------------------------------------

## STEP 13 --- Day 16\~17 비동기 JavaScript 복습

### 목표

네트워크 통신에서 Promise와 async/await가 왜 필요한지 다시 연결한다.

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
Data
```

### 확인할 내용

-   Promise
-   fulfilled / rejected
-   `async`
-   `await`
-   `throw`
-   `try/catch`
-   fetch의 네트워크 오류와 HTTP 오류 차이

> **팁** `await`가 보이면 바로 앞 표현식이 어떤 Promise를 반환하는지
> 확인한다.

------------------------------------------------------------------------

## STEP 14 --- GET / POST / PATCH / DELETE 복습

### 목표

HTTP Method를 실제 쇼핑몰 사용자 행동과 연결한다.

  행동             Method
  ---------------- --------
  주문 목록 조회   GET
  주문 생성        POST
  주문 상태 변경   PATCH
  주문 삭제        DELETE

### 특별 확인

-   POST의 JSON Body
-   PATCH의 부분 변경
-   DELETE `204 No Content`
-   `response.ok`

> **팁** Method를 암기하기보다 사용자 행동을 보고 적절한 HTTP 동작으로
> 번역하는 연습을 한다.

------------------------------------------------------------------------

## STEP 15 --- HTTP 결과를 React State에 연결하기

### 목표

Day 15\~17의 핵심을 React UI와 하나의 흐름으로 연결한다.

``` text
Request
  ↓
API
  ↓
Response
  ↓
JSON
  ↓
React State
  ↓
Re-render
  ↓
UI
```

### 상태

-   Data
-   Loading
-   Error
-   Empty

> **팁** 서버 데이터 화면에서는 데이터뿐 아니라 Loading/Error/Empty
> 상태까지 UI의 일부로 본다.

------------------------------------------------------------------------

## STEP 16 --- useEffect와 외부 시스템 동기화 복습

### 목표

컴포넌트가 API와 동기화될 때 Effect가 어떤 역할을 하는지 이해한다.

### 확인할 내용

-   최초 데이터 로드
-   effect callback을 `async`로 직접 만들지 않는 이유
-   cleanup
-   dependency
-   개발 환경 Strict Mode에서의 추가 실행

> **팁** `useEffect = API 호출`로 외우지 말고 외부 시스템과의 동기화라는
> 더 큰 개념으로 기억한다.

------------------------------------------------------------------------

## STEP 17 --- 현재 프로젝트 코드 건강검진

### 목표

처음부터 재구현하지 않고 지금까지 만든 코드를 현재 지식으로 점검한다.

### 검사 항목

-   중복 Domain 타입
-   사용하지 않는 코드
-   Props 타입 불일치
-   State 위치
-   Hook 책임
-   localStorage 의존 위치
-   Component 책임
-   import/export 일관성
-   `.ts` / `.tsx` 구분

### 원칙

문제가 없으면 유지한다. 이해가 부족한 부분만 복습하고 실제로 작업을 막는
문제만 최소한으로 수정한다.

> **팁** 복습을 대규모 리팩터링으로 바꾸지 않는다.

------------------------------------------------------------------------

## STEP 18 --- 실제 구현 전 준비 완료 확인

### 목표

다음 단계에서 Day 17의 HTTP 이론을 실제 Next.js + TypeScript 프로젝트로
옮길 준비가 되었는지 확인한다.

### 스스로 설명할 수 있어야 하는 흐름

``` text
AdminOrdersPage
      ↓
useOrders
      ↓
fetch()
      ↓
HTTP Request
      ↓
API
      ↓
HTTP Response
      ↓
React State
      ↓
OrderCard
```

그리고 상태 변경:

``` text
OrderCard
   ↓
updateOrderStatus
   ↓
PATCH
   ↓
API
   ↓
updatedOrder
   ↓
setOrders
   ↓
UI
```

> **팁** 코드 없이 위 흐름을 설명할 수 있다면 실제 구현을 시작할 준비가
> 된 것이다.

------------------------------------------------------------------------

## Day 18 완료 기준

Day 18에서는 새로운 기능의 양보다 **기존 지식을 연결하는 것**이 목표다.

다음을 설명할 수 있으면 완료한다.

-   JavaScript와 React의 역할 차이
-   React와 Next.js의 역할 차이
-   JavaScript와 TypeScript의 관계
-   Product → Cart → Order 데이터 흐름
-   Props → Event → State → Re-render 흐름
-   localStorage 기반 구조와 HTTP API 기반 구조의 차이
-   HTTP Request/Response 구조
-   Promise와 async/await가 필요한 이유
-   HTTP 결과가 React State와 UI로 연결되는 과정

------------------------------------------------------------------------

## Day 18 이후

Day 17에서 예정했던 다음 내용은 Day 18에서 억지로 진행하지 않는다.

``` text
기존 예정
STEP 19 → API Layer
STEP 20 → 전체 통합
```

이 내용은 실제 HTTP 코드를 충분히 구현하고 `useOrders` 내부에서 HTTP
세부사항의 반복과 책임 혼합을 직접 경험한 뒤 진행한다.

다음 실제 구현 단계의 우선 목표:

``` text
GET /api/orders
↓
실제 Response 확인
↓
React State 반영
↓
관리자 주문 목록 렌더링
↓
PATCH /api/orders/:id
↓
주문 상태 변경 확인
```

그 후 필요성이 명확해졌을 때:

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

구조를 배우고 적용한다.

------------------------------------------------------------------------

## 앞으로의 학습 원칙

> **원리는 단순하게, 구현은 실제 환경답게.**

-   이론: React + JavaScript
-   작은 실습: React + JavaScript
-   실제 쇼핑몰 구현: Next.js + TypeScript
-   새로운 구조: 필요성을 먼저 경험한 뒤 도입
-   완료 기준: 코드가 동작하면서 그 이유와 데이터 흐름까지 설명 가능
