# Day 7 이후 이론 총정리 --- React State / Effect / Render

> **학습 범위:** 이미 정리한 `[id]`, `useParams()`, `Number()`, `NaN`,
> `===` 이후\
> **핵심:**
> `localStorage → JSON.parse() → useState → 첫 렌더링 → useEffect → setState → 재렌더링`\
> **언어 순서:** 日本語 → English → 한국어

------------------------------------------------------------------------

# 日本語

## 1. 全体像

注文詳細ページでは、URLから「どの注文を表示するか」を取得する一方、実際の注文データは
`localStorage` から取得します。

``` text
URL側                         データ側

params.id                     localStorage
   │                              │
   │                         JSON.parse()
   │                              │
   │                           Order[]
   │                              │
   └──────────────┬───────────────┘
                  ↓
                find()
                  ↓
              Order 1件
                  ↓
              詳細UI
```

> **Tip**
>
> URLのIDは「検索条件」、`orders[]` は「検索対象」です。

## 2. `localStorage`

`localStorage` はブラウザが提供するWeb Storage
APIです。値は文字列として保存されます。

保存時:

``` text
Order[]
↓
JSON.stringify()
↓
JSON文字列
↓
localStorage
```

読み込み時:

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
> `stringify = 保存用文字列へ変換`、`parse = JavaScriptデータへ復元`
> と覚えます。

## 3. なぜ `useEffect()` で読むのか

`localStorage`
はブラウザの外部システムです。現在のコードでは、レンダリング後にブラウザ側で
`localStorage` と同期する処理をeffectに置きます。

``` tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");
}, []);
```

`"use client"` はClient Componentの境界を示しますが、`useEffect`
と同じ役割ではありません。

``` text
"use client"
→ Client Componentの境界

useEffect
→ レンダリング後の副作用・外部システムとの同期
```

> **Tip**
>
> `useEffect = localStorage専用`
> ではありません。今回はeffectの中で扱う外部システムが `localStorage`
> です。

## 4. `useState<Order[]>([])`

``` tsx
const [orders, setOrders] = useState<Order[]>([]);
```

意味:

``` text
orders
→ 現在のレンダリングで使用するstate

setOrders
→ state更新をReactへ要求する関数

Order[]
→ TypeScriptの注文配列型

[]
→ stateを最初に作るときの初期値
```

> **Tip**
>
> 初期値 `[]`
> は「注文が存在しない」と確定した値ではなく、「まだ読み込む前」の状態にも使われます。

## 5. 最初のレンダリング

最初は:

``` text
orders = []
```

なので:

``` tsx
<p>{orders.length}</p>
```

は最初に `0` として計算されます。

その後にeffectが実行されます。

``` text
useState([])
↓
最初のレンダリング
↓
画面へ反映
↓
useEffect
```

> **Tip**
>
> 「初期状態」と「データ読み込み完了後の状態」を区別してください。

## 6. `JSON.parse()`

``` tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

`JSON.parse()` はJSON文字列をJavaScriptデータへ復元します。

``` text
'[{"id":100},{"id":200}]'
↓
JSON.parse()
↓
[
  { id: 100 },
  { id: 200 }
]
```

`Order[]` はTypeScriptの型であり、`JSON.parse()`
自体とは役割が異なります。

> **Tip**
>
> `JSON.parse()` = 実行時のデータ変換、`Order[]` =
> TypeScript上の型、と分離して考えます。

## 7. `setOrders()` とstate更新

``` tsx
setOrders(parsedOrders);
```

は:

``` tsx
orders = parsedOrders;
```

という直接代入ではありません。

正しいmental model:

``` text
現在のレンダリング
orders = []

↓
setOrders(parsedOrders)

Reactへstate更新要求

↓
Reactが更新を処理

↓
次のレンダリング
orders = parsedOrders
```

> **Tip**
>
> `setState()`
> は「現在の変数を直接変更」ではなく、「新しいstateを使うレンダリングにつなげる」と考えます。

## 8. 再レンダリング

stateが変わると、そのstateを使うUIを新しい値で再計算する必要があります。

``` text
orders = []
↓
orders.length = 0

