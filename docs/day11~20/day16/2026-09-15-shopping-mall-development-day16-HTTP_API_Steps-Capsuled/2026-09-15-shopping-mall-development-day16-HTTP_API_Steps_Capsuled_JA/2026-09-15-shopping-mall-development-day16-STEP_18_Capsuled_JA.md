# Day 16 --- STEP 18. 注文取得と注文作成の完全な往復

## この STEP の目標

ユーザー操作から Request、Server、Response、React State、UI
までを一つの流れとして説明できるようにする。

## A. 注文一覧を取得

### ユーザー

``` text
ユーザー
↓
注文履歴ページ
↓
React
```

### Request

``` http
GET /orders
```

``` text
Method → GET
Path   → /orders
Body   → 通常なし
```

### Server

``` text
GET /orders
↓
Authentication / Authorization
↓
Request 条件処理
↓
Business Logic
↓
Database Query
```

### Response

``` http
200 OK
Content-Type: application/json

[
  { "id": 10, "status": "shipping" },
  { "id": 11, "status": "paid" }
]
```

### React

``` text
Response
↓
Status を確認
↓
Body を処理
↓
JavaScript Data
↓
setOrders(data)
↓
rerender
↓
UI
```

全体：

``` text
User
→ React
→ GET /orders
→ HTTP Request
→ API/Server
→ Database
→ 200 + JSON
→ HTTP Response
→ React State
→ UI
```

## B. 注文作成

React 側の値：

``` js
const newOrder = {
  productId: 3,
  quantity: 2,
};
```

JSON に serialize：

``` text
JavaScript Value
↓
JSON.stringify()
↓
JSON Text
```

Request：

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Server：

``` text
Authentication / Authorization
↓
JSON Parsing
↓
Validation
↓
Business Logic
↓
Database Insert
```

Response：

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid"
}
```

React：

``` text
createdOrder
↓
State
↓
rerender
↓
UI
```

## 失敗する場所もある

``` text
Request
↓
Server
├─ 400
├─ 401
├─ 403
├─ 500
└─ 2xx
```

さらに Network Failure もあり得る。

**ヒント**

API 通信を `fetch()` 一行だけで考えず、**User → React → Request → Server
→ Response → State → UI** の完全な往復として説明しよう。

## STEP 18 の重要ポイント

> API 通信は Request を送るだけではなく、ユーザー操作から Server
> 処理、Response、React State、最終 UI まで続く往復処理である。
