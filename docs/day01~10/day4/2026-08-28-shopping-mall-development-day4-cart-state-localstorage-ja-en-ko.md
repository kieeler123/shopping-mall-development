# Day 4 --- React Cart State と localStorage の理解 / Understanding React Cart State and localStorage / React 장바구니 State와 localStorage 이해

# 日本語

## 1. `cart` と `updatedCart` の違い

React の state を次のように定義しているとする。

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

ここで `cart` は、現在のレンダーが持っている「現在のカート
state」である。

一方、更新処理の中で作る `updatedCart`
は、変更を反映した「次に使いたい新しいカート」である。

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  return updatedCart;
});
```

例えば、現在のカートが次の状態だとする。

``` tsx
cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];
```

商品 `1` を削除すると、新しい配列は：

``` tsx
updatedCart = [
  { productId: 2, quantity: 1 },
];
```

となる。

  名前            役割
  --------------- ----------------------------------------
  `cart`          現在の React state
  `prev`          state updater が受け取った直前の state
  `updatedCart`   更新処理を反映した新しい配列

> **Tip**
>
> `updatedCart` は「これから React state と localStorage
> の両方に反映したい新しい値」と考えると理解しやすい。

------------------------------------------------------------------------

## 2. なぜ `JSON.stringify(updatedCart)` を保存するのか

削除後のコードを考える。

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart),
  );

  return updatedCart;
});
```

ここで保存したいものは「削除前のカート」ではなく「削除後のカート」である。

そのため：

``` tsx
JSON.stringify(updatedCart)
```

を使う。

概念的には：

``` text
以前の cart
↓
filter()
↓
updatedCart
↓
React state に反映
+
localStorage に保存
```

という流れになる。

> **Tip**
>
> `return updatedCart` と `JSON.stringify(updatedCart)`
> が同じデータを使っていることに注目する。画面と保存データを同じ状態に合わせるためである。

------------------------------------------------------------------------

## 3. `JSON.stringify(cart)` を使うと何が違うのか

次のように書いた場合：

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );

  return updatedCart;
});
```

`cart` は現在のレンダーが持っている state であり、今回作った
`updatedCart` とは異なる可能性がある。

例えば：

``` text
現在の cart
商品 A, B
↓
filter()
↓
updatedCart
商品 B
```

このとき `cart` を保存すると：

``` text
React state  → 商品 B
localStorage → 商品 A, B
```

のように、画面と保存データが一致しない可能性がある。

> **Tip**
>
> 更新処理の中では「変更前の値」と「変更後の値」を区別する。保存したいのが変更後なら、今回作った
> `updatedCart` を使う。

------------------------------------------------------------------------

## 4. `useState<CartItem[]>([])` の意味

次のコード：

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

では、初期 state は必ず空配列になる。

``` text
コンポーネント開始
↓
cart = []
```

localStorage のデータは、この `useState` だけでは読み込まれない。

そのため、別途 `useEffect()` で読み込むことができる。

``` tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    return;
  }

  const parsedCart: CartItem[] = JSON.parse(savedCart);

  setCart(parsedCart);
}, []);
```

流れ：

``` text
最初の state
cart = []
↓
useEffect()
↓
localStorage.getItem("cart")
↓
JSON.parse()
↓
setCart(parsedCart)
↓
保存されていたカートを state に反映
```

> **Tip**
>
> `useState([])` は「まず空のカートで開始する」、`useEffect()`
> は「ブラウザ側で保存済みデータを読み込む」と役割を分けて考える。

------------------------------------------------------------------------

## 5. `useState(() => ...)` で localStorage を読む方法

別の書き方として：

``` tsx
const [cart, setCart] = useState(
  () => JSON.parse(localStorage.getItem("cart")) || [],
);
```

という形も考えられる。

これは state の初期値を作るときに関数を実行する方法で、lazy
initializer（遅延初期化）と呼ばれる。

概念：

``` text
state 初期化
↓
localStorage を読む
↓
JSON.parse()
↓
保存済み配列
↓
その値を cart の初期 state にする
```

> **Tip**
>
> `useState(値)` は値を初期値として渡し、`useState(() => 値)`
> は初期値を作る関数を渡す、と区別するとよい。

------------------------------------------------------------------------

## 6. Next.js では localStorage の位置に注意する

`localStorage` はブラウザ API である。

``` text
ブラウザ → localStorage が存在する
サーバー → localStorage が存在しない
```

そのため Next.js では、初期化時に直接 `localStorage`
へアクセスするコードはレンダリング環境を考慮する必要がある。

学習段階では：

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  // ...
}, []);
```