setOrders([A, B, C])
↓
再レンダリング

orders = [A, B, C]
↓
orders.length = 3
```

> **Tip**
>
> stateはUIの材料です。材料が変わるとUIも再計算されます。

## 9. なぜ `useState([])` で再び初期化されないのか

再レンダリング時、コンポーネント関数は再び実行されます。しかしReactはstateをレンダリング間で保持します。

``` text
初回
useState([])
↓
既存stateなし
↓
[]を初期値として使用

setOrders([A,B])

再レンダリング
useState([])
↓
既存stateあり
↓
[A,B]を使用
```

> **Tip**
>
> `[]` は毎回代入される値ではなく **initial value** です。

## 10. 一般変数とstate

``` text
一般のローカル変数
→ 関数実行に属する

React state
→ Reactがレンダリング間で保持
→ 更新が再レンダリングと接続される
```

> **Tip**
>
> UIに影響しながら変化するデータではstateが重要です。

## 11. State Snapshot

1回のレンダリングが参照するstateは、そのレンダリング時点のsnapshotとして考えられます。

``` text
現在のレンダリング
orders = []

↓
setOrders([A,B])

現在のsnapshotを直接書き換えるのではない

↓
次のレンダリング
orders = [A,B]
```

> **Tip**
>
> 「現在のレンダリングの値か、次のレンダリングの値か」を常に区別します。

## 12. `setOrders()` 直後に古い値が見える理由

``` tsx
setOrders(parsedOrders);
console.log(orders);
```

現在のレンダリングで `orders = []` なら、`console.log(orders)`
はそのsnapshotを参照するため `[]` が見えることがあります。

``` text
orders = []
↓
setOrders([A,B])
↓
更新要求
↓
console.log(orders)
→ []
↓
次のレンダリング
→ orders = [A,B]
```

新しくparseした値をその場で確認するなら:

``` tsx
console.log(parsedOrders);
```

を使えます。

> **Tip**
>
> `setState` の直後の変数を「すでに次のstate」と考えないでください。

## 13. Dependency Array

``` tsx
useEffect(() => {
  // ...
}, []);
```

最後の `[]` はdependency arrayです。

また:

``` tsx
useEffect(() => {
  console.log(orders);
}, [orders]);
```

なら `orders` がdependencyです。

> **Tip**
>
> 空配列を単に「1回だけ」と暗記せず、effectが依存する値を表す配列だと理解します。

## 14. `loading` が必要な理由

``` text
まだデータを確認していない
orders = []

確認したが、本当に注文がない
orders = []
```

この2つは `orders` だけでは区別できません。

そこで:

``` tsx
const [loading, setLoading] = useState(true);
```

を使います。

``` text
loading = true
→ 確認中

loading = false && orders.length === 0
→ 確認完了、本当に注文なし
```

> **Tip**
>
> stateはデータだけでなくUIの「状態」も表現できます。

## 15. Re-render と Remount

``` text
mount
→ 初めて登場

re-render
→ 同じコンポーネントを新しいstateで再計算

unmount
→ コンポーネントを削除

remount
→ 新しいインスタンスとして再び登場
```

re-renderではstateが維持されますが、unmount後に新しくmountされると新しいstateが初期値から作られる場合があります。

> **Tip**
>
> `re-render ≠ remount` を必ず区別します。

## 16. Functional Updater

現在のstateを基準に次のstateを計算するとき:

``` tsx
setCount((prev) => prev + 1);
```

を使えます。

``` tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

は更新処理で前の値を順番に利用できます。

``` text
0 → 1 → 2 → 3
```

> **Tip**
>
> 「次のstateが前のstateに依存する」ならfunctional
> updaterを思い出します。

## 17. Hookの呼び出し順序

Hooksはレンダリングごとに一貫した順序で呼び出す必要があります。

``` tsx
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
```

``` text
Hook 1 → orders
Hook 2 → loading
```

そのためHookを条件によって呼んだり呼ばなかったりする構造は避けます。

> **Tip**
>
> HookはReact ComponentまたはCustom Hookのトップレベルで呼びます。

