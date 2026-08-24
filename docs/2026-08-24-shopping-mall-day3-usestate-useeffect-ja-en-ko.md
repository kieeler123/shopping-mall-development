# useState と useEffect の連携 --- Shopping Mall Day 3

# How useState and useEffect Work Together --- Shopping Mall Day 3

# useState와 useEffect의 연동 --- Shopping Mall Day 3

------------------------------------------------------------------------

# 日本語

## 1. 今回理解すること

Day 3の `/cart` ページでは、`localStorage`
に保存したカートデータを読み込み、Reactの画面へ表示する。

現在の中心コードは次の形である。

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    return;
  }

  const parsedCart: CartItem[] = JSON.parse(savedCart);

  setCart(parsedCart);
}, []);
```

ここで `useState` と `useEffect` は同じ仕事をしているわけではない。

``` text
useState
→ 値をReactに記憶させる

useEffect
→ 特定のタイミングで処理を実行する
```

今回のカートでは、この2つが次のようにつながる。

``` text
useEffect
↓
localStorageを読む
↓
JSON.parse()
↓
setCart()
↓
cart stateが変わる
↓
Reactが再レンダリング
↓
保存されたカートが画面に表示される
```

> **Tip** `useState` と `useEffect`
> をセットの文法として暗記せず、それぞれの責任を分けて理解する。

------------------------------------------------------------------------

## 2. `useState` の役割

まず次のコードを見る。

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

これはReactに「カートという状態を記憶してほしい」と伝えている。

それぞれの役割は次の通り。

``` text
cart
→ 現在のカート状態

setCart
→ cartを変更するための関数

CartItem[]
→ cartに入るデータの型

[]
→ 最初の状態
```

つまり最初は、

``` ts
cart = [];
```

という状態から始まる。

まだ `localStorage` のデータを読み込んだわけではない。

> **Tip** `useState([])` の `[]`
> は保存されたカートではなく、最初のレンダリングでReactが使用する初期値である。

------------------------------------------------------------------------

## 3. 最初のレンダリング

`CartPage` が初めて実行されると、まず `useState`
の初期値を使って画面を作る。

``` text
CartPage実行
↓
useState<CartItem[]>([])
↓
cart = []
↓
最初のレンダリング
```

例えばJSXが次のようになっているとする。

``` tsx
<pre>
  {JSON.stringify(cart, null, 2)}
</pre>
```

最初のレンダリングでは `cart`
が空配列なので、まだ保存済みの商品はstateへ入っていない。

> **Tip**
> Reactでは「保存データを全部準備してから最初の画面を作る」とは限らない。今回の構造ではまず初期状態でレンダリングし、その後ブラウザ側の保存データを読む。

------------------------------------------------------------------------

## 4. `useEffect` の役割

次にこのコードがある。

``` tsx
useEffect(() => {
  // 処理
}, []);
```

今回の `/cart` ページでは、最初のレンダリング後にブラウザ側の
`localStorage` を読むために使っている。

``` text
最初のレンダリング
↓
useEffect
↓
localStorageへアクセス
```

`localStorage` はブラウザAPIなので、今回のClient
Componentではブラウザ側で実行される処理として扱う。

> **Tip** 今の段階では `useEffect`
> を「何でも入れる場所」と考えず、「レンダリング後に必要なブラウザ側の処理を実行する場所」として理解する。

------------------------------------------------------------------------

## 5. `localStorage` からデータを取得する

`useEffect` の中で次を実行する。

``` tsx
const savedCart = localStorage.getItem("cart");
```

例えば保存されているカートが、

``` json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

なら、`savedCart` はJavaScript配列ではなくJSON文字列として取得される。

概念的には、

``` text
savedCart

'[{"productId":1,"quantity":2}]'
```

である。

また `"cart"` が存在しない場合は `null` になる。

``` text
localStorage.getItem("cart")

├─ データあり → string
└─ データなし → null
```

> **Tip** `getItem()` の直後はまだ `CartItem[]`
> ではない。「保存されていた文字列を取得した段階」と考える。

------------------------------------------------------------------------

