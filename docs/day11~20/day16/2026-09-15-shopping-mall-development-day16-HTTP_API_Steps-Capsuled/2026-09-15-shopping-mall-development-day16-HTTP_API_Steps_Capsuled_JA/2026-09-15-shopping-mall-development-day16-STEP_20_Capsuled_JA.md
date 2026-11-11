# Day 16 --- STEP 20. Day 16 最終理解チェック

## この STEP の目標

総まとめを丸暗記するのではなく、Day 17 の `fetch()`
がなぜその形になっているのか説明できる状態にする。

## 最初に思い出す構造

``` text
Client
↓ Request
Server
↓ Response
Client
```

注文プロジェクトでは：

``` text
User
↓
React (Client)
↓
HTTP Request
↓
Orders API / Server
↓
Database
↓
HTTP Response
↓
React State
↓
UI
```

## Request

``` text
HTTP Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

質問：

``` text
Method  → 何をする？
URL     → どこに？
Headers → どんなメタデータ？
Body    → どんなコンテンツ？
```

## Response

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

## CRUD 型 Orders API

``` text
POST   /orders      → Create
GET    /orders      → Read
GET    /orders/:id  → Read one
PATCH  /orders/:id  → Update
DELETE /orders/:id  → Delete
```

これは代表的な CRUD 型 API の設計であり、すべての HTTP API
が必ずこの形になるという意味ではない。

## Status Code

``` text
2xx → Success
4xx → Request 側カテゴリ
5xx → Server 側処理カテゴリ
```

代表例：

``` text
200 → 成功
201 → Resource 作成成功
204 → 成功、Body なし
400 → Bad Request
401 → Authentication 関連
403 → Authorization 関連
404 → Resource がない
500 → Server 内部処理問題
```

## JSON

``` text
JavaScript Value
↓ JSON.stringify()
JSON Text
↓ HTTP Request Body
Server
```

Response では JSON Body を Parsing して JavaScript Value として扱える。

``` text
JSON ≠ JavaScript Object
JSON ≠ HTTP
JSON ≠ Response
```

## Day 15 と接続

``` text
fetch()
↓
Promise
↓
await
↓
HTTP Response
↓
response.ok / status
↓
Body 処理
↓
Data
```

重要：

``` text
HTTP 404 / 500
≠ 自動的な Promise rejection

Network / Transport Failure
→ Promise rejection の可能性
```

## React UI と接続

``` text
Request 開始
↓
Loading
↓
Response
├─ Success → Data → State → UI
└─ Failure → Error State → Error UI
↓
Loading 終了
```

## Day 17 のコードを先に読む

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

Day 16 の言葉に変換：

``` text
/orders
→ URL

POST
→ Method

headers
→ Request Headers

Content-Type
→ Body の media type を説明

body
→ Request Body

JSON.stringify(newOrder)
→ JavaScript Value を JSON Text に serialize

await
→ Promise ベースの非同期結果を待つ

response
→ HTTP Response を表す object
```

このコードの各部分が「なぜ必要なのか」を説明できれば、Day 16
の目的は達成できている。

**ヒント**

Day 17 の前に最低限、次の2行を自分の言葉で説明できるようにしよう。

``` text
Request = Method + URL + Headers + Body
Response = Status Code + Headers + Body
```

## STEP 20 の重要ポイント

> `fetch()` は魔法ではなく、Day 16 で学んだ HTTP Request/Response を
> JavaScript から扱うための Web API である。
