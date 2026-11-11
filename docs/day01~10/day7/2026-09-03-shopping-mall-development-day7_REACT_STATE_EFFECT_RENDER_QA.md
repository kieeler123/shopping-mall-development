# Day 7 이후 이론 총정리 --- React State / Effect / Render Q&A

> **학습 범위**\
> 앞서 정리한 Dynamic Route `[id]`, `useParams()`, `Number()`, `NaN`,
> `===` 이후의 내용만 정리합니다.\
> 핵심 주제는
> `localStorage → JSON.parse() → useState → 첫 렌더링 → useEffect → setState → 재렌더링`이며,
> state snapshot, 일반 변수와 state, mount/remount, dependency array,
> `setState()` 직후 이전 값이 보이는 이유, functional updater까지
> 연결합니다.
>
> **언어 순서:** 日本語 → English → 한국어\
> **형식:** 質問と回答 / Questions & Answers / 질문과 답변

------------------------------------------------------------------------

# 日本語

## Q1. なぜ注文詳細ページでも `localStorage` から `orders` を読み込む必要がありますか？

**A.**
URLから取得できるのは「どの注文を見たいか」という識別情報です。実際の注文データそのものがURLに入っているわけではありません。

``` text
URL
/orders/123
↓
見たい注文のID

localStorage
↓
保存済みの全注文 orders[]
```

したがって、詳細ページでは最終的に「URLのID」と「保存済みの注文一覧」の両方が必要です。

``` text
URLのID + orders[]
        ↓
      find()
        ↓
    Order 1件
```

> **Tip**
>
> URLは「検索条件」、`localStorage`の `orders[]`
> は「検索対象」と考えると整理しやすいです。

------------------------------------------------------------------------

## Q2. `localStorage` とは何ですか？

**A.** `localStorage` はブラウザが提供するWeb Storage
APIの一つです。ブラウザ側にキーと値の形でデータを保存できます。

``` ts
localStorage.setItem("orders", value);
localStorage.getItem("orders");
```

重要なのは、`localStorage`
が保存する値は文字列だという点です。そのため配列やオブジェクトをそのまま保存・復元するのではなく、通常はJSONへ変換します。

``` text
Order[]
↓
JSON.stringify()
↓
JSON文字列
↓
localStorage
```

読み込むときは逆です。

``` text
localStorage
↓
JSON文字列
↓
JSON.parse()
↓
Order[]
```

> **Tip**
>
> `JSON.stringify()` は「保存できる文字列へ」、`JSON.parse()`
> は「JavaScriptで扱えるデータへ戻す」と対で覚えてください。

------------------------------------------------------------------------

## Q3. なぜ `localStorage` を `useEffect()` の中で読み込むのですか？

**A.** `localStorage`
はブラウザAPIです。React/Next.jsではレンダリングそのものと、ブラウザの外部システムにアクセスする処理を分けて考えることが重要です。

``` tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");
}, []);
```

このeffectは画面への反映後にブラウザで実行されるため、`localStorage`
へのアクセスを置く場所として適しています。

`"use client"` はClient
Componentの境界を示しますが、「コンポーネント関数のレンダリング中にブラウザ専用APIを自由に読めばよい」という意味ではありません。

> **Tip**
>
> `useEffect = localStorage専用` と暗記しないでください。`useEffect`
> はレンダリング後に外部システムと同期するためのReact
> Hookです。今回はその外部システムが `localStorage` です。

------------------------------------------------------------------------

## Q4. `useState<Order[]>([])` は何を意味しますか？

**A.** 注文一覧をReact
stateとして管理し、その最初の値を空配列にするという意味です。

``` tsx
const [orders, setOrders] = useState<Order[]>([]);
```

それぞれの役割は次のとおりです。

``` text
orders
→ 現在のレンダリングで使用するstate

setOrders
→ ordersのstate更新をReactへ要求する関数

Order[]
→ TypeScript上、注文の配列として扱う

[]
→ 初回state作成時の初期値
```

> **Tip**
>
> `[]`
> は「注文が絶対に存在しない」という意味ではありません。「まだ保存データを読み込む前なので、最初は空配列から始める」という場合もあります。

------------------------------------------------------------------------

## Q5. 最初のレンダリングでは何が起こりますか？

**A.** 最初は `orders` の初期値が `[]`
なので、その値を使ってUIが計算されます。

``` tsx
<p>注文数: {orders.length}</p>
```

最初は:

``` text
orders = []
↓
orders.length = 0
↓
最初のUIを計算
```

となります。

ここで重要なのは、まだ `useEffect()` による `localStorage`
の読み込みが完了していないということです。

> **Tip**
>
> 「最初のレンダリング時の0」と「データ確認後、本当に注文が0件」は意味が違う可能性があります。この違いが後の
> `loading` stateにつながります。

------------------------------------------------------------------------

## Q6. レンダリングとは何ですか？

**A.**
初学者向けには「現在のpropsとstateを使い、UIがどうあるべきかをReactが計算する過程」と理解するとよいです。

``` text
現在のstate
↓
コンポーネント実行
↓
JSXを計算
↓
UIへ反映
```

stateが変われば、同じJSXでも結果が変わります。

``` tsx
<p>{orders.length}</p>
```

``` text
orders = []          → 0
orders = [A, B, C]   → 3
```

> **Tip**
>
> レンダリングを「画面を一度だけ作ること」と考えないでください。state更新によって再レンダリングできます。

------------------------------------------------------------------------

## Q7. `useEffect()` はいつ実行されますか？

**A.** effectはレンダリング結果が画面に反映された後に実行されます。

現在の学習コードでは:

``` text
コンポーネント実行
↓
最初のレンダリング
↓
画面へ反映
↓
useEffect実行
↓
localStorage読み込み
```

という順序で理解できます。

