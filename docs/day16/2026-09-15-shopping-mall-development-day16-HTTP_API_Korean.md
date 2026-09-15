# Day 16 --- HTTP & API 기초 이론

> 목표: `fetch()`를 구현하기 전에 HTTP Request/Response와 API 구조를
> 이해하고, 기존 React 주문 CRUD를 서버 API 구조로 연결한다.

## 전체 흐름

``` text
사용자 → React(Client) → HTTP Request → API/Server → Database
     ← React State/UI ← HTTP Response ←
```

------------------------------------------------------------------------

## STEP 1. 왜 HTTP와 API가 필요한가?

기존 프로젝트는 브라우저 내부 저장소를 사용했다.

``` text
React → useOrders → localStorage
```

서버와 데이터베이스를 사용하는 구조에서는 다음처럼 바뀐다.

``` text
React → HTTP Request → API → Server → Database
Database → Server → HTTP Response → React → State → UI
```

핵심 질문은 **브라우저와 서버가 어떻게 데이터를 주고받는가?**이다. 이
통신에서 HTTP와 API가 등장한다.

**팁:** API 학습을 새로운 기능을 추가하는 것으로만 보지 말고, 기존의
데이터 접근 경로가 `localStorage → Server`로 바뀌는 과정으로 이해하자.

## STEP 2. Client와 Server

Client는 요청하는 쪽이고 Server는 요청을 받아 처리하고 응답하는 쪽이다.
현재 프로젝트에서 React는 Client 역할을 한다.

``` text
Client → Request → Server
Client ← Response ← Server
```

Server는 필요하면 Database를 조회하거나 수정하고,
인증·권한·검증·비즈니스 로직 등을 수행할 수 있다. Server와 Database는
같은 개념이 아니다.

**팁:** `Client=요청`, `Server=처리/응답`, `Database=저장/조회`라는 기본
역할을 먼저 잡자.

## STEP 3. HTTP란?

HTTP(Hypertext Transfer Protocol)는 Client와 Server가 메시지를 주고받기
위한 **통신 프로토콜**이다. HTTP는 인터넷 자체도, Server도, API도
아니다.

HTTP 통신에서 중요한 요소는 Request, Response, Method, Headers, Body,
Status Code 등이다.

**팁:** HTTP를 `데이터`가 아니라 **데이터를 주고받는 규칙**으로
기억하자.

## STEP 4. HTTP Request 구조

HTTP Request는 Client가 Server로 보내는 메시지다.

``` text
Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

예:

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

-   Method: 무엇을 할 것인가
-   URL: 어디에 요청할 것인가
-   Headers: 메시지에 대한 메타데이터
-   Body: 실제 전달할 콘텐츠

모든 Request가 Body를 가지는 것은 아니다.

**팁:** `행동(Method) → 목적지(URL) → 설명(Headers) → 데이터(Body)`
순서로 읽자.

## STEP 5. URL과 Endpoint

URL은 요청 목적지를 나타낸다.

``` text
https://api.myshop.com + /orders/10
└─ Base URL             └─ Path
```

Orders API의 예:

``` text
GET    /orders
GET    /orders/10
POST   /orders
PATCH  /orders/10
DELETE /orders/10
```

문서의 `/orders/:id`에서 `:id`는 placeholder이며 실제 요청에서는
`/orders/10`처럼 실제 값이 들어간다.

Query Parameter도 URL의 일부다.

``` text
GET /orders?status=배송중
```

`/orders/10`은 특정 Resource를 가리키는 데 자주 쓰이고,
`?status=배송중`은 조회 조건이나 옵션에 자주 사용된다. 정확한 의미는 API
계약이 결정한다.

**팁:** Path는 `무엇을 대상으로?`, Query는 `어떤 조건/옵션으로?`라고
생각하자.

## STEP 6. Resource와 API

Resource는 API가 다루는 도메인 대상이다.

``` text
products
users
orders
cart
```

API(Application Programming Interface)는 한 프로그램이 다른 프로그램의
기능이나 데이터를 사용할 수 있도록 제공하는 인터페이스다.

API는 URL 하나가 아니다. API 계약에는 Method, Endpoint, Headers, Request
Body, Response, Status Code, 인증 방식 등이 포함될 수 있다.

``` text
Orders API
├─ GET /orders
├─ POST /orders
├─ PATCH /orders/:id
└─ DELETE /orders/:id
```

HTTP API는 HTTP를 통해 제공되는 API다. 모든 API가 HTTP API인 것은
아니다.

**팁:** `API = 넓은 인터페이스`,
`Endpoint = 그 안의 구체적인 요청 지점`으로 구분하자.

## STEP 7. GET --- Read

GET은 Resource를 조회하는 데 사용한다.

``` http
GET /orders
GET /orders/10
```

일반적인 API에서는 GET Request Body에 의존하지 않고 Path와 Query를
사용해 조회 대상을 표현한다.

GET은 HTTP 의미론에서 **safe**하고 **idempotent**하다.

-   Safe: 요청의 의미 자체가 Resource 상태 변경을 요구하지 않는다.
-   Idempotent: 같은 요청을 반복해도 요청 자체가 의도하는 서버 상태
    효과가 한 번 수행한 것과 같다.

응답 데이터가 매번 완전히 동일해야 한다는 뜻은 아니다.

**팁:** GET은 `Read + Safe + Idempotent`로 연결하되, safe를 보안상
안전하다는 뜻으로 오해하지 말자.

## STEP 8. POST --- Create

CRUD 스타일 API에서 POST는 새로운 Resource 생성에 흔히 사용된다.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Server는 Body를 그대로 저장하기보다 인증, 검증, 비즈니스 로직 등을
수행할 수 있다. 성공적으로 Resource가 생성되면 대표적으로
`201 Created`가 사용될 수 있다.

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "결제완료"
}
```