のように、ブラウザ側で動く effect
の中で読み込む方法は役割を理解しやすい。

> **Tip**
>
> `"use client"` を使っていても、`window`、`document`、`localStorage`
> などのブラウザ API を「どこで使うか」は意識する。

------------------------------------------------------------------------

## 7. `JSON.stringify()` と `JSON.parse()` の関係

localStorage は文字列としてデータを保存する。

そのため、JavaScript の配列やオブジェクトを保存するときは：

``` tsx
JSON.stringify(updatedCart)
```

を使う。

``` text
CartItem[]
↓
JSON.stringify()
↓
文字列
↓
localStorage
```

反対に読み込むときは：

``` tsx
JSON.parse(savedCart)
```

を使う。

``` text
localStorage
↓
文字列
↓
JSON.parse()
↓
JavaScript の配列・オブジェクト
```

  関数                 役割
  -------------------- ---------------------------------
  `JSON.stringify()`   JavaScript データ → JSON 文字列
  `JSON.parse()`       JSON 文字列 → JavaScript データ

> **Tip**
>
> `stringify` は「文字列にする」、`parse` は「文字列を JavaScript
> データとして解析する」と覚える。

------------------------------------------------------------------------

## 8. なぜ同じ localStorage ロジックが繰り返されるのか

数量増加、数量減少、削除などで次のコードが繰り返されることがある。

``` tsx
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart),
);
```

例えば：

``` text
handleIncrease
→ state 更新
→ localStorage 保存

handleDecrease
→ state 更新
→ localStorage 保存

handleRemove
→ state 更新
→ localStorage 保存
```

機能が増えるほど、同じ保存処理を書く場所も増える。

これは「localStorage
への保存」という共通責務を分離できる可能性があることを示している。

> **Tip**
>
> 同じコードが複数の関数に現れ始めたら、「これは共通処理として分離できないか？」と考える習慣をつける。

------------------------------------------------------------------------

## 9. state 更新と localStorage 保存は別の責務として考えられる

例えば `handleRemove` の主な目的は商品削除である。

``` text
handleRemove
↓
対象商品を削除
↓
新しい cart を作る
```

一方：

``` tsx
localStorage.setItem(...)
```

の目的は永続化である。

つまり概念的には：

``` text
カート操作
→ React state の変更

保存処理
→ localStorage との同期
```

と役割を分けて考えることができる。

> **Tip**
>
> 最初は一つの関数内に書いて動きを理解し、その後「更新」と「保存」を分離する。この順番で学ぶと抽象化の理由が見えやすい。

------------------------------------------------------------------------

## 10. 全体のデータフロー

現在学んでいる処理は次のようにつながる。

``` text
localStorage
     │
     │ getItem()
     ▼
JSON 文字列
     │
     │ JSON.parse()
     ▼
CartItem[]
     │
     │ setCart()
     ▼
React cart state
     │
     │ map() / filter()
     ▼
updatedCart
     │
     ├──────────────┐
     │              │
     ▼              ▼
setCart()      JSON.stringify()
     │              │
     ▼              ▼
画面更新       localStorage 保存
```

> **Tip**
>
> 個々のメソッドを暗記するより、`保存 → 読み込み → state → 更新 → 再保存`
> というデータの移動を追う。

------------------------------------------------------------------------

# English

## 1. The Difference Between `cart` and `updatedCart`

Suppose the React state is defined as:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

`cart` represents the current cart state available to the current
render.

