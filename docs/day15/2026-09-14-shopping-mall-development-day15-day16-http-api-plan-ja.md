# Day 16 — HTTP と API の基礎 学習計画

> Day 15 で学んだ `Promise`、`async`、`await`、`try/catch` を実際のサーバー通信につなげるための理論中心の Day です。  
> Day 16 ではまだ `fetch()` を本格実装せず、**HTTP Request / Response と API の構造を理解すること**を目標にします。

---

## STEP 1 — なぜ HTTP と API が必要なのか？

### 学習目標

これまでブラウザ内部で扱っていたデータと、実際のサーバーで管理されるデータの違いを理解します。

```text
これまで

React
↓
useOrders
↓
localStorage

これから

React
↓
HTTP Request
↓
API
↓
Server
↓
Database
```

中心となる質問：

```text
ブラウザとサーバーは
どうやってデータをやり取りするのか？
```

その通信ルールの中心に HTTP があります。

**ヒント**

HTTP 用語から暗記せず、「ブラウザの外にある注文データをどう取得するか？」という問題から始めます。

---

## STEP 2 — Client と Server を理解

### 学習目標

誰が Request を送り、誰が Response を返すのかを区別します。

```text
Client
↓ Request
Server

Client
↑ Response
Server
```

ショッピングプロジェクトでは React アプリが Client、注文データを提供する Backend が Server になります。

```text
React
「注文一覧をください」
        ↓
      Server
        ↓
「注文一覧です」
```

基本概念：

- Client: データやサービスを要求する側
- Server: Request を受け取り処理する側
- Request: Client から Server へ送る要求
- Response: Server から Client へ返す応答

**ヒント**

`Client → Request → Server → Response → Client` の流れを最初に定着させましょう。

---

## STEP 3 — HTTP とは何か？

### 学習目標

HTTP を単なる略語ではなく、Client と Server 間の通信ルールとして理解します。

```text
Client
↓
HTTP Request
↓
Server
↓
HTTP Response
↓
Client
```

Day 16 では次の質問を中心にします。

```text
どこへ送る？
何を要求する？
どんな方法で要求する？
何が返ってくる？
```

**ヒント**

HTTP をインターネットそのものと考えず、Web 上で情報を交換するための約束として理解します。

---

## STEP 4 — Request の構造

### 学習目標

HTTP Request の大きな構造を理解します。

```text
Request

Method
URL
Headers
Body
```

例：

```text
POST /orders

Content-Type: application/json

{
  "name": "Kim",
  "totalPrice": 50000
}
```

役割：

```text
Method  → 何をする？
URL     → どこへ送る？
Headers → Request の追加情報
Body    → Server に送る実データ
```

すべての Request に Body があるわけではありません。

**ヒント**

Request を `行動 + 宛先 + 補足情報 + データ` の4つに分けて読みましょう。

---

## STEP 5 — URL と Endpoint

### 学習目標

API Request の送信先を理解します。

```text
https://example.com/api/orders
```

概念的には：

```text
Server のアドレス
+
API のパス
```

例：

```text
GET    /orders
GET    /orders/10
POST   /orders
PATCH  /orders/10
DELETE /orders/10
```

**ヒント**

Endpoint を単なる文字列として暗記せず、「どの resource を対象にするパスか？」を考えます。

---

## STEP 6 — Resource と API

### 学習目標

Resource と API の関係を理解します。

ショッピングアプリの resource 例：

```text
products
users
orders
cart
```

API は Client が Server のデータや機能を利用するために提供されるインターフェースと考えられます。

```text
React
↓
Orders API
↓
Order Data
```

例：

```text
/orders
/products
/users
```

**ヒント**

API を単なる Server URL と考えず、Client に公開された「接点・インターフェース」として理解します。

---

## STEP 7 — HTTP Method: GET

### 学習目標

データ取得と GET をつなげます。

```text
注文一覧を取得
↓
GET /orders
```

特定の注文：

```text
GET /orders/10
```

CRUD との対応：

```text
READ
↓
GET
```

**ヒント**

`GET` という単語だけを暗記せず、すでに知っている Read 処理と結びつけます。