> **Tip**
>
> `useEffect()` がソースコード上で `return`
> より上に書かれていても、「returnより先にeffect処理が完了する」という意味ではありません。

------------------------------------------------------------------------

## Q8. `JSON.parse()` の役割は何ですか？

**A.** `localStorage.getItem("orders")`
で取得したJSON文字列をJavaScriptの配列・オブジェクトとして再び扱える形へ変換します。

``` tsx
const savedOrders = localStorage.getItem("orders");

if (savedOrders) {
  const parsedOrders: Order[] = JSON.parse(savedOrders);
}
```

概念的には:

``` text
'[{"id":100},{"id":200}]'
↓ JSON.parse()
[
  { id: 100 },
  { id: 200 }
]
```

です。

ただしTypeScriptの `: Order[]`
は実行時にJSONの中身を自動検証する仕組みではありません。現在のプロジェクトでは「自分たちが保存したordersの形式を読み戻す」という前提で使用しています。

> **Tip**
>
> `JSON.parse()` は文字列を復元し、`Order[]`
> はTypeScriptでその値をどう扱うかを示す型です。二つの役割を混同しないでください。

------------------------------------------------------------------------

## Q9. `setOrders(parsedOrders)` を呼ぶと何が起こりますか？

**A.** `orders = parsedOrders`
のように現在のローカル変数を直接書き換えるのではなく、Reactにstate更新を要求します。

``` tsx
setOrders(parsedOrders);
```

概念的には:

``` text
現在
orders = []

↓ setOrders(parsedOrders)

Reactへstate更新要求

↓
Reactが更新を処理

↓
次のレンダリング
orders = parsedOrders
```

となります。

> **Tip**
>
> `setSomething()`
> を見たら「変数への代入」ではなく「次のレンダリングにつながるstate更新」と読んでください。

------------------------------------------------------------------------

## Q10. なぜ `setOrders()` の後に再レンダリングが必要なのですか？

**A.** UIが `orders` に依存しているからです。

最初:

``` text
orders = []
注文数 = 0
```

更新後:

``` text
orders = [注文1, 注文2, 注文3]
注文数 = 3
```

stateが変わったのにUIが再計算されなければ、画面は古い `0`
のままになります。そこでReactは新しいstateを使ってコンポーネントを再レンダリングします。

> **Tip**
>
> 「stateがUIの材料である → 材料が変わった →
> UIを再計算する」と考えると再レンダリングの理由が分かります。

------------------------------------------------------------------------

## Q11. 再レンダリングではコンポーネント関数が再び実行されますか？

**A.** はい。コンポーネント関数は再び実行されます。

しかし、Reactが保持しているstateまで毎回初期化されるわけではありません。

``` text
初回レンダリング
useState([])
↓
orders = []

setOrders([A, B])

再レンダリング
useState([]) を再び呼ぶ
↓
既存stateがある
↓
orders = [A, B]
```

> **Tip**
>
> 「関数は再実行される」と「stateが初期化される」は別の話です。

------------------------------------------------------------------------

## Q12. `useState([])` が再び実行されるのに、なぜ `orders` は `[]` に戻らないのですか？

**A.** `[]`
は毎回代入する値ではなく、stateが最初に作られるときの初期値だからです。Reactはレンダリングの間でstateを保持します。

``` text
useState(initialValue)

初回
→ stateがない
→ initialValueを使用

再レンダリング
→ 既存stateがある
→ 現在のstateを使用
```

> **Tip**
>
> `initialValue` は「every render
> value」ではありません。「initial」、つまり最初の値です。

------------------------------------------------------------------------

## Q13. 一般変数とstateは何が違いますか？

**A.** 一般的なローカル変数は関数が再実行されるたびに新しく作られます。

``` tsx
let count = 0;
```

一方:

``` tsx
const [count, setCount] = useState(0);
```

のstateはReactがレンダリング間で保持し、更新をUIの再レンダリングへ接続します。

``` text
一般変数
→ 関数実行に属する

React state
→ コンポーネントのレンダリング間でReactが保持
→ 更新がUI再計算につながる
```

> **Tip**
>
> 画面に影響し、時間とともに変化するデータを扱うとき、stateが重要になります。

------------------------------------------------------------------------

## Q14. stateを「snapshot」と考えるとはどういう意味ですか？

**A.**
ある1回のレンダリングでコンポーネントが受け取るstate値を、そのレンダリング時点のスナップショットとして考えるということです。

例えば最初のレンダリングが:

``` text
orders = []
```

なら、そのレンダリングから作られた処理が参照する `orders`
はその時点の値を基準にします。

`setOrders()`
は現在のスナップショットそのものを直接書き換えるのではなく、新しいstateを使う次のレンダリングにつなげます。

> **Tip**
>
> 「現在のレンダリングのstate」と「次のレンダリングのstate」を分けて話す習慣をつけると、Reactの挙動が理解しやすくなります。

------------------------------------------------------------------------

## Q15. なぜ `setOrders(parsedOrders)` の直後の `console.log(orders)` で古い値が見えることがありますか？

**A.** `console.log(orders)` が現在のレンダリングのstate
snapshotを参照しているからです。

``` tsx
setOrders(parsedOrders);
console.log(orders);
```

最初のレンダリングで `orders = []` だったなら、`setOrders()`
の直後でも現在の処理が参照する `orders` は `[]` です。

``` text
現在のレンダリング
orders = []

↓ setOrders([A, B])

次のstate更新を要求

↓ console.log(orders)

現在のsnapshot → []

↓ Reactが更新

次のレンダリング
orders = [A, B]
```

> **Tip**
>
> 今すぐ新しくパースした値を確認したいなら `console.log(parsedOrders)`
> を見る方が直接的です。

------------------------------------------------------------------------

