# Day 16 --- STEP 01. 왜 HTTP와 API가 필요한가?

> **Day 16 주제:** HTTP와 API 기초\
> **STEP 01 핵심 질문:** 지금까지 `localStorage`로 잘 만들고 있었는데,
> 왜 갑자기 HTTP와 API를 배워야 할까?

------------------------------------------------------------------------

## 0. 이번 STEP에서 가장 먼저 잡아야 할 생각

Day 16에서 HTTP, API, Request, Response, Method, JSON 같은 새로운 단어가
한꺼번에 등장한다.

처음 배우면 각각을 따로 외우기 쉽다.

``` text
HTTP = 통신 규칙
API = 인터페이스
GET = 조회
POST = 생성
JSON = 데이터 형식
```

물론 틀린 설명은 아니다. 하지만 이렇게만 외우면 실제 코드에서 다음과
같은 코드가 나왔을 때 다시 막히기 쉽다.

``` js
const response = await fetch("/orders");
```

왜 `fetch()`를 사용하는지, 왜 기다려야 하는지, `/orders`가 무엇인지,
`response`에는 무엇이 들어 있는지를 연결하지 못하기 때문이다.

그래서 STEP 01에서는 용어 암기보다 먼저 **아키텍처가 왜 바뀌는지**를
이해한다.

핵심 변화는 이것이다.

``` text
이전
React → localStorage

앞으로
React → 다른 컴퓨터에 있는 Server
```

두 대상의 위치가 달라졌기 때문에 **통신**이 필요해진다.

> HTTP와 API는 갑자기 등장한 별개의 공부가 아니라, 지금까지 만든 React
> 애플리케이션이 브라우저 밖의 Server와 데이터를 주고받기 시작하면서
> 자연스럽게 필요한 개념이다.

------------------------------------------------------------------------

# 1. 지금까지 주문 데이터는 어디에 있었을까?

우리가 기존 주문 기능을 다음과 같은 구조로 만들었다고 생각해보자.

``` text
React Component
      ↓
   useOrders
      ↓
 localStorage
```

예를 들어 주문을 저장한다면 개념적으로 다음과 같은 코드가 가능하다.

``` js
localStorage.setItem("orders", JSON.stringify(orders));
```

주문을 다시 읽을 때는:

``` js
const savedOrders = localStorage.getItem("orders");
```

처럼 브라우저가 제공하는 `localStorage` API를 사용한다.

여기서 중요한 것은 문법이 아니다.

**React와 주문 데이터가 어디에서 만나는지**를 보자.

``` text
Browser
┌───────────────────────────────┐
│                               │
│   React                       │
│     │                         │
│     ▼                         │
│   useOrders                   │
│     │                         │
│     ▼                         │
│   localStorage                │
│                               │
└───────────────────────────────┘
```

React도 브라우저에서 실행되고 `localStorage`도 브라우저가 제공한다.

즉, 지금까지는 주문 데이터를 읽기 위해 인터넷을 통해 별도의 주문
Server에 Request를 보낼 필요가 없었다.

### 여기서 중요한 점

`localStorage`도 API이다.

브라우저가 JavaScript에게 다음과 같은 기능을 제공하기 때문이다.

``` js
localStorage.getItem(...)
localStorage.setItem(...)
localStorage.removeItem(...)
```

따라서:

``` text
API = 반드시 HTTP를 사용한다
```

는 잘못된 생각이다.

우리가 Day 16부터 주로 공부하려는 것은 **HTTP를 통해 사용하는 Web API /
HTTP API** 쪽이다.

> **팁**
>
> 지금은 `API = 서버 주소`라고 외우지 말자. 이미 사용했던
> `localStorage`도 API라는 사실을 기억하면, API라는 개념을 HTTP와
> 분리해서 이해하기 쉬워진다.

------------------------------------------------------------------------

# 2. localStorage 방식은 왜 학습에 좋았을까?

처음부터 Server, Database, Authentication, HTTP까지 모두 넣었다면 주문
CRUD 자체를 배우기가 훨씬 어려웠을 것이다.

`localStorage`를 사용하면 비교적 단순하게 다음 흐름에 집중할 수 있다.

``` text
주문 추가
↓
orders 배열 변경
↓
localStorage 저장
↓
React State 변경
↓
UI 변경
```

예를 들어 우리가 먼저 익혀야 했던 핵심은 이런 것들이었다.

``` text
Create
Read
Update
Delete
```

