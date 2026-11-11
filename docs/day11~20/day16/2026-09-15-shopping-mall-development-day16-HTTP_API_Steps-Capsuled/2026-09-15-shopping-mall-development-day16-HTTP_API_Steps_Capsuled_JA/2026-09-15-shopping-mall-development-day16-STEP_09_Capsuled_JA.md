# Day 16 --- STEP 09. PATCH と Update

## この STEP の目標

特定 Resource の一部を変更する Request を理解する。

## 注文状態の変更

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

意味：

> 10番の注文の status を shipping に変更してください。

## URL と Body

``` text
/orders/10
→ 何を変更する？

Body
→ どの値を変更する？
```

これが PATCH を読むときの重要な分離である。

## Partial Update

PATCH は部分更新によく使われる。

変更するフィールドが一つだけとは限らない。

``` json
{
  "receiver": "Kim",
  "address": "..."
}
```

のように複数項目を変更する API も作れる。

## Server 処理

``` text
PATCH /orders/10
↓
Authentication
↓
Authorization
↓
Resource の存在確認
↓
Validation
↓
Business Rule
↓
Database Update
↓
Response
```

Server は不正な状態遷移を拒否することもできる。

## PATCH と Idempotency

PATCH Method 自体は idempotency を保証しない。

``` text
status を shipping に設定
```

は繰り返しても同じ状態になる可能性が高い。

一方：

``` text
quantity を現在値から +1
```

なら繰り返すたびに状態が変化する。

**ヒント**

PATCH は **Target + Changes** と読む。URL が Target、Body が Changes
である。

## STEP 09 の重要ポイント

> PATCH は Resource の部分更新によく使われ、URL が対象、Body
> が変更内容を表す。