## 6. 保存データがない場合

次のコードで確認する。

``` tsx
if (!savedCart) {
  return;
}
```

保存データがなければ、その `useEffect` の処理をそこで終了する。

この場合、

``` tsx
setCart(...)
```

は実行されない。

したがって `cart` は初期値の、

``` ts
[]
```

を維持する。

``` text
savedCart = null
↓
return
↓
setCartは実行されない
↓
cart = []
```

> **Tip** UIだけでなく保存データにもEmpty
> Stateがある。初回利用者ではカートデータ自体が存在しない可能性を考える。

------------------------------------------------------------------------

## 7. `JSON.parse()` で配列へ戻す

保存データが存在した場合は、

``` tsx
const parsedCart: CartItem[] = JSON.parse(savedCart);
```

を実行する。

変換は、

``` text
JSON string

'[{"productId":1,"quantity":2}]'

↓ JSON.parse()

JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]
```

となる。

ここで `parsedCart` という変数には配列が入った。

しかし重要なのは、この時点ではReactの `cart`
stateそのものを変更したわけではないという点である。

``` text
parsedCart
→ 読み込んで変換したJavaScript配列

cart
→ Reactが現在記憶しているstate
```

> **Tip** 普通の変数 `parsedCart` とReact stateの `cart`
> を区別する。変数に値が入っただけでは、Reactの画面用stateは変更されない。

------------------------------------------------------------------------

## 8. `setCart(parsedCart)` が接続点

次のコードが非常に重要である。

``` tsx
setCart(parsedCart);
```

これによって、

``` text
以前のcart

[]

↓ setCart(parsedCart)

新しいcart

[
  {
    productId: 1,
    quantity: 2
  }
]
```

となる。

`setCart()` は単なる変数への代入ではない。

Reactに「cart stateを新しい値へ更新してほしい」と伝える。

stateが更新されると、Reactは新しいstateを利用してコンポーネントを再レンダリングする。

> **Tip** `setCart()`
> は「値を入れる」だけではなく、「stateを更新し、その結果をUIへ反映させる流れを開始する」と理解する。

------------------------------------------------------------------------

## 9. 再レンダリングとは何か

`setCart(parsedCart)` によって `cart`
が変わると、Reactはコンポーネントをもう一度レンダリングする。

最初は、

``` text
cart = []
```

だった。

その後、

``` text
cart = [
  {
    productId: 1,
    quantity: 2
  }
]
```

になる。

JSXが、

``` tsx
<pre>
  {JSON.stringify(cart, null, 2)}
</pre>
```

なら、新しい `cart` の内容を使って画面が更新される。

``` text
state変更
↓
再レンダリング
↓
新しいcartを使ってJSXを評価
↓
画面更新
```

> **Tip**
> Reactのstateを理解するときは「値を保存する機能」だけでなく、「値が変わったときにUIを更新する仕組み」とセットで考える。

------------------------------------------------------------------------

## 10. 全体の実行順序

今回の `/cart` ページを時間順に並べると次のようになる。

``` text
① CartPageが実行される
↓
② useState([]) が初期stateを作る
↓
③ cart = []
↓
④ 最初のレンダリング
↓
⑤ useEffectが実行される
↓
⑥ localStorage.getItem("cart")
↓
⑦ savedCartを取得
↓
⑧ JSON.parse(savedCart)
↓
⑨ parsedCartを作る
↓
⑩ setCart(parsedCart)
↓
⑪ cart stateが更新される
↓
⑫ CartPageが再レンダリングされる
↓
⑬ 保存されたカート内容が画面へ反映される
```

> **Tip**
> この13段階を丸暗記する必要はない。`初期レンダリング → effect → 保存データ取得 → state更新 → 再レンダリング`
> の5段階で大きく覚える。

------------------------------------------------------------------------

## 11. なぜ普通の変数ではなく `useState` なのか

例えば次のように普通の変数だけを使うことを考える。

``` tsx
let cart = [];

useEffect(() => {
  cart = JSON.parse(savedCart);
}, []);
```

JavaScript上で変数へ値を代入すること自体はできる。