즉 CRUD이다.

``` text
Create → 주문 생성
Read   → 주문 조회
Update → 주문 수정
Delete → 주문 삭제
```

이 CRUD 개념은 Server를 사용한다고 사라지지 않는다.

오히려 Day 16 이후에는 다음처럼 **같은 의도를 다른 데이터 접근 방식으로
표현**하게 된다.

``` text
기존

getOrders()
addOrder()
updateOrder()
deleteOrder()

        ↓ HTTP 방식으로 이동

GET    /orders
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

따라서 지금까지의 공부가 임시 연습이었던 것이 아니다.

기존 CRUD 사고방식이 HTTP API 학습의 기반이 된다.

> **팁**
>
> 새로운 기술을 배울 때 기존 코드를 전부 버린다고 생각하면 학습 부담이
> 커진다. 이번에는 **CRUD라는 목적은 그대로이고, 데이터를 가져오는
> 통로가 바뀐다**고 생각하자.

------------------------------------------------------------------------

# 3. 그런데 실제 서비스에서는 문제가 생긴다

쇼핑몰 주문 데이터를 사용자 브라우저의 `localStorage`에만 저장한다고
생각해보자.

사용자 A의 브라우저:

``` text
Browser A
└─ localStorage
   └─ orders
```

사용자 B의 브라우저:

``` text
Browser B
└─ localStorage
   └─ orders
```

각 브라우저의 저장 공간은 서로 독립적이다.

쇼핑몰 운영자가 모든 사용자의 주문을 처리해야 한다면 브라우저마다 따로
존재하는 주문 데이터를 중심 시스템에서 관리하기 어렵다.

실제 주문 시스템에서는 예를 들어 다음과 같은 처리가 필요할 수 있다.

``` text
사용자
↓
주문 요청
↓
재고 확인
↓
상품 가격 확인
↓
쿠폰 유효성 확인
↓
결제 상태 확인
↓
주문 생성
↓
배송 처리
```

이런 핵심 비즈니스 로직을 전부 Client가 결정하게 하면 문제가 생긴다.

예를 들어 Client가 이런 데이터를 보냈다고 하자.

``` js
const newOrder = {
  productId: 3,
  quantity: 2,
  totalPrice: 100,
};
```

상품의 실제 가격이 50,000원인데 사용자가 브라우저 코드를 조작해서
`totalPrice: 100`을 보낸다면?

Server가 Client 값을 그대로 신뢰하면 안 된다.

따라서 Server는 필요에 따라:

``` text
productId 확인
↓
Database에서 실제 상품 가격 조회
↓
quantity 검증
↓
할인 규칙 적용
↓
최종 가격 계산
↓
주문 저장
```

같은 처리를 할 수 있다.

여기서 중요한 원칙이 나온다.

> **Client-side validation은 UX를 위한 중요한 장치지만, Server-side
> validation을 대체할 수 없다.**

React에서 수량을 1 이상만 입력하게 만들어도 Request 자체는 다른 방식으로
조작될 수 있기 때문이다.

> **팁**
>
> Frontend에서 버튼을 숨기거나 입력을 제한했다고 해서 보안 규칙이 완성된
> 것이 아니다. 중요한 권한과 데이터 검증은 Server에서도 강제해야 한다.

------------------------------------------------------------------------

# 4. 그래서 Server가 등장한다

구조를 바꿔보자.

``` text
React
↓
Server
↓
Database
```

이제 주문 데이터는 Client의 브라우저만 바라보는 것이 아니라 Server 측
시스템에서 관리된다.

조금 더 자세히 쓰면:

``` text
React Client
      │
      ▼
    Server
      │
      ▼
   Database
