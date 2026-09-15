# Day 16 --- STEP 04. HTTP Request 구조

## 이번 STEP의 목표

Client가 Server로 보내는 HTTP Request를 네 가지 핵심 요소로 분해한다.

## Request란?

Request는 Client가 Server에게 보내는 메시지다.

``` text
Client
↓
HTTP Request
↓
Server
```

대표적인 구조를 초급 단계에서는 다음처럼 이해할 수 있다.

``` text
Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

## 실제 예제

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

### Method

``` text
POST
```

Client가 **무엇을 하려고 하는지**를 표현한다. CRUD 스타일 API에서는
POST가 Resource 생성에 흔히 사용된다.

### URL

``` text
/orders
```

Request를 **어디로 보낼지** 나타낸다. 실제 환경에서는 Server 주소가 붙어
전체 URL이 될 수 있다.

### Headers

``` http
Content-Type: application/json
```

HTTP 메시지에 대한 메타데이터다. 위 Header는 Request Body의 미디어
타입이 JSON임을 설명한다.

### Body

``` json
{
  "productId": 3,
  "quantity": 2
}
```

실제로 Server에게 전달하려는 주문 생성 데이터다.

## 모든 Request에 Body가 있을까?

아니다. 예를 들어 일반적인 주문 목록 조회는 다음처럼 표현할 수 있다.

``` http
GET /orders
```

GET 조회에서는 보통 Path와 Query를 이용하고 Request Body에 의존하지
않는다.

## Request를 읽는 공식

``` text
Method  → 무엇을?
URL     → 어디에?
Headers → 어떤 부가 정보와 함께?
Body    → 어떤 데이터를?
```

**팁**

Day 17에서 `fetch(url, options)`가 등장하면 JavaScript 문법부터 외우지
말고 이 네 칸에 대응시켜 읽자.

## STEP 04 핵심 문장

> HTTP Request는 Client가 Server에게 보내는 메시지이며 Method, URL,
> Headers, Body 등의 요소로 구성된다.
