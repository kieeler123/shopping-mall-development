# localStorage と React State はなぜ自動同期されないのか
## 日本語 → English → 한국어

---

# 1. 日本語

## 1.1 この章の目的

この章では、React を学ぶときに非常に重要な次の疑問を詳しく整理します。

> なぜ `localStorage.setItem()` を実行しても React の state は自動で変わらないのか？

そして逆に、

> なぜ `setState()` を実行しても localStorage は自動で更新されないのか？

この疑問を理解するためには、まず `localStorage` と React state が **そもそも別のシステムである** ことを理解する必要があります。

最初に一番重要な結論をまとめると、

```text
localStorage
→ ブラウザの保存領域

React state
→ React が UI を描画するために使う状態
```

です。

この2つは同じデータを持つことはできますが、同じ場所ではありません。

**ヒント**

「同じ orders データを持っている」ことと「同じシステムで管理されている」ことは別です。

---

## 1.2 React state とは何か

React state は、React コンポーネントが現在の UI を決めるために使うデータです。

例えば:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

ここで `orders` は、現在コンポーネントが表示に使う注文一覧です。

例えば:

```tsx
orders.map((order) => (
  <p key={order.id}>
    {order.productName}
  </p>
))
```

とすれば、React は現在の `orders` state を使って画面を作ります。

流れ:

```text
React state
↓
コンポーネントのレンダリング
↓
画面
```

**ヒント**

React state は「今の UI が何を表示するか」に直接つながっています。

---

## 1.3 localStorage とは何か

localStorage はブラウザが提供する Web Storage API のひとつです。

例えば:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

これは React state を変更しているわけではありません。

ブラウザの保存領域に文字列を書き込んでいます。

```text
JavaScript データ
↓
JSON.stringify()
↓
文字列
↓
localStorage
```

です。

React のレンダリングシステムとは別です。

**ヒント**

localStorage は UI の状態ではなく、「後で再び取り出すための保存場所」と考えると整理しやすいです。

---

## 1.4 同じデータでも保存場所が違う

例えば最初に、

```text
React state:
[1001, 1002, 1003]

localStorage:
[1001, 1002, 1003]
```

だったとします。

ユーザーが注文 `1002` をキャンセルします。

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

すると:

```text
updatedOrders:
[1001, 1003]
```

ができます。

次に、

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

を実行します。

すると localStorage は:

```text
[1001, 1003]
```

になります。

しかし React state の `orders` はまだ:

```text
[1001, 1002, 1003]
```

のままです。

つまり:

```text
localStorage
[1001, 1003]

React state
[1001, 1002, 1003]
```

という状態が一時的に存在できます。

**ヒント**

同じ名前のデータでも、「どこに存在しているか」を必ず区別してください。

---

## 1.5 なぜ React は localStorage の変更を自動で知れないのか

React は基本的に、React 自身が管理しているデータの変化を中心にレンダリングします。

代表例:

```text
state
props
context
```

です。

一方:

```tsx
localStorage.setItem(...)
```

はブラウザ API の呼び出しです。

React API ではありません。

React から見ると:

```text
ブラウザの保存領域の文字列が変わった
```

だけです。

React はそれを「このコンポーネントの orders state が変わった」とは判断できません。

**ヒント**

`setOrders()` は React に知らせる処理、`localStorage.setItem()` はブラウザに保存を依頼する処理です。

---

## 1.6 なぜ React が勝手に同期してはいけないのか

もし React が localStorage を自動監視していたら、React は次の関係を推測しなければなりません。

```text
"orders"
→ どの state に対応する？

"cart"
→ どの state に対応する？

"user"
→ どの state に対応する？
```

しかし React はこの関係を知りません。

例えば同じ `"orders"` key を、

- 注文一覧ページ
- 注文詳細ページ
- 管理画面
- 集計画面

がそれぞれ違う形で利用するかもしれません。

そのため、どの localStorage key をどの state に反映するかは、開発者が明示的に定義します。

**ヒント**

React はアプリのデータ設計を推測しません。データの接続は開発者がコードで決めます。

---

## 1.7 `setOrders()` が必要な理由

STEP 6 では:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

を実行しました。

STEP 7 では:

```tsx
setOrders(updatedOrders);
```

を追加します。

役割は違います。