```

여기서 Server와 Database를 같은 것으로 생각하면 안 된다.

## Server의 역할

Server는 Request를 받아 처리한다.

예를 들면:

``` text
누가 요청했는가?
이 사용자가 이 주문을 볼 수 있는가?
입력값이 올바른가?
주문 가능한 상태인가?
어떤 데이터를 Database에서 가져올까?
Client에 어떤 결과를 반환할까?
```

## Database의 역할

Database는 데이터를 저장하고 조회하는 역할을 담당한다.

``` text
orders
products
users
payments
...
```

개념적으로 주문 조회는 다음처럼 될 수 있다.

``` text
React
↓
Server
↓
Database에서 주문 조회
↓
Server
↓
React
```

따라서:

``` text
Server ≠ Database
```

이다.

### 왜 Client가 Database에 바로 접근하지 않을까?

초급 구조에서 다음과 같이 생각해보자.

``` text
React → Database
```

이렇게 Client가 Database를 직접 자유롭게 조작한다면 여러 문제가 생길 수
있다.

예를 들어:

-   Database credential 노출 위험
-   사용자가 허용되지 않은 데이터를 조회할 가능성
-   중요한 검증 로직 우회 가능성
-   Database 구조 변경이 Frontend에 직접 영향을 줄 가능성
-   비즈니스 규칙을 중앙에서 통제하기 어려움

그래서 전형적인 구조에서는 Server/API가 중간 경계를 만든다.

``` text
Client
↓
API / Server
↓
Database
```

단, 실제 서비스에는 BaaS처럼 Client에서 직접 데이터 서비스에 접근하는
것처럼 보이는 구조도 있다. 그 경우에도 Authentication, Authorization,
Security Rules 같은 통제 계층이 사라지는 것은 아니다.

> **팁**
>
> 입문 단계에서는 `Client → Server → Database`를 기본 구조로 잡자.
> 나중에 다른 아키텍처를 만나더라도 이 기준점이 있으면 차이를 이해하기
> 쉽다.

------------------------------------------------------------------------

# 5. 여기서 진짜 문제가 하나 생긴다

이전에는 React와 `localStorage`가 같은 브라우저 환경 안에 있었다.

그런데 이제는:

``` text
React Client
```

와

``` text
Server
```

가 서로 다른 시스템일 수 있다.

예를 들어 사용자의 노트북에서 브라우저가 실행되고:

``` text
사용자 노트북
└─ Browser
   └─ React
```

쇼핑몰 Server는 데이터센터나 Cloud 환경에서 실행될 수 있다.

``` text
Remote Server
└─ Orders API
   └─ Database와 통신
```

그러면 React가 Server에게 이런 의사를 전달할 방법이 필요하다.

``` text
주문 목록 주세요.
```

또는:

``` text
이 주문을 생성해주세요.
```

또는:

``` text
10번 주문 상태를 변경해주세요.
```

그리고 Server도 결과를 돌려줄 방법이 필요하다.

``` text
주문 목록입니다.
```

``` text
주문이 생성되었습니다.
```

``` text
해당 주문이 없습니다.
```

즉 **두 프로그램 사이의 통신**이 필요하다.

------------------------------------------------------------------------

# 6. 이때 HTTP가 등장한다

HTTP는 Client와 Server가 메시지를 교환할 때 사용하는 통신 Protocol이다.

가장 단순한 그림은:

``` text
Client
   │
   │ HTTP Request
   ▼
Server
   │
   │ HTTP Response
   ▼
Client
```

이다.

Client가 Server에게 보내는 메시지를 **Request**라고 하고, Server가
Client에게 돌려주는 메시지를 **Response**라고 한다.

주문 목록을 가져오는 상황이라면:

``` text
React
↓
"주문 목록을 조회하고 싶습니다."
↓
HTTP Request
↓
Server
```

Server는 처리 후:

``` text
Server
↓
"성공했습니다. 주문 목록은 이것입니다."
↓
HTTP Response
↓
React
```

처럼 결과를 돌려준다.

실제 HTTP에서는 이런 의도가 Method, URL, Headers, Body, Status Code 등의
구조로 표현된다.

Day 16에서 앞으로 하나씩 배우게 된다.

> **팁**
>
> 아직 GET, POST, Header를 완벽하게 외울 필요가 없다. STEP 01에서는
> **HTTP가 왜 필요해졌는가 = Client와 Server가 떨어져 있어서 통신 규칙이
> 필요하기 때문**이라는 원인부터 확실히 잡자.

------------------------------------------------------------------------

# 7. 그러면 API는 어디에 등장할까?

HTTP와 API를 같은 것으로 생각하기 쉽다.

하지만 역할이 다르다.

## HTTP

``` text
어떤 규칙으로 통신할 것인가?
```

## API

``` text
Server가 어떤 기능과 데이터를
Client에게 어떤 방식으로 사용할 수 있게 할 것인가?
```

예를 들어 Orders API가 다음과 같은 기능을 제공한다고 해보자.

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

이것은 Client가 주문 관련 기능을 사용할 수 있는 인터페이스의 일부이다.

예를 들어:

``` text
GET /orders
```

라는 약속이 있다면 Client는 그 약속에 맞게 주문 목록 조회를 요청할 수
있다.

즉:

``` text
HTTP
→ 통신 규칙

