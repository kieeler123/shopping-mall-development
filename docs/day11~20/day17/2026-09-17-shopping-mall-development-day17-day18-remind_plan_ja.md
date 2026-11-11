# Day 18 --- 復習と再整理：React + JavaScript の理論から Next.js + TypeScript の実践へ

## Day 18 の目的

Day 17
で新しい内容への進行をいったん止め、これまで学んだ内容が実際のショッピングモールプロジェクトとどのようにつながるのかを復習する。

最終目標が **実務運用可能な Web
アプリケーション開発**であるため、学習開始時から Next.js + TypeScript
を使用してきた。この方法には、実際のプロジェクト構造や型安全性を早い段階から経験できる利点があった。一方で、React
/ JavaScript の基本原理を学ぶ段階から、型設計、Next.js
の規則、ファイル構造、Client / Server
の境界まで同時に考える必要があった。

Day 18 以降は学習レイヤーを明確に分ける。

> **理論と原理 → React + JavaScript**\
> **実際のプロジェクトの最終実装 → Next.js + TypeScript**

Day 17 で予定していた STEP 19（API Layer）と STEP
20（全体統合）は急いで進めない。実際のコードの中で必要性を十分に体験した後、次の段階でゆっくり実装する。

------------------------------------------------------------------------

## Day 18 共通進行ルール --- 3段階の接続学習

Day 18 の各復習 STEP は、可能な場合、次の順序で進める。

``` text
① React + JavaScript
原理と動作を最もシンプルな形で理解
        ↓ すぐに
② React + TypeScript
同じコードにどの型情報が、なぜ追加されるか比較
        ↓ すぐに
③ Next.js + TypeScript
現在のショッピングモールの実ファイル・型・構造へ接続
        ↓
④ 実行と検証
Browser / Network / State / UI で実際の動作を確認
```

この方法の目的は、JavaScript を長期間学んだ後で TypeScript
に「切り替える」ことではない。同じ概念を JavaScript で理解した直後に
TypeScript
の表現を確認し、両者を一つのロジックとして結びつけることである。

例：

``` js
// ① React + JavaScript — 原理を確認
const [orders, setOrders] = useState([]);
```

``` ts
// ② React + TypeScript — 同じ原理 + 型情報
const [orders, setOrders] = useState<Order[]>([]);
```

``` text
useState   → React
Order[]    → TypeScript + ショッピングモールの Domain
実際の場所 → Next.js プロジェクト
```

### 例外：Next.js 固有機能

すべての内容を無理に JavaScript 版へ変換することはしない。

-   State、Props、Event、Effect、Custom Hook のように React
    の原理が中心の内容 → React + JS で先に理解
-   App Router、`page.tsx`、`layout.tsx`、Route Handler、Server / Client
    Component のように Next.js 自体が学習対象の内容 → 実際の Next.js +
    TypeScript 環境で学ぶ

> **ヒント** 実際の TSX コードは
> `React のロジック / TypeScript の型 / Next.js の規則 / プロジェクト Domain`
> の4層に分けて読む。最終プロジェクトの Source of Truth は引き続き
> Next.js + TypeScript とし、JS
> コードは原理を明確にするための学習用コードとして扱う。

------------------------------------------------------------------------

## 今後の学習フロー

``` text
概念 / 原理
React + JavaScript
        ↓
小さな例
動作原理を確認
        ↓
実プロジェクトへ適用
Next.js + TypeScript
        ↓
実際に実行
        ↓
Browser / Network / State / UI を確認
        ↓
なぜそのコードになるのか説明
```

------------------------------------------------------------------------

## STEP 01 --- これまで作ったプロジェクト全体の流れを確認する

### 目標

各ファイルを作り直すのではなく、ショッピングモール全体のデータフローを説明できるか確認する。

``` text
Product
  ↓
商品 UI
  ↓
Cart
  ↓
Checkout
  ↓
Order
  ↓
Admin Orders
```

### 確認項目

