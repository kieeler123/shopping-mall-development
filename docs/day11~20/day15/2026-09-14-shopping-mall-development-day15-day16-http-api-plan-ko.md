# Day 16 — HTTP와 API 기초 학습 계획

> Day 15의 `Promise`, `async`, `await`, `try/catch`를 실제 서버 통신 개념과 연결하기 위한 이론 중심 Day입니다.  
> Day 16에서는 아직 `fetch()` 구현을 본격적으로 하지 않고, **HTTP 요청/응답과 API의 구조를 이해하는 것**을 목표로 합니다.

---

## STEP 1 — 왜 HTTP와 API가 필요한가?

### 학습 목표

지금까지의 쇼핑몰 프로젝트가 브라우저 내부 데이터에서 동작했다면, 실제 서비스에서는 주문 데이터를 서버와 주고받아야 한다는 차이를 이해합니다.

```text
지금까지

React
↓
useOrders
↓
localStorage

앞으로

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

핵심 질문은 다음입니다.

```text
브라우저와 서버는
어떻게 서로 데이터를 주고받는가?
```

그 통신 규칙의 중심에 HTTP가 있습니다.

**팁**

HTTP 용어부터 외우지 말고 `브라우저 밖에 있는 주문 데이터를 어떻게 가져올까?`라는 문제에서 출발합니다.

---

## STEP 2 — Client와 Server 이해

### 학습 목표

HTTP 통신에서 누가 요청하고 누가 응답하는지 구분합니다.

```text
Client
↓ Request
Server

Client
↑ Response
Server
```

쇼핑몰 프로젝트에서는 React 앱이 Client 역할을 하고, 주문 데이터를 제공하는 Backend가 Server 역할을 하게 됩니다.

```text
React
"주문 목록 주세요"
        ↓
      Server
        ↓
"여기 주문 목록입니다"
```

핵심 개념:

- Client: 서비스를 요청하는 쪽
- Server: 요청을 받아 처리하고 응답하는 쪽
- Request: Client가 Server에 보내는 요청
- Response: Server가 Client에 돌려주는 응답

**팁**

`Client → Request → Server → Response → Client` 흐름을 먼저 완전히 익히면 이후 HTTP 개념이 훨씬 쉬워집니다.

---

## STEP 3 — HTTP란 무엇인가?

### 학습 목표

HTTP를 단순한 약어가 아니라 Client와 Server 사이의 통신 규칙으로 이해합니다.

HTTP는 웹에서 Client와 Server가 요청과 응답을 주고받을 때 사용하는 대표적인 프로토콜입니다.

```text
Client
↓
HTTP Request
↓
Server
↓
HTTP Response
↓
Client
```

Day 16에서는 HTTP 내부 구현보다 다음 질문에 집중합니다.

```text
어디로 요청하는가?
무엇을 요청하는가?
어떤 방식으로 요청하는가?
결과는 어떻게 돌아오는가?
```

**팁**

HTTP를 `인터넷` 자체라고 생각하지 말고, 웹에서 데이터를 주고받기 위한 약속이라고 이해합니다.

---

## STEP 4 — Request 구조 이해

### 학습 목표

HTTP Request에 어떤 정보가 들어가는지 큰 구조를 파악합니다.

```text
Request

Method
URL
Headers
Body
```

예:

```text
POST /orders

Content-Type: application/json

