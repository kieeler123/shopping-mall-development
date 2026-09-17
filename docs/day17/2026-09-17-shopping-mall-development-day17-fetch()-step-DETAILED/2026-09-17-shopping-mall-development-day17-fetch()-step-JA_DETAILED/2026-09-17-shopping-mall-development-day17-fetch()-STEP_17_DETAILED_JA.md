# Day 17 --- STEP 17. DELETEと204 --- 最大限詳しく説明した版

> **Day 17の大テーマ:** Day 15 HTTP/API + Day 16
> 非同期JavaScriptを`fetch()`とReact Stateへ接続する\
> **STEP 17の目標:** Bodyのない成功Response
> `204 No Content`を理解し、成功後`filter()`でStateから削除する。

------------------------------------------------------------------------

## 0. このSTEPを全体フローの中に置く

``` text
React Component
      ↓
useOrders
      ↓
fetch()
      ↓
HTTP Request
      ↓
Mock API
      ↓
HTTP Response
      ↓
Response処理
      ↓
JavaScript Data
      ↓
React State
      ↓
Re-render
      ↓
UI
```

今回の中心フロー：

``` text
response.ok確認 → JSON parseなし → setOrders(filter)
```

この地図を先に持つことで、個別の文法をバラバラに暗記するのを防ぐ。

> **ヒント** 各コード行を「Request作成 / Response確認 / Body読み取り /
> State変更」のどこかに分類する。

------------------------------------------------------------------------

## 1. このSTEPの目標

Bodyのない成功Response
`204 No Content`を理解し、成功後`filter()`でStateから削除する。

目的は新しい文法を一つ追加で暗記することではない。User
Actionと最終UIの間にNetwork越しの外部Systemが入ったことで、どんな処理が必要になるのか理解することが重要。

``` text
以前
User Action → JavaScript → localStorage/State → UI

HTTP導入後
User Action → JavaScript → HTTP Request → API
→ HTTP Response → JavaScript → React State → UI
```

ここでDay 15のHTTPとDay 16の非同期JavaScriptが実際のApplication
Flowとしてつながる。

------------------------------------------------------------------------

## 2. 重要なコード / 表現

``` js
DELETE /orders/:id → 204 No Content
```

このコードを4つの層で読む。

### JavaScript

通常のFunction、Object、Condition、Array操作を見る。

### 非同期JavaScript

どのPromiseが作られるか、`await`は何を待つか、`throw`/rejectionがFlowをどう変えるかを見る。

### HTTP

可能な範囲で次を探す。

``` text
Method
URL
Headers
Body
Response
Status Code
JSON
```

### React

結果がStateを変更するか、その変更がRe-renderとUIにつながるかを見る。

> **ヒント**
> 後でTypeScriptやNext.jsが追加されても、この基礎となる4層の原理は変わらない。

------------------------------------------------------------------------

## 3. Day 15〜17との接続

### Day 15 --- HTTP/API

``` text
Client
↓ Request
Server
↓ Response
Client
```

Method / URL / Headers / Body / Status Code / JSONがDay
17では`fetch()`の具体的な要素になる。

### Day 16 --- Promiseとasync/await

Network処理は即時終了しない。

``` text
Request送信
↓
Network移動
↓
Server処理
↓
Response移動
```

後から到着する結果を扱うためPromiseと`async` / `await`が必要になる。

### Day 17 --- Reactとの接続

Responseを受け取るだけでは終わらない。

``` text
Response
↓
JavaScript Data
↓
setState
↓
Re-render
↓
UI
```

Day 17ではHTTP結果を見えるUIまでつなげる。

------------------------------------------------------------------------

## 4. 実際のショッピングモールで考える

管理者注文機能で考える。

``` text
AdminOrdersPage
↓
useOrders
↓
HTTP
↓
Orders API
```

Pageは「注文を表示する」「Statusを変更する」というUser機能に集中する。一方HTTP側ではMethod、URL、Body、成功Status、Response
Body、Failure Handlingなどを決める必要がある。

この段階ではAPI
Layerを先に作らない。まず`useOrders`でHTTP詳細を経験し、繰り返しや責任混在が見えた後で分離する。

> **ヒント** ArchitectureはFolder Structureとして暗記せず、Problem →
> Need → Solutionの順で学ぶ。

------------------------------------------------------------------------

## 5. よく混乱する点

### 混乱1 --- HTTPとJavaScriptを同じ概念として読む

`GET`、`404`、HeadersはHTTP。`await`、`throw`、`try/catch`はJavaScript。`useState`、`useEffect`はReact。

### 混乱2 --- ResponseとDataを同じものとして扱う

HTTP `Response`とBodyをparseしたJavaScript Dataは別。

### 混乱3 --- HTTP FailureとPromise rejectionを常に1:1だと思う

404/500 Responseが届いてもfetchはResponseを返せる。一方Network
FailureではResponse前にrejectされ得る。

### 混乱4 --- Server Dataが自動でReact UIへ反映されると思う

React Stateへ反映して初めてRe-renderの対象になる。

> **ヒント** 混乱したらHTTP / JavaScript /
> Reactの3列を作り、各コードの責任を分類する。

------------------------------------------------------------------------

## 6. 確認質問

コードを見ずに答える。

1.  このSTEPはRequest → Response → State → UIのどこにあるか？
2.  Day 15のどのHTTP概念を使うか？
3.  Day 16のPromise/async/awaitとどう関係するか？
4.  成功時にReact State/UIはどう変わるか？
5.  Failureはどの経路で処理されるか？
6.  Next.js + TypeScriptへ移しても変わらない原理は何か？

正確な文章暗記ではなく、Dataの出発点・待機地点・到着点を自分の言葉で説明する。

------------------------------------------------------------------------

## 7. React + JS → TypeScript → Next.js 接続

Day 18以降：

``` text
① React + JavaScript
原理を最もシンプルに理解
↓
② React + TypeScript
追加されるTypeをすぐ比較
↓
③ Next.js + TypeScript
実際のShopping Mall Projectへ適用
↓
④ Browser / Network / State / UIを検証
```

`Order`、`OrderStatus`、`Promise<Order[]>`などのTypeが付いてもHTTPのRequest/Response原理は同じ。Next.js
Route Handlerが登場してもGET、PATCH、Status
Code、JSONの意味は変わらない。

> **ヒント**
> JS版を長期間学んで後からTSへ切り替えない。JSで原理を理解した直後にTS表現を確認し、実際に保存するProject
> CodeはNext.js + TypeScriptとする。

------------------------------------------------------------------------

## 8. STEPの核心文

``` text
response.ok確認 → JSON parseなし → setOrders(filter)
```

> Bodyのない成功Response
> `204 No Content`を理解し、成功後`filter()`でStateから削除する。

コードなしで説明できればSTEP 17の中心を理解できている。
