# Day 16 --- HTTP & API 基礎理論

> 目標：`fetch()`を実装する前に、HTTP Request/Response と API
> の構造を理解し、既存の React 注文 CRUD をサーバー API
> の構造につなげる。

## 全体の流れ

``` text
ユーザー → React(Client) → HTTP Request → API/Server → Database
        ← React State/UI ← HTTP Response ←
```

------------------------------------------------------------------------

## STEP 1. なぜ HTTP と API が必要なのか？

これまでのプロジェクトでは、ブラウザ内部の保存領域を利用していた。

``` text
React → useOrders → localStorage
```

Server と Database を使う構成になると、次のように変わる。

``` text
React → HTTP Request → API → Server → Database
Database → Server → HTTP Response → React → State → UI
```

中心となる問いは、**ブラウザと Server
はどのようにデータをやり取りするのか？** である。この境界で HTTP と API
が登場する。

**ヒント:** API の導入を「React
を全部作り直すこと」と考えず、データへのアクセス経路が
`localStorage → Server` に変わると理解しよう。

## STEP 2. Client と Server

Client は Request を送る側、Server は Request を受け取り、処理して
Response を返す側である。このプロジェクトでは React が Client
の役割を持つ。

``` text
Client → Request → Server
Client ← Response ← Server
```

Server は必要に応じて Database
にアクセスし、認証、認可、Validation、Business Logic
などを実行できる。Server と Database は同じものではない。

**ヒント:** まず `Client=依頼`, `Server=処理・応答`,
`Database=保存・検索` という役割を押さえよう。

## STEP 3. HTTP とは？

HTTP (Hypertext Transfer Protocol) は Client と Server
がメッセージを交換するための **通信プロトコル** である。HTTP は Internet
自体でも Server でも API でもない。

重要な要素には Request、Response、Method、Headers、Body、Status Code
などがある。

**ヒント:** HTTP
はデータそのものではなく、**データをやり取りするためのルール**として覚えよう。

## STEP 4. HTTP Request の構造

HTTP Request は Client から Server に送るメッセージである。

``` text
Request
├─ Method
├─ URL
├─ Headers
└─ Body
```

例：

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

-   Method：何をするのか
-   URL：どこへ Request を送るのか
-   Headers：メッセージに関するメタデータ
-   Body：実際に送るコンテンツ

すべての Request に Body があるわけではない。

**ヒント:**
`行動(Method) → 宛先(URL) → 付加情報(Headers) → データ(Body)`
の順で読もう。

## STEP 5. URL と Endpoint

URL は Request の宛先を表す。

``` text
https://api.myshop.com + /orders/10
└─ Base URL             └─ Path
```

Orders API の例：

``` text
GET    /orders
GET    /orders/10
POST   /orders
PATCH  /orders/10
DELETE /orders/10
```

ドキュメントの `/orders/:id` にある `:id` は placeholder であり、実際の
Request では `/orders/10` のように具体的な値が入る。

Query Parameter も URL の一部である。

``` text
GET /orders?status=shipping
```

Path は特定 Resource の識別に、Query
は絞り込み・検索・並び替え・ページングなどの条件やオプションに使われることが多い。正確な意味は
API Contract によって決まる。

**ヒント:** `Path = 何を対象にする？`,
`Query = どんな条件・オプションで？` と考えよう。

## STEP 6. Resource と API

Resource は API が扱うドメイン上の対象である。

``` text
products
users
orders
cart
```

API (Application Programming Interface)
は、あるプログラムが別のプログラムの機能やデータを利用できるようにするインターフェースである。

API は単なる URL ではない。API Contract には
Method、Endpoint、Headers、Request Body、Response、Status
Code、認証方式などが含まれることがある。

``` text
Orders API
├─ GET /orders
├─ POST /orders
├─ PATCH /orders/:id
└─ DELETE /orders/:id
```

HTTP API は HTTP を利用して提供される API であり、すべての API が HTTP
API とは限らない。

