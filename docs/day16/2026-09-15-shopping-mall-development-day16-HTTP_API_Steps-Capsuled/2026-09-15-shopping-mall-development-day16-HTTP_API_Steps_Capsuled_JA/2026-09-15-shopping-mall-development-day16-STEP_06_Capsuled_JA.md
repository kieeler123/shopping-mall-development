# Day 16 --- STEP 06. Resource と API

## この STEP の目標

Resource と API を理解し、API を単なる URL として捉えないようにする。

## Resource

Resource は API が扱うドメイン上の対象と考えられる。

ショッピングモールなら：

``` text
products
users
orders
cart
reviews
```

などがある。

``` text
/orders
→ 注文 Resource の collection

/orders/10
→ 特定の注文 Resource
```

Resource と Database Table は必ずしも1対1ではない。

## API

API は **Application Programming Interface** の略である。

あるプログラムが、別のプログラムが提供する機能やデータを利用するためのインターフェースである。

Orders API の例：

``` text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

API Contract には URL だけではなく、次のような内容が含まれることがある。

``` text
Method
Endpoint
Headers
Request Body
Response Body
Status Code
Authentication
Error format
```

## HTTP と API の違い

``` text
HTTP
→ 通信プロトコル

API
→ 機能やデータを利用できるようにするインターフェース

HTTP API
→ HTTP を利用する API
```

すべての API が HTTP API とは限らない。ブラウザの `localStorage` も Web
API の例である。

**ヒント**

`HTTP = どう通信する？`、`API = 何を利用できるようにする？`
と質問を分けよう。

## STEP 06 の重要ポイント

> Resource は API が扱う対象であり、API
> は別のプログラムが機能やデータを利用するためのインターフェースである。