```text
localStorage.setItem()
→ ブラウザ保存データを更新

setOrders()
→ React state を更新
```

state が変わることで React は再レンダリングします。

**ヒント**

同じ `updatedOrders` を両方に使うと、保存データと UI の状態を合わせやすくなります。

---

## 1.8 `setOrders()` と再レンダリング

例えば:

```tsx
setOrders(updatedOrders);
```

を実行すると、React は state 更新を受け取ります。

概念的には:

```text
setOrders(updatedOrders)
↓
state 更新
↓
コンポーネント再実行
↓
新しい state を使って UI を計算
↓
画面更新
```

です。

ここで重要なのは、`setOrders()` が普通の変数代入ではないことです。

例えば:

```tsx
let orders = [1001, 1002, 1003];

orders = [1001, 1003];
```

と、

```tsx
setOrders([1001, 1003]);
```

は役割が違います。

後者は React の更新システムに接続されています。

**ヒント**

React state setter は「値を変える」だけでなく「React に更新を通知する」役割があります。

---

## 1.9 localStorage を最初に state に読み込む流れ

Day 7 では:

```tsx
useEffect(() => {
  const savedOrders =
    localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders =
      JSON.parse(savedOrders);

    setOrders(parsedOrders);
  }
}, []);
```

のように使いました。

流れ:

```text
ページを開く
↓
useEffect
↓
localStorage.getItem()
↓
JSON.parse()
↓
setOrders()
↓
React state
↓
UI
```

です。

つまり localStorage のデータは、自動で state になるわけではありません。

開発者が:

```text
読む
↓
変換する
↓
state に入れる
```

という処理を書いています。

**ヒント**

「localStorage → state」も手動接続です。

---

## 1.10 逆方向も手動接続

注文をキャンセルする場合:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

流れ:

```text
React state
↓
filter()
↓
updatedOrders
├→ localStorage に保存
└→ React state に反映
```

です。

つまり:

```text
localStorage → state
```

も、

```text
state → localStorage
```

も自動ではありません。

**ヒント**

「同期」というより「コードで2つの世界をつないでいる」と理解してください。

---

## 1.11 localStorage だけ更新した場合

例えば:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

だけ実行した場合:

```text
localStorage
→ 最新

React state
→ 古い
```

となる可能性があります。

そのまま UI が state を使っていると、画面上ではキャンセル済み注文がまだ見えることがあります。

**ヒント**

保存成功と UI 更新成功は別々に確認してください。

---

## 1.12 state だけ更新した場合

逆に:

```tsx
setOrders(updatedOrders);
```

だけ実行した場合:

```text
React state
→ 最新

localStorage
→ 古い
```

状態になります。

画面上では注文が消えて見えるかもしれません。

しかし再読み込みすると:

```text
localStorage
↓
古い orders
↓
JSON.parse
↓
setOrders
```

によって古い注文が戻る可能性があります。

**ヒント**

「画面が正しい」だけでは保存が正しいとは限りません。

---

## 1.13 両方更新するとどうなるか

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

なら:

```text
localStorage
→ 最新

React state
→ 最新
```

となります。

Day 8 の目的はこの状態を作ることです。

**ヒント**

同じ `updatedOrders` を保存と state 更新の両方に使うとズレを減らせます。

---

## 1.14 なぜ計算結果を一度変数にするのか

次のようにも書けます。

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(
    orders.filter(
      (order) => order.id !== orderId
    )
  )
);

setOrders(
  orders.filter(
    (order) => order.id !== orderId
  )
);
```

動く可能性はありますが、同じ `filter()` を2回書いています。

より読みやすいのは:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

です。

これは:

```text
1回計算
↓
同じ結果を保存
↓
同じ結果を state に反映
```

となります。

**ヒント**

「一度計算して再利用」は、同期ズレや重複ロジックを減らす重要な習慣です。

---

## 1.15 React state と一般変数の違い

普通の変数:

```tsx
let count = 0;

count = 1;
```

では JavaScript の変数は変わります。

しかし React の UI は、それだけで自動再レンダリングされるわけではありません。

React state:

```tsx
const [count, setCount] = useState(0);