しかし、Reactにとって重要なのは「画面をいつ更新するべきか」である。

普通の変数を書き換えただけでは、React stateの更新として扱われない。

一方、

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

を使い、

``` tsx
setCart(parsedCart);
```

を実行すると、Reactのstate更新として処理される。

``` text
普通の変数
↓
値は変更できる
↓
React stateの更新ではない


useState
↓
setCart()
↓
React state更新
↓
再レンダリング
↓
UIへ反映
```

> **Tip**
> 「値が変わった結果、画面も変わってほしい」データならstateが必要かどうかを考える。

------------------------------------------------------------------------

## 12. `useState` と `useEffect` の責任を分ける

今回使っている各要素を整理すると次のようになる。

  要素                       責任
  -------------------------- ------------------------------------------------
  `useState`                 カートデータをReactのstateとして保持する
  `cart`                     現在のカートstate
  `setCart`                  `cart` stateを更新する
  `useEffect`                レンダリング後に保存データを読む処理を実行する
  `localStorage.getItem()`   ブラウザ保存領域から文字列を取得する
  `JSON.parse()`             JSON文字列をJavaScriptデータへ戻す
  `setCart(parsedCart)`      復元したデータをReact stateへ反映する

> **Tip**
> 1つのコードとして暗記するのではなく、「保存領域」「データ変換」「React
> state」「画面更新」という責任に分解する。

------------------------------------------------------------------------

## 13. データフローとして理解する

今回の処理は次のデータフローになっている。

``` text
localStorage
   │
   │ getItem()
   ▼
savedCart
string
   │
   │ JSON.parse()
   ▼
parsedCart
CartItem[]
   │
   │ setCart()
   ▼
cart state
CartItem[]
   │
   │ React render
   ▼
画面
```

そして各Hookの役割は、

``` text
useEffect
→ この読み込み処理を開始する

useState
→ 読み込んだ結果をReactが記憶し、画面へ接続する
```

と整理できる。

> **Tip**
> Reactコードが複雑に見えたら、構文ではなく「データがどこから来て、どこへ移動するか」を矢印で書いてみる。

------------------------------------------------------------------------

## 14. Day 3全体とのつながり

商品詳細側では、

``` text
ユーザーが数量を選ぶ
↓
CartItemを作る
↓
JSON.stringify()
↓
localStorageへ保存
```

という流れだった。

カートページでは逆方向に、

``` text
localStorage
↓
getItem()
↓
JSON.parse()
↓
CartItem[]
↓
setCart()
↓
画面表示
```

となる。

つまりDay 3では、

``` text
商品詳細
↓
React state
↓
localStorageへ保存
↓
/cart
↓
localStorageから読み込み
↓
React state
↓
画面表示
```

という一連の状態の流れを経験している。

> **Tip**
> `useState`、`useEffect`、`localStorage`、JSONを別々の知識として覚えず、1つのカートデータがどこを移動しているのかでつなげる。

------------------------------------------------------------------------

# English

## 1. What We Are Trying to Understand

On the Day 3 `/cart` page, we read the cart saved in `localStorage` and
display it through React.

The central code currently looks like this:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    return;
  }

  const parsedCart: CartItem[] = JSON.parse(savedCart);

  setCart(parsedCart);
}, []);
```

`useState` and `useEffect` do not have the same responsibility.

``` text
useState
→ remembers a value as React state

useEffect
→ runs a side-effecting operation at the appropriate point
```

For this cart flow:

``` text
useEffect
↓
read localStorage
↓
JSON.parse()
↓
setCart()
↓
cart state changes
↓
React renders again
↓
saved cart appears in the UI
```

> **Tip** Do not memorize `useState` and `useEffect` as a fixed pair.
> Understand what responsibility each one has.

------------------------------------------------------------------------

## 2. The Role of `useState`

Consider:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

The pieces mean:

``` text
cart
→ current cart state

setCart
→ function used to update cart state

CartItem[]
→ type of data stored in cart