## Q16. 更新後の `orders` を観察するにはどうすればよいですか？

**A.** 学習・デバッグ目的なら `orders`
をdependencyにしたeffectで観察できます。

``` tsx
useEffect(() => {
  console.log("orders changed:", orders);
}, [orders]);
```

`orders`
が変化したレンダリングの後にeffectが実行されるので、新しいstateを観察できます。

> **Tip**
>
> これは観察用として便利ですが、「stateが変わるたびに必ずeffectを作る」というルールではありません。

------------------------------------------------------------------------

## Q17. `useEffect(..., [])` の `[]` は何ですか？

**A.** dependency
arrayです。現在の例では空配列なので、マウント後に実行するeffectのパターンとして使っています。

``` tsx
useEffect(() => {
  // localStorageを読む
}, []);
```

一方:

``` tsx
useEffect(() => {
  console.log(orders);
}, [orders]);
```

では `orders` がdependencyです。

> **Tip**
>
> `[]` を「useEffectを1回にする魔法」とだけ暗記せず、dependency
> arrayという役割を理解してください。開発環境のReact Strict
> Modeではeffectが追加で実行されたように見えることもあります。

------------------------------------------------------------------------

## Q18. mount、re-render、remountはどう違いますか？

**A.**

``` text
mount
→ コンポーネントが初めて登場する

re-render
→ 同じコンポーネントが新しいprops/stateで再計算される

unmount
→ コンポーネントが削除される

remount
→ 削除後、新しいコンポーネントとして再び登場する
```

re-renderではstateは通常維持されます。一方、コンポーネントがunmountされ、そのstateが破棄された後に新しくmountされれば、`useState`
の初期値から新しいstateが作られます。

> **Tip**
>
> `re-render ≠ remount` を必ず区別してください。

------------------------------------------------------------------------

## Q19. なぜ `orders = []` と `loading = true` を分ける必要がありますか？

**A.** `orders = []` だけでは二つの状態を区別できないからです。

``` text
ケースA
まだlocalStorageを確認していない
orders = []

ケースB
確認が終わったが本当に注文がない
orders = []
```

そこで:

``` tsx
const [loading, setLoading] = useState(true);
```

を使えば:

``` text
loading = true
→ まだ確認中

loading = false && orders.length === 0
→ 確認済み、本当に注文なし
```

と意味を分けられます。

> **Tip**
>
> stateは単なる値ではなく、「現在UIがどの状態にあるか」を表現するためにも使います。

------------------------------------------------------------------------

## Q20. `setCount(count + 1)` を3回書けば必ず3増えますか？

**A.** いいえ。現在のレンダリングで `count = 0` なら:

``` tsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

3行とも現在のsnapshotの `count = 0` を基準に:

``` text
setCount(1)
setCount(1)
setCount(1)
```

のような更新になります。

前の更新結果を使って次を計算したい場合はfunctional updaterを使います。

``` tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

概念的には:

``` text
0 → 1
1 → 2
2 → 3
```

です。

> **Tip**
>
> 「前のstateを基準に次のstateを計算する」場合は `setState(prev => ...)`
> を思い出してください。

------------------------------------------------------------------------

## Q21. なぜHookを条件文の中で呼んではいけないのですか？

**A.** React
Hooksは各レンダリングで一貫した呼び出し順序を保つ必要があります。

``` tsx
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
```

概念的には:

``` text
1番目のHook → orders
2番目のHook → loading
```

という対応が維持されます。

条件によってHookの呼び出し自体が消えると順序が不安定になります。

``` tsx
if (something) {
  useState([]); // 避ける
}
```

> **Tip**
>
> HookはReactコンポーネントまたはCustom
> Hookのトップレベルで呼ぶ、という基本ルールを守ってください。

------------------------------------------------------------------------

## Q22. ここまでのDay 7のデータフローを一つにまとめると？

**A.**

``` text
OrderDetailPage
│
├─ URL側
│   └─ params.id
│
└─ 保存データ側
    └─ useState([])
        ↓
      初回レンダリング
        ↓
      useEffect
        ↓
      localStorage
        ↓
      JSON.parse()
        ↓
      setOrders()
        ↓
      再レンダリング
        ↓
      orders[]

params.id + orders[]
        ↓
      find()
        ↓
      Order 1件
        ↓
      詳細UI
```

> **Tip**
>
> この図を自分の言葉で説明できれば、Day 7の次の `find()`
> の実装へ進む準備ができています。

------------------------------------------------------------------------

# English

## Q1. Why does the order detail page need to read `orders` from `localStorage`?

**A.** The URL only tells us which order the user wants. It does not
contain the complete order object.

``` text
URL /orders/123
→ search key / order ID

localStorage
→ saved orders[]
```

Eventually the two flows meet:

``` text
URL ID + orders[]
      ↓
    find()
      ↓
 one Order
```

> **Tip**
>
> Think of the URL ID as the search condition and `orders[]` as the
> collection being searched.

------------------------------------------------------------------------

## Q2. What is `localStorage`?

**A.** `localStorage` is a browser Web Storage API that stores key-value
data. Its values are strings.

``` ts
localStorage.setItem("orders", value);
localStorage.getItem("orders");
```

For arrays and objects, the usual flow is:

``` text
Order[]
↓ JSON.stringify()
JSON string
↓
localStorage

localStorage
↓
JSON string
↓ JSON.parse()
Order[]
```

> **Tip**
>
> Pair `JSON.stringify()` with saving and `JSON.parse()` with restoring.

------------------------------------------------------------------------

## Q3. Why read `localStorage` inside `useEffect()`?

**A.** `localStorage` is a browser API. In React and Next.js, it is
useful to separate rendering from work that synchronizes with an
external browser system.

``` tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");
}, []);
```

