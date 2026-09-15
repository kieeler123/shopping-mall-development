# Day 16 --- STEP 16. useOrders の CRUD を HTTP に翻訳する

> **この STEP の目標:** 既存 CRUD の意図を維持したまま、localStorage
> のデータアクセスを HTTP API に置き換える。

------------------------------------------------------------------------

## 0. この STEP は全体のどこにあるのか？

Day 16 は、互いに無関係な用語を順番に暗記する授業ではない。同じ
architecture を何度も見ながら、各 STEP で一部分を拡大して理解していく。

``` text
User
↓
React Client
↓
HTTP Request
↓
API / Server
↓
Database
↓
HTTP Response
↓
React State
↓
UI
```

新しい用語が出たとき最初に考えるべきなのは、**この概念は上の flow
のどこにあり、何の問題を解決しているのか？** という問いである。

> **ヒント**
>
> 定義を覚える前に、Client 側・Server 側・Request・Response・data
> representation・communication rule のどれに属するか分類しよう。

## 1. 既存 useOrders 構造

Server で結果が確定しても React UI が自動的に変わるわけではない。Client
は Response を処理し、自分の State を同期する必要がある。

``` text
HTTP Response
↓
result check / Body processing
↓
React State
↓
rerender
↓
UI
```

Server 側の永続データと React State は同じ storage ではない。Server
が注文データの source of truth になっても、React は現在の UI を表現する
Client-side State を持つ。

このため Server Data を扱う UI では `orders` だけでなく Data / Loading /
Error を分離して考えることが重要になる。

> **ヒント**
>
> API の例を読んだら、最後に「どの State
> が変わり、ユーザーには何が見える？」まで必ずつなげよう。

## 2. Hook を残せる理由

Server で結果が確定しても React UI が自動的に変わるわけではない。Client
は Response を処理し、自分の State を同期する必要がある。

``` text
HTTP Response
↓
result check / Body processing
↓
React State
↓
rerender
↓
UI
```

Server 側の永続データと React State は同じ storage ではない。Server
が注文データの source of truth になっても、React は現在の UI を表現する
Client-side State を持つ。

このため Server Data を扱う UI では `orders` だけでなく Data / Loading /
Error を分離して考えることが重要になる。

> **ヒント**
>
> API の例を読んだら、最後に「どの State
> が変わり、ユーザーには何が見える？」まで必ずつなげよう。

## 3. getOrders → GET /orders

CRUD style の Orders API では GET は Read によく対応する。

``` http
GET /orders
```

は注文 collection の取得、次の Request
は特定注文の取得として設計できる。

``` http
GET /orders/10
```

ただし GET を Database の `SELECT`
と同じ意味だと考えてはいけない。Server は
Authentication、Authorization、Query 処理、Business Logic、複数 data
source の参照などを行ったうえで Response を構成できる。

GET は HTTP semantics 上 safe かつ idempotent である。Safe は security
上安全という意味ではなく、idempotent は Response
が毎回完全に同じという意味でもない。

> **ヒント**
>
> GET を見たら「何を読む？」だけでなく「この Request semantics は
> Resource state の変更を要求しているか？」も考えよう。

## 4. getOrder → GET /orders/:id

CRUD style の Orders API では GET は Read によく対応する。

``` http
GET /orders
```

は注文 collection の取得、次の Request
は特定注文の取得として設計できる。

``` http
GET /orders/10
```

ただし GET を Database の `SELECT`
と同じ意味だと考えてはいけない。Server は
Authentication、Authorization、Query 処理、Business Logic、複数 data
source の参照などを行ったうえで Response を構成できる。

GET は HTTP semantics 上 safe かつ idempotent である。Safe は security
上安全という意味ではなく、idempotent は Response
が毎回完全に同じという意味でもない。

> **ヒント**
>
> GET を見たら「何を読む？」だけでなく「この Request semantics は
> Resource state の変更を要求しているか？」も考えよう。

## 5. addOrder → POST /orders

CRUD style の Orders API では新しい注文の作成に `POST /orders`
を使う設計が一般的である。

``` http
POST /orders
Content-Type: application/json

{
  "productId": 3,
  "quantity": 2
}
```

Client の `newOrder` は作成 Request の input であり、Server
が確定した最終 Resource とは限らない。Server
は商品・数量を検証し、正しい価格を計算し、ID や初期
status、作成時刻などを決定できる。

``` text
newOrder
↓ POST
Server
↓
createdOrder
```

Resource 作成成功には `201 Created` がよく使われるが、すべての API
が必ず 201 を使うわけではない。POST は safe ではなく、一般には
idempotent も保証されない。

> **ヒント**
>
> 「Client が作ってほしいと送ったデータ」と「Server
> が実際に作成したと確定した Resource」を分けよう。