[]
→ initial state
```

The component therefore begins with:

``` ts
cart = [];
```

This does not mean that `localStorage` was already read. It is simply
React's initial state.

> **Tip** Think of `[]` as the temporary starting value used for the
> first render, not as the value loaded from browser storage.

------------------------------------------------------------------------

## 3. The First Render

When `CartPage` runs for the first time:

``` text
CartPage runs
↓
useState<CartItem[]>([])
↓
cart = []
↓
first render
```

If the JSX contains:

``` tsx
<pre>
  {JSON.stringify(cart, null, 2)}
</pre>
```

the first render uses the empty array because the stored cart has not
yet been copied into React state.

> **Tip** In this structure, React does not wait for browser storage
> before performing the initial render. It renders the initial state
> first.

------------------------------------------------------------------------

## 4. The Role of `useEffect`

Next we have:

``` tsx
useEffect(() => {
  // work
}, []);
```

In this Day 3 implementation, it is used to read browser-side
`localStorage` after the component has rendered.

``` text
first render
↓
useEffect
↓
access localStorage
```

Because `localStorage` is a browser API, this operation belongs to
browser-side behavior in this Client Component.

> **Tip** At this stage, do not think of `useEffect` as a generic place
> for arbitrary code. Associate it with work that needs to happen after
> rendering, such as this browser-storage read.

------------------------------------------------------------------------

## 5. Reading from `localStorage`

Inside the effect:

``` tsx
const savedCart = localStorage.getItem("cart");
```

Suppose the stored cart represents:

``` json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

`savedCart` is retrieved as a string rather than a JavaScript array.

Conceptually:

``` text
savedCart

'[{"productId":1,"quantity":2}]'
```

If the `"cart"` key does not exist, the result is `null`.

``` text
localStorage.getItem("cart")

├─ value exists → string
└─ no value     → null
```

> **Tip** Immediately after `getItem()`, think "stored text," not
> "CartItem array."

------------------------------------------------------------------------

## 6. When There Is No Saved Cart

The code checks:

``` tsx
if (!savedCart) {
  return;
}
```

If no cart exists, the effect ends there.

`setCart()` is not called, so React keeps:

``` ts
cart = [];
```

The flow is:

``` text
savedCart = null
↓
return
↓
setCart is not called
↓
cart remains []
```

> **Tip** Storage has an empty state too. A new user may have no cart
> key at all.

------------------------------------------------------------------------

## 7. Restoring the Array with `JSON.parse()`

When saved data exists:

``` tsx
const parsedCart: CartItem[] = JSON.parse(savedCart);
```

The conversion is:

``` text
JSON string

'[{"productId":1,"quantity":2}]'

↓ JSON.parse()

JavaScript Array

[
  {
    productId: 1,
    quantity: 2
  }
]
```

Now `parsedCart` contains a JavaScript array.

However, React's `cart` state has not yet been updated.

``` text
parsedCart
→ ordinary JavaScript variable containing restored data

cart
→ current React state
```

> **Tip** Distinguish an ordinary variable from React state. Creating
> `parsedCart` alone does not update the state used by the UI.

------------------------------------------------------------------------

## 8. `setCart(parsedCart)` Connects the Data to React

This line is the connection point:

``` tsx
setCart(parsedCart);
```

The state changes conceptually from:

``` text
old cart

[]

↓ setCart(parsedCart)

new cart

[
  {
    productId: 1,
    quantity: 2
  }
]
```

`setCart()` is not ordinary assignment. It requests a React state
update.

Once the state is updated, React renders the component using the new
state.

> **Tip** Think of `setCart()` as both updating React state and starting
> the process that allows the UI to reflect that new state.

------------------------------------------------------------------------

## 9. What Re-rendering Means Here

Initially:

``` text
cart = []
```

After the saved data is loaded:

``` text
cart = [
  {
    productId: 1,
    quantity: 2
  }
]
```

If JSX depends on `cart`, React evaluates that JSX again using the
updated state.

``` text
state update
↓
re-render
↓
evaluate JSX with the new cart
↓
update the UI
```

> **Tip** `useState` is not only about remembering a value. Its
> importance in React is also that state changes participate in
> rendering the UI.

