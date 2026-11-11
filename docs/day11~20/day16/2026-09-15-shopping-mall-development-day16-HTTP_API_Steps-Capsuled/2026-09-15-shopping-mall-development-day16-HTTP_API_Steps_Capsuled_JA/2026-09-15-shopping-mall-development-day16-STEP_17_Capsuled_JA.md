# Day 16 --- STEP 17. Success / Failure と React State

## この STEP の目標

HTTP Response の結果を React の State と UI にどう接続するか理解する。

## Response が来ても成功とは限らない

``` text
Request
↓
Response
├─ 2xx Success
└─ 4xx / 5xx Failure Status
```

## 成功

注文一覧：

``` text
GET /orders
↓
200 + JSON
↓
Body を処理
↓
orders
↓
setOrders(...)
↓
UI
```

注文作成：

``` text
POST /orders
↓
201 + createdOrder
↓
State
↓
UI
```

削除：

``` text
DELETE /orders/10
↓
204 No Content
↓
JSON Parsing 不要
↓
State から削除
↓
UI
```

成功 Response が必ず JSON Body を持つわけではない。

## 失敗

``` text
GET /orders/999
↓
404
↓
通常の注文データとして扱わない
↓
Error State
↓
Error UI
```

## Data / Loading / Error

Server Data を扱う React UI では、少なくとも次の3状態を意識する。

``` text
Data
Loading
Error
```

概念例：

``` js
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

## Empty と Loading は違う

``` text
200 + []
→ 取得成功、注文0件

まだ Response がない
→ 結果自体が未確定
```

## finally

後の実装では：

``` text
try
→ 成功処理

catch
→ Error 処理

finally
→ loading 終了など
```

という構造が自然に使える。

**ヒント**

API UI を設計するときは `何を表示する？`
だけでなく、`待っている間は？`、`失敗したら？` もセットで考えよう。

## STEP 17 の重要ポイント

> HTTP 通信の結果は React の Data / Loading / Error State
> に接続され、その State が UI を決める。