{
  "name": "Kim",
  "totalPrice": 50000
}
```

각 요소의 역할:

```text
Method  → 무엇을 하려는가?
URL     → 어디에 요청하는가?
Headers → 요청에 대한 부가 정보
Body    → 서버에 보낼 실제 데이터
```

모든 Request가 Body를 갖는 것은 아닙니다.

**팁**

처음에는 Request를 `행동 + 목적지 + 설명 + 데이터` 네 부분으로 나눠 읽어보세요.

---

## STEP 5 — URL과 Endpoint 이해

### 학습 목표

API 요청의 목적지를 이해합니다.

예:

```text
https://example.com/api/orders
```

개념적으로 다음처럼 볼 수 있습니다.

```text
Server 주소
+
API 경로
```

주문 관련 Endpoint 예:

```text
GET    /orders
GET    /orders/10
POST   /orders
PATCH  /orders/10
DELETE /orders/10
```

`/orders/10`은 일반적으로 특정 주문을 식별하는 형태로 사용할 수 있습니다.

**팁**

Endpoint를 단순 URL 문자열로 외우지 말고 `어떤 자원(resource)을 대상으로 하는 주소인가?`를 생각하세요.

---

## STEP 6 — Resource와 API 이해

### 학습 목표

API와 Resource의 관계를 이해합니다.

쇼핑몰에는 여러 데이터 자원이 있을 수 있습니다.

```text
products
users
orders
cart
```

API는 Client가 이런 기능이나 데이터에 접근할 수 있도록 정해 놓은 인터페이스라고 이해할 수 있습니다.

```text
React
↓
Orders API
↓
Order Data
```

예:

```text
/orders
/products
/users
```

**팁**

API를 단순히 `서버 주소`라고 생각하지 마세요. Client가 서버의 기능과 데이터를 사용할 수 있도록 제공되는 접점이라는 개념이 중요합니다.

---

## STEP 7 — HTTP Method: GET

### 학습 목표

조회 기능과 GET을 연결합니다.

```text
주문 목록 조회
↓
GET /orders
```

특정 주문 조회:

```text
GET /orders/10
```

프로젝트에서 이미 했던 `주문 데이터를 가져온다`는 동작을 HTTP에서는 GET과 연결할 수 있습니다.

```text
READ
↓
GET
```

**팁**

`GET = 외운다`가 아니라 `조회(Read) 기능을 HTTP로 표현하면 GET`이라고 연결하세요.

---

## STEP 8 — HTTP Method: POST

### 학습 목표

새로운 데이터 생성과 POST를 연결합니다.

```text
새 주문 생성
↓
POST /orders
```

Request Body 예:

```json
{
  "name": "Kim",
  "phone": "010-0000-0000",
  "totalPrice": 50000
}
```

프로젝트의 주문 생성 기능과 연결하면:

```text
CREATE
↓
POST
```

**팁**

POST에서는 `무엇을 새로 만들 것인가?`와 `서버에 어떤 데이터를 보내야 하는가?`를 함께 생각하세요.

---

## STEP 9 — HTTP Method: PATCH

### 학습 목표

기존 주문의 일부 수정과 PATCH를 연결합니다.

예를 들어 주문 상태만 변경한다면:

```text
PATCH /orders/10
```

```json
{
  "status": "배송중"
}
```

프로젝트에서 이미 배운 상태 변경과 연결하면:

```text
UPDATE
↓
PATCH
```

**팁**

Day 16에서는 PATCH와 PUT의 세부 차이를 너무 깊게 파지 않습니다. 우선 `기존 데이터의 일부 수정`이라는 프로젝트 상황에 PATCH를 연결합니다.

---

## STEP 10 — HTTP Method: DELETE

### 학습 목표

삭제 기능과 DELETE를 연결합니다.

```text
DELETE /orders/10
```

CRUD와 연결하면:

```text
DELETE
↓
DELETE
```

전체 CRUD를 정리하면:

```text
Create → POST
Read   → GET
Update → PATCH
Delete → DELETE
```

**팁**

HTTP Method 네 개를 각각 외우기보다 지금까지 직접 만든 CRUD 기능과 1:1로 연결해 기억하세요.

---

## STEP 11 — Response 구조 이해

### 학습 목표

Server가 Request를 처리한 뒤 무엇을 돌려주는지 이해합니다.

개념적으로 Response는 다음 정보들을 포함할 수 있습니다.

```text
Response

Status Code
Headers
Body
```

예:

```text
Status: 200