## 18. 日本語まとめ

``` text
localStorage
↓
JSON文字列
↓
JSON.parse()
↓
Order[]
↓
setOrders()
↓
state更新
↓
再レンダリング
↓
新しいordersでUI計算
```

最終的には:

``` text
URLのorderId
       +
    orders[]
       ↓
     find()
       ↓
   Order 1件
       ↓
   注文詳細UI
```

------------------------------------------------------------------------

# English

## 1. Big Picture

The detail page has two data flows:

``` text
URL side                     Data side

params.id                    localStorage
   │                             │
   │                         JSON.parse()
   │                             │
   │                          Order[]
   │                             │
   └─────────────┬───────────────┘
                 ↓
               find()
                 ↓
             one Order
                 ↓
             Detail UI
```

> **Tip**
>
> The URL ID is the search condition; `orders[]` is the collection being
> searched.

## 2. `localStorage`

`localStorage` is a browser Web Storage API. Values are stored as
strings.

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
> Think `stringify = prepare for storage`,
> `parse = restore JavaScript data`.

## 3. Why `useEffect()`?

In this project, `localStorage` is an external browser system. The
effect performs the browser-side synchronization after rendering.

``` tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");
}, []);
```

`"use client"` and `useEffect` have different roles.

``` text
"use client"
→ Client Component boundary

useEffect
→ post-render effect / external-system synchronization
```

> **Tip**
>
> `useEffect` is not a localStorage-specific Hook.

## 4. `useState<Order[]>([])`

``` tsx
const [orders, setOrders] = useState<Order[]>([]);
```

``` text
orders
→ state used by the current render

setOrders
→ requests a state update

Order[]
→ TypeScript order-array type

[]
→ initial state value
```

> **Tip**
>
> An initial empty array can mean "not loaded yet," not necessarily "no
> orders exist."

## 5. First Render

Initially:

``` text
orders = []
↓
orders.length = 0
↓
first UI calculation
```

The effect runs afterward.

``` text
useState([])
↓
first render
↓
UI commit
↓
useEffect
```

> **Tip**
>
> Separate the initial state from the state after data loading has
> finished.

## 6. `JSON.parse()`

``` tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

`JSON.parse()` restores JavaScript data from a JSON string.

`Order[]` describes how TypeScript treats the value; it is not the same
operation as runtime parsing.

> **Tip**
>
> Runtime conversion and TypeScript type information are different
> concepts.

## 7. `setOrders()` and State Updates

``` tsx
setOrders(parsedOrders);
```

does not mean:

``` tsx
orders = parsedOrders;
```

Instead:

``` text
current render
orders = []

↓ setOrders(parsedOrders)

request state update

↓ React processes it

next render
orders = parsedOrders
```

> **Tip**
>
> Read a state setter as a request for new state, not direct mutation.

## 8. Re-render

When state changes, React recalculates UI that depends on it.

``` text
orders = []
→ length 0

setOrders([A,B,C])
↓
re-render

orders = [A,B,C]
→ length 3
```

> **Tip**
>
> State is input to the UI. New input can require a new render.

## 9. Why Doesn't `useState([])` Reset the State?

The component function runs again, but React preserves state across
re-renders.

``` text
first render
no state yet
→ use []

update
→ [A,B]

re-render
existing state
→ use [A,B]
```

> **Tip**
>
> `[]` is an initial value, not an every-render assignment.

## 10. Local Variable vs State

``` text
local variable
→ belongs to a function execution

React state
→ preserved across renders
→ connected to UI updates
```

> **Tip**
>
> State is important for changing data that affects the UI.

## 11. State Snapshot

Each render sees a particular state snapshot.

``` text
current render
orders = []

↓ setOrders([A,B])

request another state