------------------------------------------------------------------------

## 10. Complete Execution Order

The current `/cart` flow can be traced in time:

``` text
1. CartPage runs
↓
2. useState([]) creates the initial state
↓
3. cart = []
↓
4. first render
↓
5. useEffect runs
↓
6. localStorage.getItem("cart")
↓
7. savedCart is retrieved
↓
8. JSON.parse(savedCart)
↓
9. parsedCart is created
↓
10. setCart(parsedCart)
↓
11. cart state is updated
↓
12. CartPage renders again
↓
13. the saved cart is reflected in the UI
```

> **Tip** You do not need to memorize all thirteen steps. Reduce them to
> five: initial render → effect → read storage → update state →
> re-render.

------------------------------------------------------------------------

## 11. Why Not Use a Normal Variable?

You might imagine:

``` tsx
let cart = [];

useEffect(() => {
  cart = JSON.parse(savedCart);
}, []);
```

JavaScript can assign a new value to that variable, but changing an
ordinary variable is not the same as updating React state.

With:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

and:

``` tsx
setCart(parsedCart);
```

React knows that its state has changed.

``` text
ordinary variable
↓
value can change
↓
not a React state update


useState
↓
setCart()
↓
React state update
↓
re-render
↓
UI reflects the new value
```

> **Tip** When a changing value should cause the screen to change, ask
> whether that value belongs in React state.

------------------------------------------------------------------------

## 12. Separating Responsibilities

  Element                    Responsibility
  -------------------------- -----------------------------------------------
  `useState`                 Holds cart data as React state
  `cart`                     Current cart state
  `setCart`                  Updates cart state
  `useEffect`                Runs the storage-loading work after rendering
  `localStorage.getItem()`   Retrieves the stored string
  `JSON.parse()`             Restores JavaScript data from the JSON string
  `setCart(parsedCart)`      Places restored data into React state

> **Tip** Break the code into storage access, data conversion, React
> state, and rendering responsibilities.

------------------------------------------------------------------------

## 13. Understanding It as Data Flow

The entire flow can be visualized as:

``` text
localStorage
   │
   │ getItem()
   ▼
savedCart
string
   │
   │ JSON.parse()
   ▼
parsedCart
CartItem[]
   │
   │ setCart()
   ▼
cart state
CartItem[]
   │
   │ React render
   ▼
UI
```

The Hooks have different roles:

``` text
useEffect
→ starts the browser-storage loading work

useState
→ lets React remember the result and connect it to rendering
```

> **Tip** When React code feels complicated, draw where the data comes
> from and where it moves instead of focusing only on syntax.

------------------------------------------------------------------------

## 14. Connection to the Whole Day 3 Flow

On the product-detail side:

``` text
user selects quantity
↓
create CartItem
↓
JSON.stringify()
↓
save to localStorage
```

On the cart-page side:

``` text
localStorage
↓
getItem()
↓
JSON.parse()
↓
CartItem[]
↓
setCart()
↓
render
```

Together:

``` text
product detail
↓
React state
↓
save to localStorage
↓
/cart
↓
read from localStorage
↓
React state
↓
UI
```

> **Tip** Treat `useState`, `useEffect`, JSON, and `localStorage` as
> parts of one cart data flow rather than isolated topics.

------------------------------------------------------------------------

# 한국어

## 1. 이번에 이해할 핵심

Day 3의 `/cart` 페이지에서는 `localStorage`에 저장한 장바구니 데이터를
읽어서 React 화면에 보여주고 있다.

현재 핵심 코드는 다음과 같다.

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    return;
  }

  const parsedCart: CartItem[] = JSON.parse(savedCart);

  setCart(parsedCart);
}, []);
```

여기서 `useState`와 `useEffect`는 같은 일을 하는 것이 아니다.

``` text
useState
→ React가 값을 기억하도록 한다

