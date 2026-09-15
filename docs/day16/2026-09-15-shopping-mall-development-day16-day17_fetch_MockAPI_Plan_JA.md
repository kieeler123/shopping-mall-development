# Day 17 — `fetch()` と Mock API — STEP別学習計画



Day 16 の HTTP/API 理論を実際の `fetch()` code と Mock API ベースの注文 CRUD に接続する。



```text
Before
React → useOrders → localStorage

After
React → useOrders → fetch() → Mock API
```


> **ヒント**
>
> 各 STEP で code を Day 16 の Method / URL / Headers / Body / Response / Status Code / JSON 用語へ戻して説明する。


---
## STEP 01. localStorage 方式と API 方式の比較


### 目標
`React → localStorage` と `React → fetch() → API` を比較し、維持される flow と変わる部分を確認する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 02. fetch() とは何か？


### 目標
`fetch()` を HTTP 自体ではなく Browser JavaScript Web API として理解し、Promise と接続する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 03. 最初の GET Request


### 目標
`fetch('/orders')` が Day 16 の `GET /orders` にどう対応するか理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。

```js
const response = await fetch("/orders");
```


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 04. Response object


### 目標
`response` が注文配列ではなく HTTP Response を表す object であることを理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 05. response.json()


### 目標
JSON Response Body を読み取り、parse して JavaScript value にする流れを理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。

```js
const data = await response.json();
```


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 06. response.ok と HTTP Error


### 目標
4xx/5xx HTTP status と Network/Promise rejection を区別し、`response.ok` の役割を理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。

```js
if (!response.ok) {
  throw new Error("Request failed");
}
```


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 07. GET + try/catch


### 目標
async/await、response.ok、throw、response.json()、try/catch を GET pattern にまとめる。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 08. Mock API


### 目標
Production Backend がなくても HTTP と非同期 UI を練習できる Mock API の目的を理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 09. /orders API Contract


### 目標
GET・POST・PATCH・DELETE の Orders API Contract を練習対象として定義する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 10. React で注文一覧 GET


### 目標
取得した注文 data を `setOrders()` に接続し `Response → State → UI` を実装する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 11. Loading State


### 目標
Request 処理中と Empty Data を分離し Loading lifecycle を設計する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 12. Error State


### 目標
HTTP/Network failure を Error State と user-facing UI に接続する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 13. 特定注文 GET


### 目標
`/orders/:id` Route Template を実際の ``/orders/${id}`` Request に変換する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 14. POST で注文作成


### 目標
POST の Method・Headers・Content-Type・Body・JSON.stringify() を Day 16 理論に接続する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。

```js
const response = await fetch("/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newOrder),
});
```


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 15. createdOrder の処理


### 目標
Client の `newOrder` と Server の `createdOrder` を区別し、Server 結果を State に反映する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 16. PATCH で注文更新


### 目標
URL=Target、Body=Changes という PATCH partial modification を実装する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。

```js
await fetch(`/orders/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(changes),
});
```


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 17. DELETE で注文削除


### 目標
DELETE と 204 No Content を処理し、無条件に `response.json()` を呼ばない理由を理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。

```js
const response = await fetch(`/orders/${id}`, { method: "DELETE" });
```


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 18. useOrders を HTTP に refactor


### 目標
既存 CRUD interface を維持しながら `useOrders` 内部を localStorage から HTTP に置き換える。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 19. API Layer


### 目標
fetch/status/body/error の重複を見つけ、`ordersApi` のような API Layer の意味を理解する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## STEP 20. 全体統合と確認


### 目標
User action から Mock API、Response、Data/Loading/Error State、UI まで Day 17 全体 flow を説明する。


### 学習ポイント
```text
Request → Mock API → Response → React State → UI
```

この STEP では code の HTTP 的な意味、非同期の待機 point、Success / Failure が React State にどう反映されるか確認する。


> **ヒント**
>
> syntax だけを暗記せず、注文 CRUD の具体的な場面でもう一度説明する。


---
## Final Flow

最終的に `User → React → useOrders → fetch() → HTTP Request → Mock API → HTTP Response → Data/Loading/Error State → UI` を end-to-end で説明できる状態を目標にする。