Inside an update operation, `updatedCart` represents the newly
calculated cart that we want to use next.

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  return updatedCart;
});
```

For example:

``` tsx
cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];
```

After removing product `1`:

``` tsx
updatedCart = [
  { productId: 2, quantity: 1 },
];
```

  Name            Responsibility
  --------------- ----------------------------------------------
  `cart`          Current React state
  `prev`          Previous state received by the state updater
  `updatedCart`   Newly calculated cart after the update

> **Tip**
>
> Think of `updatedCart` as the new value that should become both the
> next React state and the persisted cart data.

------------------------------------------------------------------------

## 2. Why Save `JSON.stringify(updatedCart)`?

Consider:

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart),
  );

  return updatedCart;
});
```

We want to persist the cart after the deletion, not the cart before it.

The flow is:

``` text
previous cart
↓
filter()
↓
updatedCart
↓
use as next React state
+
save to localStorage
```

> **Tip**
>
> Notice that `return updatedCart` and `JSON.stringify(updatedCart)` use
> the same data. This helps the UI state and persisted data represent
> the same cart.

------------------------------------------------------------------------

## 3. What If We Use `JSON.stringify(cart)`?

Consider:

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );

  return updatedCart;
});
```

`cart` belongs to the current render and may still represent the value
before this update.

For example:

``` text
current cart
A, B
↓
filter()
↓
updatedCart
B
```

Saving `cart` could result in:

``` text
React state  → B
localStorage → A, B
```

The persisted data may therefore become inconsistent with the newly
calculated state.

> **Tip**
>
> During an update, distinguish between the old value and the newly
> calculated value. If you need the result of the current operation, use
> `updatedCart`.

------------------------------------------------------------------------

## 4. What `useState<CartItem[]>([])` Means

With:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

the initial state is an empty array.

``` text
component starts
↓
cart = []
```

This statement itself does not read localStorage.

Saved data can then be loaded separately with an effect:

``` tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    return;
  }

  const parsedCart: CartItem[] = JSON.parse(savedCart);

  setCart(parsedCart);
}, []);
```

Flow:

``` text
initial cart = []
↓
useEffect()
↓
read localStorage
↓
JSON.parse()
↓
setCart(parsedCart)
↓
saved cart becomes React state
```

> **Tip**
>
> Think of `useState([])` as initialization and the effect as
> browser-side restoration of persisted data.

------------------------------------------------------------------------

## 5. Initializing State with `useState(() => ...)`

Another possible pattern is:

``` tsx
const [cart, setCart] = useState(
  () => JSON.parse(localStorage.getItem("cart")) || [],
);
```

Passing a function to `useState` for initial state is called a lazy
initializer.

Conceptually:

``` text
initialize state
↓
read localStorage
↓
JSON.parse()
↓
saved array
↓
use it as initial cart state
```

> **Tip**
>
> `useState(value)` receives an initial value. `useState(() => value)`
> receives a function that produces the initial value.

------------------------------------------------------------------------

## 6. Be Careful with localStorage in Next.js

`localStorage` is a browser API.

``` text
Browser → localStorage exists
Server  → localStorage does not exist
```

Therefore, direct access to localStorage during initialization in
Next.js requires awareness of the rendering environment.

For a learning project, this separation is easy to reason about:

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  // ...
}, []);
```

The effect handles browser-side restoration.

> **Tip**
>
> Even with `"use client"`, pay attention to where browser-only APIs
> such as `window`, `document`, and `localStorage` are accessed.

------------------------------------------------------------------------

## 7. `JSON.stringify()` vs `JSON.parse()`

localStorage stores string values.

To save a JavaScript array or object:

``` tsx
JSON.stringify(updatedCart)
```

Flow:

``` text
CartItem[]
↓
JSON.stringify()
↓
JSON string
↓
localStorage
```

To restore it:

``` tsx
JSON.parse(savedCart)
```

Flow:

``` text
localStorage
↓
JSON string
↓
JSON.parse()
↓
JavaScript array/object
```

  Function             Direction
  -------------------- -------------------------------
  `JSON.stringify()`   JavaScript data → JSON string
  `JSON.parse()`       JSON string → JavaScript data

> **Tip**
>
> `stringify` creates a string; `parse` interprets that string back into
> JavaScript data.

------------------------------------------------------------------------