useEffect
→ 필요한 시점에 특정 작업을 실행한다
```

현재 장바구니에서는 둘이 다음처럼 연결된다.

``` text
useEffect
↓
localStorage 읽기
↓
JSON.parse()
↓
setCart()
↓
cart state 변경
↓
React 재렌더링
↓
저장된 장바구니가 화면에 표시
```

> **팁** `useState + useEffect`를 하나의 공식처럼 외우지 말고 각각 무슨
> 책임을 담당하는지 분리해서 이해한다.

------------------------------------------------------------------------

## 2. `useState`의 역할

먼저:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

를 살펴본다.

각각의 역할은:

``` text
cart
→ 현재 장바구니 상태

setCart
→ cart 상태를 변경하는 함수

CartItem[]
→ cart에 들어갈 데이터의 타입

[]
→ 처음 상태
```

이다.

따라서 페이지가 처음 시작할 때는:

``` ts
cart = [];
```

상태다.

이 `[]`는 `localStorage`에서 읽어온 값이 아니다.

아직 저장 데이터를 읽기 전 React가 첫 화면을 만들기 위해 사용하는 초기
상태다.

> **팁** `useState([])`의 빈 배열은 `저장된 장바구니가 비어 있다`는
> 결론이 아니라 `아직 읽기 전이므로 일단 빈 배열로 시작한다`는
> 초기값이라고 이해한다.

------------------------------------------------------------------------

## 3. 첫 번째 렌더링

`CartPage`가 처음 실행되면 먼저 `useState`의 초기값을 이용한다.

``` text
CartPage 실행
↓
useState<CartItem[]>([])
↓
cart = []
↓
첫 번째 렌더링
```

예를 들어 JSX가:

``` tsx
<pre>
  {JSON.stringify(cart, null, 2)}
</pre>
```

라면 첫 렌더링에서는 `cart`가 빈 배열이므로 저장된 상품 데이터가 아직
state에 들어오지 않은 상태로 화면이 만들어진다.

> **팁** 현재 구조에서는 `localStorage를 먼저 읽고 첫 화면을 만든다`가
> 아니라 `초기값으로 첫 화면을 만든 뒤 localStorage를 읽는다` 순서라는
> 점이 중요하다.

------------------------------------------------------------------------

## 4. `useEffect`의 역할

그다음:

``` tsx
useEffect(() => {
  // 실행할 작업
}, []);
```

가 있다.

현재 `/cart` 페이지에서는 첫 렌더링 이후 브라우저의 `localStorage`를
읽는 작업에 사용한다.

``` text
첫 번째 렌더링
↓
useEffect 실행
↓
localStorage 접근
```

`localStorage`는 브라우저 API이므로 현재 Client Component에서 브라우저
측 작업으로 처리한다.

> **팁** 지금 단계에서 `useEffect`를 `아무 코드나 넣는 곳`이라고
> 생각하지 말고 `렌더링 이후 필요한 브라우저 측 작업을 실행하는 곳`으로
> 이해한다.

------------------------------------------------------------------------

## 5. `localStorage`에서 저장 데이터 가져오기

`useEffect` 안에서:

``` tsx
const savedCart = localStorage.getItem("cart");
```

를 실행한다.

저장된 장바구니가:

``` json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

라고 해도 `savedCart`가 바로 JavaScript 배열이 되는 것은 아니다.

개념적으로:

``` text
savedCart

'[{"productId":1,"quantity":2}]'
```

와 같은 문자열이다.

그리고 `"cart"`가 저장되어 있지 않으면 `null`이다.

``` text
localStorage.getItem("cart")

├─ 데이터 있음 → string
└─ 데이터 없음 → null
```

> **팁** `getItem()` 직후에는 `CartItem[]를 가져왔다`고 생각하지 말고
> `저장되어 있던 문자열을 가져왔다`고 생각한다.

------------------------------------------------------------------------

## 6. 저장된 데이터가 없는 경우

다음 코드가 이를 처리한다.

``` tsx
if (!savedCart) {
  return;
}
```

저장 데이터가 없으면 `useEffect` 내부 작업을 종료한다.

따라서:

``` tsx
setCart(...)
```

가 실행되지 않는다.

그러면 `cart`는 처음 상태인:

``` ts
[]
```

을 그대로 유지한다.

