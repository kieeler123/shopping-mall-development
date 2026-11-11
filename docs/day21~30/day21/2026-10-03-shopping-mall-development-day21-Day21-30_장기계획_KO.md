# Day 21\~30 --- React / Next.js 데이터 흐름 장기 학습 플랜

> **큰 목표:** 데이터가 API에서 들어와 State가 되고, 사용자 이벤트로
> 변경되고, 컴포넌트 사이를 이동하며, 최종적으로 하나의 기능으로
> 구조화되는 과정을 이해한다.

------------------------------------------------------------------------

# 전체 큰 흐름

``` text
Day 21~25
동작 원리
"데이터가 어떻게 움직이는가?"

        ↓

Day 26~30
구조화
"그 데이터를 사용하는 앱을 어떻게 나누고 관리하는가?"
```

------------------------------------------------------------------------

## Day 21 --- 비동기 데이터 흐름

### 핵심 질문

> API에서 데이터를 어떻게 가져오는가?

### 학습 주제

``` text
Promise
async
await
fetch
Response
response.ok
response.json()
throw
try / catch / finally
```

### 핵심 흐름

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
response.ok
↓
response.json()
↓
Promise<Data>
↓
await
↓
Data
```

### 완료 목표

`fetch → Promise → await → Response → json → await → Data`를 자기 말로
설명한다.

------------------------------------------------------------------------

## Day 22 --- React State 업데이트와 불변성

### 핵심 질문

> 가져온 데이터를 React에서 어떻게 관리하고 변경하는가?

### 학습 주제

``` text
useState
setState
재렌더링
불변성
prevState
spread
map
filter
```

### 핵심 흐름

``` text
Data
↓
State
↓
setState
↓
새로운 State 생성
↓
재렌더링
↓
UI
```

### 완료 목표

``` ts
setOrders((prevOrders) =>
  prevOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order
  )
);
```

를 자기 말로 설명한다.

------------------------------------------------------------------------

## Day 23 --- 이벤트와 State

### 핵심 질문

> 사용자가 어떻게 State 변경을 시작하는가?

### 학습 주제

``` text
onClick
onChange
event
event handler
함수 호출
State 업데이트
```

### 핵심 흐름

``` text
사용자
↓
onClick / onChange
↓
Event
↓
함수 실행
↓
State 변경
↓
재렌더링
↓
UI 변경
```

### 실제 프로젝트 연결

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

이 코드에서 사용자 이벤트가 어떻게 상태 변경 함수까지 전달되는지
이해한다.

------------------------------------------------------------------------

## Day 24 --- `useEffect`와 외부 시스템 동기화

### 핵심 질문

> 컴포넌트는 언제 외부 시스템과 동기화하는가?

### 학습 주제

``` text
render
Effect
useEffect
dependency array
외부 시스템
API 호출
```

### 핵심 흐름

``` text
렌더링
↓
useEffect
↓
외부 시스템과 동기화
↓
API
↓
State 업데이트
↓
재렌더링
```

### 실제 프로젝트 연결

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

`useEffect = fetch`로 외우지 않고, 외부 시스템과의 동기화라는 역할을
이해한다.

------------------------------------------------------------------------

## Day 25 --- 데이터 흐름 통합

### 핵심 질문

> Day 21\~24의 개념을 하나의 기능 안에서 어떻게 연결하는가?

### 학습 흐름

``` text
API
↓
fetch
↓
Data
↓
State
↓
UI
↓
사용자 Event
↓
함수 실행
↓
API 수정 요청
↓
수정된 Data
↓
State 수정
↓
재렌더링
↓
UI 갱신
```

### 목표

비동기, State, Event, Effect를 별개의 개념이 아니라 하나의 데이터
흐름으로 연결한다.

Day 25는 새로운 개념을 많이 추가하기보다 Day 21\~24를 통합하는 날로
사용한다.

------------------------------------------------------------------------

# Day 21\~25 완료 시점

여기까지의 질문은:

> **데이터는 어떻게 움직이는가?**

이다.

``` text
API
↓
비동기
↓
Data
↓
State
↓
Event
↓
State 변경
↓
UI
```

Day 26부터는 질문이 바뀐다.

> **이 흐름을 사용하는 코드를 어떻게 구조화할 것인가?**

------------------------------------------------------------------------

## Day 26 --- Props와 부모·자식 데이터 흐름

### 핵심 질문

> 데이터와 함수는 컴포넌트 사이를 어떻게 이동하는가?

### 학습 주제

``` text
Parent
Child
Props
데이터 전달
함수 전달
자식 이벤트
```

### 핵심 흐름

``` text
Parent
↓
data / function
↓
props
↓
Child
```

그리고:

``` text
Child에서 사용자 Event
↓
부모가 내려준 함수 호출
↓
State 변경
↓
재렌더링
```

### 실제 프로젝트 연결

``` tsx
<OrderCard
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

`order`와 `updateOrderStatus`가 왜 props로 내려가는지 설명한다.

------------------------------------------------------------------------

## Day 27 --- 컴포넌트 분리와 책임

### 핵심 질문

> 어떤 코드를 어느 컴포넌트가 담당해야 하는가?

### 학습 주제

``` text
컴포넌트 책임
페이지
목록
카드
아이템
UI 분리
```

### 예시 구조

``` text
AdminOrdersPage
│
├─ 페이지 전체 구성
│
├─ OrderCard
│   └─ 주문 하나 표시
│
└─ OrderItemList
    └─ 주문 상품 목록
```