**ヒント:** `API = 広いインターフェース`,
`Endpoint = その中の具体的な Request 地点` と整理しよう。

## STEP 7. GET --- Read

GET は Resource を取得するために使う。

``` http
GET /orders
GET /orders/10
```

一般的な API では GET Request Body に依存せず、Path や Query Parameter
で取得対象や条件を表現する。

HTTP の意味論では GET は **safe** かつ **idempotent** である。

-   Safe：Request の意味そのものが Resource の状態変更を要求しない。
-   Idempotent：同じ Request を繰り返しても、意図される Server
    状態への効果が1回の場合と同じ。

毎回まったく同じ Response が返るという意味ではない。

**ヒント:** GET は `Read + Safe + Idempotent` とつなげよう。ただし safe
を「セキュリティ上安全」という意味と混同しないこと。

## STEP 8. POST --- Create

CRUD 型 API では POST は新しい Resource の作成によく使われる。

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Server は Request Body
をそのまま保存するのではなく、認証、Validation、Business Logic
などを行ってから保存できる。Resource の作成成功には代表的に
`201 Created` が使われる。

``` http
201 Created
Content-Type: application/json

{
  "id": 101,
  "productId": 3,
  "quantity": 2,
  "status": "paid"
}
```

POST は一般に safe ではなく、idempotent も保証されない。同じ作成 Request
を繰り返すと重複 Resource が作られる可能性がある。

**ヒント:** Request Body と Server が返した作成済み Resource
を区別しよう。`id` などは Server が生成することがある。

## STEP 9. PATCH --- Update

PATCH は Resource の一部を変更するためによく使われる。

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

次のように考える。

``` text
/orders/10 → 誰を変更する？
Body       → 何を変更する？
```

Server は存在確認、権限、入力値、状態遷移ルールなどを確認してから
Database を更新できる。

PATCH Method 自体は idempotency を保証しない。「status を shipping
に設定」は結果として idempotent になり得るが、「quantity
を1増やす」はそうならない可能性がある。

**ヒント:** PATCH は **Target + Changes**、つまり `URL=対象`,
`Body=変更内容` と読もう。

## STEP 10. DELETE --- Delete

DELETE は Resource の削除を要求する。

``` http
DELETE /orders/10
```

単純な削除 API では Method + Path だけで意図が十分伝わるため Body
がない場合が多い。ただし絶対的なルールではなく、API Contract に従う。

成功例：

``` http
204 No Content
```

API によっては `200 OK` と Body を返すこともある。対象が存在しない場合は
`404 Not Found` などがあり得る。

DELETE は safe ではないが、HTTP の意味論では idempotent である。最初が
204、2回目が 404
でも、最終的に対象が存在しないという意図された状態効果は同じである。

**ヒント:** `DELETE = 204` と暗記しない。DELETE は Request Method、204
は可能な Response の一つである。

## STEP 11. HTTP Response の構造

Response は Server から Client に返すメッセージである。

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

Status Code は処理結果、Headers はメタデータ、Body は実際の Response
内容を表す。

`204 No Content` のように成功していても Body がない Response もある。

**ヒント:** `Response ≠ JSON`。JSON は Response Body
で利用できるデータ表現形式の一つにすぎない。

## STEP 12. Status Code

重要な Status Code：

  Code                        意味
  --------------------------- -------------------------------------
  200 OK                      処理成功
  201 Created                 Resource 作成成功
  204 No Content              成功、Response Body なし
  400 Bad Request             Request が API の要件を満たさない等
  401 Unauthorized            認証情報が必要・無効など
  403 Forbidden               Request した操作を行う権限がない等
  404 Not Found               対象 Resource が見つからない
  500 Internal Server Error   Server 処理中の予期しない問題

分類：

``` text
2xx → Success
4xx → Request 側のカテゴリ
5xx → Server 側の処理問題
```

これを Frontend/Backend 開発者個人の責任という意味に解釈してはいけない。

