# Day 16 --- STEP 14. Headers と Content-Type

## この STEP の目標

HTTP Headers と Body の違いを理解し、`Content-Type` が何を説明する
Header なのかを明確にする。

## Headers

Headers は HTTP メッセージのメタデータである。

``` http
Content-Type: application/json
Authorization: Bearer ...
Accept: application/json
```

## Body

Body は実際のメッセージコンテンツである。

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

ここでは：

``` text
Content-Type
→ Header

JSON の注文データ
→ Body
```

## Content-Type

`Content-Type` は **現在のメッセージ Body の media type** を説明する。

Request：

``` text
Request Content-Type
→ Request Body の種類
```

Response：

``` text
Response Content-Type
→ Response Body の種類
```

同じ Header 名でも、それぞれ別のメッセージ Body を説明している。

## Content-Type がない場合

必ず Error になるとは限らない。Server、Framework、API Contract
によって処理は異なる。

JSON を期待する API に異なる media type を送れば、実装によって
`415 Unsupported Media Type` などで拒否される可能性もある。

## Accept との違い

``` text
Content-Type
→ 現在のメッセージ Body の media type

Accept
→ Client が受け入れ可能・希望する Response media type
```

Body がないメッセージでは Content-Type が不要な場合もある。

**ヒント**

一文で整理しよう。

> Headers はメタデータ、Body は実際の内容、Content-Type は Body の media
> type を説明する Header。

## STEP 14 の重要ポイント

> `Content-Type: application/json` は、現在の HTTP メッセージ Body が
> JSON media type であることを示す Header である。