The effect runs after the rendered result is committed, making it an
appropriate place for this browser-side synchronization.

`"use client"` marks a Client Component boundary; it should not be
interpreted as "every browser-only API should be read directly during
render."

> **Tip**
>
> Do not memorize `useEffect` as a localStorage function. It is a React
> Hook for synchronizing with external systems after rendering;
> `localStorage` is simply the external system in this example.

------------------------------------------------------------------------

## Q4. What does `useState<Order[]>([])` mean?

**A.**

``` tsx
const [orders, setOrders] = useState<Order[]>([]);
```

means that the component keeps an order array as React state and starts
it with an empty array.

``` text
orders     → state for the current render
setOrders  → requests an update to that state
Order[]    → TypeScript type
[]         → initial state value
```

> **Tip**
>
> An empty initial array does not necessarily mean "there are no
> orders." It can mean "the saved orders have not been loaded yet."

------------------------------------------------------------------------

## Q5. What happens during the first render?

**A.** The component initially receives the state value `[]`, so the UI
is calculated from that value.

``` text
orders = []
↓
orders.length = 0
↓
first UI calculation
```

The localStorage effect has not completed yet.

> **Tip**
>
> Distinguish "0 before loading" from "0 after loading." This is why a
> separate loading state becomes useful.

------------------------------------------------------------------------

## Q6. What does rendering mean?

**A.** A useful beginner mental model is: rendering is React calculating
what the UI should look like from the current props and state.

``` text
current state
↓
component runs
↓
JSX is calculated
↓
result is committed to the UI
```

The same JSX can produce different output when state changes.

> **Tip**
>
> Rendering is not a one-time event. State updates can cause re-renders.

------------------------------------------------------------------------

## Q7. When does `useEffect()` run?

**A.** Effects run after React commits the rendered result.

For the current learning example:

``` text
component runs
↓
first render
↓
UI commit
↓
effect runs
↓
localStorage is read
```

> **Tip**
>
> Source-code position does not mean the effect finishes before the JSX
> `return`.

------------------------------------------------------------------------

## Q8. What does `JSON.parse()` do?

**A.** It converts the JSON string retrieved from localStorage back into
JavaScript data.

``` text
'[{"id":100},{"id":200}]'
↓ JSON.parse()
[
  { id: 100 },
  { id: 200 }
]
```

In:

``` tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

`JSON.parse()` performs the runtime parsing, while `Order[]` is the
TypeScript type used by the code. The annotation itself does not
validate arbitrary JSON at runtime.

> **Tip**
>
> Separate runtime data conversion from TypeScript's compile-time type
> description.

------------------------------------------------------------------------

## Q9. What happens when `setOrders(parsedOrders)` runs?

**A.** It does not behave like:

``` ts
orders = parsedOrders;
```

Instead, it requests a React state update.

``` text
current render
orders = []

↓ setOrders(parsedOrders)

state update requested

↓ React processes update

next render
orders = parsedOrders
```

> **Tip**
>
> Read `setSomething(...)` as "request the next state," not "directly
> mutate the current local variable."

------------------------------------------------------------------------

## Q10. Why is a re-render needed after the state update?

**A.** Because the UI depends on the state.

``` text
orders = []        → order count 0
orders = [A,B,C]   → order count 3
```

React must calculate the component again with the new state so the
displayed UI can reflect the change.

> **Tip**
>
> State is input to the UI. When that input changes, React may need to
> recalculate the UI.

------------------------------------------------------------------------

## Q11. Does the component function run again during a re-render?

**A.** Yes. The function runs again, but React preserves the component's
state across re-renders.

``` text
first render
useState([])
→ orders = []

setOrders([A,B])

re-render
useState([]) is called again
→ existing state is used
→ orders = [A,B]
```

> **Tip**
>
> Function re-execution and state re-initialization are not the same
> thing.

------------------------------------------------------------------------

## Q12. Why doesn't `useState([])` reset `orders` to `[]` on every re-render?

**A.** Because `[]` is an initial value. React uses it when the state is
first created. On later re-renders, React provides the currently stored
state.

``` text
first render
no existing state
→ use initial value

later render
existing state
→ use current state
```

> **Tip**
>
> The argument to `useState` is an initial value, not a value that is
> assigned on every render.

------------------------------------------------------------------------

## Q13. What is the difference between a normal local variable and React state?

**A.** A local variable belongs to a particular function execution.
React state is preserved by React across renders and its updates are
connected to UI rendering.

``` text
local variable
→ belongs to function execution

state
→ preserved across renders
→ updates can trigger UI recalculation
```

> **Tip**
>
> State is especially useful for changing data that affects what the
> user sees.

------------------------------------------------------------------------

## Q14. What does it mean to say state is a "snapshot"?

**A.** Each render receives a particular state value. You can think of
that value as the snapshot for that render.

If the current render has:

``` text
orders = []
```

calling `setOrders()` does not mutate that snapshot in place. It
requests an update that leads to another render with a new snapshot.

> **Tip**
>
> Ask: "Am I looking at the current render's state, or the next render's
> state?"

------------------------------------------------------------------------

## Q15. Why can `console.log(orders)` immediately after `setOrders()` show the old value?

**A.** Because the code is still reading the state snapshot from the
current render.

``` tsx
setOrders(parsedOrders);
console.log(orders);
```

Conceptually:

``` text
current render: orders = []
↓
setOrders([A,B])
↓
request update
↓
console.log(orders)
→ []
↓
next render: orders = [A,B]
```

> **Tip**
>
> To inspect the value you just parsed immediately, log `parsedOrders`.
> To observe the updated state, observe a later render.

------------------------------------------------------------------------

## Q16. How can I observe the updated `orders` state?

**A.** For learning or debugging, you can use an effect that depends on
`orders`.

``` tsx
useEffect(() => {
  console.log("orders changed:", orders);
}, [orders]);
```

It runs after a render in which the dependency changed.

> **Tip**
>
> This is useful for observation, but it does not mean every state
> change requires an effect.

------------------------------------------------------------------------

## Q17. What does the `[]` in `useEffect(..., [])` mean?

**A.** It is the dependency array. In the current pattern, an empty
dependency array is used for an effect associated with mounting.

With:

``` tsx
useEffect(() => {
  console.log(orders);
}, [orders]);
```

`orders` is a dependency.

> **Tip**
>
> Learn the concept "dependency array," not merely the slogan "empty
> array means once." React Strict Mode in development can make effect
> execution appear more than once.

------------------------------------------------------------------------

## Q18. What is the difference between mount, re-render, and remount?

**A.**

``` text
mount
→ component appears for the first time