setCount(1);
```

では React に更新が伝わります。

流れ:

```text
setCount
↓
React が state 更新を認識
↓
再レンダリング
```

です。

**ヒント**

React では「画面に関係する値」は state として管理する理由がここにあります。

---

## 1.16 state は現在 UI のためのデータ

例えば:

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

この `orders` は React state です。

React は localStorage を直接見て描画しているわけではありません。

そのため画面に何が出るかは、現在の `orders` state に依存します。

**ヒント**

画面表示がおかしいときは、まず「現在の state は何か」を確認してください。

---

## 1.17 localStorage は永続化のためのデータ

localStorage は、ページを再読み込みした後でもデータを復元するために役立ちます。

整理すると:

```text
React state
→ 今この瞬間の UI の状態

localStorage
→ 後でも復元するための保存
```

です。

**ヒント**

`state = 今`、`localStorage = 後でも使う保存` と分けると理解しやすいです。

---

## 1.18 Source of Truth とは何か

少し発展した概念に **Source of Truth** があります。

これは簡単に言うと:

> 最終的にどのデータを正しいものとして扱うのか？

という意味です。

同じ注文データを、

```text
React state
localStorage
```

の両方に持つと、

```text
どっちが最新？
```

という問題が生まれます。

これが同期問題です。

**ヒント**

同じデータを複数の場所に持つほど「どこが正しいか」を明確にする必要があります。

---

## 1.19 学習用アプリでの Source of Truth

今回の学習プロジェクトでは単純化して:

```text
localStorage
→ 持続保存

React state
→ 現在 UI
```

としています。

localStorage から state を初期化し、変更時には両方を更新します。

**ヒント**

今の段階では「localStorage を保存用、state を表示用」と役割分担すると十分です。

---

## 1.20 実際のサーバーアプリではどうなるか

実際のショッピングモールでは注文を localStorage だけに保存することは普通しません。

一般的には:

```text
React
↓
API
↓
Server
↓
Database
```

があります。

キャンセル処理:

```text
ユーザーがキャンセル
↓
API リクエスト
↓
サーバーが検証
↓
DB 更新
↓
レスポンス
↓
React state 更新
```

です。

ここでも DB が変わっただけでは、現在の React state が自動で変わるとは限りません。

サーバーの結果を受け取り、UI 側を更新する必要があります。

**ヒント**

今の localStorage と state の関係は、将来の「サーバーデータと UI state」の練習になります。

---

## 1.21 同期ズレの代表例

### ケース A: localStorage だけ更新

```text
Storage 最新
State 古い
```

### ケース B: state だけ更新

```text
State 最新
Storage 古い
```

### ケース C: 両方更新

```text
Storage 最新
State 最新
```

**ヒント**

バグ調査では「保存側」と「UI 側」を別々に確認してください。

---

## 1.22 最終コード

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "本当にこの注文をキャンセルしますか？"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
}
```

流れ:

```text
クリック
↓
confirm
↓
filter
↓
updatedOrders
├→ localStorage
└→ React state
```

**ヒント**

「計算 → 保存 → state 更新」の3段階に分けて読むと理解しやすいです。

---

## 1.23 日本語の最終メンタルモデル

```text
localStorage
= ブラウザ保存
= 永続化

React state
= React のレンダリング状態
= 現在 UI
```

そして:

```text
localStorage 変更
≠
React state 自動変更

React state 変更
≠
localStorage 自動変更
```

必要なのは:

```text
明示的な接続コード
```

です。

**ヒント**

一番重要な文:

> localStorage は保存場所、React state は描画状態なので、自動同期されない。

---

# 2. English

## 2.1 Goal of this chapter

This chapter explains one of the most important concepts when learning React:

> Why doesn't `localStorage.setItem()` automatically update React state?

And also:

> Why doesn't `setState()` automatically update localStorage?

The key idea is simple:

```text
localStorage
→ browser storage

React state
→ data React uses to render the UI
```

These are two different systems.

**Tip**

Having the same data in two places does not mean those two places are automatically connected.

---

## 2.2 What is React state?

React state is data managed by React and used to determine what a component renders.

Example:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
```

The `orders` value is used by the component:

```tsx
orders.map((order) => (
  <p key={order.id}>
    {order.productName}
  </p>
))
```

Conceptually:

```text
React state
↓
render component
↓
UI
```

**Tip**

Think of state as the current data that directly drives the screen.

---

## 2.3 What is localStorage?

localStorage is a browser-provided Web Storage API.

Example:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

This stores a string in the browser.

It does not update React state.

```text
JavaScript data
↓
JSON.stringify()
↓
string
↓
localStorage
```

**Tip**

localStorage is storage for later retrieval, not React's rendering state.

---

## 2.4 Same data, different locations

Suppose:

```text
React state:
[1001, 1002, 1003]