### 목표

디자인 패턴을 깊게 배우기보다:

> "이 코드는 누구의 책임인가?"

를 판단하는 연습을 한다.

------------------------------------------------------------------------

## Day 28 --- Custom Hook

### 핵심 질문

> UI와 상태/로직을 어떻게 분리할 수 있는가?

### 학습 주제

``` text
Custom Hook
useOrders
State
Effect
fetch
업데이트 함수
UI와 로직 분리
```

### 핵심 구조

``` text
Component
→ UI 표현

Custom Hook
→ State
→ Effect
→ API 통신
→ 업데이트 로직
```

### 실제 프로젝트 연결

``` ts
const {
  orders,
  isLoading,
  error,
  updateOrderStatus,
} = useOrders();
```

새로운 Hook을 많이 만드는 것보다 기존 `useOrders()`가 왜 존재하는지를
설명하는 것을 먼저 목표로 한다.

------------------------------------------------------------------------

## Day 29 --- UI 상태 모델링

### 핵심 질문

> 데이터가 있다는 상태 외에 UI에는 어떤 상태가 존재하는가?

### 학습 주제

``` text
Loading
Error
Empty
Success
조건부 렌더링
```

### 핵심 모델

``` text
요청 중
→ Loading

실패
→ Error

성공 + 데이터 없음
→ Empty

성공 + 데이터 있음
→ Success
```

### 실제 프로젝트 연결

``` tsx
{isLoading && <p>주문을 불러오는 중입니다...</p>}

{error && <p>오류: {error}</p>}

{!isLoading && !error && orders.length === 0 && (
  <p>주문이 없습니다.</p>
)}
```

UI를 단순히 데이터 표시 영역이 아니라 여러 상태를 표현하는 시스템으로
이해한다.

------------------------------------------------------------------------

## Day 30 --- 실전 통합과 리팩터링

### 핵심 질문

> 지금까지 배운 내용을 이용해 실제 기능 하나를 처음부터 끝까지 설명할 수
> 있는가?

새로운 이론을 많이 추가하지 않는다.

주문 관리 기능 전체를 분석한다.

``` text
AdminOrdersPage
↓
useOrders
↓
useEffect
↓
loadOrders
↓
GET API
↓
Order[]
↓
setOrders
↓
재렌더링
↓
OrderCard
↓
onChange
↓
updateOrderStatus
↓
PATCH API
↓
updatedOrder
↓
setOrders(prev => ...)
↓
map
↓
새 Order[]
↓
재렌더링
↓
UI 변경
```

### 완료 목표

코드를 외워서 재현하는 것이 아니라:

> 각 코드가 왜 존재하고, 데이터가 어디에서 어디로 이동하는지 설명하면서
> 코드를 읽고 일부를 직접 작성할 수 있다.

------------------------------------------------------------------------

# Day 21\~30을 하나의 이야기로 보기

``` text
Day 21
데이터는 어떻게 가져오지?
        ↓
Day 22
가져온 데이터는 어떻게 바꾸지?
        ↓
Day 23
사용자가 어떻게 변경을 시작하지?
        ↓
Day 24
외부 시스템과 언제 동기화하지?
        ↓
Day 25
앞의 내용을 전부 연결하면?
        ↓
Day 26
컴포넌트끼리는 어떻게 전달하지?
        ↓
Day 27
코드는 어디에 나눠야 하지?
        ↓
Day 28
상태와 로직은 어디로 분리하지?
        ↓
Day 29
Loading / Error / Empty / Success는 어떻게 표현하지?
        ↓
Day 30
실제 기능 전체를 내가 설명하고 구성할 수 있을까?
```

------------------------------------------------------------------------

# 10일 과정의 두 챕터

## Part 1 --- Day 21\~25: 동작 원리

``` text
비동기
↓
State
↓
Event
↓
Effect
↓
통합
```

핵심 질문:

> **데이터가 어떻게 움직이는가?**

## Part 2 --- Day 26\~30: 구조화

``` text
Props
↓
컴포넌트 책임
↓
Custom Hook
↓
UI 상태 모델링
↓
실전 리팩터링
```

핵심 질문:

> **그 데이터를 사용하는 앱을 어떻게 나누고 관리하는가?**

------------------------------------------------------------------------

# Day 30 이후 자연스럽게 이어질 질문

Day 21\~30에서는 주로 요청을 보내고 받은 데이터를 React/Next.js UI에서
사용하는 쪽을 본다.

그다음에는 자연스럽게:

``` text
Client
↓
fetch("/api/orders")
↓
그 요청은 어디로 가는가?
↓
Next.js Server / API
```

라는 질문으로 넘어갈 수 있다.

다음 큰 챕터에서는:

``` text
Route Handler
Request / Response
GET / POST / PATCH / DELETE
동적 Route
HTTP
DB
Server / Client 전체 연결
```

같은 서버/API 영역으로 확장할 수 있다.

------------------------------------------------------------------------

# 운영 원칙

이 로드맵의 하루 분량은 고정된 절대량이 아니다.

``` text
큰 방향은 유지
↓
하루 학습
↓
이해도 확인
↓
다음 날 깊이 조절
```

특히 처음 이론을 깊게 배우는 단계에서는 진도를 빠르게 넘기는 것보다
**전날 개념을 다음 날 실제 코드에서 다시 발견하는 것**을 중요하게 본다.