-   各ページとコンポーネントの役割
-   データがどこで作られ、どこへ移動するか
-   ユーザーイベントがどの State の変更につながるか
-   localStorage がどのデータを担当していたか

> **ヒント**
> コードを暗記するのではなく、一つのユーザー操作がどのファイルと State
> を通るか追跡する。

------------------------------------------------------------------------

## STEP 02 --- JavaScript の基本文法を復習する

### 目標

React コード内で使ってきた JavaScript 自体を分離して理解する。

### 復習項目

-   変数とスコープ
-   オブジェクトと配列
-   分割代入
-   spread 構文
-   `map`, `filter`, `find`
-   関数とコールバック
-   モジュール `import` / `export`
-   条件式と三項演算子

> **ヒント** React のコードを読むとき、どこまでが純粋な JavaScript
> なのか区別する。

------------------------------------------------------------------------

## STEP 03 --- Component と JSX の復習

### 目標

Component の責任と JSX が UI を表現する仕組みを再確認する。

### 重要な質問

-   なぜ UI を Component に分割するのか？
-   Component 関数が再実行されるとはどういうことか？
-   JSX と JavaScript の式はどうつながるのか？
-   `map()` でリストを描画するとき、なぜ `key` が必要なのか？

> **ヒント** Component を単なるファイルではなく、入力を受け取って UI
> を表現する関数として考える。

------------------------------------------------------------------------

## STEP 04 --- Props と一方向データフローの復習

### 目標

親と子の Component 間でデータと関数がどう移動するか説明する。

``` text
Parent State
    ↓
   Props
    ↓
  Child

Child Event
    ↓
Callback Props
    ↓
Parent State 変更
```

### 実プロジェクトとの接続

-   `order={order}`
-   `onStatusChange={updateOrderStatus}`

> **ヒント** Props
> のエラーでは、親が渡している値と子が要求している値を両側から比較する。

------------------------------------------------------------------------

## STEP 05 --- State と Re-render の復習

### 目標

State と通常の変数の違いを理解し、UI 更新の流れを説明する。

``` text
ユーザー操作
  ↓
setState
  ↓
State 変更
  ↓
Re-render
  ↓
新しい UI
```

### 確認項目

-   `useState`
-   以前の State を基準にした更新
-   配列 State のイミュータビリティ
-   `map`, `filter`, spread を使った State 更新

> **ヒント** State を見たら、その State
> を変更するイベントや処理も一緒に探す。

------------------------------------------------------------------------

## STEP 06 --- Event と Form の流れを復習する

### 目標

ユーザー入力が React
のデータになり、アプリの動作につながる流れを確認する。

``` text
User Input
   ↓
Event
   ↓
Handler
   ↓
State
   ↓
Submit
   ↓
Business Action
```

### 確認項目

-   `onClick`
-   `onChange`
-   submit 処理
-   入力値と State の接続
-   Event Handler への関数の受け渡し

> **ヒント** Handler を読むとき、何が発生し、どの State
> または関数に影響するのか追跡する。

------------------------------------------------------------------------

## STEP 07 --- Custom Hook の復習

### 目標

Custom Hook を単なるコード分割ではなく、State
と動作の再利用・責任分離として理解する。

``` text
Component
   ↓
Custom Hook
   ↓
State + Actions
```

### 実プロジェクトとの接続

-   Cart 関連 Hook
-   Order 関連 Hook
-   `useOrders`

> **ヒント** Hook を読むときは、最初に何を return
> しているか確認すると公開インターフェースが分かりやすい。

------------------------------------------------------------------------

## STEP 08 --- localStorage ベースのデータフローを復習する

### 目標

HTTP API に移行する前に、以前の保存方式の役割と限界を明確にする。

``` text
React State
    ↕
localStorage
```

### 確認項目

-   保存するタイミング
-   読み込むタイミング
-   JSON のシリアライズ / デシリアライズ
-   Browser Storage の限界
-   React State と永続データの違い