re-render
→ same component is recalculated with current props/state

unmount
→ component is removed

remount
→ a new instance appears after removal
```

State is generally preserved across a re-render. If a component is
unmounted and its state is discarded, a newly mounted instance can start
again from its `useState` initial values.

> **Tip**
>
> Remember: `re-render ≠ remount`.

------------------------------------------------------------------------

## Q19. Why keep `orders = []` and `loading = true` as separate states?

**A.** Because the same empty array can represent different situations.

``` text
not checked yet
orders = []

checked and genuinely empty
orders = []
```

A loading state separates those meanings.

``` text
loading = true
→ still checking

loading = false && orders.length === 0
→ finished, no orders
```

> **Tip**
>
> State can represent not only data but also the status of the UI.

------------------------------------------------------------------------

## Q20. Does calling `setCount(count + 1)` three times always add three?

**A.** No. If the current render has `count = 0`, all three expressions
can use that same snapshot.

``` tsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

They are conceptually based on `0 + 1`.

When the next value depends on the previous state, use a functional
updater:

``` tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

``` text
0 → 1 → 2 → 3
```

> **Tip**
>
> If the next state is calculated from the previous state, think
> `setState(prev => ...)`.

------------------------------------------------------------------------

## Q21. Why should Hooks not be called conditionally?

**A.** React relies on Hooks being called consistently across renders.

``` tsx
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
```

A useful conceptual model is:

``` text
Hook #1 → orders
Hook #2 → loading
```

Conditionally skipping a Hook can disturb that consistent order.

> **Tip**
>
> Call Hooks at the top level of React components or custom Hooks.

------------------------------------------------------------------------

## Q22. What is the complete mental model for this part of Day 7?

**A.**

``` text
OrderDetailPage
│
├─ URL side
│   └─ params.id
│
└─ saved-data side
    └─ useState([])
        ↓
      first render
        ↓
      useEffect
        ↓
      localStorage
        ↓
      JSON.parse()
        ↓
      setOrders()
        ↓
      re-render
        ↓
      orders[]

params.id + orders[]
        ↓
      find()
        ↓
      one Order
        ↓
      detail UI
```

> **Tip**
>
> If you can explain this diagram without looking at the code, you are
> ready to connect the two flows with `find()`.

------------------------------------------------------------------------

# 한국어

## Q1. 주문 상세 페이지에서도 왜 `localStorage`에서 `orders`를 읽어와야 하나요?

**A.** URL에서 얻는 것은 **어떤 주문을 보고 싶은지 알려주는 주문
ID**입니다. 주문의 이름, 주소, 상품 목록, 총금액 같은 실제 주문 데이터
전체가 URL에 들어 있는 것은 아닙니다.

``` text
URL
/orders/123
↓
찾고 싶은 주문의 ID

localStorage
↓
저장된 전체 주문 orders[]
```

그래서 상세 페이지에서는 최종적으로 두 정보가 필요합니다.

``` text
URL의 주문 ID + orders[]
              ↓
            find()
              ↓
          Order 하나
```

> **팁**
>
> URL의 ID는 **검색 조건**, `orders[]`는 **검색 대상 데이터**라고
> 생각하면 쉽습니다.

------------------------------------------------------------------------

## Q2. `localStorage`는 정확히 무엇인가요?

**A.** `localStorage`는 브라우저가 제공하는 Web Storage API입니다.
브라우저에 key-value 형태로 값을 저장할 수 있습니다.

``` ts
localStorage.setItem("orders", value);
localStorage.getItem("orders");
```

중요한 특징은 저장 값이 문자열이라는 것입니다. 따라서 배열이나 객체는
보통 JSON 문자열로 바꿔 저장합니다.

``` text
Order[]
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage
```

읽을 때는 반대입니다.

``` text
localStorage
↓
JSON 문자열
↓
JSON.parse()
↓
Order[]
```

> **팁**
>
> `JSON.stringify()` = 저장하기 좋은 문자열로 변환, `JSON.parse()` =
> 다시 JavaScript 데이터로 복원이라고 한 쌍으로 기억하세요.

------------------------------------------------------------------------

## Q3. 왜 `localStorage`를 `useEffect()` 안에서 읽나요?

**A.** `localStorage`는 브라우저 API입니다. React/Next.js에서는 **렌더링
자체**와 **브라우저의 외부 시스템과 동기화하는 작업**을 구분하는 것이
중요합니다.

``` tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");
}, []);
```

effect는 렌더링 결과가 화면에 반영된 뒤 실행되므로, 현재 프로젝트에서는
브라우저의 `localStorage`를 읽는 작업을 넣기에 적절합니다.

또한 `"use client"`는 Client Component의 경계를 지정하는 것이지,
**렌더링 중에 브라우저 전용 API를 아무렇게나 직접 읽어도 된다는 뜻**으로
이해하면 안 됩니다.

> **팁**
>
> `useEffect = localStorage 함수`라고 외우지 마세요. `useEffect`는 외부
> 시스템과 동기화하기 위한 React Hook이고, 지금은 그 외부 시스템이
> `localStorage`인 것입니다.

------------------------------------------------------------------------

## Q4. `useState<Order[]>([])`는 무엇을 뜻하나요?

**A.**

``` tsx
const [orders, setOrders] = useState<Order[]>([]);
```

는 주문 배열을 React state로 관리하고, 처음 state를 만들 때 빈 배열로
시작하겠다는 뜻입니다.

``` text
orders
→ 현재 렌더링에서 사용하는 state

