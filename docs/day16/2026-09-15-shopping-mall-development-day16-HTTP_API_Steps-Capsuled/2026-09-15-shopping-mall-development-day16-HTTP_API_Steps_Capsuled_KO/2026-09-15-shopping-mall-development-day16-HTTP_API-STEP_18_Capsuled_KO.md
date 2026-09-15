# Day 16 --- STEP 18. 주문 조회와 생성의 전체 HTTP 흐름

## 이번 STEP의 목표

지금까지 배운 개념을 사용자 행동부터 최종 UI까지 하나의 왕복 흐름으로
연결한다.

## 시나리오 A: 주문 목록 조회

### 1. 사용자 행동

``` text
사용자
↓
주문 내역 페이지 진입
```

React는 화면에 표시할 주문 데이터가 필요하다.

### 2. Request 구성

``` http
GET /orders
```

``` text
Method → GET
Path   → /orders
Body   → 일반적인 조회에서는 없음
```

인증이 필요한 API라면 필요한 인증 정보가 Header 등에 포함될 수 있다.

### 3. Server 처리

``` text
GET /orders
↓
Server
↓
Authentication / Authorization
↓
요청 조건 처리
↓
Business Logic
↓
Database 조회
```

### 4. Response

``` http
200 OK
Content-Type: application/json

[
  { "id": 10, "status": "shipping" },
  { "id": 11, "status": "paid" }
]
```

### 5. React 처리

``` text
Response
↓
Status 확인
↓
Body 처리
↓
JavaScript 주문 데이터
↓
setOrders(data)
↓
React rerender
↓
UI
```

전체:

``` text
User
→ React
→ GET /orders
→ HTTP Request
→ API/Server
→ Database
→ 200 + JSON
→ HTTP Response
→ React State
→ UI
```

## 시나리오 B: 주문 생성

### 1. 사용자 행동

``` text
사용자
↓
[주문하기]
```

React에는 개념적으로:

``` js
const newOrder = {
  productId: 3,
  quantity: 2,
};
```

같은 데이터가 있다.

### 2. JSON 직렬화와 Request

``` text
JavaScript Value
↓
JSON.stringify()
↓
JSON Text
```

Request:

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

### 3. Server 처리

``` text
POST /orders
↓
Authentication / Authorization
↓
JSON Parsing
↓
Validation
↓
Business Logic
↓
Database Insert
```

### 4. Response

Server가 ID 등을 생성했다면:

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid"
}
```

### 5. React State와 UI

``` text
201 Response
↓
createdOrder
↓
State에 반영
↓
rerender
↓
UI에 새 주문 표시
```

## 실패 지점도 존재한다

``` text
Request
↓
Server
├─ 400 Validation 문제
├─ 401 Authentication 문제
├─ 403 Authorization 문제
├─ 500 Server 처리 문제
└─ 2xx Success
```

네트워크 자체가 실패할 수도 있다.

**팁**

전체 흐름을 공부할 때 `fetch()` 한 줄만 보지 말고 **사용자 → React →
Request → Server → Response → State → UI**를 한 문장으로 설명해보자.

## STEP 18 핵심 문장

> API 통신은 Request를 보내는 순간이 끝이 아니라 사용자 행동에서 시작해
> Server 처리와 Response를 거쳐 React State와 UI까지 이어지는 왕복
> 과정이다.
