# Day 16 --- STEP 03. HTTP とは何か？

## この STEP の目標

HTTP を Server、API、Internet、JSON などと区別し、役割を正しく理解する。

## HTTP の意味

HTTP は **Hypertext Transfer Protocol** の略である。重要なのは
`Protocol` という部分である。

Protocol は、通信する双方が従うルールや約束である。

``` text
Client
   │
   │ HTTP という通信ルール
   ▼
Server
```

Client と Server は HTTP を使って Request と Response を交換する。

## HTTP は Internet そのものではない

``` text
HTTP ≠ Internet
HTTP ≠ Server
HTTP ≠ API
HTTP ≠ JSON
```

Internet はネットワーク全体に関する大きな概念であり、HTTP は Web
で広く利用される通信プロトコルの一つである。

## HTTP で学ぶ主な要素

Request:

``` text
Method
URL
Headers
Body
```

Response:

``` text
Status Code
Headers
Body
```

Day 16 の多くは、この HTTP
メッセージの各要素を一つずつ理解する学習である。

例：

``` text
React Client
↓
GET /orders
↓
HTTP Request
↓
Server
↓
200 OK + JSON
↓
HTTP Response
↓
React Client
```

**ヒント**

HTTP を「データ取得機能」と覚えず、**Client と Server
がメッセージを交換するための通信ルール**と覚えよう。

## STEP 03 の重要ポイント

> HTTP は Client と Server が Request と Response
> を交換するために使う通信プロトコルである。
