# Day 16 --- STEP 19. HTTP/API の重要用語を完全に区別する

> **この STEP の目標:**
> HTTP、API、Request、Response、Method、Endpoint、JSON、Status Code
> を一つの階層モデルに配置する。

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

## 1. HTTP

`HTTP`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `HTTP`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 2. API

`API`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `API`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 3. Request

`Request`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `Request`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 4. Response

`Response`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `Response`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 5. Method

`Method`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `Method`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 6. Endpoint

`Endpoint`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `Endpoint`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 7. Header

`Header`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `Header`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 8. Body

この概念では **runtime 上の値**、**データ表現形式**、**HTTP message
内の位置**を分けて考えることが重要である。

``` text
JavaScript Value
↓ serialization
JSON Text
↓
HTTP Body

JSON を含む HTTP Body
↓ parsing
JavaScript Value
```

Headers は message に関する metadata であり、Body そのものではない。JSON
は Body
に入れられる表現形式の一つである。`Content-Type: application/json`
は、現在の message Body の media type を説明している。

JavaScript コードで `{ id: 10 }` のような形を見たからといって、すぐ JSON
と呼んではいけない。それは runtime 上の JavaScript Object
かもしれない。Network で交換するために serialize された text
なのかどうかを区別する必要がある。

> **ヒント**
>
> 波括弧を見たら、まず「これは JavaScript Value か、JSON Text
> か、それとも HTTP Body の content か？」と確認しよう。

## 9. JSON

この概念では **runtime 上の値**、**データ表現形式**、**HTTP message
内の位置**を分けて考えることが重要である。

``` text
JavaScript Value
↓ serialization
JSON Text
↓
HTTP Body

JSON を含む HTTP Body
↓ parsing
JavaScript Value
```

Headers は message に関する metadata であり、Body そのものではない。JSON
は Body
に入れられる表現形式の一つである。`Content-Type: application/json`
は、現在の message Body の media type を説明している。

JavaScript コードで `{ id: 10 }` のような形を見たからといって、すぐ JSON
と呼んではいけない。それは runtime 上の JavaScript Object
かもしれない。Network で交換するために serialize された text
なのかどうかを区別する必要がある。

> **ヒント**
>
> 波括弧を見たら、まず「これは JavaScript Value か、JSON Text
> か、それとも HTTP Body の content か？」と確認しよう。

## 10. Status Code

Status Code は Response 全体ではなく、Response に含まれる **HTTP level
の処理結果 signal** である。

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

例えば 404 Response に JSON Error Body が含まれることもある。一方、204
は成功だが Response Body を持たない。この違いを理解していないと、後で
`response.json()` をすべての Response
に対して無条件に実行するようなコードを書きやすい。

Request 側の Method は「Client が何をしたいか」を表し、Response 側の
Status Code は「Server がその Request をどう処理したか」を表す。

> **ヒント**
>
> Status Code は数字だけで暗記せず、注文 API の具体的な状況と React UI
> の反応をセットで考えよう。

## 11. API ≠ Server

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

## 12. API ≠ URL

`API ≠ URL`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `API ≠ URL`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 13. HTTP ≠ API

`HTTP ≠ API`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `HTTP ≠ API`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 14. Request ≠ Method

`Request ≠ Method`は単独の定義としてではなく、一つの end-to-end HTTP
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
> `Request ≠ Method`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 15. Response ≠ JSON

この概念では **runtime 上の値**、**データ表現形式**、**HTTP message
内の位置**を分けて考えることが重要である。

``` text
JavaScript Value
↓ serialization
JSON Text
↓
HTTP Body

JSON を含む HTTP Body
↓ parsing
JavaScript Value
```

Headers は message に関する metadata であり、Body そのものではない。JSON
は Body
に入れられる表現形式の一つである。`Content-Type: application/json`
は、現在の message Body の media type を説明している。