localStorage:
[1001, 1002, 1003]
```

Now cancel order `1002`.

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

Result:

```text
[1001, 1003]
```

If you only run:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

then:

```text
localStorage:
[1001, 1003]

React state:
[1001, 1002, 1003]
```

can exist at the same time.

**Tip**

Always ask: where does this value currently live?

---

## 2.5 Why React does not automatically know about localStorage changes

React primarily reacts to changes in data that are part of React's own data flow:

```text
state
props
context
```

`localStorage.setItem()` is a browser API call, not a React state update.

From React's perspective, a browser storage value changed. That does not tell React which component state should change.

**Tip**

`setOrders()` talks to React. `localStorage.setItem()` talks to the browser's storage system.

---

## 2.6 Why automatic synchronization would be ambiguous

Imagine React tried to automatically connect storage keys to state.

How would it know:

```text
"orders"
→ which state?

"cart"
→ which component?

"user"
→ which state shape?
```

The same storage key could be used by many components for different purposes.

React cannot safely guess those relationships.

**Tip**

Developers define the data connections explicitly.

---

## 2.7 Why `setOrders()` is needed

Storage update:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

React state update:

```tsx
setOrders(updatedOrders);
```

Different responsibilities:

```text
localStorage.setItem()
→ update persisted browser storage

setOrders()
→ update React state
```

**Tip**

Use the same `updatedOrders` value for both to keep them aligned.

---

## 2.8 `setOrders()` and re-rendering

When:

```tsx
setOrders(updatedOrders);
```

runs, React receives a state update.

Conceptually:

```text
setOrders
↓
state update
↓
component renders again
↓
new state is used
↓
UI updates
```

This is different from assigning a normal variable.

**Tip**

A React state setter does more than assign a value; it participates in React's update system.

---

## 2.9 Loading localStorage into state

Example:

```tsx
useEffect(() => {
  const savedOrders =
    localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders =
      JSON.parse(savedOrders);

    setOrders(parsedOrders);
  }
}, []);
```

Flow:

```text
page loads
↓
useEffect
↓
localStorage.getItem()
↓
JSON.parse()
↓
setOrders()
↓
React state
↓
UI
```

**Tip**

localStorage data becomes state only because your code explicitly reads and assigns it.

---

## 2.10 The reverse direction is also manual

On cancellation:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

Flow:

```text
React state
↓
calculate updated data
↓
updatedOrders
├→ save to localStorage
└→ update React state
```

**Tip**

Both directions require explicit code.

---

## 2.11 Updating only localStorage

If you only do:

```tsx
localStorage.setItem(...);
```

then:

```text
storage
→ new

state
→ old
```

The UI may still display old data.

**Tip**

Persistence success does not guarantee UI update.

---

## 2.12 Updating only state

If you only do:

```tsx
setOrders(updatedOrders);
```

then:

```text
state
→ new

storage
→ old
```

The UI may look correct now, but after refresh old localStorage data may be loaded again.

**Tip**

A correct screen does not necessarily mean the stored data is correct.

---

## 2.13 Updating both

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

Now:

```text
storage
→ new

state
→ new
```

This is the target behavior for the current learning project.

**Tip**

One computed result should ideally be reused for persistence and UI state.

---

## 2.14 Why calculate once

Less ideal:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(
    orders.filter((order) => order.id !== orderId)
  )
);

setOrders(
  orders.filter((order) => order.id !== orderId)
);
```

Better:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

Benefits:

```text
one calculation
↓
one clear result
↓
reuse in both systems
```

**Tip**

Compute once and reuse to reduce duplication and synchronization mistakes.

---

## 2.15 React state vs normal variables

Normal variable:

```tsx
let count = 0;
count = 1;
```

The variable changes, but React does not automatically re-render just because that assignment happened.

React state:

```tsx
const [count, setCount] = useState(0);
setCount(1);
```

This goes through React's state update mechanism.

**Tip**

Values that affect the UI usually belong in state.

---

## 2.16 State represents current UI data

Example:

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