POST는 일반적으로 safe하지 않고 idempotent도 보장되지 않는다. 같은 생성
요청을 반복하면 중복 Resource가 만들어질 수 있다.

**팁:** Request Body와 Server가 반환한 생성 결과를 구분하자. `id` 같은
값은 Server가 생성할 수 있다.

## STEP 9. PATCH --- Update

PATCH는 Resource의 부분 수정을 표현하는 데 자주 사용된다.

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "배송중"
}
```

여기서:

``` text
/orders/10 → 누구를 수정?
Body       → 무엇을 수정?
```

Server는 Resource 존재 여부, 권한, 입력값, 상태 변경 규칙 등을 확인한 후
DB를 수정할 수 있다.

PATCH Method 자체는 idempotency를 보장하지 않는다.
`status를 배송중으로 설정`하는 요청은 결과적으로 idempotent할 수 있지만,
`quantity를 1 증가`시키는 방식은 그렇지 않을 수 있다.

**팁:** PATCH는 **Target + Changes**, 즉 `URL=대상`,
`Body=변경 내용`으로 읽자.

## STEP 10. DELETE --- Delete

DELETE는 Resource 삭제를 요청한다.

``` http
DELETE /orders/10
```

단순 삭제에서는 Method와 Path만으로 의도가 충분해 Body가 없는 경우가
흔하지만, Body가 절대 불가능한 것은 아니다. API 계약을 따라야 한다.

성공 예:

``` http
204 No Content
```

또는 API에 따라 `200 OK`와 Response Body를 사용할 수도 있다. Resource가
없으면 `404 Not Found` 등이 가능하다.

DELETE는 safe하지 않지만 HTTP 의미론상 idempotent하다. 첫 삭제가 204이고
두 번째 삭제가 404여도 최종적으로 대상이 존재하지 않는 상태 효과는 같다.

**팁:** `DELETE = 204`라고 외우지 말자. DELETE는 요청 Method이고 204는
가능한 Response 결과 중 하나다.

## STEP 11. HTTP Response 구조

Response는 Server가 Client로 보내는 메시지다.

``` text
Response
├─ Status Code
├─ Headers
└─ Body
```

예:

``` http
200 OK
Content-Type: application/json

