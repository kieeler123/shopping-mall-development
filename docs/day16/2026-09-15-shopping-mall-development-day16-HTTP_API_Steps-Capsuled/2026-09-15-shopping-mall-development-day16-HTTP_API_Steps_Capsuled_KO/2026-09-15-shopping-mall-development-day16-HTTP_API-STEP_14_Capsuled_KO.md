# Day 16 --- STEP 14. Headers와 Content-Type

## 이번 STEP의 목표

HTTP 메시지의 Headers와 Body를 구분하고 `Content-Type`의 역할을 정확히
이해한다.

## Headers란?

Headers는 HTTP 메시지에 대한 메타데이터를 담는다.

예:

``` http
Content-Type: application/json
Authorization: Bearer ...
Accept: application/json
```

Header는 `이름: 값` 형태로 표현된다.

## Body란?

Body는 실제 메시지 콘텐츠가 들어가는 영역이다.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

여기서:

``` text
Content-Type: application/json
→ Header

JSON 주문 데이터
→ Body
```

## Content-Type

`Content-Type`은 현재 메시지 Body의 **media type**을 설명한다.

Request:

``` text
Content-Type
→ Request Body가 어떤 타입인지 설명
```

Response:

``` text
Content-Type
→ Response Body가 어떤 타입인지 설명
```

같은 Header 이름이지만 서로 다른 메시지 Body를 설명한다.

## Content-Type이 없으면?

항상 오류가 발생하는 것은 아니다. Server나 Framework가 어떻게
구현되었는지, API가 어떤 형식을 요구하는지에 따라 다르다.

JSON을 기대하는 API라면 올바른 Content-Type을 보내는 것이 중요하며,
지원하지 않는 타입은 `415 Unsupported Media Type` 등으로 거절될 수도
있다.

## Content-Type과 Accept

``` text
Content-Type
→ 현재 메시지 Body의 타입

Accept
→ Client가 Response로 받을 수 있거나 선호하는 타입
```

둘은 역할이 다르다.

## Body가 없을 때

`204 No Content` Response처럼 Body가 없다면 Body 타입을 설명할 필요도
없을 수 있다.

**팁**

세 개를 한 문장으로 기억하자.

> Headers는 메타데이터, Body는 실제 콘텐츠, Content-Type은 Body의 미디어
> 타입을 설명하는 Header다.

## STEP 14 핵심 문장

> `Content-Type: application/json`은 현재 HTTP 메시지 Body가 JSON 미디어
> 타입임을 나타내는 Header다.