---

## STEP 8 — HTTP Method: POST

### 学習目標

新規データ作成と POST をつなげます。

```text
新しい注文を作成
↓
POST /orders
```

Request Body 例：

```json
{
  "name": "Kim",
  "phone": "010-0000-0000",
  "totalPrice": 50000
}
```

CRUD：

```text
CREATE
↓
POST
```

**ヒント**

POST では「何を作るのか？」と「Server にどんなデータを送るのか？」をセットで考えます。

---

## STEP 9 — HTTP Method: PATCH

### 学習目標

既存データの一部更新と PATCH をつなげます。

注文 status だけ変更する例：

```text
PATCH /orders/10
```

```json
{
  "status": "配送中"
}
```

CRUD：

```text
UPDATE
↓
PATCH
```

**ヒント**

Day 16 では PATCH と PUT の細かい違いを深追いしません。まず「既存データの一部更新」と PATCH を結びつけます。

---

## STEP 10 — HTTP Method: DELETE

### 学習目標

削除処理と DELETE をつなげます。

```text
DELETE /orders/10
```

CRUD 全体：

```text
Create → POST
Read   → GET
Update → PATCH
Delete → DELETE
```

**ヒント**

4つの Method を別々に暗記せず、これまで作った CRUD 機能と1対1で対応させます。

---

## STEP 11 — Response の構造

### 学習目標

Server が Request を処理した後に何を返すか理解します。

```text
Response

Status Code
Headers
Body
```

例：

```text
Status: 200

{
  "id": 10,
  "status": "配送中"
}
```

Client は Response から結果とデータを判断します。

**ヒント**

Request と Response は必ずペアで追います。「送った」で終わらず「何が返ったか？」まで確認します。

---

## STEP 12 — HTTP Status Code の基礎

### 学習目標

Status Code が Request の処理結果を表すことを理解します。

```text
200 OK
→ 成功

201 Created
→ 新規データ作成成功

400 Bad Request
→ 不正な Request

401 Unauthorized
→ 認証が必要、または認証失敗に関連

403 Forbidden
→ 権限不足

404 Not Found
→ Resource が見つからない

500 Internal Server Error
→ Server 内部エラー
```

カテゴリ：

```text
2xx → 成功
4xx → Client / Request 側の問題
5xx → Server 側の問題
```

**ヒント**

すべての Status Code を暗記する必要はありません。まず `200/201`、`400/401/403/404`、`500` を実例と結びつけます。

---

## STEP 13 — JSON を理解

### 学習目標

Client と Server 間でよく使われるデータ交換形式 JSON を理解します。

```json
{
  "id": 10,
  "name": "Kim",
  "status": "配送中",
  "totalPrice": 50000
}
```

配列：

```json
[
  { "id": 1, "status": "決済完了" },
  { "id": 2, "status": "配送中" }
]
```

JavaScript オブジェクトと似ていますが、JSON はデータ交換形式です。

**ヒント**

`JSON = JavaScript オブジェクトそのもの` と考えないようにします。見た目は似ていますが役割が違います。

---

## STEP 14 — Headers と Content-Type

### 学習目標

Headers が Request / Response に関する追加情報を伝えることを理解します。

代表例：

```text
Content-Type: application/json
```

概念：

```text
Body
→ 実際のデータ

Headers
→ 通信やデータについての説明情報
```

**ヒント**

すべての Header を暗記しません。Day 16 では `Content-Type` を確実に理解すれば十分です。

---

## STEP 15 — Day 15 の非同期処理と HTTP を接続

### 学習目標

なぜ HTTP の前に Promise と async/await を学んだのか理解します。

Server の Response は即座に返るとは限りません。

```text
Request 送信
↓
待つ
↓
Response 到着
```

実際のコードは概念的に：

```text
HTTP Request
↓
Promise
↓
await
↓
Response
↓
成功処理 / 失敗処理
```

Day 15：

```text
Promise
async
await
try/catch
```

Day 16：

```text
HTTP
Request
Response
API
```

Day 17 で `fetch()` を使って両者を接続します。

