# Day 16 --- STEP 12. HTTP Status Code

## 이번 STEP의 목표

Status Code를 단순한 에러 번호가 아니라 Server 처리 결과의 신호로
이해한다.

## Status Code란?

Response에 포함되는 숫자 코드다.

``` text
Request
↓
Server 처리
↓
Response
└─ Status Code
```

## 2xx --- Success

대표적으로:

``` text
200 OK
→ 요청 처리 성공

201 Created
→ Resource 생성 성공

204 No Content
→ 성공했지만 Response Body 없음
```

200이 204보다 더 성공했다는 의미는 아니다.

## 4xx --- Request 측 범주

``` text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

### 400

Request가 API의 입력 규칙에 맞지 않는 경우 등에 사용될 수 있다.

### 401

주로 인증 정보가 없거나 유효하지 않은 상황 등에 사용된다. 이름이
`Unauthorized`라서 혼동하기 쉽지만 초급 단계에서는 **Authentication
문제와 연결**해서 기억하는 것이 좋다.

### 403

신원이 확인되어도 해당 작업을 수행할 권한이 없는 상황 등에 사용된다.

``` text
Authentication
→ 너 누구야?

Authorization
→ 너 이 작업 해도 돼?
```

### 404

요청 대상 Resource를 찾지 못한 경우 등에 사용된다. 브라우저 페이지에만
사용하는 코드가 아니다.

## 5xx --- Server 측 처리 문제

``` text
500 Internal Server Error
```

Server가 Request를 처리하는 과정에서 예상하지 못한 문제가 발생했음을
나타낸다.

## Status와 Body

Error Response도 JSON Body를 가질 수 있다.

``` http
404 Not Found
Content-Type: application/json

{
  "code": "ORDER_NOT_FOUND",
  "message": "Order not found"
}
```

Status는 큰 결과 신호이고 Body는 세부 정보를 제공할 수 있다.

**팁**

`4xx = Frontend 개발자 잘못`, `5xx = Backend 개발자 잘못`이라고 사람의
책임으로 번역하지 말자. HTTP Response의 **문제 범주**다.

## STEP 12 핵심 문장

> Status Code는 Server가 Request를 처리한 결과를 HTTP 수준에서 표현하는
> 숫자 코드다.
