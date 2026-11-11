# Day 16 --- STEP 16. 기존 주문 CRUD를 HTTP API로 바꾸기

## 이번 STEP의 목표

지금까지 `useOrders + localStorage`로 처리하던 CRUD를 HTTP Request로
번역한다.

## 기존 구조

``` text
React Component
↓
useOrders
↓
localStorage
```

## 새로운 구조

``` text
React Component
↓
useOrders
↓
HTTP Request
↓
Orders API
↓
Server
↓
Database
↓
HTTP Response
↓
useOrders
↓
React State
↓
UI
```

`useOrders` 같은 추상화가 반드시 사라지는 것은 아니다. 내부 데이터 접근
방식이 달라질 수 있다.

## CRUD 매핑

  기존 개념 함수               HTTP
  ---------------------------- ----------------------
  `getOrders()`                `GET /orders`
  `getOrder(id)`               `GET /orders/:id`
  `addOrder(order)`            `POST /orders`
  `updateOrder(id, changes)`   `PATCH /orders/:id`
  `deleteOrder(id)`            `DELETE /orders/:id`

## 주문 목록

``` text
getOrders()
↓
GET /orders
↓
200 + JSON
↓
setOrders(data)
↓
UI
```

## 주문 생성

``` text
addOrder(newOrder)
↓
POST /orders
↓
Server가 주문 생성
↓
201 + createdOrder
↓
createdOrder를 State에 반영
```

Client가 보낸 값보다 Server가 반환한 Resource를 기준으로 동기화하는 것이
중요할 수 있다.

## 주문 수정

``` text
updateOrder(10, changes)
↓
PATCH /orders/10
↓
200 + updatedOrder
↓
State의 10번 주문 업데이트
```

## 주문 삭제

``` text
deleteOrder(10)
↓
DELETE /orders/10
↓
204
↓
State에서 10번 주문 제거
```

Database가 바뀌었다고 React UI가 자동으로 바뀌는 것은 아니다. Client의
State도 적절히 동기화해야 한다.

**팁**

기존 CRUD 사고방식을 버리지 말자. `get/add/update/delete`를 각각 HTTP
Method로 **번역하는 연습**을 하면 된다.

## STEP 16 핵심 문장

> CRUD의 의미는 그대로이고 데이터 접근 방식이 localStorage에서 HTTP
> API로 이동한다.