**ヒント**

「なぜ await が必要だったのか？」を Server の Response を待つ状況と結びつけましょう。

---

## STEP 16 — 注文 CRUD を HTTP に変換

### 学習目標

これまでの注文機能を HTTP の言葉で表現します。

```text
注文一覧取得
→ GET /orders

注文1件取得
→ GET /orders/:id

注文作成
→ POST /orders

注文 status 更新
→ PATCH /orders/:id

注文削除
→ DELETE /orders/:id
```

全体：

```text
UI 操作
↓
HTTP Request
↓
API
↓
Server 処理
↓
HTTP Response
↓
React state 更新
↓
UI 更新
```

**ヒント**

新しい無関係な例を作らず、すでに理解している orders 機能を HTTP の言葉へ翻訳します。

---

## STEP 17 — 成功と失敗の流れ

### 学習目標

API 通信には成功と失敗の両方があることを理解します。

成功：

```text
Request
↓
Server
↓
200 / 201
↓
Response Data
↓
state 更新
↓
UI
```

失敗：

```text
Request
↓
Server
↓
4xx / 5xx
↓
Error 処理
↓
ユーザーへの Feedback
```

ここで Day 15 の `try/catch` が実務的な意味を持ち始めます。

**ヒント**

API の流れを考えるときは、成功ルートと失敗ルートを必ず両方描きましょう。

---

## STEP 18 — Day 16 全体の通信フロー

### 学習目標

HTTP/API の大きな流れを説明できるようにします。

```text
ユーザーが注文一覧を要求
↓
React (Client)
↓
GET /orders
↓
HTTP Request
↓
API / Server
↓
注文データ処理
↓
HTTP Response
↓
Status Code + JSON
↓
React
↓
state
↓
UI
```

作成の場合：

```text
ユーザーが注文
↓
POST /orders
↓
Request Body (JSON)
↓
Server
↓
201 Created
↓
作成された注文の Response
```

**ヒント**

この流れをコードなしで自分の言葉で説明できれば、Day 17 の `fetch()` に進む準備ができています。

---

## STEP 19 — 混同しやすい概念を整理

### 学習目標

Day 16 の主要用語を区別します。

```text
HTTP
→ Client と Server の通信ルール

API
→ Client が Server のデータ/機能を利用するためのインターフェース

Request
→ Client から Server へ送るもの

Response
→ Server から Client へ返すもの

Method
→ Request の目的・行動

Endpoint
→ Request の対象となる API パス

JSON
→ データ表現・交換形式

Status Code
→ Request の処理結果を示すコード
```

**ヒント**

用語を別々に暗記するのではなく、一つの `GET /orders` の中で各概念を探してみましょう。

---

## STEP 20 — Day 16 最終復習・完了基準

### 最終チェックリスト

```text
1. Client と Server を説明できる
2. Request と Response を区別できる
3. HTTP が必要な理由を説明できる
4. API の役割を説明できる
5. URL と Endpoint の役割を理解している
6. GET / POST / PATCH / DELETE を CRUD と対応できる
7. Request の Method / URL / Headers / Body を区別できる
8. Response の Status Code / Headers / Body を区別できる
9. 代表的な 2xx / 4xx / 5xx を理解している
10. JSON の役割を説明できる
11. Content-Type の基本的な意味を説明できる
12. Day 15 async/await と HTTP を接続して説明できる
13. 注文 CRUD を HTTP Request として表現できる
14. 成功・失敗の流れを説明できる
15. Request → Response → state → UI を説明できる
```

### Day 16 完了基準

次の流れを自分の言葉で説明できれば Day 16 完了です。

```text
React
↓
HTTP Request
↓
API
↓
Server
↓
HTTP Response
↓
JSON + Status Code
↓
React state
↓
UI
```

次の Day：

```text
Day 16
HTTP + API Theory
↓
Day 17
fetch() + Mock API
```

**ヒント**

Day 16 の目標は HTTP の専門家になることではありません。`fetch()` のコードを見たとき、なぜ URL、method、headers、body、response が登場するのか説明できるレベルで十分です。
