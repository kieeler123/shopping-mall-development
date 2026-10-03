# Day 21〜30 --- React / Next.js データフロー長期学習プラン

> **大きな目標：** API から入ったデータが State
> になり、ユーザー操作で変更され、コンポーネント間を移動し、最終的に一つの機能として構造化される流れを理解する。

------------------------------------------------------------------------

# 全体像

``` text
Day 21〜25
動作原理
「データはどう動くのか？」

        ↓

Day 26〜30
構造化
「そのデータを使うアプリをどう分け、管理するのか？」
```

------------------------------------------------------------------------

## Day 21 --- 非同期データフロー

**核心の問い：** API からデータをどう取得するか？

``` text
Promise
async
await
fetch
Response
response.ok
response.json()
throw
try / catch / finally
```

``` text
API
↓
fetch()
↓
Promise<Response>
↓
await
↓
Response
↓
response.ok
↓
response.json()
↓
Promise<Data>
↓
await
↓
Data
```

**完了目標：**
`fetch → Promise → await → Response → json → await → Data`
を自分の言葉で説明する。

------------------------------------------------------------------------

## Day 22 --- React State の更新とイミュータビリティ

**核心の問い：** 取得したデータを React でどう管理・変更するか？

``` text
useState
setState
再レンダリング
イミュータビリティ
prevState
spread
map
filter
```

``` text
Data
↓
State
↓
setState
↓
新しい State を作る
↓
再レンダリング
↓
UI
```

**完了目標：** `setOrders(prevOrders => prevOrders.map(...))`
を自分で説明する。

------------------------------------------------------------------------

## Day 23 --- イベントと State

**核心の問い：** ユーザーはどうやって State の変更を開始するのか？

``` text
onClick
onChange
event
event handler
関数呼び出し
State 更新
```

``` text
ユーザー
↓
onClick / onChange
↓
Event
↓
関数実行
↓
State 変更
↓
再レンダリング
↓
UI 変更
```

実プロジェクト：

``` tsx
onChange={(e) => {
  onStatusChange(
    order.id,
    e.target.value as OrderStatus
  );
}}
```

ブラウザイベントが State を変更する関数までどう届くか理解する。

------------------------------------------------------------------------

## Day 24 --- `useEffect` と外部システムの同期

**核心の問い：** コンポーネントはいつ外部システムと同期するのか？

``` text
render
Effect
useEffect
dependency array
外部システム
API 呼び出し
```

``` text
レンダリング
↓
useEffect
↓
外部システムと同期
↓
API
↓
State 更新
↓
再レンダリング
```

実プロジェクト：

``` ts
useEffect(() => {
  void loadOrders();
}, [loadOrders]);
```

`useEffect = fetch`
と暗記せず、「外部システムとの同期」という役割を理解する。

------------------------------------------------------------------------

## Day 25 --- データフロー統合

**核心の問い：** Day 21〜24 を一つの機能の中でどうつなげるか？

``` text
API
↓
fetch
↓
Data
↓
State
↓
UI
↓
ユーザー Event
↓
関数実行
↓
API 更新リクエスト
↓
更新された Data
↓
State 更新
↓
再レンダリング
↓
UI 更新
```

**目標：** 非同期、State、Event、Effect
を別々の知識ではなく、一つのデータフローとして理解する。

Day 25 は新しい概念を増やすより統合を優先する。

------------------------------------------------------------------------

# Day 21〜25 終了時点

ここまでの問い：

> **データはどう動くのか？**

``` text
API
↓
非同期
↓
Data
↓
State
↓
Event
↓
State 変更
↓
UI
```

Day 26 から問いが変わる。

> **この流れを使うコードをどう構造化するか？**

------------------------------------------------------------------------

## Day 26 --- Props と親子データフロー

**核心の問い：** データと関数はコンポーネント間をどう移動するか？

``` text
Parent
Child
Props
データを渡す
関数を渡す
子のイベント
```

``` text
Parent
↓
data / function
↓
props
↓
Child
```

そして：

``` text
Child のユーザー Event
↓
親から渡された関数を呼ぶ
↓
State 変更
↓
再レンダリング
```

実プロジェクト：

``` tsx
<OrderCard
  order={order}
  onStatusChange={updateOrderStatus}
/>
```

`order` と `updateOrderStatus` を props で渡す理由を説明する。

------------------------------------------------------------------------

## Day 27 --- コンポーネント分割と責任

**核心の問い：** どのコードをどのコンポーネントが担当するべきか？