**ヒント:** `Method = Client が要求した行動`,
`Status Code = Server の処理結果` と区別しよう。

## STEP 13. JSON

JSON (JavaScript Object Notation)
はデータを表現・交換するためのテキスト形式である。

JavaScript Object：

``` js
const order = {
  id: 10,
  status: "shipping",
};
```

JSON：

``` json
{
  "id": 10,
  "status": "shipping"
}
```

見た目は似ているが同じものではない。

``` text
JavaScript Value
→ JSON.stringify()
→ JSON Text
→ HTTP Body
```

逆方向は概念的に：

``` text
HTTP Body
→ JSON Text
→ Parsing
→ JavaScript Value
```

JSON の値として string、number、boolean、null、object、array
が利用できる。`undefined` や function は JSON の値ではない。

**ヒント:** `{...}` を見ただけで JSON と呼ばず、JavaScript
の実行時データなのか JSON Text なのか文脈を確認しよう。

## STEP 14. Headers と Content-Type

Headers は HTTP メッセージに関するメタデータを持つ。

例：

``` http
Content-Type: application/json
Authorization: Bearer ...
Accept: application/json
```

`Content-Type` は **現在のメッセージ Body の media type** を表す。

``` text
Request Content-Type  → Request Body の種類
Response Content-Type → Response Body の種類
```

Body がないメッセージでは Content-Type が不要なこともある。Content-Type
がない、または間違っている場合の動作は Server/API の実装による。

`Accept` は Client が受け入れ可能、または希望する Response の media type
を表すために使われる。

**ヒント:** `Headers=メタデータ`, `Body=実際の内容`,
`Content-Type=Body の種類の説明` と分けよう。

## STEP 15. HTTP と Promise / async / await / try-catch

Server 通信には時間がかかる。

``` text
Request → 待機 → Response
```

JavaScript の `fetch()` のような Web API は非同期処理を Promise
で表現する。

``` text
fetch()
→ Promise
→ await
→ Response
```

HTTP 自体が Promise を返すのではなく、`fetch()` が Promise を返す。

`await` はブラウザ全体を停止させるのではなく、現在の async function
の続きの実行を Promise の完了まで待たせる。

概念例：

``` js
async function loadOrders() {
  try {
    const response = await fetch("/orders");

    if (!response.ok) {
      throw new Error("注文の取得に失敗しました");
    }

    const data = await response.json();
    // state を更新
  } catch (error) {
    // エラー処理
  }
}
```

重要なのは、`fetch()` は通常 HTTP 404/500 Response が返っただけでは
Promise を reject しないこと。Response
自体は届いているため、`response.ok` や Status
を確認する必要がある。ネットワークレベルの失敗などは Promise rejection
につながることがある。

**ヒント:** `response.ok = HTTP Status の確認`,
`try/catch = JavaScript の例外・Promise rejection の処理`
と役割を分けよう。

## STEP 16. 既存の注文 CRUD を HTTP に変換

既存関数と HTTP API の対応：

  機能                         HTTP
  ---------------------------- ----------------------
  `getOrders()`                `GET /orders`
  `getOrder(id)`               `GET /orders/:id`
  `addOrder(order)`            `POST /orders`
  `updateOrder(id, changes)`   `PATCH /orders/:id`
  `deleteOrder(id)`            `DELETE /orders/:id`

全体：

``` text
UI Action
→ useOrders
→ HTTP Request
→ API
→ Server
→ Database
→ HTTP Response
→ useOrders
→ React State
→ UI
```

Server が最終的に確定した結果を Response として受け取り、React State
と同期する流れが重要になる。

**ヒント:** CRUD 自体が消えるのではなく、**データアクセス方法が
localStorage から HTTP API に変わる**と理解しよう。

## STEP 17. 成功・失敗を React UI につなげる

Server Data を扱うときは Data だけでなく Loading と Error も考える。

``` text
Request 開始
→ Loading
→ Response
   ├─ Success → Data → State → UI
   └─ Error   → Error State → Error UI
→ Loading 終了
```