> **ヒント** localStorage
> を悪い方式と決めつけず、どの規模・目的に適した保存方法なのか区別する。

------------------------------------------------------------------------

## STEP 09 --- Product → Cart → Order のデータモデルを復習する

### 目標

ショッピングモールの主要 Domain データが機能間でどう変化するか確認する。

``` text
Product
   ↓
CartItem
   ↓
Checkout
   ↓
Order
   ↓
OrderItem
```

### 確認項目

-   Product と CartItem の違い
-   CartItem と OrderItem の違い
-   注文時点で保存すべき情報
-   `OrderStatus`
-   重複した Domain Type がないか

> **ヒント**
> 型名だけを見るのではなく、そのデータが何を意味し、いつ作られるのかを先に考える。

------------------------------------------------------------------------

## STEP 10 --- TypeScript を JavaScript 上の安全装置として整理する

### 目標

TypeScript を新しいロジックではなく、理解済みの JavaScript
に型情報を追加するものとして整理する。

``` js
function updateStatus(id, status) {
  // JavaScript のロジック
}
```

``` ts
function updateStatus(
  id: number,
  status: OrderStatus
): void {
  // 同じロジック + 型情報
}
```

### 確認項目

-   primitive type
-   object type
-   union type
-   Props type
-   関数の parameter / return type
-   `Promise<T>`
-   `unknown` の narrowing

> **ヒント** TS コードが複雑に見えたら、型表記を一度外して内部の
> JavaScript の流れから読む。

------------------------------------------------------------------------

## STEP 11 --- React の上で Next.js が担当する役割を整理する

### 目標

React の原理と Next.js 固有の機能を区別する。

### React

-   Component
-   JSX
-   Props
-   State
-   Event
-   Hook
-   Effect

### Next.js

-   App Router
-   `page.tsx`
-   Layout
-   Routing
-   Client / Server の境界
-   Route Handler
-   プロジェクトのファイル規則

> **ヒント** 理解できないコードがあれば、まず React の問題なのか Next.js
> の規則なのか分類する。

------------------------------------------------------------------------

## STEP 12 --- Day 15 の HTTP / API 基礎を復習する

### 目標

Browser と Server が HTTP で通信する基本構造を説明する。

``` text
Client
  ↓ Request
Server
  ↓ Response
Client
```

### 確認項目

-   Method
-   URL
-   Headers
-   Body
-   Response
-   Status Code
-   JSON
-   API Contract

> **ヒント** HTTP Request は Method → URL → Headers → Body → Status →
> Response Body の順で読む。

------------------------------------------------------------------------

## STEP 13 --- Day 16〜17 の非同期 JavaScript を復習する

### 目標

Promise と async / await がネットワーク通信になぜ必要なのか再確認する。

``` text
fetch()
  ↓
Promise<Response>
  ↓ await
Response
  ↓
response.json()
  ↓
Promise<Data>
  ↓ await
Data
```

### 確認項目

-   Promise
-   fulfilled / rejected
-   `async`
-   `await`
-   `throw`
-   `try/catch`
-   fetch における Network Error と HTTP Error の違い

> **ヒント** `await` を見たら、その直後の式がどんな Promise
> を返しているのか確認する。

------------------------------------------------------------------------

## STEP 14 --- GET / POST / PATCH / DELETE の復習

### 目標

HTTP Method を実際のショッピングモールの操作と結びつける。

  操作           Method
  -------------- --------
  注文一覧取得   GET
  注文作成       POST
  注文状態変更   PATCH
  注文削除       DELETE

### 特別確認

-   POST の JSON Body
-   PATCH の部分更新
-   DELETE `204 No Content`
-   `response.ok`

> **ヒント** Method を単独で暗記するより、ユーザー操作を HTTP
> の動作に変換する練習をする。

------------------------------------------------------------------------

## STEP 15 --- HTTP の結果を React State に接続する

### 目標

Day 15〜17 の中心内容を一つの UI フローとして接続する。