## 6. updateOrder → PATCH /orders/:id

PATCH は Resource の partial modification によく使われる。URL と Body
は別々の質問として読む。

``` http
PATCH /orders/10
Content-Type: application/json

{
  "status": "shipping"
}
```

``` text
/orders/10 → どの Resource？
Body       → 何を変更？
```

Partial は「必ず一つの field だけ」という意味ではない。Server
は入力形式だけでなく、現在の注文状態からその変更が許可されるかという
Business Rule も確認できる。

PATCH Method 自体は idempotency を保証しない。「status を shipping
に設定」と「quantity を現在値から
+1」では繰り返したときの効果が異なる可能性がある。

> **ヒント**
>
> PATCH は「一項目変更」ではなく **Target + Changes による部分更新**
> と覚えよう。

## 7. deleteOrder → DELETE /orders/:id

DELETE は Resource の削除を要求する Method である。

``` http
DELETE /orders/10
```

単純な削除では Method と Path だけで意図を十分表せることが多いが、DELETE
Request Body が絶対に不可能という意味ではない。実際の Contract に従う。

成功時は `204 No Content` を返す API もあれば、`200 OK` と Body を返す
API もある。DELETE と 204 は同じ概念ではない。

DELETE は Resource state の変更を要求するため safe ではないが、HTTP
semantics 上は idempotent である。最初が 204、繰り返しが 404
でも、意図された最終状態が「Resource が存在しない」なら矛盾しない。

> **ヒント**
>
> Idempotency は Response の完全一致ではなく、繰り返した Request
> の意図された state effect を見る。

## 8. 各 operation の input/output

`各 operation の input/output`は単独の定義としてではなく、一つの
end-to-end HTTP flow の中で理解する。

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

同じ Path でも Method が変われば意味が変わることがあり、同じ Endpoint
でも認証状態、入力値、Resource の存在、Server 処理結果によって異なる
Response が返る。

したがって HTTP code は一つの単語だけを切り取って読むのではなく、message
の方向、Request
semantics、宛先、metadata、content、処理結果を組み合わせて読む必要がある。

> **ヒント**
>
> `各 operation の input/output`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 9. localStorage source と Server source

Browser で動く Client と Server の間には trust boundary
がある。Client-side code は利用者が観察・変更できるため、重要な business
rule を React の制御だけに依存してはいけない。

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

Server と Database も同じ役割ではない。Database
はデータの保存・検索を担当し、Server は Request
を解釈し、ルールを適用し、必要な Database 操作を調整して Response
を作る。

すべての Endpoint
が上記処理を全部行うわけではないが、このモデルを持っておくと Server
を「Internet 上の localStorage」のように誤解しにくい。

> **ヒント**
>
> Client validation は UX に重要だが、Server validation や Authorization
> の代わりにはならない。

## 10. Server Response を権威ある結果として扱う

Browser で動く Client と Server の間には trust boundary
がある。Client-side code は利用者が観察・変更できるため、重要な business
rule を React の制御だけに依存してはいけない。

``` text
Request
↓
Server
├─ Authentication
├─ Authorization
├─ Parsing
├─ Validation
├─ Business Logic
└─ Database access
↓
Response
```

Server と Database も同じ役割ではない。Database
はデータの保存・検索を担当し、Server は Request
を解釈し、ルールを適用し、必要な Database 操作を調整して Response
を作る。

すべての Endpoint
が上記処理を全部行うわけではないが、このモデルを持っておくと Server
を「Internet 上の localStorage」のように誤解しにくい。

> **ヒント**
>
> Client validation は UX に重要だが、Server validation や Authorization
> の代わりにはならない。

## 11. React State の同期

Server で結果が確定しても React UI が自動的に変わるわけではない。Client
は Response を処理し、自分の State を同期する必要がある。

``` text
HTTP Response
↓
result check / Body processing
↓
React State
↓
rerender
↓
UI
```

Server 側の永続データと React State は同じ storage ではない。Server
が注文データの source of truth になっても、React は現在の UI を表現する
Client-side State を持つ。

このため Server Data を扱う UI では `orders` だけでなく Data / Loading /
Error を分離して考えることが重要になる。

> **ヒント**
>
> API の例を読んだら、最後に「どの State
> が変わり、ユーザーには何が見える？」まで必ずつなげよう。

## 12. Loading が設計に加わる

Network 通信には時間がかかるため、HTTP 通信は JavaScript
の非同期処理と自然につながる。

``` text
fetch()
↓
Promise
↓
pending
↓
HTTP communication
↓
Response に関する結果 または rejection
```

正確には **HTTP が Promise を返すのではない**。Browser の JavaScript Web
API である `fetch()` が Promise を返す。`await` はその Promise
ベースの処理結果を現在の async function 内で待つのであり、Browser
全体を停止するものではない。