The UI uses `orders` state, not localStorage directly.

So if the screen looks wrong, the current state is the first thing to inspect.

**Tip**

Debug UI by checking current state before checking storage.

---

## 2.17 localStorage represents persistence

A useful distinction:

```text
React state
→ current UI

localStorage
→ data that can be restored later
```

**Tip**

Think `state = now`, `localStorage = later persistence`.

---

## 2.18 Source of Truth

A Source of Truth is the place considered authoritative for a piece of data.

If the same order data exists in:

```text
React state
localStorage
```

then a synchronization question appears:

```text
Which one is newer?
Which one should be trusted?
```

**Tip**

The more places store the same data, the more important it is to define which one is authoritative.

---

## 2.19 Source of Truth in this learning project

For this simplified project:

```text
localStorage
→ persistent copy

React state
→ current UI copy
```

The app initializes state from storage and updates both after changes.

**Tip**

At this stage, it is enough to think of localStorage as persistence and state as display state.

---

## 2.20 What changes in a real server application

A production shopping system is more likely to use:

```text
React
↓
API
↓
Server
↓
Database
```

Cancellation flow:

```text
user clicks cancel
↓
send API request
↓
server validates
↓
database updates
↓
response returns
↓
React state updates
```

A database update does not magically update an already-rendered React component.

**Tip**

The current localStorage lesson is preparation for understanding server data and client UI synchronization.

---

## 2.21 Common synchronization failures

Case A:

```text
Storage new
State old
```

Case B:

```text
State new
Storage old
```

Case C:

```text
Storage new
State new
```

**Tip**

When debugging, inspect storage and state separately.

---

## 2.22 Final code

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
}
```

Mental flow:

```text
click
↓
confirm
↓
filter
↓
updatedOrders
├→ localStorage
└→ React state
```

**Tip**

Read it as: calculate → persist → update UI state.

---

## 2.23 Final mental model

```text
localStorage
= browser persistence

React state
= React rendering state
```

Therefore:

```text
localStorage change
≠
automatic React state change

React state change
≠
automatic localStorage change
```

You need explicit synchronization code.

**Tip**

The most important sentence:

> localStorage is storage, React state is rendering state, so they do not automatically synchronize.

---

# 3. 한국어

## 3.1 이 장의 목표

이번 장에서는 React를 배우면서 매우 중요한 질문을 깊게 다룹니다.

> 왜 `localStorage.setItem()`을 실행해도 React state가 자동으로 바뀌지 않을까?

그리고 반대로:

> 왜 `setOrders()`를 실행해도 localStorage가 자동으로 바뀌지 않을까?

핵심 결론은 단순합니다.

```text
localStorage
→ 브라우저 저장소

React state
→ React가 UI를 렌더링하기 위해 사용하는 상태
```

이 둘은 같은 데이터를 담을 수는 있지만, 같은 시스템은 아닙니다.

**팁**

같은 `orders` 데이터를 가지고 있다고 해서 자동으로 연결된 것은 아닙니다.

---

## 3.2 React state란 무엇인가?

React state는 React 컴포넌트가 현재 어떤 화면을 그릴지 결정하는 데 사용하는 데이터입니다.

예:

```tsx
const [orders, setOrders] =
  useState<Order[]>([]);
```

여기서 `orders`는 현재 컴포넌트가 화면에 표시할 주문 목록입니다.

예:

```tsx
orders.map((order) => (
  <p key={order.id}>
    {order.productName}
  </p>
))
```

흐름:

```text
React state
↓
컴포넌트 렌더링
↓
UI
```

입니다.

**팁**

state는 “현재 화면이 무엇을 보여줘야 하는가?”와 직접 연결된 데이터라고 생각하세요.

---

## 3.3 localStorage란 무엇인가?

localStorage는 브라우저가 제공하는 Web Storage API입니다.

예:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

이 코드는 React state를 바꾸는 것이 아닙니다.

브라우저 저장 공간에 문자열을 저장합니다.

흐름:

```text
JavaScript 데이터
↓
JSON.stringify()
↓
문자열
↓
localStorage
```

입니다.

**팁**

localStorage는 화면 상태가 아니라 “나중에도 꺼내기 위한 저장 공간”입니다.

---

## 3.4 같은 데이터라도 존재하는 장소가 다르다

처음:

```text
React state:
[1001, 1002, 1003]

