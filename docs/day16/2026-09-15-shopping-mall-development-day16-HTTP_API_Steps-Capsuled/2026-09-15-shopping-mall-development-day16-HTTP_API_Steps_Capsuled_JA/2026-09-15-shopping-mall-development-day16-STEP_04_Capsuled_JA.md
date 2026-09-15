# Day 16 --- STEP 04. HTTP Request の構造

## この STEP の目標

Client から Server に送られる HTTP Request を構成要素ごとに分解する。

## Request とは？

``` text
Client
↓
HTTP Request
↓
Server
```

初級段階では Request を次のように理解できる。

``` text
Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

## 例

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

### Method

``` text
POST
```

「何をしたいのか」を表す。CRUD 型 API では POST は Resource
作成によく使われる。

### URL

``` text
/orders
```

「どこへ Request を送るのか」を表す。

### Headers

``` http
Content-Type: application/json
```

HTTP メッセージに関するメタデータである。この場合 Request Body の media
type が JSON であることを説明している。

### Body

``` json
{
  "productId": 3,
  "quantity": 2
}
```

Server に渡す実際のコンテンツである。

## すべての Request に Body があるのか？

ない。

``` http
GET /orders
```

のように、一般的な取得 Request では Body を使わず Path や Query
Parameter を利用することが多い。

## 読み方

``` text
Method  → 何をする？
URL     → どこに？
Headers → どんな付加情報と一緒に？
Body    → どんなデータを？
```

**ヒント**

Day 17 の `fetch()` を見るとき、JavaScript の文法だけを暗記せず、この
Request の4要素に対応させて読もう。

## STEP 04 の重要ポイント

> HTTP Request は Client → Server
> のメッセージであり、Method、URL、Headers、Body などで構成される。
