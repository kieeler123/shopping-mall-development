# Day 16 --- STEP 11. HTTP Response の構造

## この STEP の目標

Server から Client に戻る HTTP Response を構成要素ごとに理解する。

## Response の方向

``` text
Server
↓
HTTP Response
↓
Client
```

Request と逆方向である。

## 基本構造

``` text
Response
├─ Status Code
├─ Headers
└─ Body
```

例：

``` http
200 OK
Content-Type: application/json

{
  "id": 10,
  "status": "shipping"
}
```

## Status Code

``` text
200
```

Server が Request をどう処理したかを表す HTTP
レベルの結果シグナルである。

## Response Headers

``` http
Content-Type: application/json
```

Response のメタデータ。この場合 Response Body の media type が JSON
であることを示す。

## Response Body

``` json
{
  "id": 10,
  "status": "shipping"
}
```

実際に返されるコンテンツである。

Body が必ず存在するわけではない。

``` http
204 No Content
```

は成功しているが Body がない。

## Response と JSON

``` text
Response
├─ Status Code
├─ Headers
└─ Body
    └─ JSON の場合がある
```

つまり：

``` text
Response ≠ JSON
```

**ヒント**

Day 17 で `const response = await fetch(...)` を見ても、`response`
をすぐ注文データだと思わないこと。まず **HTTP Response
を表すもの**として理解しよう。

## STEP 11 の重要ポイント

> HTTP Response は Server → Client のメッセージであり、Status
> Code、Headers、Body から構成される。
