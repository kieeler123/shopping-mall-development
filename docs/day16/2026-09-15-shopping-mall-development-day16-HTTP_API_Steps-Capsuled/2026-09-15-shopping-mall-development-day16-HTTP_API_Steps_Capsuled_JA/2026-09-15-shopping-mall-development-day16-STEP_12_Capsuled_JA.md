# Day 16 --- STEP 12. HTTP Status Code

## この STEP の目標

Status Code を単なるエラー番号ではなく、Server の処理結果を表す HTTP
のシグナルとして理解する。

## Status Code

``` text
Request
↓
Server 処理
↓
Response
└─ Status Code
```

## 2xx --- Success

``` text
200 OK
→ 処理成功

201 Created
→ Resource 作成成功

204 No Content
→ 成功、Response Body なし
```

200 が 204 より「より成功」という意味ではない。

## 4xx --- Request 側のカテゴリ

``` text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

### 400

Request が API の入力要件を満たさない場合などに利用される。

### 401

認証情報が必要、または無効な場合などに利用される。名称は Unauthorized
だが、初級段階では Authentication と結び付けると整理しやすい。

### 403

Request した操作を行う権限がない場合などに利用される。

``` text
Authentication
→ あなたは誰？

Authorization
→ あなたはこれをしてよい？
```

### 404

対象 Resource が見つからない場合など。Web ページだけの Status ではない。

## 5xx

``` text
500 Internal Server Error
```

Server の処理中に予期しない問題が起きたことを表す。

## Error Response にも Body はある

``` http
404 Not Found
Content-Type: application/json

{
  "code": "ORDER_NOT_FOUND",
  "message": "Order not found"
}
```

Status Code は大きな結果を、Body は詳細情報を表すことができる。

**ヒント**

`4xx = Frontend 開発者のミス`, `5xx = Backend 開発者のミス`
と人の責任に変換しないこと。HTTP の問題カテゴリである。

## STEP 12 の重要ポイント

> Status Code は Server が Request を処理した結果を HTTP
> レベルで表す数値コードである。