``` text
savedCart = null
↓
return
↓
setCart 실행 안 함
↓
cart = []
```

> **팁** Empty State는 화면뿐 아니라 저장소에도 존재한다. 처음 사이트를
> 방문한 사용자는 `"cart"` 자체가 없을 수 있다.

------------------------------------------------------------------------

## 7. `JSON.parse()`로 JavaScript 배열 복원

저장된 데이터가 있다면:

``` tsx
const parsedCart: CartItem[] = JSON.parse(savedCart);
```

를 실행한다.

흐름은:

``` text
JSON 문자열

'[{"productId":1,"quantity":2}]'

↓ JSON.parse()

JavaScript 배열

[
  {
    productId: 1,
    quantity: 2
  }
]
```

이다.

이제 `parsedCart`에는 JavaScript 배열이 들어 있다.

하지만 여기서 중요한 점은 **아직 React의 `cart` state를 변경한 것은
아니라는 것**이다.

``` text
parsedCart
→ 읽어서 변환한 일반 JavaScript 변수

cart
→ React가 현재 기억하고 있는 state
```

> **팁** 일반 변수와 React state를 구분한다. `parsedCart`에 값이
> 생겼다고 해서 React의 `cart`가 자동으로 바뀌는 것은 아니다.

------------------------------------------------------------------------

## 8. `setCart(parsedCart)`가 연결점이다

가장 중요한 부분은:

``` tsx
setCart(parsedCart);
```

이다.

이 코드로:

``` text
기존 cart

[]

↓ setCart(parsedCart)

새로운 cart

[
  {
    productId: 1,
    quantity: 2
  }
]
```

가 된다.

`setCart()`는 일반적인 변수 대입이 아니다.

React에게 `cart state를 새로운 값으로 업데이트해 달라`고 요청한다.

그리고 state가 바뀌면 React는 새로운 state를 사용해 컴포넌트를 다시
렌더링한다.

> **팁** `setCart()`를 단순히 `cart에 값을 넣는 함수`라고만 생각하지
> 말고 `React state를 변경해서 화면 갱신으로 연결하는 함수`라고
> 이해한다.

------------------------------------------------------------------------

## 9. 재렌더링이란 무엇인가

처음에는:

``` text
cart = []
```

이었다.

그런데 `setCart(parsedCart)` 이후에는:

``` text
cart = [
  {
    productId: 1,
    quantity: 2
  }
]
```

가 된다.

JSX에서 `cart`를 사용하고 있다면 React는 새로운 `cart` 값으로 JSX를 다시
계산한다.

``` text
state 변경
↓
재렌더링
↓
새로운 cart로 JSX 계산
↓
화면 갱신
```

예를 들어:

``` tsx
<pre>
  {JSON.stringify(cart, null, 2)}
</pre>
```

도 새로운 `cart` 값을 사용하게 된다.

> **팁** React state는 단순한 데이터 보관함이 아니다.
> `state가 바뀌면 그 state를 사용하는 UI도 다시 계산된다`는 점까지 함께
> 이해해야 한다.

------------------------------------------------------------------------

## 10. 전체 실행 순서

현재 `/cart` 페이지의 실행을 시간 순서로 풀면 다음과 같다.

``` text
① CartPage 실행
↓
② useState([])로 초기 state 생성
↓
③ cart = []
↓
④ 첫 번째 렌더링
↓
⑤ useEffect 실행
↓
⑥ localStorage.getItem("cart")
↓
⑦ savedCart 가져오기
↓
⑧ JSON.parse(savedCart)
↓
⑨ parsedCart 생성
↓
⑩ setCart(parsedCart)
↓
⑪ cart state 변경
↓
⑫ CartPage 재렌더링
↓
⑬ 저장된 장바구니가 화면에 반영
```

이를 더 크게 묶으면:

``` text
초기 렌더링
↓
effect 실행
↓
저장 데이터 읽기
↓
state 업데이트
↓
재렌더링
```

이다.

> **팁** 세부 13단계를 모두 외우기보다 위의 5단계 흐름을 자신의 말로
> 설명할 수 있는지를 확인한다.