setOrders
→ orders state 업데이트를 React에 요청하는 함수

Order[]
→ TypeScript에서 주문 배열로 다룬다는 타입

[]
→ 최초 state 생성 시 사용할 초기값
```

> **팁**
>
> `orders = []`라고 해서 반드시 주문이 없다는 뜻은 아닙니다. 아직 저장
> 데이터를 읽기 전이라 임시로 빈 배열일 수도 있습니다.

------------------------------------------------------------------------

## Q5. 첫 렌더링에서는 무슨 일이 일어나나요?

**A.** 처음에는 `orders`의 초기값이 `[]`이므로 React는 그 값을 이용해
UI를 계산합니다.

``` tsx
<p>저장된 주문 개수: {orders.length}</p>
```

처음에는:

``` text
orders = []
↓
orders.length = 0
↓
첫 UI 계산
```

입니다.

이 시점에는 아직 `useEffect()`가 `localStorage`에서 주문을 복원하기
전입니다.

> **팁**
>
> **불러오기 전이라 0개**와 **불러와 보니 실제로 0개**는 서로 다른
> 상태입니다. 이 차이가 나중의 `loading` state와 연결됩니다.

------------------------------------------------------------------------

## Q6. 렌더링(rendering)이 정확히 무엇인가요?

**A.** 지금 단계에서는 **현재 props와 state를 가지고 UI가 어떻게 보여야
할지를 React가 계산하는 과정**이라고 이해하면 좋습니다.

``` text
현재 state
↓
컴포넌트 함수 실행
↓
JSX 계산
↓
UI 반영
```

같은 JSX라도 state가 달라지면 결과가 달라집니다.

``` tsx
<p>{orders.length}</p>
```

``` text
orders = []        → 0
orders = [A,B,C]   → 3
```

> **팁**
>
> 렌더링을 **화면을 최초 한 번 만드는 것**으로만 생각하지 마세요.
> state가 바뀌면 재렌더링될 수 있습니다.

------------------------------------------------------------------------

## Q7. `useEffect()`는 언제 실행되나요?

**A.** effect는 렌더링 결과가 화면에 반영된 뒤 실행됩니다.

현재 학습 코드의 흐름은:

``` text
컴포넌트 함수 실행
↓
첫 렌더링
↓
화면 반영
↓
useEffect 실행
↓
localStorage 읽기
```

라고 이해하면 됩니다.

> **팁**
>
> 코드에서 `useEffect()`가 `return`보다 위에 적혀 있다고 해서 effect의
> 내부 작업이 화면보다 먼저 끝난다고 생각하면 안 됩니다.

------------------------------------------------------------------------

## Q8. `JSON.parse()`는 정확히 무슨 일을 하나요?

**A.** `localStorage.getItem("orders")`에서 얻은 JSON 문자열을 다시
JavaScript 배열/객체로 사용할 수 있게 복원합니다.

``` text
'[{"id":100},{"id":200}]'
↓ JSON.parse()
[
  { id: 100 },
  { id: 200 }
]
```

현재 코드는:

``` tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

처럼 작성했습니다.

여기서 `JSON.parse()`는 **실행 시점의 데이터 변환**, `Order[]`는
**TypeScript에서 이 값을 어떤 타입으로 다룰지 표현하는 것**입니다.
`: Order[]`를 붙였다고 해서 외부의 임의 JSON 내용이 런타임에서 자동
검증되는 것은 아닙니다.

> **팁**
>
> `JSON.parse()`와 TypeScript 타입 표시는 서로 역할이 다릅니다. **데이터
> 복원**과 **타입 설명**을 구분하세요.

------------------------------------------------------------------------

## Q9. `setOrders(parsedOrders)`를 실행하면 정확히 무엇이 일어나나요?

**A.** 다음처럼 현재 지역 변수에 직접 대입하는 것이 아닙니다.

``` ts
orders = parsedOrders; // 이런 의미가 아님
```

대신 React에 state 업데이트를 요청합니다.

``` tsx
setOrders(parsedOrders);
```

개념적으로:

``` text
현재 렌더링
orders = []

↓ setOrders(parsedOrders)

React에 state 업데이트 요청

↓
React가 업데이트 처리

↓
다음 렌더링
orders = parsedOrders
```

입니다.

> **팁**
>
> `setSomething()`을 보면 **현재 변수를 즉시 수정한다**가 아니라 **다음
> 렌더링에 사용할 state 업데이트를 요청한다**라고 읽어보세요.

------------------------------------------------------------------------

## Q10. 왜 `setOrders()` 뒤에 재렌더링이 필요한가요?

**A.** 화면이 `orders`를 사용하고 있기 때문입니다.

``` text
처음
orders = []
→ 주문 개수 0

업데이트 후
orders = [주문1, 주문2, 주문3]
→ 주문 개수 3
```

state만 바뀌고 UI를 다시 계산하지 않으면 화면에는 계속 `0`이 남습니다.
따라서 React는 새로운 state를 기준으로 컴포넌트를 다시 렌더링합니다.

> **팁**
>
> **state는 UI의 재료이고, 재료가 바뀌었으니 UI를 다시 계산한다**고
> 이해하면 됩니다.

------------------------------------------------------------------------

