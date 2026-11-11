# Day 16 --- STEP 05. URL, Path, Endpoint, Query Parameter

## 이번 STEP의 목표

Request가 어디로 향하는지 표현하는 URL과 API의 구체적인 요청 지점을
이해한다.

## URL의 기본 구조

예를 들어:

``` text
https://api.myshop.com/orders/10
```

초급 단계에서는 다음처럼 나눠볼 수 있다.

``` text
https://api.myshop.com + /orders/10
└──── Base URL ─────┘   └─ Path ─┘
```

`/orders/10`은 주문 Resource 중 10번 주문을 가리키는 Path다.

## Endpoint

API 전체가 하나의 큰 인터페이스라면 Endpoint는 그 안에서 Request를 보낼
수 있는 구체적인 지점이다.

Orders API:

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

실무 문서에서는 Method + URL/Path 조합을 하나의 endpoint라고 부르기도
한다.

## `:id`는 무엇인가?

문서에서:

``` text
/orders/:id
```

라고 쓰면 `:id`는 실제 URL 문자가 아니라 placeholder다.

``` text
/orders/:id   ← Route template
/orders/10    ← 실제 Request Path
/orders/53    ← 실제 Request Path
```

## Query Parameter

목록 조회에 조건을 추가하고 싶다면 API 설계에 따라 Query Parameter를
사용할 수 있다.

``` http
GET /orders?status=shipping
```

구조:

``` text
/orders
→ Path

?
→ Query 시작

status=shipping
→ key=value
```

여러 개라면:

``` text
/orders?status=shipping&page=2
```

처럼 `&`로 연결한다.

## Path와 Query의 역할

보통:

``` text
/orders/10
→ 특정 주문을 식별

/orders?status=shipping
→ 주문 목록에 조회 조건을 추가
```

하지만 정확한 의미는 API 설계가 결정한다.

**팁**

`Path Parameter = 특정 대상`, `Query Parameter = 조건/옵션`이라는 초급
모델을 사용하되, 실제 사용법은 반드시 API 문서를 확인하자.

## STEP 05 핵심 문장

> URL은 Request의 목적지를 나타내며, Endpoint는 API의 구체적인 요청
> 지점이다. Query Parameter는 URL에 조회 조건이나 옵션 등을 추가할 수
> 있다.