Orders API
→ 주문 기능을 사용할 수 있도록 정의한 인터페이스/계약
```

이라고 구분할 수 있다.

## 비유로 이해하기

식당을 예로 들면 API를 메뉴판에 비유할 수 있다.

``` text
손님
↓
메뉴판에서 주문 가능한 항목 확인
↓
정해진 방식으로 주문
↓
주방이 처리
↓
결과를 받음
```

여기서 메뉴판은 손님이 주방 내부 구조를 몰라도 어떤 요청을 할 수 있는지
알려준다.

API도 비슷하게 Client가 Server 내부 구현을 전부 몰라도 정해진 계약에
따라 기능을 사용할 수 있게 한다.

하지만 이 비유는 완벽하지 않다. HTTP는 메뉴판 자체가 아니라 **메시지를
주고받는 규칙**에 더 가깝다.

> **팁**
>
> `API = URL`로 축소해서 외우지 말자. URL/Endpoint는 API Contract의 한
> 부분이다. API에는 Method, 입력 형식, Response 형식, 인증 방식, Error
> 규칙 등도 포함될 수 있다.

------------------------------------------------------------------------

# 8. localStorage 구조와 HTTP API 구조를 직접 비교해보자

## 기존 구조

``` text
React Component
↓
useOrders
↓
localStorage
```

주문 조회:

``` text
React
↓
localStorage.getItem("orders")
↓
orders
↓
State
↓
UI
```

## 앞으로의 구조

``` text
React Component
↓
useOrders
↓
HTTP Request
↓
Orders API / Server
↓
Database
↓
HTTP Response
↓
useOrders
↓
React State
↓
UI
```

주문 조회:

``` text
React
↓
GET /orders
↓
HTTP Request
↓
Server
↓
Database
↓
200 OK + 주문 데이터
↓
HTTP Response
↓
React
↓
State
↓
UI
```

가장 중요한 변화는 이것이다.

``` text
localStorage에서 직접 읽기
```

에서:

``` text
Server에게 요청하고
Response를 기다린 뒤
그 결과를 State에 반영하기
```

로 바뀐다.

이 변화 때문에 비동기 처리도 중요해진다.

------------------------------------------------------------------------

# 9. Day 15의 Promise가 여기서 다시 등장하는 이유

Day 15에서 Promise, `async`, `await`, `try/catch`를 배웠다면 이런 의문이
생길 수 있다.

> Promise를 왜 먼저 배운 거지?

HTTP 통신을 시작하면 이유가 명확해진다.

Server Request는 시간이 걸린다.

``` text
Request 시작
↓
Network 이동
↓
Server가 Request 수신
↓
Server 처리
↓
Database 작업
↓
Response 생성
↓
Network 이동
↓
Client가 Response 수신
```

JavaScript는 이 모든 과정이 끝날 때까지 브라우저 전체를 멈춰 놓는
방식으로 동작하면 안 된다.

그래서 비동기 처리 모델이 필요하다.

Day 17에서 보게 될 대표적인 코드:

``` js
const response = await fetch("/orders");
```

여기서:

``` text
fetch()
→ JavaScript Web API
→ HTTP Request를 시작하는 데 사용
→ Promise 반환

await
→ 그 Promise 기반 비동기 작업의 결과를 기다림

response
→ Server에서 온 HTTP Response를 나타내는 객체
```

라는 연결이 생긴다.

중요한 정확성 하나:

``` text
HTTP가 Promise를 반환한다
```

가 아니다.

정확히는:

``` text
fetch()라는 JavaScript Web API가 Promise를 반환한다.
```

HTTP는 통신 Protocol이다.

> **팁**
>
> Day 15와 Day 16을 별도 과목으로 생각하지 말자.
>
> ``` text
> Day 15
> Promise / async / await
>        ↓
> Day 16
> HTTP Request / Response
>        ↓
> Day 17
> fetch()
> ```
>
> 이런 순서로 연결된다.

------------------------------------------------------------------------

# 10. HTTP 통신이 생기면 실패의 종류도 늘어난다

`localStorage`에서 데이터를 읽는 것과 Server에서 데이터를 가져오는 것은
실패 상황의 폭이 다르다.

Server 통신에서는 예를 들어:

``` text
인터넷 연결 문제
Server 접근 실패
로그인 필요
권한 없음
잘못된 Request
Resource 없음
Server 내부 오류
```

등이 발생할 수 있다.

HTTP Status Code로 보면 나중에 다음과 같은 값들을 배우게 된다.

``` text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