↓
next render
orders = [A,B]
```

> **Tip**
>
> Ask whether a value belongs to the current render or the next render.

## 12. Why Can `console.log(orders)` Show the Old Value?

``` tsx
setOrders(parsedOrders);
console.log(orders);
```

The log still reads the current render's snapshot.

``` text
current orders = []
↓
setOrders([A,B])
↓
update requested
↓
console.log(orders)
→ []
↓
next render
orders = [A,B]
```

> **Tip**
>
> To inspect the newly parsed value immediately, log `parsedOrders`.

## 13. Dependency Array

``` tsx
useEffect(() => {
  // ...
}, []);
```

The final array is the dependency array.

``` tsx
useEffect(() => {
  console.log(orders);
}, [orders]);
```

Here `orders` is a dependency.

> **Tip**
>
> Learn the dependency concept rather than only memorizing "empty array
> means once."

## 14. Why `loading` Matters

``` text
not checked yet
orders = []

checked and genuinely empty
orders = []
```

The same data shape can mean two different UI states.

``` text
loading = true
→ checking

loading = false && orders.length === 0
→ finished, no orders
```

> **Tip**
>
> State can represent both data and UI status.

## 15. Re-render vs Remount

``` text
mount
→ first appearance

re-render
→ same component recalculated

unmount
→ component removed

remount
→ a new instance appears
```

> **Tip**
>
> Remember: `re-render ≠ remount`.

## 16. Functional Updater

When the next state depends on the previous state:

``` tsx
setCount((prev) => prev + 1);
```

Multiple updater calls can conceptually process:

``` text
0 → 1 → 2 → 3
```

> **Tip**
>
> Think `setState(prev => ...)` when calculating from previous state.

## 17. Hook Call Order

Hooks need consistent call order across renders.

``` text
Hook 1 → orders
Hook 2 → loading
```

Therefore Hooks should not be conditionally skipped.

> **Tip**
>
> Call Hooks at the top level of React components or custom Hooks.

## 18. English Summary

``` text
localStorage
↓
JSON string
↓
JSON.parse()
↓
Order[]
↓
setOrders()
↓
state update
↓
re-render
↓
UI recalculated with new orders
```

Then:

``` text
URL orderId
    +
 orders[]
    ↓
  find()
    ↓
 one Order
    ↓
 Detail UI
```

------------------------------------------------------------------------

# 한국어

## 1. 전체 그림

주문 상세 페이지에는 두 개의 데이터 흐름이 있습니다.

``` text
URL 쪽                         데이터 쪽

params.id                     localStorage
   │                              │
   │                         JSON.parse()
   │                              │
   │                           Order[]
   │                              │
   └──────────────┬───────────────┘
                  ↓
                find()
                  ↓
              Order 하나
                  ↓
              상세 UI
```

URL은 **어떤 주문을 찾을지** 알려주고, `localStorage`는 **실제 저장된
주문 데이터**를 제공합니다.

> **팁**
>
> `params.id` = 검색 조건, `orders[]` = 검색 대상이라고 생각하세요.

## 2. `localStorage`

`localStorage`는 브라우저의 Web Storage API입니다. 값은 문자열로
저장됩니다.

저장할 때:

``` text
Order[]
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage
```

읽을 때:

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
> `JSON.stringify()`는 저장 방향, `JSON.parse()`는 복원 방향이라고 한
> 세트로 기억하세요.

## 3. 왜 `useEffect()` 안에서 읽는가?

현재 프로젝트에서 `localStorage`는 브라우저의 외부 시스템입니다. 렌더링
이후 이 외부 시스템과 동기화하는 작업을 effect에서 수행합니다.

``` tsx
useEffect(() => {
  const savedOrders = localStorage.getItem("orders");
}, []);
```

그리고:

``` text
"use client"
→ Client Component 경계

useEffect
→ 렌더링 이후 side effect / 외부 시스템 동기화
```

로 역할이 다릅니다.

> **팁**
>
> `useEffect = localStorage용`으로 외우지 마세요. 지금은 effect의 대상이
> `localStorage`일 뿐입니다.

## 4. `useState<Order[]>([])`

``` tsx
const [orders, setOrders] = useState<Order[]>([]);
```

각 부분은:

``` text
orders
→ 현재 렌더링에서 사용하는 state

setOrders
→ state 업데이트를 React에 요청

Order[]
→ TypeScript의 주문 배열 타입

