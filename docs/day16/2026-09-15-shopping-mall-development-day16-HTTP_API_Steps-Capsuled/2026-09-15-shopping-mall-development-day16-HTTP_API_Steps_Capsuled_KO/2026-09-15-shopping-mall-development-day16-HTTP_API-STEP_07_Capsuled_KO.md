# Day 16 --- STEP 07. GET과 Read

## 이번 STEP의 목표

GET을 단순히 `데이터 가져오기`로 외우지 않고 HTTP 의미와 주문 조회
흐름에 연결한다.

## GET의 기본 역할

CRUD 스타일 API에서 GET은 Resource 조회(Read)에 사용한다.

``` http
GET /orders
```

→ 주문 목록 조회

``` http
GET /orders/10
```

→ 10번 주문 조회

## GET Request의 입력

일반적인 Web API에서는 GET Request Body에 의존하지 않고 Path와 Query를
이용한다.

``` http
GET /orders?status=shipping
```

여기서 `status=shipping`은 조회 조건으로 설계될 수 있다.

## Server 내부에서는?

`GET /orders`가 DB의 단순 SELECT 하나와 같다는 뜻은 아니다.

``` text
GET /orders
↓
Server
↓
Authentication
↓
Authorization
↓
Query 조건 확인
↓
Business Logic
↓
Database
↓
Response 데이터 구성
```

API에 따라 필요한 과정이 달라진다.

## Safe

GET은 HTTP 의미론에서 safe Method다.

Safe란 **Client가 Resource 상태 변경을 요청하는 의미가 아니다**라는
뜻이다.

Server가 로그를 남기거나 통계를 기록할 수는 있다. Safe는
`아무런 side effect도 물리적으로 발생하지 않는다`는 뜻이 아니다.

## Idempotent

GET은 idempotent하다.

같은 GET Request를 반복한다고 해서 그 Request 자체가 Server Resource
상태를 추가로 변화시키는 의미가 되지 않는다.

반복 GET의 Response 데이터가 항상 동일해야 한다는 뜻도 아니다. 다른
사용자가 데이터를 변경했다면 조회 결과는 달라질 수 있다.

**팁**

`Safe = 보안상 안전`이 아니다. `Idempotent = Response가 항상 동일`도
아니다. 둘 다 **Request의 의미와 상태 효과**에 관한 개념이다.

## STEP 07 핵심 문장

> GET은 Resource를 조회하는 Method이며 HTTP 의미론상 safe하고
> idempotent하다.
