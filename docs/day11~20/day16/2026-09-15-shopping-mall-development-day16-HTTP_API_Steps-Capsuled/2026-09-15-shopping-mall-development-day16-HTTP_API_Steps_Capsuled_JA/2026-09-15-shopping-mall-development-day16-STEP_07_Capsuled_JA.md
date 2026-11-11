# Day 16 --- STEP 07. GET と Read

## この STEP の目標

GET を単なる「データ取得」として暗記せず、HTTP の意味論まで理解する。

## GET の基本

CRUD 型 API では GET は Resource の取得(Read)によく使われる。

``` http
GET /orders
```

→ 注文一覧

``` http
GET /orders/10
```

→ 10番の注文

## GET の入力

一般的な Web API では GET Request Body に依存せず、Path や Query
Parameter を利用する。

``` http
GET /orders?status=shipping
```

## Server 内部

GET が Database の SELECT と完全に同じ意味ではない。

``` text
GET /orders
↓
Server
↓
Authentication
↓
Authorization
↓
Query 条件の処理
↓
Business Logic
↓
Database
↓
Response の構成
```

## Safe

GET は HTTP の意味論で **safe** である。

これは Request の意味そのものが Resource
の状態変更を要求していないという意味である。

ログ記録などの副次的処理まで絶対に発生しないという意味ではない。

## Idempotent

GET は **idempotent** でもある。

同じ GET を繰り返しても、その Request 自体が Server Resource
の状態を追加で変更することを意図しない。

Response
が毎回完全に同じという意味ではない。他の処理でデータが変化すれば
Response も変わり得る。

**ヒント**

`Safe = セキュリティ上安全`、`Idempotent = Response が毎回同じ`
と誤解しないようにしよう。

## STEP 07 の重要ポイント

> GET は Resource の Read に使われ、HTTP の意味論では safe かつ
> idempotent である。