{
  "id": 10,
  "status": "배송중"
}
```

Status Code는 처리 결과를 나타내고, Headers는 Response의 메타데이터를
전달하며, Body에는 실제 콘텐츠가 들어간다.

`204 No Content`처럼 성공했지만 Body가 없는 Response도 있다.

**팁:** `Response ≠ JSON`. JSON은 Response Body가 사용할 수 있는 데이터
표현 형식 중 하나다.

## STEP 12. Status Code

핵심 Status Code:

  -----------------------------------------------------------------------
  코드                                의미
  ----------------------------------- -----------------------------------
  200 OK                              성공

  201 Created                         Resource 생성 성공

  204 No Content                      성공, Body 없음

  400 Bad Request                     Request가 API 요구사항에 맞지 않는
                                      등의 문제

  401 Unauthorized                    인증 정보가 필요하거나 유효하지
                                      않은 경우 등에 사용

  403 Forbidden                       요청 작업에 대한 권한이 없는 경우
                                      등에 사용

  404 Not Found                       대상 Resource를 찾을 수 없음

  500 Internal Server Error           Server 처리 중 예상하지 못한 문제
  -----------------------------------------------------------------------

범주:

``` text
2xx → Success
4xx → Request 측 범주의 문제
5xx → Server 측 처리 문제
```

4xx/5xx를 특정 개발자의 잘못이라는 의미로 해석하면 안 된다.

**팁:** `Method = Client의 요청 의도`,
`Status Code = Server의 처리 결과`로 구분하자.

## STEP 13. JSON

JSON(JavaScript Object Notation)은 데이터를 표현하고 교환하기 위한
텍스트 기반 형식이다.

JavaScript Object:

``` js
const order = {
  id: 10,
  status: "배송중",
};
```

JSON:

``` json
{
  "id": 10,
  "status": "배송중"
}
```

둘은 비슷해 보이지만 같은 것이 아니다.

``` text
JavaScript Value
→ JSON.stringify()
→ JSON Text
→ HTTP Body
```

반대 방향은 개념적으로:

``` text
HTTP Body
→ JSON Text
→ Parsing
→ JavaScript Value
```

JSON 값에는 string, number, boolean, null, object, array 등이 있으며
`undefined`나 function은 JSON 값이 아니다.

**팁:** `{}`가 보인다고 무조건 JSON이라고 부르지 말고 현재 값이 JS
런타임 데이터인지 JSON 텍스트인지 문맥을 확인하자.

## STEP 14. Headers와 Content-Type

Headers는 HTTP 메시지에 대한 메타데이터다.

대표 예:

``` http
Content-Type: application/json
Authorization: Bearer ...
Accept: application/json
```

`Content-Type`은 **현재 메시지 Body의 미디어 타입**을 설명한다.

Request에서:

``` text
Content-Type → Request Body의 타입
```

Response에서:

``` text
Content-Type → Response Body의 타입
```

Body가 없으면 Content-Type이 필요하지 않을 수도 있다. Content-Type이
없거나 잘못됐을 때의 동작은 Server/API 구현에 따라 달라질 수 있다.

`Accept`는 Client가 받을 수 있거나 선호하는 Response 미디어 타입을
표현하는 데 사용된다.

**팁:** `Headers=메타데이터`, `Body=실제 콘텐츠`,
`Content-Type=Body 타입 설명`으로 분리하자.

## STEP 15. HTTP와 Promise / async / await / try-catch

Server 통신에는 시간이 걸린다.

``` text
Request → 기다림 → Response
```

JavaScript의 `fetch()` 같은 Web API는 비동기 작업을 Promise로 표현한다.

``` text
fetch()
→ Promise
→ await
→ Response
```

HTTP 자체가 Promise를 반환하는 것은 아니다. `fetch()`가 Promise를
반환한다.

`await`는 브라우저 전체를 멈추는 것이 아니라 현재 async 함수의 이후
실행을 해당 Promise의 완료까지 기다리게 한다.

개념 예:

``` js
async function loadOrders() {
  try {
    const response = await fetch("/orders");

    if (!response.ok) {
      throw new Error("주문 조회 실패");
    }

    const data = await response.json();
    // state 업데이트
  } catch (error) {
    // 오류 처리
  }
}
```

중요: `fetch()`는 일반적으로 HTTP 404/500 Response만으로 Promise를
reject하지 않는다. 실제 Response가 도착했기 때문이다. 따라서 HTTP 성공
여부는 `response.ok` 또는 Status를 확인해야 한다. 네트워크 수준의 실패
등은 Promise rejection으로 이어질 수 있다.

**팁:** `response.ok = HTTP 상태 확인`,
`try/catch = JavaScript 예외/Promise rejection 처리`로 역할을 구분하자.

## STEP 16. 기존 주문 CRUD를 HTTP로 변환

기존 함수와 HTTP API를 연결하면:

  기능                         HTTP
  ---------------------------- ----------------------
  `getOrders()`                `GET /orders`
  `getOrder(id)`               `GET /orders/:id`
  `addOrder(order)`            `POST /orders`
  `updateOrder(id, changes)`   `PATCH /orders/:id`
  `deleteOrder(id)`            `DELETE /orders/:id`

전체 구조:

``` text
UI Action
→ useOrders
→ HTTP Request
→ API
→ Server
→ Database
→ HTTP Response
→ useOrders
→ React State
→ UI
```

Server가 최종적으로 확정한 데이터를 Response로 받아 state와 동기화하는
흐름이 중요하다.

**팁:** 기존 CRUD가 없어지는 것이 아니라 **데이터 접근 방식이
localStorage에서 HTTP API로 변경된다**고 이해하자.

## STEP 17. 성공과 실패를 React UI에 연결

API 통신에서는 Data만이 아니라 Loading과 Error도 생각해야 한다.

``` text
Request 시작
→ Loading
→ Response
   ├─ Success → Data → State → UI
   └─ Error   → Error State → Error UI