{
  "id": 10,
  "status": "배송중"
}
```

Client는 Response를 받아 성공 여부와 데이터를 판단합니다.

**팁**

Request와 Response를 한 쌍으로 보세요. `보냈다`에서 끝나는 것이 아니라 항상 `무엇이 돌아왔는가?`까지 추적합니다.

---

## STEP 12 — HTTP Status Code 기초

### 학습 목표

상태 코드가 요청 처리 결과를 나타낸다는 것을 이해합니다.

Day 16에서는 우선 대표적인 코드만 다룹니다.

```text
200 OK
→ 요청 성공

201 Created
→ 새로운 데이터 생성 성공

400 Bad Request
→ 잘못된 요청

401 Unauthorized
→ 인증 필요/인증 실패와 관련

403 Forbidden
→ 접근 권한 부족

404 Not Found
→ 요청한 자원을 찾을 수 없음

500 Internal Server Error
→ 서버 내부 오류
```

중요한 것은 숫자를 모두 암기하는 것이 아니라 범주와 의미를 읽는 것입니다.

```text
2xx → 성공
4xx → Client 요청 측 문제
5xx → Server 측 문제
```

**팁**

처음에는 `200/201`, `400/401/403/404`, `500` 정도만 실제 상황과 연결하세요.

---

## STEP 13 — JSON 이해

### 학습 목표

Client와 Server 사이에서 데이터를 표현할 때 자주 사용하는 JSON 형식을 이해합니다.

예:

```json
{
  "id": 10,
  "name": "Kim",
  "status": "배송중",
  "totalPrice": 50000
}
```

배열도 전달할 수 있습니다.

```json
[
  { "id": 1, "status": "결제완료" },
  { "id": 2, "status": "배송중" }
]
```

JavaScript 객체와 비슷해 보이지만 JSON은 데이터 교환 형식입니다.

**팁**

`JSON = JavaScript 객체 그 자체`라고 동일시하지 마세요. 모양은 비슷하지만 역할이 다릅니다.

---

## STEP 14 — Headers와 Content-Type 기초

### 학습 목표

Headers가 Request/Response에 대한 부가 정보를 전달한다는 것을 이해합니다.

대표적인 예:

```text
Content-Type: application/json
```

이는 전달되는 내용이 JSON 형식이라는 정보를 나타낼 수 있습니다.

개념적으로:

```text
Body
→ 실제 데이터

Headers
→ 그 통신에 대한 설명 정보
```

**팁**

Headers의 모든 종류를 외우지 않습니다. Day 16에서는 `Content-Type` 하나를 확실히 이해하는 것으로 충분합니다.

---

## STEP 15 — HTTP와 Day 15 비동기 처리 연결

### 학습 목표

왜 Day 15에서 Promise와 async/await를 먼저 배웠는지 연결합니다.

서버 응답은 즉시 돌아온다고 보장할 수 없습니다.

```text
Request 전송
↓
기다림
↓
Response 도착
```

따라서 실제 코드에서는 다음과 같은 흐름이 필요해집니다.

```text
HTTP Request
↓
Promise
↓
await
↓
Response
↓
성공 처리 / 실패 처리
```

Day 15:

```text
Promise
async
await
try/catch
```

Day 16:

```text
HTTP
Request
Response
API
```

Day 17에서 두 영역이 `fetch()`를 통해 실제 코드로 연결됩니다.

**팁**

`await가 왜 필요했지?`라는 질문을 서버 응답을 기다리는 상황과 연결하면 Day 15 이론이 실제 개발 개념으로 바뀝니다.

---

## STEP 16 — 주문 CRUD를 HTTP로 변환

### 학습 목표

지금까지 쇼핑몰에서 구현한 기능을 HTTP 관점으로 다시 표현합니다.

```text
주문 전체 조회
→ GET /orders

특정 주문 조회
→ GET /orders/:id

주문 생성
→ POST /orders

주문 상태 변경
→ PATCH /orders/:id