따라서 React UI도 단순히 데이터만 관리하기보다 다음 상태가 중요해진다.

``` text
Data
Loading
Error
```

예를 들어:

``` js
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

이런 구조가 자연스럽게 등장한다.

## 빈 배열과 Loading은 다르다

``` text
orders = []
```

만 보고는:

``` text
주문이 정말 0개인가?
아직 Request가 끝나지 않았나?
실패해서 데이터를 못 받았나?
```

를 구분하기 어렵다.

그래서 Server Data를 다루는 UI에서는 상태 모델이 더 중요해진다.

> **팁**
>
> API 통신을 배울 때 Network 코드만 보지 말고 UI까지 연결하자.
>
> ``` text
> Request → Loading → Success/Error → State → UI
> ```
>
> 이 흐름을 이해해야 React에서 API를 제대로 사용할 수 있다.

------------------------------------------------------------------------

# 11. 예제: 주문 목록을 조회한다고 생각해보자

사용자가 주문 내역 페이지를 연다.

## 1단계 --- React가 주문 데이터가 필요하다고 판단

``` text
OrderHistory Page
↓
orders가 필요함
```

## 2단계 --- Client가 Request

개념적으로:

``` http
GET /orders
```

아직 GET의 세부 의미를 완벽히 몰라도 된다.

지금은:

``` text
Client
→ Server에게 주문 목록을 요청
```

이라고 이해하면 된다.

## 3단계 --- Server가 처리

``` text
Request 수신
↓
사용자 확인
↓
권한 확인
↓
Database에서 주문 조회
↓
Response 생성
```

## 4단계 --- Response

예:

``` http
200 OK
Content-Type: application/json

[
  {
    "id": 10,
    "status": "shipping"
  }
]
```

## 5단계 --- React가 결과를 State에 반영

개념적으로:

``` text
HTTP Response
↓
Body 처리
↓
JavaScript Data
↓
setOrders(data)
↓
React rerender
↓
화면에 주문 표시
```

전체를 한 번에 보면:

``` text
User
↓
OrderHistory
↓
React Client
↓
HTTP Request
↓
Orders API
↓
Server
↓
Database
↓
Server
↓
HTTP Response
↓
React
↓
State
↓
UI
```

이 그림이 앞으로 Day 16 전체를 이해하는 뼈대가 된다.

------------------------------------------------------------------------

# 12. 예제: 주문을 생성한다면?

사용자가 상품 3번을 2개 주문한다고 해보자.

React에는 먼저 JavaScript 값이 있을 수 있다.

``` js
const newOrder = {
  productId: 3,
  quantity: 2,
};
```

Client는 Server에게 주문 생성을 요청한다.

개념적으로:

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Server는 단순히 그대로 저장하는 것만이 아니라 필요에 따라:

``` text
사용자 확인
↓
상품 존재 확인
↓
수량 검증
↓
재고 확인
↓
가격 계산
↓
주문 생성
↓
Database 저장
```

을 수행할 수 있다.

그리고 Server가 최종 Resource를 반환할 수 있다.

``` json
{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid",
  "createdAt": "..."
}
```

여기서 매우 중요한 차이가 있다.

``` text
newOrder
→ Client가 보낸 입력