## Q11. 재렌더링되면 컴포넌트 함수도 다시 실행되나요?

**A.** 네. 컴포넌트 함수는 다시 실행됩니다.

하지만 함수가 다시 실행된다고 해서 React가 관리하던 state가 매번
초기화되는 것은 아닙니다.

``` text
첫 렌더링
useState([])
↓
orders = []

setOrders([A,B])

재렌더링
useState([]) 다시 호출
↓
기존 state가 있음
↓
orders = [A,B]
```

> **팁**
>
> **함수 재실행**과 **state 초기화**를 서로 다른 개념으로 구분하세요.

------------------------------------------------------------------------

## Q12. `useState([])`가 다시 실행되는데 왜 `orders`가 다시 `[]`가 되지 않나요?

**A.** `[]`는 매 렌더링마다 덮어쓸 값이 아니라 **state를 처음 만들 때
사용하는 초기값**이기 때문입니다.

``` text
최초 렌더링
기존 state 없음
↓
초기값 [] 사용

재렌더링
기존 state 있음
↓
현재 저장된 state 사용
```

React가 렌더링 사이에서 해당 state를 유지합니다.

> **팁**
>
> `useState(initialValue)`에서 중요한 단어는 `initial`, 즉
> **최초**입니다.

------------------------------------------------------------------------

## Q13. 일반 변수와 React state는 무엇이 다른가요?

**A.** 일반 지역변수는 함수 실행에 속합니다.

``` tsx
let count = 0;
```

함수가 새로 실행되면 해당 지역변수도 새롭게 만들어집니다.

반면:

``` tsx
const [count, setCount] = useState(0);
```

의 state는 React가 렌더링 사이에서 유지하며, state 업데이트는 UI
재렌더링과 연결됩니다.

``` text
일반 지역변수
→ 함수 실행에 속함

React state
→ React가 렌더링 사이에서 유지
→ 업데이트가 UI 재계산과 연결됨
```

> **팁**
>
> 장바구니 수량, 주문 목록, 로딩 여부처럼 **시간에 따라 변하고 화면에도
> 영향을 주는 값**을 볼 때 state를 떠올리세요.

------------------------------------------------------------------------

## Q14. state를 snapshot이라고 보는 것은 무슨 뜻인가요?

**A.** 컴포넌트가 한 번 렌더링될 때 사용하는 state 값을 **그 렌더링
시점의 스냅샷**처럼 이해하는 것입니다.

현재 렌더링이:

``` text
orders = []
```

를 받았다면 그 렌더링에서 만들어진 코드가 읽는 `orders`는 그 시점의 값을
기준으로 합니다.

`setOrders()`는 그 현재 snapshot을 직접 고쳐버리는 것이 아니라 새로운
state를 사용하는 **다음 렌더링**으로 연결합니다.

``` text
현재 렌더링 snapshot
orders = []

↓ setOrders([A,B])

다음 state 업데이트 요청

↓ 재렌더링

새 snapshot
orders = [A,B]
```

> **팁**
>
> React state가 헷갈릴 때 **현재 렌더링의 값인가, 다음 렌더링의
> 값인가?**를 물어보세요.

------------------------------------------------------------------------

## Q15. 왜 `setOrders(parsedOrders)` 직후 `console.log(orders)`는 이전 값을 보여줄 수 있나요?

**A.** 그 `console.log()`가 아직 **현재 렌더링의 state snapshot**을 보고
있기 때문입니다.

``` tsx
setOrders(parsedOrders);
console.log(orders);
```

처음 `orders = []`였다면:

``` text
현재 렌더링
orders = []

↓ setOrders([A,B])

state 업데이트 요청

↓ console.log(orders)

현재 snapshot이므로 []
```

그 후 React가 업데이트를 처리하면:

``` text
다음 렌더링
orders = [A,B]
```

가 됩니다.

> **팁**
>
> 방금 `JSON.parse()`한 데이터를 즉시 확인하려면
> `console.log(parsedOrders)`가 더 직접적입니다.

------------------------------------------------------------------------

## Q16. 업데이트된 `orders` 자체를 관찰하려면 어떻게 하나요?

**A.** 학습이나 디버깅 목적으로 다음처럼 `orders`를 dependency로 둔
effect를 사용할 수 있습니다.

``` tsx
useEffect(() => {
  console.log("orders 변경:", orders);
}, [orders]);
```

`orders`가 변경된 렌더링 이후 effect가 실행되므로 새 state를 관찰할 수
있습니다.

> **팁**
>
> 이것은 **관찰용 예제**입니다. state가 바뀔 때마다 무조건 effect를
> 만들어야 한다는 의미는 아닙니다.

------------------------------------------------------------------------

## Q17. `useEffect(..., [])`의 `[]`는 무엇인가요?

**A.** dependency array, 즉 의존성 배열입니다.

``` tsx
useEffect(() => {
  // localStorage 읽기
}, []);
```

현재 패턴에서는 빈 의존성 배열을 사용하여 마운트 이후 수행할 effect를
표현합니다.

반면:

``` tsx
useEffect(() => {
  console.log(orders);
}, [orders]);
```

에서는 `orders`가 의존성입니다.

> **팁**
>
> `[] = 무조건 딱 한 번`이라고만 외우지 말고 **의존성 배열이 비어
> 있다**는 개념부터 이해하세요. 개발 환경의 React Strict Mode에서는
> effect가 추가로 실행되는 것처럼 관찰될 수도 있습니다.

------------------------------------------------------------------------

## Q18. mount, re-render, remount는 어떻게 다른가요?

**A.**

``` text
mount
→ 컴포넌트가 처음 등장

re-render
→ 같은 컴포넌트가 현재 props/state를 기준으로 다시 계산

unmount
→ 컴포넌트가 제거됨

remount
→ 제거된 뒤 새로운 컴포넌트 인스턴스로 다시 등장
```