localStorage:
[1001, 1002, 1003]
```

라고 해봅시다.

`1002` 주문을 취소합니다.

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

결과:

```text
updatedOrders:
[1001, 1003]
```

이제:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

를 실행하면 localStorage는:

```text
[1001, 1003]
```

이 됩니다.

하지만 React state는 아직:

```text
[1001, 1002, 1003]
```

일 수 있습니다.

즉:

```text
localStorage
[1001, 1003]

React state
[1001, 1002, 1003]
```

라는 상태가 가능합니다.

**팁**

데이터 내용을 보기 전에 “이 값이 지금 어디에 들어있는가?”를 먼저 확인하세요.

---

## 3.5 왜 React는 localStorage 변경을 자동으로 알지 못할까?

React는 기본적으로 React 자신의 데이터 흐름을 중심으로 렌더링합니다.

대표적으로:

```text
state
props
context
```

입니다.

반면:

```tsx
localStorage.setItem(...)
```

은 React API가 아니라 브라우저 API입니다.

React 입장에서는:

```text
브라우저 저장소의 문자열이 바뀌었다
```

정도로만 볼 수 있습니다.

그 변화가 어떤 컴포넌트의 어떤 state와 연결되는지는 React가 알 수 없습니다.

**팁**

`setOrders()`는 React에게 상태 변경을 알리는 코드이고, `localStorage.setItem()`은 브라우저에게 저장을 요청하는 코드입니다.

---

## 3.6 React가 자동 동기화하면 왜 문제가 될까?

React가 localStorage를 자동으로 감시한다고 가정해봅시다.

그럼 React는 이런 관계를 추측해야 합니다.

```text
"orders"
→ 어떤 state?

"cart"
→ 어떤 컴포넌트?

"user"
→ 어떤 형태의 state?
```

하지만 React는 이런 관계를 알 수 없습니다.

같은 `"orders"` 데이터를 여러 컴포넌트가 다르게 사용할 수도 있습니다.

예:

```text
주문 목록 페이지
주문 상세 페이지
관리자 페이지
통계 페이지
```

모두 같은 key를 보더라도 사용하는 목적과 구조가 다를 수 있습니다.

**팁**

React는 애플리케이션의 데이터 구조를 추측하지 않습니다. 개발자가 연결 관계를 직접 코드로 정의해야 합니다.

---

## 3.7 `setOrders()`가 필요한 이유

STEP 6:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

STEP 7:

```tsx
setOrders(updatedOrders);
```

두 코드는 역할이 다릅니다.

```text
localStorage.setItem()
→ 브라우저 저장 데이터 변경

setOrders()
→ React state 변경
```

state가 변경되면 React는 새 상태를 기준으로 다시 렌더링합니다.

**팁**

같은 `updatedOrders`를 저장소와 state 양쪽에 사용하면 두 데이터가 어긋날 가능성을 줄일 수 있습니다.

---

## 3.8 `setOrders()`가 실행되면 어떤 일이 일어날까?

```tsx
setOrders(updatedOrders);
```

를 실행하면 React가 state 업데이트를 인식합니다.

개념적으로:

```text
setOrders(updatedOrders)
↓
state 업데이트
↓
컴포넌트 재렌더링
↓
새 state 사용
↓
새 UI 계산
```

입니다.

이것은 일반 변수 대입과 다릅니다.

일반 변수:

```tsx
let orders = [1001, 1002, 1003];

orders = [1001, 1003];
```

React state:

```tsx
setOrders([1001, 1003]);
```

후자는 React 업데이트 시스템에 연결됩니다.

**팁**

React state setter는 단순히 값을 바꾸는 함수가 아니라 React에게 상태 변경 사실을 알려주는 함수입니다.

---

## 3.9 localStorage에서 state로 가져오는 흐름

Day 7에서는:

```tsx
useEffect(() => {
  const savedOrders =
    localStorage.getItem("orders");

  if (savedOrders) {
    const parsedOrders =
      JSON.parse(savedOrders);

    setOrders(parsedOrders);
  }
}, []);
```

를 사용했습니다.

흐름:

```text
페이지 열림
↓
useEffect
↓
localStorage.getItem()
↓
JSON.parse()
↓
setOrders()
↓
React state
↓
UI
```

입니다.

즉 localStorage 데이터가 자동으로 state가 되는 것이 아닙니다.

우리가 직접:

```text
읽기
↓
복원
↓
state에 넣기
```

를 구현한 것입니다.

**팁**

`localStorage → React state`도 자동이 아니라 수동 연결입니다.

---

## 3.10 반대 방향도 수동 연결이다

주문 취소:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

흐름:

```text
React state
↓
filter()
↓
updatedOrders
├→ localStorage 저장
└→ React state 갱신
```

입니다.

즉:

```text
localStorage → state
```

도,

```text
state → localStorage
```

도 직접 연결해야 합니다.

**팁**

자동 동기화라고 생각하지 말고 “두 시스템 사이에 다리를 놓는다”고 생각하세요.

---

## 3.11 localStorage만 바꾸면 생기는 문제

다음만 실행:

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);
```