→ Loading 종료
```

예:

``` text
200 → 주문 데이터 표시
400 → 입력 확인 안내
401 → 로그인/인증 관련 처리
403 → 권한 없음 안내
404 → 주문을 찾을 수 없음
500 → 서버 문제 안내/재시도
```

빈 배열 `[]`과 아직 Loading 중인 상태는 다르다. 조회 결과 주문이 0개인
것과 결과가 아직 오지 않은 것은 구분해야 한다.

**팁:** Server 데이터를 다룰 때 항상 `Data / Loading / Error` 세 상태를
함께 생각하자.

## STEP 18. 전체 Request → Response 왕복

### 주문 조회

``` text
사용자
→ 주문 페이지
→ React
→ GET /orders
→ HTTP Request
→ API/Server
→ Database 조회
→ 200 + JSON
→ HTTP Response
→ React
→ 주문 데이터
→ State
→ UI
```

### 주문 생성

``` text
사용자
→ 주문하기
→ React의 newOrder
→ JSON.stringify()
→ POST /orders
→ Content-Type: application/json
→ JSON Body
→ Server
→ Parsing / Validation / Business Logic
→ Database
→ 201 Created + 생성된 주문 JSON
→ React
→ State
→ UI
```

**팁:** API 통신을 `Request 전송`에서 끝내지 말고 **사용자 행동부터 최종
UI까지 하나의 왕복 흐름**으로 설명하자.

## STEP 19. 핵심 용어 구분

  개념          핵심 의미
  ------------- --------------------------------------------------
  HTTP          Client-Server 통신 프로토콜
  API           기능/데이터를 사용할 수 있게 제공하는 인터페이스
  Request       Client → Server 메시지
  Response      Server → Client 메시지
  Method        Request의 행동 의미
  Endpoint      API의 구체적인 요청 지점
  Header        HTTP 메시지 메타데이터
  Body          HTTP 메시지의 실제 콘텐츠
  JSON          데이터 표현 형식
  Status Code   Server의 Request 처리 결과

질문으로 기억하면 쉽다.

``` text
HTTP        → 어떻게 통신할까?
API         → 어떤 기능/데이터를 사용할 수 있게 할까?
Request     → Client가 무엇을 요청했나?
Method      → 무엇을 할 것인가?
Endpoint    → 어디에 요청할 것인가?
JSON        → 데이터를 어떻게 표현했나?
Response    → Server가 무엇을 돌려줬나?
Status Code → 처리 결과가 어떠했나?
```

**팁:** 정의만 외우지 말고 실제 `POST /orders → 201 + JSON` 예제 안에서
각 용어의 위치를 찾아보자.

## STEP 20. Day 16 최종 정리

HTTP Request:

``` text
Method + URL + Headers + Body
```

HTTP Response:

``` text
Status Code + Headers + Body
```

주문 CRUD:

``` text
POST   /orders      → Create
GET    /orders      → Read
GET    /orders/:id  → Read one
PATCH  /orders/:id  → Update
DELETE /orders/:id  → Delete
```

최종 흐름:

``` text
React(Client)
→ HTTP Request
→ API
→ Server
→ Database
→ HTTP Response
→ Status/Headers/Body
→ React
→ Data / Loading / Error
→ State
→ UI
```

Day 17의 `fetch()`는 새로운 마법이 아니라 이 HTTP 구조를 JavaScript
코드로 실행하는 방법이다.

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

이 코드에서:

``` text
/orders              → URL
POST                 → Method
headers              → Headers
Content-Type         → Body 타입 설명
body                 → Request Body
JSON.stringify()     → JS 값을 JSON 텍스트로 직렬화
await                → Promise 기반 비동기 결과 기다림
response             → HTTP Response
```

**팁:** Day 17로 넘어가기 전에 딱 두 줄을 확실히 기억하자.\
`Request = Method + URL + Headers + Body`\
`Response = Status Code + Headers + Body`

------------------------------------------------------------------------

## Day 16 완료 기준

다음 흐름을 자신의 말로 설명할 수 있다면 충분하다.

``` text
React
→ HTTP Request
→ API/Server
→ 처리 및 Database 접근
→ HTTP Response
→ JSON + Status Code
→ React State
→ UI
```

그리고 `fetch()` 코드에서 URL, Method, Headers, Body, Response가 왜
존재하는지 설명할 수 있다면 Day 17을 시작할 준비가 된 것이다.