재렌더링에서는 일반적으로 state가 유지됩니다.

하지만 컴포넌트가 unmount되어 기존 state가 폐기되고 나중에 새로
mount된다면 `useState`의 초기값으로 새로운 state가 시작될 수 있습니다.

> **팁**
>
> 반드시 `re-render ≠ remount`로 구분하세요.

------------------------------------------------------------------------

## Q19. 왜 `orders = []`와 `loading = true`를 별도로 관리하나요?

**A.** `orders = []` 하나만으로는 현재 상황을 정확히 구분할 수 없기
때문입니다.

``` text
상황 A
아직 localStorage 확인 전
orders = []

상황 B
확인 완료했는데 실제 주문이 없음
orders = []
```

두 상황의 데이터 모양은 똑같습니다.

그래서:

``` tsx
const [loading, setLoading] = useState(true);
```

를 추가하면:

``` text
loading = true
→ 아직 확인 중

loading = false && orders.length === 0
→ 확인 완료 + 실제 주문 없음
```

으로 UI 상태를 구분할 수 있습니다.

> **팁**
>
> state는 데이터 자체뿐 아니라 **데이터를 확인 중인지, 성공했는지, 비어
> 있는지** 같은 UI 상태도 표현할 수 있습니다.

------------------------------------------------------------------------

## Q20. `setCount(count + 1)`을 세 번 실행하면 항상 3 증가하나요?

**A.** 아닙니다. 현재 렌더링에서 `count = 0`이라면:

``` tsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

세 표현 모두 현재 snapshot의 `count = 0`을 기준으로 계산할 수 있습니다.

개념적으로:

``` text
setCount(0 + 1)
setCount(0 + 1)
setCount(0 + 1)
```

입니다.

이전 state를 기준으로 다음 state를 계산해야 한다면 functional updater를
사용합니다.

``` tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

개념적으로:

``` text
0 → 1
1 → 2
2 → 3
```

으로 처리됩니다.

> **팁**
>
> **다음 state가 이전 state에 의존한다면 `setState(prev => ...)`**를
> 떠올리세요. 장바구니 수량 증가에서도 중요한 패턴입니다.

------------------------------------------------------------------------

## Q21. 왜 Hook을 조건문 안에서 호출하면 안 되나요?

**A.** React Hooks는 렌더링마다 일관된 호출 순서를 유지해야 합니다.

``` tsx
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
```

학습용으로 생각하면:

``` text
첫 번째 Hook → orders
두 번째 Hook → loading
```

처럼 연결됩니다.

그런데:

``` tsx
if (something) {
  useState([]);
}
```

처럼 조건에 따라 Hook 자체의 호출 여부가 달라지면 렌더링마다 순서가
흔들릴 수 있습니다.

> **팁**
>
> Hook은 React 컴포넌트나 Custom Hook의 **최상위 레벨에서 호출한다**는
> 기본 규칙을 기억하세요.

------------------------------------------------------------------------

## Q22. 지금까지의 전체 실행 순서를 한 번에 정리하면 어떻게 되나요?

**A.**

``` text
① OrderDetailPage 시작
        ↓
② useState([])로 초기 orders 준비
        ↓
③ 첫 렌더링
        ↓
④ 초기 UI 화면 반영
        ↓
⑤ useEffect 실행
        ↓
⑥ localStorage.getItem("orders")
        ↓
⑦ JSON.parse()
        ↓
⑧ parsedOrders 생성
        ↓
⑨ setOrders(parsedOrders)
        ↓
⑩ React가 state 업데이트 처리
        ↓
⑪ OrderDetailPage 재렌더링
        ↓
⑫ 새로운 orders로 JSX 재계산
        ↓
⑬ 갱신된 UI 화면 반영
```

그리고 앞에서 이미 정리한 URL 흐름과 합치면:

``` text
URL 흐름                         주문 데이터 흐름

/orders/123                     useState([])
    ↓                               ↓
useParams()                     첫 렌더링
    ↓                               ↓
params.id                       useEffect
    ↓                               ↓
Number()                        localStorage
    ↓                               ↓
orderId                         JSON.parse()
                                    ↓
                                setOrders()
                                    ↓
                                재렌더링
                                    ↓
                                  orders[]

              orderId + orders[]
                      ↓
                    find()
                      ↓
                  Order 하나
                      ↓
                  상세 UI
```

> **팁**
>
> Day 7을 코드 암기가 아니라 **두 개의 데이터 흐름이 마지막에 합쳐지는
> 구조**로 설명할 수 있으면 이해가 매우 탄탄해집니다.

------------------------------------------------------------------------

# 最終チェック / Final Check / 최종 체크

### 日本語

自分の言葉で次を説明できるか確認してください。

``` text
localStorage
→ JSON文字列
→ JSON.parse()
→ Order[]
→ setOrders()
→ 再レンダリング
→ 新しいorders

そして

URLのorderId + orders[]
→ find()
→ Order 1件
```

### English

Try to explain this without looking at the code:

``` text
localStorage
→ JSON string
→ JSON.parse()
→ Order[]
→ setOrders()
→ re-render
→ new orders state

then

URL orderId + orders[]
→ find()
→ one Order
```

### 한국어

코드를 보지 않고 다음 흐름을 설명할 수 있는지 확인해보세요.

``` text
localStorage
→ JSON 문자열
→ JSON.parse()
→ Order[]
→ setOrders()
→ 재렌더링
→ 새로운 orders state

그리고

URL의 orderId + orders[]
→ find()
→ 주문 하나
```

> **팁**
>
> 여기까지 자연스럽게 설명할 수 있다면 다음 구현 단계인
> `orders.find(...)`를 배우기 위한 이론 준비가 끝난 것입니다.