[]
→ 최초 state 생성 시 초기값
```

입니다.

> **팁**
>
> 초기 `[]`는 **주문이 없다는 최종 결론**이 아니라 **아직 데이터를
> 불러오기 전**일 수도 있습니다.

## 5. 첫 렌더링

처음에는:

``` text
orders = []
```

이므로:

``` tsx
<p>{orders.length}</p>
```

는 `0`으로 계산됩니다.

흐름:

``` text
useState([])
↓
첫 렌더링
↓
화면 반영
↓
useEffect
```

> **팁**
>
> **초기 상태**와 **데이터 확인이 끝난 상태**를 구분해서 생각하세요.

## 6. `JSON.parse()`

``` tsx
const parsedOrders: Order[] = JSON.parse(savedOrders);
```

`JSON.parse()`는 JSON 문자열을 JavaScript 데이터로 복원합니다.

``` text
'[{"id":100},{"id":200}]'
↓
JSON.parse()
↓
[
  { id: 100 },
  { id: 200 }
]
```

여기서 `Order[]`는 TypeScript 타입입니다.

> **팁**
>
> `JSON.parse()`는 실제 데이터 변환, `Order[]`는 TypeScript의 타입
> 정보입니다. 둘을 같은 역할로 생각하지 마세요.

## 7. `setOrders()`와 state 업데이트

``` tsx
setOrders(parsedOrders);
```

는:

``` tsx
orders = parsedOrders;
```

와 같은 직접 대입이 아닙니다.

``` text
현재 렌더링
orders = []

↓
setOrders(parsedOrders)

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
> `setOrders()`를 **현재 변수 수정**이 아니라 **새 state를 사용할 다음
> 렌더링으로 연결하는 요청**이라고 이해하세요.

## 8. 재렌더링

state가 변경되면 새로운 state로 UI를 다시 계산합니다.

``` text
orders = []
→ orders.length = 0

setOrders([A,B,C])
↓
재렌더링

orders = [A,B,C]
→ orders.length = 3
```

> **팁**
>
> state = UI의 재료입니다. 재료가 바뀌면 화면 계산도 바뀝니다.

## 9. 왜 `useState([])`가 다시 `[]`로 만들지 않는가?

재렌더링 시 컴포넌트 함수는 다시 실행되지만 React가 state를 렌더링
사이에서 유지합니다.

``` text
첫 렌더링
기존 state 없음
↓
초기값 [] 사용

setOrders([A,B])

재렌더링
기존 state 있음
↓
현재 state [A,B] 사용
```

> **팁**
>
> `useState(initialValue)`의 `initial`에 집중하세요. 초기값이지 매
> 렌더링 대입값이 아닙니다.

## 10. 일반 변수와 state

``` text
일반 지역변수
→ 함수 실행에 속함

React state
→ React가 렌더링 사이에서 유지
→ 업데이트가 재렌더링과 연결됨
```

> **팁**
>
> 장바구니 수량, 주문 목록, 로딩 상태처럼 변하면서 UI에 영향을 주는
> 값에서 state가 중요합니다.

## 11. State Snapshot

한 번의 렌더링에서 읽는 state를 그 렌더링 시점의 **snapshot**으로 생각할
수 있습니다.

``` text
현재 렌더링
orders = []

↓
setOrders([A,B])

현재 snapshot을 직접 수정하는 것이 아님

↓
다음 렌더링
orders = [A,B]
```

> **팁**
>
> React state가 헷갈리면 **현재 렌더링 값인지 다음 렌더링 값인지** 먼저
> 구분하세요.

## 12. `setOrders()` 직후 이전 값이 보이는 이유

``` tsx
setOrders(parsedOrders);
console.log(orders);
```

현재 렌더링의 `orders`가 `[]`였다면 `console.log(orders)`는 그
snapshot을 읽기 때문에 이전 값이 보일 수 있습니다.

``` text
orders = []
↓
setOrders([A,B])
↓
업데이트 요청
↓
console.log(orders)
→ []
↓
다음 렌더링
orders = [A,B]
```

방금 만든 데이터를 즉시 보고 싶다면:

``` tsx
console.log(parsedOrders);
```