------------------------------------------------------------------------

## 11. 왜 일반 변수로 처리하지 않는가

다음처럼 생각할 수도 있다.

``` tsx
let cart = [];

useEffect(() => {
  cart = JSON.parse(savedCart);
}, []);
```

JavaScript 변수 자체에는 새로운 값을 넣을 수 있다.

하지만 일반 변수의 변경은 React state 변경이 아니다.

반면:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

에서:

``` tsx
setCart(parsedCart);
```

를 실행하면 React가 state 변경으로 처리한다.

``` text
일반 변수
↓
값 변경 가능
↓
React state 업데이트가 아님


useState
↓
setCart()
↓
React state 업데이트
↓
재렌더링
↓
화면에 새로운 값 반영
```

> **팁** `값이 바뀌었을 때 화면도 따라서 바뀌어야 하는가?`를 기준으로
> state가 필요한지 생각해본다.

------------------------------------------------------------------------

## 12. 각 코드의 책임 구분

  요소                       책임
  -------------------------- ----------------------------------------
  `useState`                 장바구니 데이터를 React state로 보관
  `cart`                     현재 장바구니 state
  `setCart`                  `cart` state 변경
  `useEffect`                렌더링 후 저장 데이터를 읽는 작업 실행
  `localStorage.getItem()`   브라우저 저장소에서 문자열 가져오기
  `JSON.parse()`             JSON 문자열을 JavaScript 데이터로 복원
  `setCart(parsedCart)`      복원한 데이터를 React state에 반영

> **팁** 코드를 통째로 외우지 말고
> `저장소 접근 → 데이터 변환 → state 저장 → 화면 반영`으로 책임을
> 분해한다.

------------------------------------------------------------------------

## 13. 데이터 흐름으로 이해하기

현재 데이터가 이동하는 모습을 그리면:

``` text
localStorage
   │
   │ getItem()
   ▼
savedCart
string
   │
   │ JSON.parse()
   ▼
parsedCart
CartItem[]
   │
   │ setCart()
   ▼
cart state
CartItem[]
   │
   │ React render
   ▼
화면
```

그리고 Hook의 역할을 붙이면:

``` text
useEffect
→ localStorage 읽기 흐름을 시작

useState
→ 읽어온 결과를 React가 기억하고 화면에 연결
```

이라고 정리할 수 있다.

> **팁** React 코드가 복잡해 보일 때 문법부터 보지 말고
> `데이터가 어디에서 와서 어디로 이동하는가?`를 화살표로 그려본다.

------------------------------------------------------------------------

## 14. Day 3 전체 흐름과 연결하기

상품 상세에서는:

``` text
사용자가 수량 선택
↓
CartItem 생성
↓
JSON.stringify()
↓
localStorage 저장
```

을 했다.

그리고 `/cart`에서는 반대로:

``` text
localStorage
↓
getItem()
↓
JSON.parse()
↓
CartItem[]
↓
setCart()
↓
화면 출력
```

을 한다.

따라서 Day 3 전체를 하나로 연결하면:

``` text
상품 상세
↓
quantity state
↓
CartItem
↓
JSON.stringify()
↓
localStorage 저장
↓
/cart
↓
localStorage.getItem()
↓
JSON.parse()
↓
CartItem[]
↓
setCart()
↓
cart state
↓
React 재렌더링
↓
장바구니 화면
```

이 된다.

Day 3의 핵심은 단순히 `useState`, `useEffect`, `localStorage`, JSON
문법을 각각 배우는 것이 아니라 **사용자 조작으로 만들어진 상태가
저장되고, 다른 화면에서 다시 읽혀 React state가 되고, 최종적으로 UI로
나타나는 전체 데이터 흐름을 이해하는 것**이다.

> **팁** 이후 API나 DB를 배우더라도
> `외부 데이터 읽기 → JavaScript 데이터로 다루기 → state에 저장 → 렌더링`이라는
> 큰 사고방식은 계속 재사용된다. 지금은 장바구니라는 작은 예제로 그
> 기초를 익히는 단계라고 생각하면 된다.
