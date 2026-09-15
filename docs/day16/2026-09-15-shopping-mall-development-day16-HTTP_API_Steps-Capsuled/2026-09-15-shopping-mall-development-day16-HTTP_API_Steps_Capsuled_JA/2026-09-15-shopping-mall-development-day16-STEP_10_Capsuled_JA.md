# Day 16 --- STEP 10. DELETE と Delete

## この STEP の目標

DELETE Request と、その成功・失敗 Response を理解する。

## 基本 Request

``` http
DELETE /orders/10
```

意味：

> 10番の注文 Resource を削除してください。

Method が削除という行動を、Path が対象を示す。

## DELETE に Body は必要？

単純な削除では Method + Path だけで意図が伝わるため、Body
がないことが多い。

ただし「DELETE は絶対に Body を持てない」と考えてはいけない。API
Contract に従う。

## Server 処理

``` text
DELETE /orders/10
↓
Authentication
↓
Authorization
↓
Resource の存在確認
↓
削除可能か Business Rule を確認
↓
Database 処理
↓
Response
```

## 成功

代表例：

``` http
204 No Content
```

204 は成功だが Response Body がない。

API によっては：

``` http
200 OK
Content-Type: application/json

{
  "deletedId": 10
}
```

のような形も可能である。

## 失敗

対象がなければ：

``` http
404 Not Found
```

権限がなければ 403 などが利用されることもある。

## DELETE の Idempotency

DELETE は Resource の状態変更を要求するため safe ではないが、HTTP
の意味論では idempotent である。

``` text
1回目 → 削除 → 204
2回目 → すでに存在しない → 404 の可能性
```

Response が異なっても、最終的に Resource
が存在しないという意図された状態効果は同じである。

**ヒント**

Idempotent を「同じ Status Code が返る」と覚えないこと。Server の
Resource 状態に対する意図された効果を見る。

## STEP 10 の重要ポイント

> DELETE は Resource の削除を要求し、safe ではないが HTTP の意味論では
> idempotent である。
