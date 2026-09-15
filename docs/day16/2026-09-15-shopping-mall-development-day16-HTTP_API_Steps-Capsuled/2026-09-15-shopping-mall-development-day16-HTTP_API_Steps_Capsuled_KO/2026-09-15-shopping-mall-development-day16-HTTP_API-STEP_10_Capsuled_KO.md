# Day 16 --- STEP 10. DELETE와 Delete

## 이번 STEP의 목표

Resource 삭제 Request와 성공/실패 Response의 관계를 이해한다.

## 기본 DELETE Request

``` http
DELETE /orders/10
```

의 의미는:

> 10번 주문 Resource를 삭제해 주세요.

Method가 삭제 의도를, Path가 대상을 나타낸다.

## DELETE Body는 필요한가?

단순한 Resource 삭제에서는 Method + Path만으로 의도가 충분해서 Body가
없는 경우가 흔하다.

그러나 `DELETE는 절대 Body를 가질 수 없다`라고 외우면 안 된다. 실제 API
Contract를 따라야 한다.

## Server에서 일어날 수 있는 일

``` text
DELETE /orders/10
↓
Authentication
↓
Authorization
↓
Resource 존재 확인
↓
삭제 가능한 상태인지 확인
↓
Database 처리
↓
Response
```

로그인한 사용자라도 다른 사용자의 주문을 삭제할 권한은 없을 수 있다.

## 성공 Response

대표적인 성공 형태:

``` http
204 No Content
```

204는 성공했으며 Response Body가 없다는 의미다.

API에 따라:

``` http
200 OK
Content-Type: application/json

{
  "deletedId": 10
}
```

처럼 반환할 수도 있다.

## 실패 Response

대상이 없으면:

``` http
404 Not Found
```

권한이 없으면 API 설계에 따라 403 등이 가능하다.

## DELETE는 idempotent

DELETE는 상태 변경을 요구하므로 safe하지 않다. 하지만 HTTP 의미론에서는
idempotent하다.

``` text
첫 번째 DELETE → 삭제됨 → 204
두 번째 DELETE → 이미 없음 → 404일 수도 있음
```

Response는 달라도 대상이 존재하지 않는 최종 상태 효과는 같다.

**팁**

Idempotent는 `같은 Status Code가 반복된다`는 뜻이 아니다. **같은
Request를 반복했을 때 의도된 서버 상태 효과**를 보자.

## STEP 10 핵심 문장

> DELETE는 Resource 삭제를 요청하며 safe하지 않지만 HTTP 의미론상
> idempotent하다.
