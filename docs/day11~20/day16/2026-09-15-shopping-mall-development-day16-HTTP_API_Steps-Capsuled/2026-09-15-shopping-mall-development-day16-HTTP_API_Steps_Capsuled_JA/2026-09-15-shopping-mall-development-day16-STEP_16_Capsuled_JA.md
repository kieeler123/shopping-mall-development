# Day 16 --- STEP 16. 既存の注文 CRUD を HTTP に変換する

## この STEP の目標

`useOrders + localStorage` の CRUD を HTTP API Request
に置き換えて考える。

## 以前

``` text
React Component
↓
useOrders
↓
localStorage
```

## Server API 導入後

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

`useOrders` が不要になるとは限らない。内部のデータアクセス方法を HTTP
に変更できる。

## CRUD Mapping

  Function                     HTTP
  ---------------------------- ----------------------
  `getOrders()`                `GET /orders`
  `getOrder(id)`               `GET /orders/:id`
  `addOrder(order)`            `POST /orders`
  `updateOrder(id, changes)`   `PATCH /orders/:id`
  `deleteOrder(id)`            `DELETE /orders/:id`

## Read

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

## Create

``` text
addOrder(newOrder)
↓
POST /orders
↓
Server が Resource を作成
↓
201 + createdOrder
↓
State に反映
```

Client が送った入力ではなく、Server が確定して返した Resource を State
に反映することが重要になる場合がある。

## Update

``` text
updateOrder(10, changes)
↓
PATCH /orders/10
↓
updatedOrder
↓
State を更新
```

## Delete

``` text
deleteOrder(10)
↓
DELETE /orders/10
↓
204
↓
State から削除
```

Database が変更されたからといって React UI
が自動更新されるわけではない。Client State を同期する必要がある。

**ヒント**

CRUD の考え方を捨てる必要はない。既存の get/add/update/delete を HTTP
Request に **翻訳する練習**をしよう。

## STEP 16 の重要ポイント

> CRUD の意味はそのままで、データアクセス方法が localStorage から HTTP
> API に変わる。
