# Day 16 --- STEP 19. HTTP / API / Request / Response 핵심 용어 완전 구분

## 이번 STEP의 목표

비슷하게 느껴지는 용어를 하나의 통신 구조 안에서 각자의 위치에 배치한다.

## 전체 지도

``` text
React Client
│
│ HTTP Request
│ ├─ Method
│ ├─ URL / Endpoint
│ ├─ Headers
│ └─ Body (JSON일 수 있음)
▼
API / Server
│
│ Server Processing
▼
Database
│
▼
Server
│
│ HTTP Response
│ ├─ Status Code
│ ├─ Headers
│ └─ Body (JSON일 수 있음)
▼
React
```

## HTTP

``` text
질문: 어떻게 통신할까?
답: HTTP라는 Protocol을 사용한다.
```

## API

``` text
질문: Client가 Server의 어떤 기능/데이터를 사용할 수 있을까?
답: API가 인터페이스를 제공한다.
```

## Request

``` text
방향: Client → Server
```

Method, URL, Headers, Body 등이 포함될 수 있다.

## Response

``` text
방향: Server → Client
```

Status Code, Headers, Body가 포함된다.

## Method

Request의 행동 의미다.

``` text
GET
POST
PATCH
DELETE
```

## Endpoint

API의 구체적인 요청 지점이다.

``` text
/orders
/orders/10
```

문서나 실무에서는 `GET /orders`처럼 Method까지 포함한 조합을
endpoint라고 부르기도 한다.

## JSON

데이터 표현 형식이다.

``` text
Body
└─ JSON 형식을 사용할 수 있음
```

HTTP나 Response 자체가 JSON인 것은 아니다.

## Status Code

Server 처리 결과를 Response에서 표현한다.

``` text
200
201
400
404
500
```

## 한 번에 비교

  개념          질문
  ------------- -----------------------------------------------
  HTTP          어떻게 통신하는가?
  API           어떤 기능/데이터를 사용할 수 있게 제공하는가?
  Request       Client가 무엇을 보냈는가?
  Method        무엇을 할 것인가?
  Endpoint      어디에 요청할 것인가?
  Header        메시지에 어떤 메타데이터가 있는가?
  Body          실제 콘텐츠는 무엇인가?
  JSON          데이터를 어떤 형식으로 표현했는가?
  Response      Server가 무엇을 돌려줬는가?
  Status Code   처리 결과가 어떠했는가?

## 실제 예제

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3
}
```

``` text
POST         → Method
/orders      → Endpoint/Path
Content-Type → Header
JSON         → Body의 콘텐츠 형식
전체         → HTTP Request
```

Response:

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3
}
```

``` text
201          → Status Code
Content-Type → Response Header
JSON         → Response Body의 콘텐츠 형식
전체         → HTTP Response
```

**팁**

용어 정의를 따로 외우기보다 하나의 실제 Request/Response를 가져와 각
부분에 이름표를 붙이는 연습을 하자.

## STEP 19 핵심 문장

> HTTP는 통신 규칙, API는 인터페이스, Request/Response는 메시지,
> Method는 요청 행동, Endpoint는 요청 지점, JSON은 데이터 형식, Status
> Code는 처리 결과다.