また、404/500 Response が届いた状況と Network failure で Promise が
reject された状況は別である。`fetch()` は通常、4xx/5xx
という理由だけでは reject しないため、`response.ok` と `try/catch`
は異なる役割を持つ。

> **ヒント**
>
> 「HTTP failure status」と「Promise rejection」を一つの Error
> としてまとめず、二つの layer に分けよう。

## 13. Error が設計に加わる

`Error が設計に加わる`は単独の定義としてではなく、一つの end-to-end HTTP
flow の中で理解する。

``` text
React Client
↓
HTTP Request
↓
Orders API / Server
↓
HTTP Response
↓
React
```

同じ Path でも Method が変われば意味が変わることがあり、同じ Endpoint
でも認証状態、入力値、Resource の存在、Server 処理結果によって異なる
Response が返る。

したがって HTTP code は一つの単語だけを切り取って読むのではなく、message
の方向、Request
semantics、宛先、metadata、content、処理結果を組み合わせて読む必要がある。

> **ヒント**
>
> `Error が設計に加わる`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 14. Component と Hook の責任分離

Server で結果が確定しても React UI が自動的に変わるわけではない。Client
は Response を処理し、自分の State を同期する必要がある。

``` text
HTTP Response
↓
result check / Body processing
↓
React State
↓
rerender
↓
UI
```

Server 側の永続データと React State は同じ storage ではない。Server
が注文データの source of truth になっても、React は現在の UI を表現する
Client-side State を持つ。

このため Server Data を扱う UI では `orders` だけでなく Data / Loading /
Error を分離して考えることが重要になる。

> **ヒント**
>
> API の例を読んだら、最後に「どの State
> が変わり、ユーザーには何が見える？」まで必ずつなげよう。

------------------------------------------------------------------------

## 注文 Project の完全な Flow に戻してみる

``` text
React Client
      │
      │ HTTP Request
      │ ├─ Method
      │ ├─ URL / Endpoint
      │ ├─ Headers
      │ └─ Body
      ▼
Orders API / Server
      │
      ├─ Authentication
      ├─ Authorization
      ├─ Parsing
      ├─ Validation
      ├─ Business Logic
      └─ Database
      │
      ▼
HTTP Response
      │ ├─ Status Code
      │ ├─ Headers
      │ └─ Body
      ▼
React
      │
      ├─ Data
      ├─ Loading
      └─ Error
      ▼
State → rerender → UI
```

## よくある誤解を確認する

**useOrders の CRUD を HTTP に翻訳する**を一つの keyword
に縮めて暗記しないことが重要である。特に次の境界を維持する。

``` text
HTTP ≠ API
API ≠ Server
Server ≠ Database
Request ≠ Method
Response ≠ JSON
Body ≠ JSON
Status Code ≠ Response
fetch() ≠ HTTP
```

この STEP の中心テーマではない組み合わせも含まれているが、全体の境界 map
を毎回見ておくと、後の `fetch()`
実装で一つの概念が別の概念に置き換わってしまうのを防げる。

> **ヒント**
>
> 二つの用語が似て見えたら、それぞれが答える質問を一つずつ作ろう。例：`Method → 何をしたい？`、`Status Code → 処理結果はどうだった？`。

## 自分の言葉で説明してみる

次の質問に、本文を見ずに答えてみよう。

1.  **useOrders の CRUD を HTTP に翻訳する**は注文 Project
    で何を意味するか？
2.  Request → Server → Response のどこに現れるか？
3.  注文一覧取得ではどう現れるか？
4.  注文作成・更新・削除ではどう関係するか？
5.  どんな誤解が Day 17 の `fetch()` code を間違わせるか？
6.  Response の後、React State / UI はどう関わるか？

> **ヒント**
>
> すぐに本文を読み返さず、まず声に出して説明しよう。説明が止まった場所が、そのまま復習ポイントになる。

## STEP 16 Checklist

-   [ ] 既存 CRUD の意図を維持したまま、localStorage のデータアクセスを
    HTTP API に置き換える。
-   [ ] Orders API の具体例で説明できる。
-   [ ] 似ている HTTP/API 用語との違いを説明できる。
-   [ ] Request → Server → Response → State → UI の中に配置できる。
-   [ ] 必要に応じて Day 15 の非同期処理や Day 17 の `fetch()`
    と接続できる。

## STEP 16 の重要ポイント

> **既存 CRUD の意図を維持したまま、localStorage のデータアクセスを HTTP
> API に置き換える。**

## 次の STEP への接続

この概念をもう一度 HTTP の完全な往復 flow に戻してから次へ進もう。次の
STEP でも **なぜ必要か → 正確な役割 → 注文例 → よくある誤解 → React
との接続** という順序で一つの構成要素を拡大する。