## 8. Why Does the Same localStorage Logic Start Repeating?

As cart features grow, the same persistence line can appear in multiple
handlers:

``` tsx
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart),
);
```

For example:

``` text
handleIncrease
→ update state
→ save localStorage

handleDecrease
→ update state
→ save localStorage

handleRemove
→ update state
→ save localStorage
```

This repetition suggests that persistence may be a shared responsibility
that can eventually be separated.

> **Tip**
>
> When identical logic begins appearing in several functions, ask
> whether it represents a reusable responsibility.

------------------------------------------------------------------------

## 9. State Updates and Persistence Can Be Separate Responsibilities

The primary responsibility of `handleRemove` is removing an item:

``` text
handleRemove
↓
remove target item
↓
produce a new cart
```

The responsibility of:

``` tsx
localStorage.setItem(...)
```

is persistence.

Conceptually:

``` text
cart operation
→ change React state

persistence
→ synchronize with localStorage
```

These responsibilities can be separated as the application grows.

> **Tip**
>
> It is useful to first implement both concerns together so you
> understand the flow, and then refactor once the repetition becomes
> visible.

------------------------------------------------------------------------

## 10. The Complete Data Flow

The concepts connect like this:

``` text
localStorage
     │
     │ getItem()
     ▼
JSON string
     │
     │ JSON.parse()
     ▼
CartItem[]
     │
     │ setCart()
     ▼
React cart state
     │
     │ map() / filter()
     ▼
updatedCart
     │
     ├──────────────┐
     │              │
     ▼              ▼
setCart()      JSON.stringify()
     │              │
     ▼              ▼
UI update      localStorage
```

> **Tip**
>
> Instead of memorizing each method separately, follow the movement of
> the data: persist → restore → state → update → persist again.

------------------------------------------------------------------------

# 한국어

## 1. `cart`와 `updatedCart`의 차이

React state가 다음과 같이 있다고 하자.

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

여기서 `cart`는 현재 렌더가 가지고 있는 현재 장바구니 state다.

반면 업데이트 과정에서 만드는 `updatedCart`는 이번 변경 사항을 적용한
새로운 장바구니다.

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  return updatedCart;
});
```

예를 들어 현재 값이:

``` tsx
cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];
```

이고 1번 상품을 삭제했다면:

``` tsx
updatedCart = [
  { productId: 2, quantity: 1 },
];
```

이 된다.

  이름            역할
  --------------- -------------------------------------------
  `cart`          현재 React state
  `prev`          state updater가 전달받은 이전 state
  `updatedCart`   이번 변경을 적용해서 새로 계산한 장바구니

> **팁**
>
> `updatedCart`는 앞으로 React state와 저장 데이터에 반영하고 싶은
> 새로운 값이라고 생각하면 이해하기 쉽다.

------------------------------------------------------------------------

## 2. 왜 `JSON.stringify(updatedCart)`를 사용하는가

삭제 함수가 다음과 같다고 하자.

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart),
  );

  return updatedCart;
});
```

여기서 저장하고 싶은 것은 삭제 전 장바구니가 아니라 삭제가 반영된 새로운
장바구니다.

흐름은:

``` text
이전 cart
↓
filter()
↓
updatedCart
↓
React의 다음 state로 사용
+
localStorage에도 저장
```

이다.

> **팁**
>
> `return updatedCart`와 `JSON.stringify(updatedCart)`가 동일한 데이터를
> 사용한다는 점을 확인하자. 화면 상태와 저장 상태를 같은 값으로 맞추려는
> 것이다.

------------------------------------------------------------------------

## 3. `JSON.stringify(cart)`를 쓰는 것과의 차이

다음처럼 작성했다고 해보자.

``` tsx
setCart((prev) => {
  const updatedCart = prev.filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );

  return updatedCart;
});
```

`cart`는 현재 렌더가 가지고 있던 state이기 때문에 이번에 새롭게 계산한
`updatedCart`와 다를 수 있다.

예를 들어:

``` text
현재 cart
상품 A, B
↓
filter()
↓
updatedCart
상품 B
```

인데 기존 `cart`를 저장한다면:

``` text
React state  → 상품 B
localStorage → 상품 A, B
```

처럼 서로 다른 상태가 될 수 있다.

> **팁**
>
> 업데이트 로직 안에서는 변경 전 데이터와 변경 후 데이터를 구분하자.
> 이번 작업의 결과를 저장해야 한다면 새롭게 계산한 `updatedCart`를
> 사용하는 것이 핵심이다.

------------------------------------------------------------------------

## 4. `useState<CartItem[]>([])`의 의미

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

이 코드는 최초 state를 빈 배열로 만든다.

``` text
컴포넌트 시작
↓
cart = []
```

이 `useState` 자체는 localStorage를 읽지 않는다.

그래서 별도의 effect에서 저장 데이터를 읽을 수 있다.

``` tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    return;
  }

  const parsedCart: CartItem[] = JSON.parse(savedCart);

  setCart(parsedCart);
}, []);
```

전체 흐름:

``` text
최초 cart = []
↓
useEffect()
↓
localStorage 읽기
↓
JSON.parse()
↓
setCart(parsedCart)
↓
저장되어 있던 장바구니를 state에 반영
```

> **팁**
>
> `useState([])`는 초기화, `useEffect()`는 브라우저 저장 데이터
> 복원이라고 역할을 나눠서 이해하면 좋다.

------------------------------------------------------------------------

## 5. `useState(() => ...)`로 localStorage에서 초기화하기

다음과 같은 방식도 생각할 수 있다.

``` tsx
const [cart, setCart] = useState(
  () => JSON.parse(localStorage.getItem("cart")) || [],
);
```

`useState`에 초기값을 직접 넣는 대신 초기값을 만드는 함수를 전달한
것이다. 이를 lazy initializer, 즉 지연 초기화 함수라고 한다.

개념적으로:

``` text
state 초기화
↓
localStorage 읽기
↓
JSON.parse()
↓
저장된 배열 복원
↓
그 값을 cart의 초기 state로 사용
```

하는 방식이다.

> **팁**
>
> `useState(값)`은 초기값을 전달하고, `useState(() => 값)`은 초기값을
> 만들어주는 함수를 전달한다고 구분하자.

------------------------------------------------------------------------

## 6. Next.js에서는 localStorage 사용 위치에 주의하기

`localStorage`는 브라우저 API다.

``` text
브라우저 → localStorage 존재
서버     → localStorage 없음
```

따라서 Next.js에서는 초기화 과정에서 localStorage에 바로 접근할 때
렌더링 환경을 고려해야 한다.

학습 단계에서는 다음 구조가 역할을 이해하기 쉽다.

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  // ...
}, []);
```

즉 state는 빈 배열로 시작하고, 브라우저에서 effect가 실행되면 저장된
장바구니를 복원한다.

> **팁**
>
> `"use client"`가 있어도 `window`, `document`, `localStorage` 같은
> 브라우저 전용 API를 어느 시점과 위치에서 사용하는지 의식하자.

------------------------------------------------------------------------

## 7. `JSON.stringify()`와 `JSON.parse()`

localStorage는 문자열 형태로 데이터를 저장한다.

배열이나 객체를 저장할 때:

``` tsx
JSON.stringify(updatedCart)
```

를 사용한다.

``` text
CartItem[]
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage
```

반대로 저장된 데이터를 다시 가져올 때:

``` tsx
JSON.parse(savedCart)
```

를 사용한다.

``` text
localStorage
↓
JSON 문자열
↓
JSON.parse()
↓
JavaScript 배열/객체
```

  함수                 역할
  -------------------- ---------------------------------
  `JSON.stringify()`   JavaScript 데이터 → JSON 문자열
  `JSON.parse()`       JSON 문자열 → JavaScript 데이터

> **팁**
>
> `stringify`는 문자열로 만들기, `parse`는 문자열을 다시 JavaScript
> 데이터로 해석하기라고 기억하자.

------------------------------------------------------------------------

## 8. 왜 localStorage 로직이 반복되기 시작하는가

장바구니 기능이 늘어나면 다음 코드가 여러 함수에서 반복될 수 있다.

``` tsx
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart),
);
```

현재 구조를 예로 들면:

``` text
handleIncrease
→ 수량 증가
→ localStorage 저장