createdOrder
→ Server가 처리 후 확정하여 반환한 Resource
```

둘은 반드시 완전히 같은 데이터일 필요가 없다.

Server가 ID, 생성 시각, 상태 등을 결정할 수 있기 때문이다.

> **팁**
>
> Server를 단순한 `localStorage의 인터넷 버전`이라고 생각하지 말자.
> Server는 데이터 저장뿐 아니라 검증, 권한, 비즈니스 로직, Response 구성
> 등을 담당할 수 있다.

------------------------------------------------------------------------

# 13. 왜 React가 Database 결과를 바로 화면에 보여주는 게 아닐까?

초보 단계에서 다음처럼 생각하기 쉽다.

``` text
Database 변경
↓
화면 자동 변경
```

하지만 React UI는 React State를 기반으로 렌더링된다.

일반적인 흐름은:

``` text
Database
↓
Server
↓
HTTP Response
↓
React가 Response 처리
↓
State 변경
↓
rerender
↓
UI 변경
```

이다.

즉 Server의 데이터와 React State는 같은 것이 아니다.

Server 측의 데이터가 Source of Truth 역할을 할 수 있지만, Client는
Response를 받아 자신의 State를 적절히 동기화해야 한다.

예:

``` text
POST /orders 성공
↓
createdOrder 반환
↓
React State에 createdOrder 반영
↓
주문 목록 UI 갱신
```

이 구조는 이후 `useOrders`를 HTTP 기반으로 바꿀 때 매우 중요하다.

> **팁**
>
> `Server Data → 자동 UI`라고 생각하지 말고 중간에 반드시 **React
> State**를 넣어서 흐름을 그려보자.

------------------------------------------------------------------------

# 14. API가 있으면 Server 내부를 몰라도 되는 이유

Client 입장에서 중요한 것은 Server 내부 코드 전체가 아니다.

Orders API가 다음과 같이 약속했다고 해보자.

``` text
GET /orders
→ 주문 목록 반환

POST /orders
→ 주문 생성
```

Client는 Server 내부에서 어떤 Framework를 쓰는지 반드시 알 필요가 없다.

예를 들어 Server가 내부적으로:

``` text
Node.js
Java
Python
Go
```

중 무엇으로 구현되어 있더라도, Client와 합의한 HTTP API Contract가
유지된다면 Frontend는 같은 방식으로 통신할 수 있다.

Database도:

``` text
MySQL
PostgreSQL
MongoDB
```

등으로 바뀔 수 있다.

API는 이런 내부 구현과 Client 사이에 경계를 만들어준다.

``` text
React
↓
API Contract
↓
Server 내부 구현
↓
Database
```

이것이 API를 단순 URL보다 큰 개념으로 이해해야 하는 이유 중 하나이다.

------------------------------------------------------------------------

# 15. 여기까지의 개념을 역할별로 분리하자

아직 세부 내용은 이후 STEP에서 배우지만, 지금 위치만 잡아보자.

  개념        현재 단계에서의 역할
  ----------- ---------------------------------------------------------------
  React       Client UI/Application
  Client      Request를 보내는 쪽
  Server      Request를 처리하고 Response를 만드는 쪽
  Database    데이터를 저장·조회하는 시스템
  HTTP        Client와 Server가 통신하는 Protocol
  API         Client가 기능/데이터를 사용할 수 있게 하는 Interface/Contract
  Request     Client → Server 메시지
  Response    Server → Client 메시지
  JSON        Request/Response Body 등에 사용할 수 있는 데이터 표현 형식
  Promise     비동기 작업의 미래 결과를 표현하는 JS 개념
  `fetch()`   HTTP Request를 시작하는 데 사용하는 Browser Web API

이 표에서 특히 다음을 구분해야 한다.

``` text
HTTP ≠ API
API ≠ Server
Server ≠ Database
Response ≠ JSON
fetch() ≠ HTTP
```

------------------------------------------------------------------------

# 16. 자주 하는 오해 ① --- API는 Server다?

아니다.

Server는 실제 Request를 처리하는 시스템이고, API는 Client가 사용할 수
있도록 제공되는 인터페이스/계약이다.

``` text
Server
└─ Orders API를 제공할 수 있음
```

한 Server가 여러 API 영역을 제공할 수도 있다.

``` text
Server
├─ Products API
├─ Orders API
├─ Users API
└─ Reviews API
```

------------------------------------------------------------------------

# 17. 자주 하는 오해 ② --- API는 URL이다?

URL은 API Contract의 중요한 부분이지만 API 전체와 동일하지 않다.

예를 들어:

``` text
POST /orders
```

를 제대로 사용하려면 `/orders`라는 주소만 알아서는 부족할 수 있다.

다음 정보도 필요할 수 있다.

``` text
어떤 Method?
어떤 Header?
Body에는 어떤 필드?
Authentication은?
성공 Status는?
실패 Status는?
Response Body 구조는?
```

따라서 API는 더 큰 계약이다.

------------------------------------------------------------------------

# 18. 자주 하는 오해 ③ --- HTTP는 JSON을 보내는 기술이다?

HTTP Body에 JSON을 많이 사용하기 때문에 그렇게 느낄 수 있다.

하지만 HTTP와 JSON은 별개이다.

HTTP Body에는:

``` text
JSON
text
HTML
image
file
기타 media type
```

등이 들어갈 수 있다.

따라서:

``` text
HTTP ≠ JSON
Body ≠ JSON
```

이다.

JSON은 HTTP 메시지 안에서 사용할 수 있는 **데이터 표현 방식 중
하나**이다.

------------------------------------------------------------------------

# 19. 자주 하는 오해 ④ --- Server를 쓰면 React State는 필요 없다?

아니다.

Server Data와 React State는 역할이 다르다.

``` text
Server Data
→ Server 측에서 관리되는 데이터

