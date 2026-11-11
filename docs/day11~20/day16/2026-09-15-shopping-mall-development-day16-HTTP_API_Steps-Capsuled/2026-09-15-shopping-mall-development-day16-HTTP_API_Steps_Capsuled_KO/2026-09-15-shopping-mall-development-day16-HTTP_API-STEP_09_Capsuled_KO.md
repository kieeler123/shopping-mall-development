# Day 16 --- STEP 09. PATCH와 Update

## 이번 STEP의 목표

특정 Resource의 일부 데이터를 수정하는 Request를 이해한다.

## 주문 상태 수정

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

이 Request를 자연어로 읽으면:

> 10번 주문의 status를 shipping으로 변경해 주세요.

## URL과 Body의 역할

``` text
/orders/10
→ 누구를 수정할 것인가?

{
  "status": "shipping"
}
→ 무엇을 수정할 것인가?
```

이 구분이 PATCH의 핵심이다.

## Partial Update

PATCH는 부분 수정에 흔히 사용된다.

전체 주문 데이터를 다시 보낼 필요 없이 변경하려는 필드만 표현하는 API를
설계할 수 있다.

``` json
{
  "receiver": "Kim",
  "address": "..."
}
```

처럼 여러 필드를 한 번에 변경할 수도 있다.

## Server 처리

``` text
PATCH /orders/10
↓
Authentication
↓
Authorization
↓
Resource 존재 확인
↓
Body Validation
↓
Business Rule 확인
↓
Database Update
↓
Response
```

예를 들어 이미 배송 완료된 주문을 다시 `결제완료` 상태로 바꾸는 것을
Server가 금지할 수도 있다.

## PATCH와 idempotency

PATCH Method 자체는 idempotency를 보장하지 않는다.

``` text
status를 shipping으로 설정
```

은 반복해도 결과가 같을 수 있다.

반면:

``` text
quantity를 현재 값에서 +1
```

이라는 의미의 PATCH는 반복할 때마다 결과가 달라질 수 있다.

**팁**

PATCH를 볼 때 `Target + Changes`로 읽자. URL이 Target, Body가 Changes다.

## STEP 09 핵심 문장

> PATCH는 특정 Resource의 일부를 수정하는 데 흔히 사용되며 URL은 수정
> 대상, Body는 변경 내용을 나타낸다.