例：

``` text
200 → 注文データを表示
400 → 入力内容の確認を案内
401 → ログイン・認証関連の処理
403 → 権限がないことを表示
404 → 注文が見つからない
500 → Server 問題・再試行案内
```

空配列 `[]` と「まだ Response が来ていない」は異なる状態である。

**ヒント:** Server Data を扱うときは常に `Data / Loading / Error`
をセットで考えよう。

## STEP 18. Request → Response の完全な往復

### 注文一覧取得

``` text
ユーザー
→ 注文ページ
→ React
→ GET /orders
→ HTTP Request
→ API/Server
→ Database 検索
→ 200 + JSON
→ HTTP Response
→ React
→ 注文データ
→ State
→ UI
```

### 注文作成

``` text
ユーザー
→ 注文する
→ React の newOrder
→ JSON.stringify()
→ POST /orders
→ Content-Type: application/json
→ JSON Body
→ Server
→ Parsing / Validation / Business Logic
→ Database
→ 201 Created + 作成済み注文 JSON
→ React
→ State
→ UI
```

**ヒント:** API 通信を「Request
を送った」で終わらせず、**ユーザー操作から最終 UI
までの往復**として説明しよう。

## STEP 19. 主要用語を区別する

  概念          中心的な意味
  ------------- ----------------------------------------------
  HTTP          Client-Server 通信プロトコル
  API           機能・データを利用可能にするインターフェース
  Request       Client → Server のメッセージ
  Response      Server → Client のメッセージ
  Method        Request の行動の意味
  Endpoint      API 内の具体的な Request 地点
  Header        HTTP メッセージのメタデータ
  Body          HTTP メッセージの実際の内容
  JSON          データ表現形式
  Status Code   Server による Request 処理結果

質問で覚える：

``` text
HTTP        → どう通信する？
API         → どんな機能・データを利用可能にする？
Request     → Client は何を依頼した？
Method      → 何をする？
Endpoint    → どこへ Request する？
JSON        → データをどう表現する？
Response    → Server は何を返した？
Status Code → 処理結果はどうだった？
```

**ヒント:** 定義だけを暗記せず、`POST /orders → 201 + JSON`
のような具体例の中で各用語の位置を探そう。

## STEP 20. Day 16 最終まとめ

HTTP Request：

``` text
Method + URL + Headers + Body
```

HTTP Response：

``` text
Status Code + Headers + Body
```

注文 CRUD：

``` text
POST   /orders      → Create
GET    /orders      → Read
GET    /orders/:id  → Read one
PATCH  /orders/:id  → Update
DELETE /orders/:id  → Delete
```

最終フロー：

``` text
React (Client)
→ HTTP Request
→ API
→ Server
→ Database
→ HTTP Response
→ Status/Headers/Body
→ React
→ Data / Loading / Error
→ State
→ UI
```

Day 17 の `fetch()` は魔法ではなく、今日学んだ HTTP の構造を JavaScript
から実行するための Web API である。

``` js
const response = await fetch("/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newOrder),
});
```

対応関係：

``` text
/orders          → URL
POST             → Method
headers          → Headers
Content-Type     → Body の media type を説明
body             → Request Body
JSON.stringify() → JS の値を JSON Text に serialize
await            → Promise ベースの非同期結果を待つ
response         → HTTP Response
```

**ヒント:** Day 17 の前に次の2行を確実に覚えよう。\
`Request = Method + URL + Headers + Body`\
`Response = Status Code + Headers + Body`

------------------------------------------------------------------------

## Day 16 完了チェック

次の流れを自分の言葉で説明できれば十分である。

``` text
React
→ HTTP Request
→ API/Server
→ 処理・Database アクセス
→ HTTP Response
→ JSON + Status Code
→ React State
→ UI
```

さらに `fetch()` のコードに URL、Method、Headers、Body、Response
がなぜ登場するのか説明できれば Day 17 に進む準備ができている。