React State
→ 현재 Client UI를 렌더링하기 위해 React가 사용하는 상태
```

일반적인 흐름:

``` text
Server
↓ Response
React
↓
setOrders(...)
↓
State
↓
UI
```

React는 Server가 있다고 해서 State 없이 자동으로 화면을 업데이트하지
않는다.

------------------------------------------------------------------------

# 20. 자주 하는 오해 ⑤ --- Client validation이 있으면 Server validation은 필요 없다?

필요하다.

React에서:

``` js
if (quantity < 1) {
  return;
}
```

처럼 막아도 사용자가 정상 UI만 사용한다는 보장은 없다.

Request는 개발자 도구나 다른 Client 등에서도 만들어질 수 있다.

따라서 중요한 규칙은 Server에서도 확인해야 한다.

``` text
Client Validation
→ 빠른 피드백 / UX

Server Validation
→ Server가 신뢰할 수 있는 규칙 강제
```

둘은 경쟁 관계가 아니라 서로 다른 역할이다.

------------------------------------------------------------------------

# 21. Day 16 전체에서 앞으로 무엇을 배우게 될까?

STEP 01에서 전체 구조를 잡았다.

앞으로는 이 그림을 확대한다.

``` text
React Client
      │
      │ HTTP Request
      │
      ├─ Method
      ├─ URL / Endpoint
      ├─ Headers
      └─ Body
      │
      ▼
     API
      │
    Server
      │
      ├─ Authentication
      ├─ Authorization
      ├─ Validation
      ├─ Business Logic
      └─ Database
      │
      ▼
HTTP Response
      │
      ├─ Status Code
      ├─ Headers
      └─ Body
      │
      ▼
    React
      │
      ├─ Data
      ├─ Loading
      └─ Error
      │
      ▼
    State
      │
      ▼
      UI
```

즉 Day 16의 나머지 STEP들은 이 큰 그림의 부품을 하나씩 확대해서 배우는
과정이다.

------------------------------------------------------------------------

# 22. Day 17의 fetch() 코드를 미리 보면

아직 구현을 시작하지 않아도 다음 코드를 한번 보자.

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

STEP 01을 이해했다면 최소한 이렇게 볼 수 있다.

``` text
React
↓
fetch()
↓
Server와 통신하려고 함
↓
/orders라는 API 쪽으로 Request
↓
Response를 기다림
↓
response를 받음
```

Day 16이 끝나면 더 구체적으로:

``` text
/orders
→ URL / Endpoint 쪽 개념

POST
→ HTTP Method

headers
→ HTTP Request Headers

Content-Type
→ Body의 media type 설명

body
→ Request Body

JSON.stringify()
→ JS Value를 JSON Text로 serialize

await
→ Promise 기반 비동기 작업 결과를 기다림

response
→ HTTP Response를 나타내는 object
```

까지 설명할 수 있게 되는 것이 목표다.

------------------------------------------------------------------------

# 23. STEP 01 전체 흐름을 한 번에 연결하기

처음에는:

``` text
React
↓
useOrders
↓
localStorage
```

였다.

이 방식에서는 주문 데이터가 브라우저 쪽에 있었다.

하지만 Server 중심 구조로 이동하면:

``` text
React
↓
HTTP Request
↓
API
↓
Server
↓
Database
```

가 된다.

그리고 결과가 돌아온다.

``` text
Database
↓
Server
↓
HTTP Response
↓
React
↓
State
↓
UI
```

Client와 Server가 서로 다른 시스템이므로 통신 규칙이 필요하고, 그 역할을
HTTP가 담당한다.

Server가 Client에게 어떤 기능과 데이터를 어떤 방식으로 사용할 수 있게
할지 정의하는 인터페이스가 API이다.

그리고 통신에는 기다림과 실패 가능성이 있으므로 Day 15의 Promise / async
/ await / try-catch가 실제 의미를 갖기 시작한다.

최종적으로:

``` text
Day 15
비동기 처리 이해
      ↓
