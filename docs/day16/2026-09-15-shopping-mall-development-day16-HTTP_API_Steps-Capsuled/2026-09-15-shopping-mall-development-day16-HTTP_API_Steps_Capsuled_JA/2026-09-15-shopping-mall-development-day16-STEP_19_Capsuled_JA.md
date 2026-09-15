# Day 16 --- STEP 19. HTTP / API / Request / Response の用語を完全に区別する

## この STEP の目標

似て見える重要用語を、一つの通信構造の中で正しい場所に配置する。

## 全体マップ

``` text
React Client
│
│ HTTP Request
│ ├─ Method
│ ├─ URL / Endpoint
│ ├─ Headers
│ └─ Body (JSON の場合がある)
▼
API / Server
│
│ Processing
▼
Database
│
▼
Server
│
│ HTTP Response
│ ├─ Status Code
│ ├─ Headers
│ └─ Body (JSON の場合がある)
▼
React
```

## HTTP

質問：

> どのルールで通信する？

答え：HTTP という Protocol。

## API

質問：

> Client はどんな機能やデータを利用できる？

API がその Interface/Contract を提供する。

## Request

``` text
Client → Server
```

のメッセージ。

## Response

``` text
Server → Client
```

のメッセージ。

## Method

Request の行動の意味。

``` text
GET
POST
PATCH
DELETE
```

## Endpoint

API の具体的な Request 地点。文書によっては Method + URL/Path
の組み合わせを Endpoint として扱う。

## JSON

データ表現形式。

``` text
Body
└─ JSON を利用できる
```

JSON は HTTP や Response 自体ではない。

## Status Code

Response に含まれる Server 処理結果。

``` text
200
201
400
404
500
```

## 比較表

  Concept       質問
  ------------- --------------------------------
  HTTP          どう通信する？
  API           どんな機能・データを提供する？
  Request       Client は何を送った？
  Method        何をする？
  Endpoint      どこに Request する？
  Header        どんなメタデータ？
  Body          実際のコンテンツは？
  JSON          データをどう表現する？
  Response      Server は何を返した？
  Status Code   処理結果は？

## 実例

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3
}
```

``` text
POST         → Method
/orders      → Path / Endpoint target
Content-Type → Header
JSON         → Body の表現形式
全体         → HTTP Request
```

Response：

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3
}
```

``` text
201          → Status Code
Content-Type → Response Header
JSON         → Response Body の表現形式
全体         → HTTP Response
```

**ヒント**

定義を別々に暗記するより、一つの Request/Response
に各用語のラベルを付ける練習をしよう。

## STEP 19 の重要ポイント

> HTTP は通信ルール、API はインターフェース、Request/Response
> はメッセージ、Method は行動、Endpoint は Request 地点、JSON
> はデータ形式、Status Code は処理結果である。
