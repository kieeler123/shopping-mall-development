# Day 16 --- STEP 06. Resource와 API

## 이번 STEP의 목표

API를 단순한 URL로 생각하지 않고 Resource와 API의 관계를 이해한다.

## Resource란?

Resource는 Client가 API를 통해 다루는 도메인의 대상이라고 생각할 수
있다.

쇼핑몰이라면:

``` text
products
users
orders
cart
reviews
```

등이 Resource가 될 수 있다.

``` text
/orders
→ 주문 Resource의 collection

/orders/10
→ 특정 주문 Resource
```

Resource가 Database Table과 반드시 1:1 대응하는 것은 아니다.

## API란?

API는 **Application Programming Interface**다.

한 프로그램이 다른 프로그램이 제공하는 기능이나 데이터를 사용할 수
있도록 만든 인터페이스다.

Orders API를 예로 들면:

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

이런 기능들을 통해 React는 Server의 주문 기능을 사용할 수 있다.

## API는 URL 하나가 아니다

API 계약에는 다음과 같은 내용이 포함될 수 있다.

``` text
Method
Endpoint
필요한 Headers
Request Body 구조
Response Body 구조
Status Code
Authentication 방식
Error 형식
```

따라서 `/orders` 하나만 보고 API 전체라고 생각하면 범위가 너무 좁다.

## HTTP와 API 관계

``` text
HTTP
→ 통신 프로토콜

API
→ 기능/데이터를 사용하도록 제공하는 인터페이스

HTTP API
→ HTTP를 통신 방식으로 사용하는 API
```

API는 HTTP에만 존재하는 개념이 아니다. 브라우저의 `localStorage`도 Web
API의 예다.

**팁**

`HTTP = 어떻게 통신?`, `API = 무엇을 사용할 수 있게 제공?`라는 질문으로
둘을 구분하자.

## STEP 06 핵심 문장

> Resource는 API가 다루는 대상이고, API는 다른 프로그램이 기능과
> 데이터를 사용할 수 있도록 제공되는 인터페이스다.