그러면:

```text
localStorage
→ 최신

React state
→ 이전 값
```

이 될 수 있습니다.

화면은 여전히 이전 state를 사용하므로 취소된 주문이 남아 보일 수 있습니다.

**팁**

저장 성공과 화면 갱신 성공은 별개의 문제입니다.

---

## 3.12 state만 바꾸면 생기는 문제

다음만 실행:

```tsx
setOrders(updatedOrders);
```

그러면:

```text
React state
→ 최신

localStorage
→ 이전 값
```

이 됩니다.

현재 화면에서는 주문이 사라져 보이지만 새로고침하면:

```text
localStorage의 이전 값
↓
JSON.parse
↓
setOrders
```

로 인해 취소된 주문이 다시 나타날 수 있습니다.

**팁**

현재 UI가 맞아 보여도 저장 데이터가 최신인지 따로 확인해야 합니다.

---

## 3.13 둘 다 업데이트하면

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

그러면:

```text
localStorage
→ 최신

React state
→ 최신
```

상태가 됩니다.

현재 Day 8에서는 이 상태를 만드는 것이 목표입니다.

**팁**

하나의 `updatedOrders`를 기준으로 양쪽을 업데이트하세요.

---

## 3.14 왜 계산 결과를 변수에 저장할까?

이렇게 쓸 수도 있습니다.

```tsx
localStorage.setItem(
  "orders",
  JSON.stringify(
    orders.filter(
      (order) => order.id !== orderId
    )
  )
);

setOrders(
  orders.filter(
    (order) => order.id !== orderId
  )
);
```

하지만 같은 `filter()`가 두 번 있습니다.

더 좋은 구조:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

setOrders(updatedOrders);
```

흐름:

```text
한 번 계산
↓
같은 결과를 저장
↓
같은 결과를 state에 반영
```

입니다.

**팁**

한 번 계산한 값을 재사용하면 중복 코드와 동기화 실수를 줄일 수 있습니다.

---

## 3.15 React state와 일반 변수의 차이

일반 변수:

```tsx
let count = 0;

count = 1;
```

JavaScript 변수 값은 바뀝니다.

하지만 React가 그 사실을 자동으로 렌더링 이벤트로 처리하지는 않습니다.

React state:

```tsx
const [count, setCount] = useState(0);

setCount(1);
```

는 React 업데이트 시스템에 연결됩니다.

```text
setCount
↓
React가 변경 인식
↓
재렌더링
```

입니다.

**팁**

화면에 영향을 주는 값은 왜 state로 관리하는지 이 차이를 통해 이해할 수 있습니다.

---

## 3.16 state는 현재 UI의 데이터다

예:

```tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

여기서 `orders`는 React state입니다.

컴포넌트는 localStorage를 직접 보고 화면을 그리는 것이 아니라 현재 state를 기준으로 렌더링합니다.

**팁**

화면이 이상하면 localStorage보다 먼저 현재 state 값을 확인하는 습관을 들이세요.

---

## 3.17 localStorage는 지속 저장 역할이다

정리:

```text
React state
→ 지금 화면에 필요한 데이터

localStorage
→ 나중에 다시 복원하기 위한 저장 데이터
```

입니다.

**팁**

`state = 지금`, `localStorage = 다음에도`라고 기억해도 좋습니다.

---

## 3.18 Source of Truth란?

Source of Truth는 쉽게 말하면:

> 최종적으로 어떤 데이터를 가장 신뢰할 것인가?

