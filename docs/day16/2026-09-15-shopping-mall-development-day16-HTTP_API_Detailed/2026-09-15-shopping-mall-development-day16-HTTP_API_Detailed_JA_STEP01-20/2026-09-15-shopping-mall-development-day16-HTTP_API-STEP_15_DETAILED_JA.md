# Day 16 --- STEP 15. HTTP と Promise / async / await / try-catch

> **この STEP の目標:** Day 15 の非同期 JavaScript を fetch ベースの
> HTTP 通信、response.ok、Error handling と接続する。

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

## 1. Network 処理に待ち時間がある理由

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

## 2. HTTP 自体は Promise を返さない

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

## 3. fetch は Browser Web API

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

## 4. fetch は Promise を返す

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

## 5. Promise pending の時間

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

## 6. async function

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

## 7. await が待つもの

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

## 8. await は Browser 全体を止めない

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

## 9. Response object

`Response object`は単独の定義としてではなく、一つの end-to-end HTTP flow
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
> `Response object`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 10. response.json() も Promise

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

## 11. try/catch の役割

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

## 12. 404/500 と rejection の違い

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

## 13. Network failure

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

## 14. response.ok

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

## 15. HTTP failure を明示的に throw

`HTTP failure を明示的に throw`は単独の定義としてではなく、一つの
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
> `HTTP failure を明示的に throw`を読んだ後、注文の取得・作成・更新・削除のどれか一つを使って、自分の言葉で説明してみよう。

## 16. finally と Loading

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

## 17. React の完全な async flow

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

**HTTP と Promise / async / await / try-catch**を一つの keyword
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

1.  **HTTP と Promise / async / await / try-catch**は注文 Project
    で何を意味するか？
2.  Request → Server → Response のどこに現れるか？
3.  注文一覧取得ではどう現れるか？
4.  注文作成・更新・削除ではどう関係するか？
5.  どんな誤解が Day 17 の `fetch()` code を間違わせるか？
6.  Response の後、React State / UI はどう関わるか？

> **ヒント**
>
> すぐに本文を読み返さず、まず声に出して説明しよう。説明が止まった場所が、そのまま復習ポイントになる。

## STEP 15 Checklist

-   [ ] Day 15 の非同期 JavaScript を fetch ベースの HTTP
    通信、response.ok、Error handling と接続する。
-   [ ] Orders API の具体例で説明できる。
-   [ ] 似ている HTTP/API 用語との違いを説明できる。
-   [ ] Request → Server → Response → State → UI の中に配置できる。
-   [ ] 必要に応じて Day 15 の非同期処理や Day 17 の `fetch()`
    と接続できる。

## STEP 15 の重要ポイント

> **Day 15 の非同期 JavaScript を fetch ベースの HTTP
> 通信、response.ok、Error handling と接続する。**

## 次の STEP への接続

この概念をもう一度 HTTP の完全な往復 flow に戻してから次へ進もう。次の
STEP でも **なぜ必要か → 正確な役割 → 注文例 → よくある誤解 → React
との接続** という順序で一つの構成要素を拡大する。