Day 16
HTTP / API 이해
      ↓
Day 17
fetch()로 실제 HTTP Request
```

로 이어진다.

------------------------------------------------------------------------

# 24. 스스로 설명해보기

다음 질문에 코드 없이 말로 답해보자.

### Q1

왜 `localStorage`를 사용할 때보다 Server를 사용할 때 HTTP가 중요해질까?

### Q2

Server와 Database는 왜 같은 개념이 아닐까?

### Q3

HTTP와 API는 어떤 차이가 있을까?

### Q4

React가 Server의 Database를 직접 자유롭게 조작하지 않고 Server/API를
거치는 이유는 무엇일까?

### Q5

Server가 주문을 생성했다고 해서 React UI가 자동으로 바뀌지 않는 이유는
무엇일까?

### Q6

Day 15의 Promise와 Day 16의 HTTP는 어떻게 연결될까?

### Q7

`fetch()`와 HTTP는 같은 개념일까?

------------------------------------------------------------------------

# 25. 정답을 확인하기 전에 생각할 핵심 문장

Q1:

``` text
React와 Server가 서로 다른 시스템에 있으므로
메시지를 주고받기 위한 통신이 필요하다.
```

Q2:

``` text
Server는 Request를 처리하고,
Database는 데이터를 저장·조회하는 역할을 담당한다.
```

Q3:

``` text
HTTP = 통신 Protocol
API = 기능/데이터를 이용할 수 있게 하는 Interface/Contract
```

Q4:

``` text
Authentication, Authorization, Validation,
Business Logic, 보안, 내부 구현 분리 등이 필요하기 때문이다.
```

Q5:

``` text
React UI는 React State를 기반으로 렌더링되므로,
Response를 처리해 State를 갱신해야 한다.
```

Q6:

``` text
HTTP 통신에는 기다림이 있고,
JavaScript에서는 fetch() 같은 Promise 기반 API를
async/await로 다룰 수 있다.
```

Q7:

``` text
아니다.

HTTP = Protocol
fetch() = HTTP Request를 시작하는 데 사용할 수 있는 JavaScript Web API
```

------------------------------------------------------------------------

# 26. STEP 01 핵심 체크리스트

아래 내용을 자신의 말로 설명할 수 있다면 STEP 01의 목표를 달성한 것이다.

-   [ ] 기존 `React → useOrders → localStorage` 구조를 설명할 수 있다.
-   [ ] Server 기반 구조에서 왜 통신이 필요한지 설명할 수 있다.
-   [ ] Client와 Server의 역할을 대략 구분할 수 있다.
-   [ ] Server와 Database가 같은 개념이 아니라는 것을 안다.
-   [ ] HTTP를 통신 Protocol이라고 설명할 수 있다.
-   [ ] API를 Server 자체나 URL 하나와 동일시하지 않는다.
-   [ ] `localStorage`도 API라는 점을 이해한다.
-   [ ] Client validation과 Server validation의 역할이 다르다는 것을
    안다.
-   [ ] Server Data와 React State가 같은 것이 아님을 이해한다.
-   [ ] HTTP 통신과 Promise/async/await가 왜 연결되는지 설명할 수 있다.
-   [ ] `fetch()`와 HTTP를 같은 개념으로 생각하지 않는다.
-   [ ] 앞으로 Request/Response를 배워야 하는 이유를 설명할 수 있다.

------------------------------------------------------------------------

# 27. STEP 01 최종 핵심 문장

> **기존에는 React가 브라우저의 localStorage에서 직접 주문 데이터를 읽고
> 썼지만, Server 기반 구조에서는 React와 Server가 서로 통신해야 한다.
> HTTP는 그 통신에 사용되는 Protocol이고, API는 Server의 기능과 데이터를
> Client가 정해진 방식으로 사용할 수 있게 하는 Interface/Contract이다.
> 이 통신에는 기다림과 실패 가능성이 있기 때문에 Promise, async/await,
> try/catch가 실제 HTTP 통신과 연결된다.**

------------------------------------------------------------------------

# 다음 STEP과의 연결

STEP 01에서는 **왜 HTTP/API가 필요한가**를 배웠다.

다음에는 이 구조의 양쪽 주체를 더 정확히 분리한다.

``` text
Client
↓ Request
Server
↓ Response
Client
```

즉 다음 주제는:

> **STEP 02 --- Client와 Server는 정확히 어떤 역할을 하는가?**

이다.