라는 뜻입니다.

같은 `orders` 데이터가:

```text
React state
localStorage
```

두 군데 있다면 이런 질문이 생깁니다.

```text
어느 쪽이 최신인가?
어느 쪽을 기준으로 해야 하나?
```

이게 동기화 문제입니다.

**팁**

같은 데이터를 여러 곳에 보관할수록 Source of Truth를 명확히 정해야 합니다.

---

## 3.19 현재 학습 프로젝트의 Source of Truth 이해

현재는 단순화해서:

```text
localStorage
→ 지속 저장

React state
→ 현재 화면
```

역할로 사용하고 있습니다.

페이지를 열 때:

```text
localStorage
↓
state 초기화
```

변경할 때:

```text
새 데이터
├→ localStorage
└→ state
```

입니다.

**팁**

지금은 “localStorage는 저장용, state는 렌더링용”으로 역할을 분리하면 충분합니다.

---

## 3.20 실제 서버 애플리케이션에서는?

실제 쇼핑몰은 보통:

```text
React
↓
API
↓
Server
↓
Database
```

구조를 사용합니다.

주문 취소:

```text
사용자 취소
↓
API 요청
↓
서버 검증
↓
DB 업데이트
↓
응답
↓
React state 업데이트
```

입니다.

DB가 바뀌었다고 현재 브라우저의 React state가 자동으로 바뀌는 것은 아닙니다.

**팁**

지금 localStorage와 state의 동기화 개념은 나중에 서버 데이터와 클라이언트 UI를 동기화하는 개념으로 그대로 확장됩니다.

---

## 3.21 대표적인 동기화 실패 상황

### 상황 A

```text
Storage 최신
State 과거
```

### 상황 B

```text
State 최신
Storage 과거
```

### 상황 C

```text
Storage 최신
State 최신
```

현재 목표는 C입니다.

**팁**

버그가 생기면 “저장 데이터”와 “React state”를 각각 따로 확인하세요.

---

## 3.22 최종 코드

```tsx
function handleCancelOrder() {
  const confirmed = window.confirm(
    "정말 이 주문을 취소하시겠습니까?"
  );

  if (!confirmed) return;

  const updatedOrders = orders.filter(
    (order) => order.id !== orderId
  );

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  setOrders(updatedOrders);
}
```

흐름:

```text
클릭
↓
confirm
↓
filter
↓
updatedOrders
├→ localStorage 저장
└→ React state 갱신
```

**팁**

이 코드는 `계산 → 저장 → 화면 상태 갱신`으로 읽으면 이해하기 쉽습니다.

---

## 3.23 최종 Mental Model

```text
localStorage
= 브라우저 저장소
= 지속 데이터

React state
= React 렌더링 상태
= 현재 UI 데이터
```

그리고:

```text
localStorage 변경
≠
React state 자동 변경

React state 변경
≠
localStorage 자동 변경
```

필요한 것은:

```text
개발자가 직접 작성한 동기화 코드
```

입니다.

가장 중요한 문장:

> localStorage는 저장소이고, React state는 렌더링 상태이므로 서로 자동으로 동기화되지 않는다.

**팁**

앞으로 state와 외부 저장소를 같이 쓸 때는 항상 세 가지를 확인하세요.

```text
1. 현재 UI는 어떤 state를 보고 있는가?
2. 저장 데이터는 어디에 있는가?
3. 둘을 언제, 어떤 코드로 맞춰줄 것인가?
```

---

# 4. Quick Reference / 早見表 / 빠른 정리

| Concept | 日本語 | English | 한국어 |
|---|---|---|---|
| React state | UI 描画のための状態 | rendering state | UI 렌더링 상태 |
| localStorage | ブラウザ保存領域 | browser persistence | 브라우저 저장소 |
| `setOrders()` | React に状態更新を通知 | notify React of state update | React state 변경 |
| `setItem()` | 保存データを書き換える | update stored data | 저장 데이터 변경 |
| Synchronization | 明示的にコードで接続 | explicit connection | 직접 코드로 연결 |
| Source of Truth | 正しい基準データ | authoritative data source | 기준이 되는 데이터 |

最終公式 / Final formula / 최종 공식:

```text
localStorage change
≠ React state change

React state change
≠ localStorage change

Therefore:

calculate new data
↓
persist it
↓
update React state
```