handleDecrease
→ 수량 감소
→ localStorage 저장

handleRemove
→ 상품 삭제
→ localStorage 저장
```

기능이 하나씩 추가될수록 똑같은 저장 로직도 계속 추가된다.

이 반복은 `localStorage 저장`이라는 공통 책임을 별도로 분리할 수 있다는
신호가 될 수 있다.

> **팁**
>
> 똑같은 코드가 여러 함수에서 반복되기 시작하면 단순히 복사하기 전에
> `이 부분은 공통 로직인가?`를 생각해보는 습관을 들이자.

------------------------------------------------------------------------

## 9. 장바구니 변경과 저장은 서로 다른 책임으로 볼 수 있다

예를 들어 `handleRemove`의 핵심 책임은:

``` text
상품 삭제
↓
새로운 cart 생성
```

이다.

반면:

``` tsx
localStorage.setItem(...)
```

의 책임은 데이터를 브라우저 저장소에 영속화하는 것이다.

따라서 개념적으로:

``` text
장바구니 조작
→ React state 변경

저장 로직
→ localStorage와 동기화
```

처럼 나눠볼 수 있다.

처음에는 한 함수 안에 작성하면서 데이터 흐름을 배우고, 반복이 보이기
시작하면 저장 책임을 분리하는 방향으로 리팩터링할 수 있다.

> **팁**
>
> 공통 함수나 동기화 로직을 만드는 이유는 단순히 코드를 짧게 만들기
> 위해서가 아니다. `수량 변경`, `상품 삭제`, `저장`처럼 서로 다른 책임을
> 분리하면 수정할 위치도 명확해진다.

------------------------------------------------------------------------

## 10. 전체 데이터 흐름 연결하기

지금까지의 개념을 한 번에 연결하면:

``` text
localStorage
     │
     │ getItem()
     ▼
JSON 문자열
     │
     │ JSON.parse()
     ▼
CartItem[]
     │
     │ setCart()
     ▼
React cart state
     │
     │ map() / filter()
     ▼
updatedCart
     │
     ├──────────────┐
     │              │
     ▼              ▼
setCart()      JSON.stringify()
     │              │
     ▼              ▼
화면 변경       localStorage 저장
```

이 흐름에서:

``` text
map()             → 수정
filter()          → 삭제
updatedCart       → 변경 후 새 데이터
setCart()         → React state 변경
JSON.stringify()  → 저장 가능한 문자열로 변환
JSON.parse()      → 저장 문자열을 JS 데이터로 복원
localStorage      → 새로고침 이후에도 유지할 데이터 저장
```

이라고 역할을 연결할 수 있다.

> **팁**
>
> 각각의 문법을 따로 외우기보다
> `저장 → 복원 → state → 수정/삭제 → 새로운 state → 다시 저장`이라는
> 데이터의 여행 경로를 그려보면 훨씬 오래 기억할 수 있다.

------------------------------------------------------------------------

## 11. 다음 리팩터링 단계에서 생각할 점

현재 여러 handler 안에:

``` tsx
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart),
);
```

가 반복되고 있다는 사실을 발견했다면 좋은 리팩터링 시점이다.

다음 단계에서는 다음 질문을 생각할 수 있다.

``` text
수량 증가 함수가
localStorage 저장까지 책임져야 할까?

수량 감소 함수도
같은 저장 코드를 가지고 있어야 할까?

삭제 함수도
같은 저장 코드를 또 써야 할까?

아니면 cart가 바뀌었을 때
한 곳에서 저장을 담당하게 만들 수 있을까?
```

이 질문이 React의 state와 side effect를 분리해서 생각하는 다음 학습
단계로 연결된다.

> **팁**
>
> 반복 코드를 발견한 순간이 리팩터링을 배우기 가장 좋은 순간이다. 지금은
> `왜 분리해야 하는가`를 이미 코드에서 직접 확인하고 있기 때문에, 다음
> 단계의 추상화가 단순한 문법 암기가 아니라 실제 문제 해결로 연결된다.
