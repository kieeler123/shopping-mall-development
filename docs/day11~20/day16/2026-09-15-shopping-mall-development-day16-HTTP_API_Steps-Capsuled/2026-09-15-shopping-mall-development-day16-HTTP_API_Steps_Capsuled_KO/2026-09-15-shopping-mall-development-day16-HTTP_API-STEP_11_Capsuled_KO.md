# Day 16 --- STEP 11. HTTP Response 구조

## 이번 STEP의 목표

Server가 Client에게 돌려주는 HTTP Response의 구조를 이해한다.

## Response 방향

``` text
Server
↓
HTTP Response
↓
Client
```

Request와 방향이 반대다.

## Response 구조

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
  "status": "shipping"
}
```

## Status Code

``` text
200
```

Server가 Request를 어떻게 처리했는지 나타내는 HTTP 수준의 결과 신호다.

## Response Headers

``` http
Content-Type: application/json
```

Response 메시지에 대한 메타데이터다. 위 경우 Response Body의 미디어
타입이 JSON임을 나타낸다.

## Response Body

``` json
{
  "id": 10,
  "status": "shipping"
}
```

실제 반환 콘텐츠다.

Body가 항상 있는 것은 아니다.

``` http
204 No Content
```

는 성공 Response지만 Body가 없다.

## Response와 JSON 구분

``` text
Response
├─ Status Code
├─ Headers
└─ Body
    └─ JSON일 수 있음
```

따라서 `Response = JSON`이 아니다.

**팁**

Day 17에서 `const response = await fetch(...)`를 보게 되면 `response`를
곧바로 주문 데이터라고 생각하지 말자. 먼저 **HTTP Response**라고
생각해야 한다.

## STEP 11 핵심 문장

> HTTP Response는 Server → Client 메시지이며 Status Code, Headers,
> Body로 구성된다.