``` text
Request
  ↓
API
  ↓
Response
  ↓
JSON
  ↓
React State
  ↓
Re-render
  ↓
UI
```

### State

-   Data
-   Loading
-   Error
-   Empty

> **ヒント** Server Data を使う画面では Data だけでなく Loading / Error
> / Empty も UI の一部として考える。

------------------------------------------------------------------------

## STEP 16 --- useEffect と外部システム同期の復習

### 目標

Component が API と同期するとき Effect がどんな役割を持つのか理解する。

### 確認項目

-   初回データロード
-   Effect callback 自体を `async` にしない理由
-   cleanup
-   dependency
-   開発環境の Strict Mode による追加実行

> **ヒント** `useEffect = API 呼び出し`
> と暗記せず、外部システムとの同期という大きな概念で覚える。

------------------------------------------------------------------------

## STEP 17 --- 現在のプロジェクトコード健康診断

### 目標

最初から作り直さず、現在の知識で既存コードを点検する。

### 点検項目

-   重複した Domain Type
-   未使用コード
-   Props の型不一致
-   State の配置
-   Hook の責任
-   localStorage 依存箇所
-   Component の責任
-   import / export の一貫性
-   `.ts` / `.tsx` の区別

### 原則

問題がなければ維持する。理解が曖昧な部分だけ復習し、現在の作業を妨げる問題だけ最小限修正する。

> **ヒント** 復習を大規模リファクタリングに変えない。

------------------------------------------------------------------------

## STEP 18 --- 実装開始前の準備完了確認

### 目標

Day 17 の HTTP 理論を Next.js + TypeScript
の実プロジェクトへ移す準備ができたか確認する。

### コードなしで説明できるべき流れ

``` text
AdminOrdersPage
      ↓
useOrders
      ↓
fetch()
      ↓
HTTP Request
      ↓
API
      ↓
HTTP Response
      ↓
React State
      ↓
OrderCard
```

状態変更：

``` text
OrderCard
   ↓
updateOrderStatus
   ↓
PATCH
   ↓
API
   ↓
updatedOrder
   ↓
setOrders
   ↓
UI
```

> **ヒント**
> コードを見なくてもこの流れを説明できれば、実装を始める準備ができている。

------------------------------------------------------------------------

## Day 18 の完了基準

Day 18 は新機能の量ではなく、既存知識を接続することが目標。

次の内容を説明できれば完了とする。

-   JavaScript と React の役割の違い
-   React と Next.js の役割の違い
-   JavaScript と TypeScript の関係
-   Product → Cart → Order のデータフロー
-   Props → Event → State → Re-render の流れ
-   localStorage ベースと HTTP API ベースの構造の違い
-   HTTP Request / Response の構造
-   Promise と async / await が必要な理由
-   HTTP の結果が React State と UI に接続される過程

------------------------------------------------------------------------

## Day 18 以降

Day 17 で予定していた内容を Day 18 に無理に入れない。

``` text
以前の予定
STEP 19 → API Layer
STEP 20 → 全体統合
```

実際の HTTP コードを十分に実装し、`useOrders` 内で HTTP
の詳細処理の重複や責任の混在を体験した後に進める。

次の実装段階の優先目標：

``` text
GET /api/orders
↓
実際の Response を確認
↓
React State に反映
↓
管理者注文一覧を描画
↓
PATCH /api/orders/:id
↓
注文状態の変更を確認
```

必要性が明確になった後で：

``` text
Component
   ↓
useOrders
   ↓
ordersApi
   ↓
fetch
   ↓
API
```

という構造を学び、適用する。

------------------------------------------------------------------------

## 今後の学習原則

> **原理はシンプルに、実装は実際の環境らしく。**

-   理論：React + JavaScript
-   小さな練習：React + JavaScript
-   実際のショッピングモール実装：Next.js + TypeScript
-   新しい構造：解決すべき問題を体験してから導入
-   完了基準：コードが動作し、その理由とデータフローまで説明できる