JavaScript コードで `{ id: 10 }` のような形を見たからといって、すぐ JSON
と呼んではいけない。それは runtime 上の JavaScript Object
かもしれない。Network で交換するために serialize された text
なのかどうかを区別する必要がある。

> **ヒント**
>
> 波括弧を見たら、まず「これは JavaScript Value か、JSON Text
> か、それとも HTTP Body の content か？」と確認しよう。

## 16. Status Code ≠ Response

Status Code は Response 全体ではなく、Response に含まれる **HTTP level
の処理結果 signal** である。

``` text
HTTP Response
├─ Status Code
├─ Headers
└─ Body
```

例えば 404 Response に JSON Error Body が含まれることもある。一方、204
は成功だが Response Body を持たない。この違いを理解していないと、後で
`response.json()` をすべての Response
に対して無条件に実行するようなコードを書きやすい。

Request 側の Method は「Client が何をしたいか」を表し、Response 側の
Status Code は「Server がその Request をどう処理したか」を表す。

> **ヒント**
>
> Status Code は数字だけで暗記せず、注文 API の具体的な状況と React UI
> の反応をセットで考えよう。

## 17. Endpoint ≠ API 全体

`Endpoint ≠ API 全体`は単独の定義としてではなく、一つの end-to-end HTTP
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
> `Endpoint ≠ API 全体`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 18. Content-Type ≠ JSON

この概念では **runtime 上の値**、**データ表現形式**、**HTTP message
内の位置**を分けて考えることが重要である。

``` text
JavaScript Value
↓ serialization
JSON Text
↓
HTTP Body

JSON を含む HTTP Body
↓ parsing
JavaScript Value
```

Headers は message に関する metadata であり、Body そのものではない。JSON
は Body
に入れられる表現形式の一つである。`Content-Type: application/json`
は、現在の message Body の media type を説明している。

JavaScript コードで `{ id: 10 }` のような形を見たからといって、すぐ JSON
と呼んではいけない。それは runtime 上の JavaScript Object
かもしれない。Network で交換するために serialize された text
なのかどうかを区別する必要がある。

> **ヒント**
>
> 波括弧を見たら、まず「これは JavaScript Value か、JSON Text
> か、それとも HTTP Body の content か？」と確認しよう。

## 19. fetch ≠ HTTP

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

## 20. 階層モデル

`階層モデル`は単独の定義としてではなく、一つの end-to-end HTTP flow
の中で理解する。

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
> `階層モデル`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

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

**HTTP/API の重要用語を完全に区別する**を一つの keyword
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

1.  **HTTP/API の重要用語を完全に区別する**は注文 Project
    で何を意味するか？
2.  Request → Server → Response のどこに現れるか？
3.  注文一覧取得ではどう現れるか？
4.  注文作成・更新・削除ではどう関係するか？
5.  どんな誤解が Day 17 の `fetch()` code を間違わせるか？
6.  Response の後、React State / UI はどう関わるか？

> **ヒント**
>
> すぐに本文を読み返さず、まず声に出して説明しよう。説明が止まった場所が、そのまま復習ポイントになる。

## STEP 19 Checklist

-   [ ] HTTP、API、Request、Response、Method、Endpoint、JSON、Status
    Code を一つの階層モデルに配置する。
-   [ ] Orders API の具体例で説明できる。
-   [ ] 似ている HTTP/API 用語との違いを説明できる。
-   [ ] Request → Server → Response → State → UI の中に配置できる。
-   [ ] 必要に応じて Day 15 の非同期処理や Day 17 の `fetch()`
    と接続できる。

## STEP 19 の重要ポイント

> **HTTP、API、Request、Response、Method、Endpoint、JSON、Status Code
> を一つの階層モデルに配置する。**

## 次の STEP への接続

この概念をもう一度 HTTP の完全な往復 flow に戻してから次へ進もう。次の
STEP でも **なぜ必要か → 正確な役割 → 注文例 → よくある誤解 → React
との接続** という順序で一つの構成要素を拡大する。