``` text
コンポーネントの責任
Page
List
Card
Item
UI 分割
```

例：

``` text
AdminOrdersPage
│
├─ ページ全体
│
├─ OrderCard
│   └─ 注文1件を表示
│
└─ OrderItemList
    └─ 注文商品の一覧
```

深いデザインパターンより：

> 「このコードは誰の責任か？」

を判断する練習をする。

------------------------------------------------------------------------

## Day 28 --- Custom Hook

**核心の問い：** UI と State / ロジックをどう分離するか？

``` text
Custom Hook
useOrders
State
Effect
fetch
更新関数
UI とロジックの分離
```

``` text
Component
→ UI

Custom Hook
→ State
→ Effect
→ API 通信
→ 更新ロジック
```

実プロジェクト：

``` ts
const {
  orders,
  isLoading,
  error,
  updateOrderStatus,
} = useOrders();
```

新しい Hook を大量に作る前に、既存の `useOrders()`
がなぜ存在するか説明できるようにする。

------------------------------------------------------------------------

## Day 29 --- UI 状態のモデリング

**核心の問い：** 「データがある」以外に UI にはどんな状態があるか？

``` text
Loading
Error
Empty
Success
条件付きレンダリング
```

``` text
リクエスト中
→ Loading

失敗
→ Error

成功 + データなし
→ Empty

成功 + データあり
→ Success
```

実プロジェクト：

``` tsx
{isLoading && <p>注文を読み込み中です...</p>}

{error && <p>エラー: {error}</p>}

{!isLoading && !error && orders.length === 0 && (
  <p>注文がありません。</p>
)}
```

UI を複数の状態を表現するシステムとして理解する。

------------------------------------------------------------------------

## Day 30 --- 実践統合とリファクタリング

**核心の問い：**
これまでの知識で実際の機能を最初から最後まで説明できるか？

新しい理論を大量に追加しない。

注文管理全体：

``` text
AdminOrdersPage
↓
useOrders
↓
useEffect
↓
loadOrders
↓
GET API
↓
Order[]
↓
setOrders
↓
再レンダリング
↓
OrderCard
↓
onChange
↓
updateOrderStatus
↓
PATCH API
↓
updatedOrder
↓
setOrders(prev => ...)
↓
map
↓
新しい Order[]
↓
再レンダリング
↓
UI 変更
```

**完了目標：**
コードを暗記するのではなく、各コードがなぜ存在するか、データがどこからどこへ移動するかを説明しながら、一部を自分で書けるようになる。

------------------------------------------------------------------------

# Day 21〜30 を一つの物語として見る

``` text
Day 21
データをどう取得する？
        ↓
Day 22
取得したデータをどう変更する？
        ↓
Day 23
ユーザーはどう変更を開始する？
        ↓
Day 24
いつ外部システムと同期する？
        ↓
Day 25
全部つなげると？
        ↓
Day 26
コンポーネント間でどう渡す？
        ↓
Day 27
コードをどこに分ける？
        ↓
Day 28
State とロジックをどこに分離する？
        ↓
Day 29
Loading / Error / Empty / Success をどう表す？
        ↓
Day 30
実機能全体を説明・構成できる？
```

------------------------------------------------------------------------

# 2つのチャプター

## Part 1 --- Day 21〜25：動作原理

``` text
非同期
↓
State
↓
Event
↓
Effect
↓
統合
```

> **データはどう動くのか？**

## Part 2 --- Day 26〜30：構造化

``` text
Props
↓
コンポーネント責任
↓
Custom Hook
↓
UI 状態モデリング
↓
実践リファクタリング
```

> **そのデータを使うアプリをどう分け、管理するか？**

------------------------------------------------------------------------

# Day 30 の次へ

Day 21〜30 では主に Client がリクエストを送り、受け取ったデータを UI
で使う側を見る。

その後は：

``` text
Client
↓
fetch("/api/orders")
↓
そのリクエストはどこへ行く？
↓
Next.js Server / API
```

という問いに進める。

次の大きなチャプター候補：

``` text
Route Handler
Request / Response
GET / POST / PATCH / DELETE
動的 Route
HTTP
DB
Server / Client 全体接続
```

------------------------------------------------------------------------

# 学習の運用方針

1日の分量は絶対固定ではない。

``` text
大きな方向は維持
↓
1日学習
↓
理解度を確認
↓
次の日の深さを調整
```

初めて理論を深く学ぶ段階では、急いで進むより
**前日に学んだ概念を次の日に実コードの中で再発見すること**を重視する。