가 더 직접적입니다.

> **팁**
>
> setter 바로 다음 줄이라고 해서 state 변수가 이미 다음 렌더링 값으로
> 바뀌었다고 생각하지 마세요.

## 13. Dependency Array

``` tsx
useEffect(() => {
  // ...
}, []);
```

마지막 `[]`는 dependency array입니다.

``` tsx
useEffect(() => {
  console.log(orders);
}, [orders]);
```

라면 `orders`가 dependency입니다.

> **팁**
>
> `[]`를 단순히 **딱 한 번 실행시키는 기호**로 외우지 말고 effect의
> 의존성을 표현하는 배열이라고 이해하세요.

## 14. `loading`이 필요한 이유

다음 두 상황을 보세요.

``` text
아직 localStorage 확인 전
orders = []

확인했는데 실제 주문 없음
orders = []
```

`orders`만 보면 똑같습니다.

그래서:

``` tsx
const [loading, setLoading] = useState(true);
```

를 따로 관리하면:

``` text
loading = true
→ 확인 중

loading = false && orders.length === 0
→ 확인 완료 + 실제 주문 없음
```

으로 구분할 수 있습니다.

> **팁**
>
> state는 데이터뿐 아니라 **UI가 현재 어떤 단계인지**도 표현합니다.

## 15. Re-render와 Remount

``` text
mount
→ 컴포넌트 최초 등장

re-render
→ 같은 컴포넌트를 새로운 state로 다시 계산

unmount
→ 컴포넌트 제거

remount
→ 새로운 인스턴스로 다시 등장
```

재렌더링에서는 state가 유지됩니다. 반면 기존 컴포넌트가 제거되고 새로
마운트되면 새로운 state가 초기값으로 시작할 수 있습니다.

> **팁**
>
> `re-render ≠ remount`를 반드시 구분하세요.

## 16. Functional Updater

다음 state가 이전 state에 의존한다면:

``` tsx
setCount((prev) => prev + 1);
```

패턴이 중요합니다.

``` tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

개념적으로:

``` text
0 → 1 → 2 → 3
```

처럼 이전 업데이트 결과를 이용해 계산합니다.

> **팁**
>
> **이전 state로 다음 state를 계산한다 → functional updater**라고
> 연결하세요.

## 17. Hook 호출 순서

Hooks는 렌더링마다 일관된 순서로 호출되어야 합니다.

``` tsx
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
```

개념적으로:

``` text
Hook 1 → orders
Hook 2 → loading
```

이 순서가 유지됩니다.

> **팁**
>
> Hook은 React Component 또는 Custom Hook의 최상위 레벨에서 호출하는
> 기본 규칙을 지키세요.

## 18. 전체 실행 순서

``` text
① OrderDetailPage 실행
        ↓
② useState([]) 초기 state
        ↓
③ 첫 렌더링
        ↓
④ 화면 반영
        ↓
⑤ useEffect 실행
        ↓
⑥ localStorage.getItem()
        ↓
⑦ JSON.parse()
        ↓
⑧ parsedOrders
        ↓
⑨ setOrders(parsedOrders)
        ↓
⑩ React state 업데이트
        ↓
⑪ 재렌더링
        ↓
⑫ 새로운 orders로 JSX 계산
        ↓
⑬ 갱신된 UI
```

그리고 앞에서 배운 URL 흐름과 합치면:

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
                  주문 상세 UI
```

## 최종 핵심 문장

**`useState`로 초기 state를 준비하고 → 첫 렌더링을 수행한 뒤 →
`useEffect`에서 `localStorage`의 JSON 문자열을 읽어 `JSON.parse()`로
복원하고 → `setOrders()`로 state 업데이트를 요청하면 → React가
재렌더링하여 새로운 `orders`로 UI를 계산한다. 이후 URL에서 얻은
`orderId`와 `orders[]`를 `find()`로 연결해 특정 주문 하나를 찾는다.**

> **팁**
>
> 이 문장을 코드 없이 설명할 수 있으면, 다음 `find()` 구현 단계로
> 넘어가기 위한 이론적 연결이 완성된 것입니다.