주문 삭제
→ DELETE /orders/:id
```

이제 기존 로직을 다음처럼 바라볼 수 있습니다.

```text
UI 행동
↓
HTTP Request
↓
API
↓
Server 처리
↓
HTTP Response
↓
React state 변경
↓
UI 갱신
```

**팁**

새로운 예제를 따로 만들기보다 지금까지 만든 `orders` 기능을 HTTP 언어로 번역하는 연습을 하세요.

---

## STEP 17 — 성공과 실패 흐름 모델링

### 학습 목표

API 통신에는 성공만 존재하지 않는다는 것을 이해합니다.

성공:

```text
Request
↓
Server
↓
200 / 201
↓
Response Data
↓
state 업데이트
↓
UI 표시
```

실패:

```text
Request
↓
Server
↓
4xx / 5xx
↓
Error 처리
↓
사용자에게 피드백
```

Day 15의 `try/catch`가 여기서 실제 역할을 갖기 시작합니다.

**팁**

API를 배울 때는 항상 성공 경로와 실패 경로를 동시에 그려보세요.

---

## STEP 18 — Day 16 전체 실행 흐름

### 학습 목표

HTTP/API 통신의 큰 그림을 설명할 수 있도록 정리합니다.

```text
사용자가 주문 조회
↓
React(Client)
↓
GET /orders
↓
HTTP Request
↓
API / Server
↓
주문 데이터 처리
↓
HTTP Response
↓
Status Code + JSON
↓
React
↓
state
↓
UI
```

생성이라면:

```text
사용자 주문
↓
POST /orders
↓
Request Body(JSON)
↓
Server
↓
201 Created
↓
생성된 주문 Response
```

**팁**

이 흐름을 코드 없이 자기 말로 설명할 수 있다면 Day 17의 `fetch()`를 배울 준비가 된 것입니다.

---

## STEP 19 — 자주 헷갈리는 개념 구분

### 학습 목표

Day 16에서 섞이기 쉬운 용어를 구분합니다.

```text
HTTP
→ Client와 Server가 통신하는 규칙

API
→ Client가 서버의 기능/데이터를 사용할 수 있게 제공된 인터페이스

Request
→ Client가 Server에 보내는 것

Response
→ Server가 Client에 돌려주는 것

Method
→ 요청의 목적/행동을 표현

Endpoint
→ 요청을 보내는 API의 대상 경로

JSON
→ 데이터를 표현하고 교환하는 형식

Status Code
→ 요청 처리 결과를 나타내는 코드
```

**팁**

용어를 각각 따로 암기하기보다 하나의 `GET /orders` 요청 안에서 모든 용어를 찾아보세요.

---

## STEP 20 — Day 16 최종 복습 및 완료 기준

### 최종 체크리스트

```text
1. Client와 Server를 설명할 수 있다
2. Request와 Response를 구분할 수 있다
3. HTTP가 왜 필요한지 설명할 수 있다
4. API의 역할을 설명할 수 있다
5. URL과 Endpoint의 역할을 이해한다
6. GET / POST / PATCH / DELETE를 CRUD와 연결할 수 있다
7. Request의 Method / URL / Headers / Body를 구분할 수 있다
8. Response의 Status Code / Headers / Body를 구분할 수 있다
9. 대표적인 2xx / 4xx / 5xx 의미를 이해한다
10. JSON의 역할을 설명할 수 있다
11. Content-Type의 기본 의미를 설명할 수 있다
12. Day 15 async/await와 HTTP 통신을 연결할 수 있다
13. 주문 CRUD를 HTTP 요청으로 표현할 수 있다
14. 성공과 실패 흐름을 설명할 수 있다
15. 전체 Request → Response → state → UI 흐름을 설명할 수 있다
```

### Day 16 완료 기준

다음 흐름을 자신의 말로 설명할 수 있으면 Day 16을 마칩니다.

```text
React
↓
HTTP Request
↓
API
↓
Server
↓
HTTP Response
↓
JSON + Status Code
↓
React state
↓
UI
```

다음 Day에서는 이 이론을 실제 JavaScript 코드로 연결합니다.

```text
Day 16
HTTP + API Theory
↓
Day 17
fetch() + Mock API
```

**팁**

Day 16의 목표는 HTTP 전문가가 되는 것이 아닙니다. `fetch()` 코드를 보았을 때 왜 URL, method, headers, body, response가 등장하는지 설명할 수 있는 수준이면 충분합니다.
