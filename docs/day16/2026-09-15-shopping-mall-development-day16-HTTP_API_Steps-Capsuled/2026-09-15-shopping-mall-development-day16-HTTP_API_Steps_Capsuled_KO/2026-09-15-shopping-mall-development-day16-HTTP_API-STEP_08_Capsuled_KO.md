# Day 16 --- STEP 08. POST와 Create

## 이번 STEP의 목표

주문 생성 Request를 통해 POST, Request Body, 201 Created의 관계를
이해한다.

## POST로 주문 생성

CRUD 스타일 Orders API에서 새 주문 생성은 다음처럼 표현할 수 있다.

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

자연어로:

> 이 데이터를 이용해서 새로운 주문을 만들어 주세요.

## 왜 `/orders`인가?

새 주문은 아직 Server가 부여한 ID가 없을 수 있다. 따라서 주문
collection인 `/orders`를 대상으로 생성 요청을 보내는 형태가 자연스럽다.

## Body가 필요한 이유

Server가 어떤 주문을 만들지 알아야 하기 때문이다.

``` text
productId
quantity
배송 정보 등
```

하지만 Client가 보낸 모든 값을 Server가 무조건 신뢰해서는 안 된다.

``` text
POST /orders
↓
Authentication
↓
Validation
↓
Business Logic
↓
Database
```

예를 들어 최종 가격은 Server가 상품 데이터에 따라 다시 계산할 수 있다.

## 201 Created

Resource가 성공적으로 생성됐다면 대표적으로:

``` http
201 Created
```

를 사용할 수 있다.

Response Body에는 Server가 확정한 Resource가 포함될 수 있다.

``` json
{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid"
}
```

Request에는 없던 `id`, `status`, `createdAt` 등이 추가될 수 있다.

## POST와 idempotency

POST는 일반적으로 idempotent가 보장되지 않는다.

``` text
POST /orders
POST /orders
```

를 반복하면 두 주문이 만들어질 가능성이 있다.

**팁**

`POST = 무조건 201`이 아니다. POST는 Request Method이고, 201은 Resource
생성 성공에 흔히 쓰이는 Response Status다.

## STEP 08 핵심 문장

> CRUD 스타일 API에서 POST는 Resource 생성에 흔히 사용되며, 생성할
> 데이터는 Request Body에 담고 성공 시 201 Created가 사용될 수 있다.
