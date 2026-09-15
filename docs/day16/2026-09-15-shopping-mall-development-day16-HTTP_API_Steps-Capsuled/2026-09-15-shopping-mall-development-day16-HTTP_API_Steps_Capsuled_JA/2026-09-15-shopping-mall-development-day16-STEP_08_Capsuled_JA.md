# Day 16 --- STEP 08. POST と Create

## この STEP の目標

注文作成を通して POST、Request Body、201 Created の関係を理解する。

## POST Request

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

自然な意味は：

> この入力を使って新しい注文を作成してください。

## なぜ `/orders` なのか？

新しい注文はまだ Server が決めた ID
を持っていないことがある。そのため注文 collection である `/orders`
に生成 Request を送る設計が一般的である。

## Server は Client をそのまま信頼しない

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

例えば Client が送った合計金額をそのまま保存せず、Server
が商品価格から再計算することができる。

## 201 Created

Resource 作成成功では代表的に：

``` http
201 Created
```

が使われる。

Response Body：

``` json
{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid"
}
```

Request になかった `id`、`status`、`createdAt` などを Server
が追加することもある。

## POST と Idempotency

POST は一般的に idempotent が保証されない。

同じ作成 Request を繰り返すと、複数の Resource が作られる可能性がある。

**ヒント**

`POST = 必ず 201` ではない。POST は Request Method、201 は Resource
作成成功に使われる代表的な Status Code である。

## STEP 08 の重要ポイント

> CRUD 型 API では POST は Resource 作成によく使われ、作成データを Body
> に送り、成功時には 201 Created が使われることがある。
