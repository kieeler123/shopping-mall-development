# Day 5 Theory Notes — localStorage, JSON, React State, useEffect, and Dependency Array

---

# 日本語

## 1. 今回のテーマ

今回の Day 5 では、カートページで保存したデータを `/checkout` ページで読み込み、React の state に入れて画面表示へつなげる流れを理解する。

全体の流れは次の通り。

```text
/cart で cart を保存
↓
localStorage
↓
/checkout で読み込む
↓
JSON.parse()
↓
React state に保存
↓
再レンダリング
↓
注文商品を画面に表示
```

この流れを理解するうえで重要なのが、次の概念である。

```text
localStorage
JSON.stringify()
JSON.parse()
useState()
useEffect()
dependency array []
```

> **Tip**
>
> コードを一つの塊として暗記するのではなく、「保存」「読み込み」「変換」「state 保存」「画面反映」の段階に分けて理解すると整理しやすい。

---

## 2. localStorage とは何か

`localStorage` はブラウザが提供する保存領域である。

たとえばカートデータを保存するとき、

```tsx
localStorage.setItem("cart", JSON.stringify(cart));
```

のように書くことができる。

ここで重要なのは、`localStorage` が基本的に **文字列を保存する仕組み** だということ。

JavaScript の配列が、

```tsx
[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 }
]
```

だったとしても、そのまま配列として保存されるわけではない。

`JSON.stringify()` によって文字列へ変換される。

```text
JavaScript 配列
↓
JSON.stringify()
↓
JSON 形式の文字列
↓
localStorage に保存
```

> **Tip**
>
> `localStorage` を「JavaScript オブジェクト保管庫」と考えず、「文字列の保管庫」と考える。

---

## 3. JSON.stringify() の役割

`JSON.stringify()` は JavaScript の配列やオブジェクトを JSON 形式の文字列へ変換する。

```tsx
const cart = [
  { productId: 1, quantity: 2 }
];

const text = JSON.stringify(cart);
```

概念的には、

```text
[
  { productId: 1, quantity: 2 }
]
```

が、

```text
"[{\"productId\":1,\"quantity\":2}]"
```

のような文字列になる。

そのため、

```tsx
localStorage.setItem("cart", JSON.stringify(cart));
```

は、

```text
cart 配列
↓
JSON.stringify(cart)
↓
文字列
↓
"cart" というキーで localStorage に保存
```

という処理である。

> **Tip**
>
> `stringify` は「string にする」と考えると名前から役割を思い出しやすい。

---

## 4. localStorage.getItem() の役割

保存したデータを読むときは、

```tsx
localStorage.getItem("cart");
```

を使う。

たとえば、

```tsx
const savedCart = localStorage.getItem("cart");
```

とすると、`savedCart` には `"cart"` キーに保存されていた値が入る。

ただし、返ってくるのは配列ではなく文字列、またはデータが存在しなければ `null` である。

```text
localStorage
└─ cart
    ↓
getItem("cart")
    ↓
文字列 または null
```

> **Tip**
>
> `getItem()` の戻り値を「元の配列」と思わない。まだ文字列の段階である。

---

## 5. なぜ JSON.parse() が必要なのか

保存時に `JSON.stringify()` で文字列へ変換したので、読み込み時には元の JavaScript データへ戻す必要がある。

その役割を持つのが `JSON.parse()`。

```tsx
const savedCart = localStorage.getItem("cart");

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
}
```

流れは次の通り。

```text
保存するとき

JavaScript 配列
↓
JSON.stringify()
↓
文字列
↓
localStorage


読み込むとき

localStorage
↓
getItem()
↓
文字列
↓
JSON.parse()
↓
JavaScript 配列
```

`stringify()` と `parse()` は反対方向の処理である。

> **Tip**
>
> `stringify = JavaScript → 文字列`
>
> `parse = 文字列 → JavaScript`
>
> のペアで覚える。

---

# 6. なぜ if (savedCart) が必要なのか

`localStorage.getItem("cart")` は、必ずデータを返すわけではない。

もし `"cart"` が保存されていなければ、

```tsx
null
```

が返る。

そのため、

```tsx
const savedCart = localStorage.getItem("cart");

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
}
```

のように存在確認をする。

考え方は、

```text
cart が保存されている？
│
├─ YES → JSON.parse()
└─ NO  → 処理しない
```

である。

> **Tip**
>
> 外部ストレージや API から取得する値は「必ず存在する」と決めつけない。

---

# 7. React state に入れる理由

checkout ページで読み込んだ cart データを React の画面表示に使いたい。

そのため、

```tsx
const [cart, setCart] = useState([]);
```

のように state を用意する。

そして localStorage から読み込んだデータを、

```tsx
setCart(JSON.parse(savedCart));
```

で state に入れる。

流れは次のようになる。

```text
localStorage
↓
getItem()
↓
文字列
↓
JSON.parse()
↓
JavaScript 配列
↓
setCart()
↓
cart state 更新
↓
React 再レンダリング
↓
新しい cart を使って画面表示
```

> **Tip**
>
> `localStorage` は「保存場所」、React state は「現在の UI が使うデータ」と分けて考える。

---

# 8. なぜ "use client" が必要なのか

Next.js App Router では、コンポーネントはデフォルトで Server Component として扱われる。

しかし `localStorage` はブラウザに存在する API である。

```text
ブラウザ
→ localStorage あり

サーバー
→ localStorage なし
```

また、`useState` や `useEffect` も Client Component で使用する React Hook である。

そのため、checkout ページでこれらを使う場合、

```tsx
"use client";
```

をファイル上部に書く。

例：

```tsx
"use client";

import { useEffect, useState } from "react";
```

> **Tip**
>
> `localStorage`, `window`, `document`, `useState`, `useEffect` が登場したら、「このコンポーネントはブラウザ側で動く必要がある」と考える。

---

# 9. useEffect とは何か

`useEffect` は、React コンポーネントのレンダリングそのものとは別に、ある処理を実行したいときに使う Hook である。

基本形は、

```tsx
useEffect(() => {
  // 実行したい処理
}, []);
```

である。

今回なら、

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

のように localStorage を読む処理を入れる。

大まかな流れは、

```text
コンポーネントがレンダリングされる
↓
画面へ反映される
↓
useEffect の処理が実行される
```

と理解するとよい。

> **Tip**
>
> 最初は `useEffect` を「レンダリング後に実行したい処理を書く場所」と理解すると入りやすい。

---

# 10. なぜ localStorage の読み込みを useEffect に入れるのか

今回の目的は、checkout ページがブラウザで表示された後に保存済み cart を読み込むこと。

```text
CheckoutPage
↓
最初のレンダリング
↓
ブラウザでページが用意される
↓
useEffect 実行
↓
localStorage.getItem("cart")
↓
cart 読み込み
↓
setCart()
↓
再レンダリング
```

この流れにすることで、ブラウザ専用 API の読み込み処理を React のレンダリングロジックから分離できる。

> **Tip**
>
> 「画面を描く処理」と「外部の保存場所を読む処理」を分けると考えると分かりやすい。

---

# 11. useEffect の第二引数とは何か

`useEffect` は一般的に次の形を持つ。

```tsx
useEffect(() => {
  // effect
}, [依存する値]);
```

二番目の引数、

```tsx
[依存する値]
```

を **dependency array（依存配列）** と呼ぶ。

React はこの配列を見て、

```text
この effect をいつ再実行するか
```

を判断する。

> **Tip**
>
> `useEffect` の `[]` は単なる記号ではない。「この effect が何に依存しているか」を React に伝える場所である。

---

# 12. 空配列 [] の意味

今回のコードは、

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

となる。

ここで、

```tsx
[]
```

には依存する値が一つも入っていない。

つまり React に、

```text
この effect は、更新を監視する特定の state や props を持っていない
```

と伝えている。

一般的な使い方では、結果としてコンポーネントが最初にマウントされた後に一度実行される用途で使われる。

```text
初回レンダリング
↓
useEffect 実行
↓
その後の通常の再レンダリングでは再実行しない
```

今回の cart 読み込みにはこれが合っている。

なぜなら、checkout ページを開いたときに一度 localStorage から cart を取得すればよいからである。

> **Tip**
>
> `[]` を「一回だけ」と丸暗記するより、「監視する依存値がない」と理解すると、後で `[name]` や `[cart]` を学ぶときにつながる。

---

# 13. マウントとは何か

React で **mount** とは、コンポーネントが画面に初めて登場することを指す。

たとえば `/checkout` へ移動したとき、

```text
CheckoutPage がまだ存在しない
↓
/checkout を開く
↓
CheckoutPage が作られる
↓
画面に登場
↓
mount
```

となる。

空の dependency array を持つ `useEffect` は、この初回 mount の後に実行する処理に向いている。

> **Tip**
>
> `mount = コンポーネントが初めて画面に登場する` と覚える。

---

# 14. [] を書かなかったらどうなるか

次のコードを考える。

```tsx
useEffect(() => {
  console.log("effect");
});
```

第二引数がない。

この場合、effect はレンダリングのたびに実行される。

```text
レンダリング
↓
effect
↓
再レンダリング
↓
effect
↓
再レンダリング
↓
effect
...
```

必ず無限ループになるわけではないが、effect の中で state 更新を行っているとループの原因になることがある。

たとえば、

```tsx
useEffect(() => {
  setCart(...);
});
```

のような処理では、

```text
render
↓
effect
↓
setCart()
↓
state 更新
↓
render
↓
effect
↓
setCart()
↓
...
```

という危険な流れになり得る。

> **Tip**
>
> dependency array を省略すると「レンダリングのたびに effect が走る」という点を忘れない。

---

# 15. [] がある場合

```tsx
useEffect(() => {
  console.log("effect");
}, []);
```

なら、通常の学習上の理解として、

```text
初回 render
↓
effect
↓
state が変わって再 render
↓
effect は通常再実行されない
```

となる。

今回の localStorage 読み込みは、

```text
checkout を開いたとき一度読む
```

のが目的なので `[]` が合っている。

> **Tip**
>
> 初期データの読み込み、初回だけ行いたい準備処理では `[]` がよく登場する。

---

# 16. dependency array に値が入る場合

たとえば、

```tsx
useEffect(() => {
  console.log(name);
}, [name]);
```

とすると、この effect は `name` に依存している。

概念的には、

```text
初回
↓
effect

name が変わる
↓
effect 再実行

name が変わる
↓
effect 再実行
```

となる。

つまり、

```tsx
[]
```

と、

```tsx
[name]
```

は意味が違う。

```text
[]
→ 監視対象なし

[name]
→ name の変化を監視
```

> **Tip**
>
> dependency array を「いつ実行するかを決める条件表」と考えると理解しやすい。

---

# 17. 三つのパターン比較

## A. 第二引数なし

```tsx
useEffect(() => {
  // ...
});
```

```text
基本的にレンダリングごとに実行
```

## B. 空配列

```tsx
useEffect(() => {
  // ...
}, []);
```

```text
初回 mount 後の一度の処理として使う
```

## C. 値あり

```tsx
useEffect(() => {
  // ...
}, [name]);
```

```text
初回 + name が変わったとき
```

| 書き方 | 実行タイミングの基本理解 |
|---|---|
| `useEffect(fn)` | レンダリングのたび |
| `useEffect(fn, [])` | 初回 mount 後 |
| `useEffect(fn, [name])` | 初回 + `name` 変更時 |

> **Tip**
>
> この三つを並べて比較すると dependency array の意味が一気に分かりやすくなる。

---

# 18. 今回の checkout ではなぜ [] なのか

今回の目的は、

```text
checkout ページを開く
↓
保存済み cart を一度読む
↓
state に入れる
```

である。

cart state が変わるたびに localStorage をもう一度読み直したいわけではない。

そのため、

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

となる。

> **Tip**
>
> 「この effect は何が変わったら再実行したいのか？」と自問する。今回の答えは「特にない。ページを開いた最初だけ」である。

---

# 19. setCart() が起こす再レンダリング

次のコードで、

```tsx
setCart(JSON.parse(savedCart));
```

が実行されると state が更新される。

その結果 React はコンポーネントを再レンダリングする。

```text
初回
cart = []
↓
render
↓
useEffect
↓
localStorage 読み込み
↓
setCart(parsedCart)
↓
cart state 更新
↓
再レンダリング
↓
新しい cart で画面作成
```

ここで `[]` があるため、通常の再レンダリングで同じ effect を繰り返し実行しない。

この点が今回非常に重要である。

> **Tip**
>
> `setState → 再レンダリング` という React の基本ルールと、`[] → effect の再実行を通常防ぐ` という関係をセットで理解する。

---

# 20. 全体コード

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <main>
      <h1>注文書</h1>
    </main>
  );
}
```

---

# 21. 一行ずつ意味を読む

```tsx
"use client";
```

```text
このコンポーネントは Client Component
```

```tsx
import { useEffect, useState } from "react";
```

```text
state と effect を使う
```

```tsx
const [cart, setCart] = useState([]);
```

```text
最初の cart は空配列
```

```tsx
useEffect(() => {
```

```text
レンダリング後に行う処理を定義
```

```tsx
const savedCart = localStorage.getItem("cart");
```

```text
ブラウザの保存領域から cart を読む
```

```tsx
if (savedCart) {
```

```text
保存データが存在するか確認
```

```tsx
JSON.parse(savedCart)
```

```text
文字列を JavaScript データへ戻す
```

```tsx
setCart(...)
```

```text
cart state を更新
```

```tsx
}, []);
```

```text
依存値なし
→ 初回 mount 後の読み込み用途
```

> **Tip**
>
> コードを見ずにこの順序を自分の言葉で説明できれば、かなり理解できている。

---

# 22. 最終データフロー

```text
Day 4

cart state
↓
JSON.stringify()
↓
localStorage.setItem()
↓
ブラウザに文字列として保存


Day 5

/checkout mount
↓
useEffect
↓
localStorage.getItem()
↓
savedCart
↓
JSON.parse()
↓
JavaScript 配列
↓
setCart()
↓
cart state 更新
↓
再レンダリング
↓
注文商品表示
```

> **Tip**
>
> このデータフローを紙に一度描くと、`localStorage`, `JSON`, `state`, `useEffect` の役割が分離して見える。

---

# English

## 1. Topic

The goal of this Day 5 step is to read cart data that was saved earlier and use it inside the `/checkout` page.

The complete flow is:

```text
save cart on /cart
↓
localStorage
↓
read it on /checkout
↓
JSON.parse()
↓
store it in React state
↓
re-render
↓
display order items
```

Important concepts:

```text
localStorage
JSON.stringify()
JSON.parse()
useState()
useEffect()
dependency array []
```

> **Tip**
>
> Do not memorize the code as one block. Separate it into storage, retrieval, conversion, state update, and rendering.

---

## 2. What Is localStorage?

`localStorage` is browser-provided storage.

For example:

```tsx
localStorage.setItem("cart", JSON.stringify(cart));
```

The important point is that localStorage fundamentally stores string values.

A JavaScript array such as:

```tsx
[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 }
]
```

is converted into a string before being stored.

```text
JavaScript array
↓
JSON.stringify()
↓
JSON string
↓
localStorage
```

> **Tip**
>
> Think of localStorage as string storage, not as direct JavaScript object storage.

---

## 3. JSON.stringify()

`JSON.stringify()` converts JavaScript data into a JSON-formatted string.

```tsx
const text = JSON.stringify(cart);
```

Then:

```tsx
localStorage.setItem("cart", JSON.stringify(cart));
```

means:

```text
cart
↓
convert to string
↓
store under the key "cart"
```

> **Tip**
>
> The word `stringify` itself helps: it turns something into a string.

---

## 4. localStorage.getItem()

To read the saved value:

```tsx
const savedCart = localStorage.getItem("cart");
```

The result is a string or `null`.

```text
localStorage
↓
getItem("cart")
↓
string or null
```

It is not automatically restored to the original array.

> **Tip**
>
> After `getItem()`, remember that the data is still in its stored string form.

---

## 5. Why JSON.parse() Is Needed

Because the data was stringified before storage, it must be converted back into JavaScript data.

```tsx
const savedCart = localStorage.getItem("cart");

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
}
```

The round trip is:

```text
saving:
JavaScript data
↓
JSON.stringify()
↓
string

reading:
string
↓
JSON.parse()
↓
JavaScript data
```

> **Tip**
>
> Memorize them as opposites:
>
> `stringify`: JavaScript → string
>
> `parse`: string → JavaScript

---

## 6. Why Check if(savedCart)?

If the `"cart"` key does not exist, `getItem()` returns `null`.

Therefore:

```tsx
if (savedCart) {
  // parse only when data exists
}
```

protects the next step.

> **Tip**
>
> Never assume browser storage or external data always exists.

---

## 7. Why Put the Data in React State?

The checkout UI should render based on the cart data.

```tsx
const [cart, setCart] = useState([]);
```

Then:

```tsx
setCart(JSON.parse(savedCart));
```

updates the state.

```text
localStorage
↓
getItem()
↓
JSON.parse()
↓
setCart()
↓
state update
↓
React re-render
↓
UI uses new cart
```

> **Tip**
>
> localStorage is persistent storage; state is the current data used to render the UI.

---

## 8. Why "use client" Is Needed

In the Next.js App Router, components are Server Components by default.

`localStorage` exists in the browser, not on the server.

```text
browser
→ localStorage exists

server
→ localStorage does not exist
```

`useState` and `useEffect` are also hooks used in Client Components.

Therefore:

```tsx
"use client";
```

is required for this component.

> **Tip**
>
> When you see `localStorage`, `window`, `document`, `useState`, or `useEffect`, think about whether the component must run on the client.

---

# 9. What Is useEffect?

`useEffect` is a React Hook used to run logic outside the direct rendering calculation of the component.

Basic form:

```tsx
useEffect(() => {
  // effect logic
}, []);
```

For this checkout page:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

A beginner-friendly mental model is:

```text
render component
↓
update the page
↓
run the effect
```

> **Tip**
>
> At this stage, think of `useEffect` as a place for logic that should run after rendering.

---

# 10. Why Read localStorage Inside useEffect?

The checkout page needs to read browser storage after the component is running in the browser.

Conceptually:

```text
CheckoutPage renders
↓
component appears in browser
↓
useEffect runs
↓
read localStorage
↓
setCart()
↓
re-render
```

This separates the rendering logic from external/browser-side work.

> **Tip**
>
> Think of rendering as “describe the UI” and the effect as “perform the browser-side work.”

---

# 11. What Is the Second Argument of useEffect?

The typical form is:

```tsx
useEffect(() => {
  // effect
}, [dependencies]);
```

The second argument is the **dependency array**.

React uses it to determine when the effect needs to run again.

> **Tip**
>
> The dependency array is not decoration. It describes what values the effect depends on.

---

# 12. What Does an Empty Array [] Mean?

In:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

the dependency array contains no values.

Conceptually, you are saying:

```text
this effect is not watching a changing prop/state dependency
```

For the normal learning model, this means the effect is used for work that should happen once after the component initially mounts.

```text
initial render
↓
effect runs
↓
later normal re-renders
↓
effect does not run again
```

That matches this use case because we want to load the saved cart when the checkout page opens.

> **Tip**
>
> Instead of memorizing `[] = once`, understand it as “there are no changing dependencies to watch.”

---

# 13. What Does Mount Mean?

Mount means that a component appears in the UI for the first time.

```text
CheckoutPage does not exist on screen
↓
open /checkout
↓
React creates CheckoutPage
↓
it appears
↓
mount
```

An effect with an empty dependency array is commonly used for work associated with this initial mount.

> **Tip**
>
> `mount` = the component enters the screen for the first time.

---

# 14. What If There Is No Dependency Array?

Consider:

```tsx
useEffect(() => {
  console.log("effect");
});
```

There is no second argument.

This effect runs after every render.

```text
render
↓
effect
↓
render
↓
effect
↓
...
```

It does not automatically mean an infinite loop, but it can create one if the effect also updates state.

For example:

```tsx
useEffect(() => {
  setCart(...);
});
```

could create:

```text
render
↓
effect
↓
setCart()
↓
state update
↓
render
↓
effect
↓
setCart()
↓
...
```

> **Tip**
>
> No dependency array means the effect is eligible to run after every render.

---

# 15. What Happens With []?

```tsx
useEffect(() => {
  console.log("effect");
}, []);
```

The usual learning model is:

```text
initial render
↓
effect runs
↓
state changes
↓
re-render
↓
effect normally does not run again
```

This makes it suitable for loading initial cart data.

> **Tip**
>
> Initial data loading is one of the most common places where you will see `[]`.

---

# 16. What If the Array Contains a Value?

Example:

```tsx
useEffect(() => {
  console.log(name);
}, [name]);
```

The effect depends on `name`.

```text
initial render
↓
effect

name changes
↓
effect

name changes again
↓
effect
```

So:

```text
[]
→ no changing dependency being watched

[name]
→ watch name
```

> **Tip**
>
> Think of the dependency array as a list of values whose changes matter to the effect.

---

# 17. Compare the Three Patterns

### A. No second argument

```tsx
useEffect(() => {
  // ...
});
```

Runs after every render.

### B. Empty array

```tsx
useEffect(() => {
  // ...
}, []);
```

Used for initial mount behavior.

### C. Dependency value

```tsx
useEffect(() => {
  // ...
}, [name]);
```

Runs initially and again when `name` changes.

| Form | Basic execution model |
|---|---|
| `useEffect(fn)` | after every render |
| `useEffect(fn, [])` | after initial mount |
| `useEffect(fn, [name])` | initial + when `name` changes |

> **Tip**
>
> Compare these three side by side rather than studying each in isolation.

---

# 18. Why [] Fits the Checkout Cart Load

The desired behavior is:

```text
open checkout
↓
read saved cart once
↓
store it in state
```

We do not want to re-read localStorage every time the cart state causes a render.

So:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

fits the task.

> **Tip**
>
> Ask: “What value should cause this effect to run again?” In this case, the answer is none for this initial load.

---

# 19. setCart() and Re-rendering

When:

```tsx
setCart(JSON.parse(savedCart));
```

runs, the cart state changes.

Then React re-renders.

```text
initial cart = []
↓
render
↓
effect
↓
read localStorage
↓
setCart(parsedCart)
↓
state changes
↓
re-render
↓
UI now uses saved cart
```

Because the effect has `[]`, this normal re-render does not repeatedly reload localStorage.

> **Tip**
>
> Understand these two rules together:
>
> `setState → re-render`
>
> `[] → effect normally does not repeat on that re-render`

---

# 20. Full Example

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <main>
      <h1>Checkout</h1>
    </main>
  );
}
```

---

# 21. Read the Code Line by Line

```tsx
"use client";
```

Client Component.

```tsx
const [cart, setCart] = useState([]);
```

Initial cart state is an empty array.

```tsx
useEffect(() => {
```

Define side-effect logic.

```tsx
const savedCart = localStorage.getItem("cart");
```

Read the saved string.

```tsx
if (savedCart) {
```

Check whether data exists.

```tsx
JSON.parse(savedCart)
```

Convert the string back into JavaScript data.

```tsx
setCart(...)
```

Update React state.

```tsx
}, []);
```

No changing dependency is being watched; use it as initial-load behavior.

> **Tip**
>
> If you can explain every line without looking at notes, the concept is starting to become yours.

---

# 22. Final Data Flow

```text
Day 4

cart state
↓
JSON.stringify()
↓
localStorage.setItem()
↓
stored as text


Day 5

/checkout mounts
↓
useEffect
↓
localStorage.getItem()
↓
savedCart string
↓
JSON.parse()
↓
JavaScript array
↓
setCart()
↓
state update
↓
re-render
↓
render order items
```

> **Tip**
>
> Draw this flow once from memory. It is a good test of whether you understand the relationship between storage, effects, state, and rendering.

---

# 한국어

## 1. 이번 이론의 목표

이번 Day 5 단계의 핵심은 `/cart`에서 저장해둔 장바구니 데이터를 `/checkout`에서 다시 읽어 React state에 넣는 것이다.

전체 흐름은 다음과 같다.

```text
/cart에서 cart 저장
↓
localStorage
↓
/checkout에서 읽기
↓
JSON.parse()
↓
React state에 저장
↓
재렌더링
↓
주문 상품 화면 출력
```

이 과정에서 핵심적으로 이해해야 할 것은:

```text
localStorage
JSON.stringify()
JSON.parse()
useState()
useEffect()
의존성 배열 []
```

이다.

> **팁**
>
> 코드를 한 덩어리로 외우지 말고 **저장 → 읽기 → 변환 → state 저장 → 렌더링**으로 나눠 생각한다.

---

## 2. localStorage란?

`localStorage`는 브라우저가 제공하는 저장 공간이다.

예를 들어 Day 4에서 장바구니를 저장할 때 다음과 같은 코드를 사용할 수 있다.

```tsx
localStorage.setItem("cart", JSON.stringify(cart));
```

여기서 가장 중요한 점은 `localStorage`가 기본적으로 **문자열을 저장한다**는 것이다.

예를 들어 원래 cart가:

```tsx
[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 }
]
```

이라는 JavaScript 배열이어도 그대로 배열 상태로 저장되는 것이 아니다.

```text
JavaScript 배열
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage 저장
```

의 과정을 거친다.

> **팁**
>
> `localStorage`는 **JavaScript 배열/객체 보관함**이 아니라 **문자열 보관함**이라고 생각하면 이해가 쉽다.

---

## 3. JSON.stringify()는 무엇인가

`JSON.stringify()`는 JavaScript 배열이나 객체를 JSON 형식의 문자열로 바꿔준다.

```tsx
const cart = [
  { productId: 1, quantity: 2 }
];

const text = JSON.stringify(cart);
```

개념적으로:

```text
JavaScript 데이터
↓
JSON.stringify()
↓
문자열
```

이다.

따라서:

```tsx
localStorage.setItem("cart", JSON.stringify(cart));
```

는:

```text
cart 배열
↓
문자열로 변환
↓
"cart"라는 이름으로 저장
```

이라고 읽으면 된다.

> **팁**
>
> `stringify` 안에 `string`이 들어있다고 생각하면 **문자열로 만든다**는 역할이 잘 기억난다.

---

## 4. localStorage.getItem()은 무엇인가

저장한 데이터를 읽을 때는:

```tsx
localStorage.getItem("cart");
```

을 사용한다.

```tsx
const savedCart = localStorage.getItem("cart");
```

라고 하면 `"cart"`라는 key에 저장되어 있던 값을 가져온다.

하지만 반환되는 값은:

```text
문자열
또는
null
```

이다.

원래 cart 배열이 바로 반환되는 것이 아니다.

> **팁**
>
> `getItem()`을 한 직후에는 아직 JavaScript 배열이 아니라 **저장되어 있던 문자열**이라고 생각한다.

---

## 5. JSON.parse()가 왜 필요한가

저장할 때:

```tsx
JSON.stringify(cart)
```

로 문자열로 바꿨기 때문에 읽을 때는 다시 JavaScript 데이터로 복구해야 한다.

이때 사용하는 것이:

```tsx
JSON.parse()
```

이다.

```tsx
const savedCart = localStorage.getItem("cart");

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
}
```

전체 왕복 흐름은:

```text
저장

JavaScript 배열
↓
JSON.stringify()
↓
문자열
↓
localStorage


읽기

localStorage
↓
getItem()
↓
문자열
↓
JSON.parse()
↓
JavaScript 배열
```

이다.

> **팁**
>
> 둘을 한 쌍으로 기억한다.
>
> `stringify` = JavaScript → 문자열  
> `parse` = 문자열 → JavaScript

---

# 6. 왜 if (savedCart)가 필요한가

`localStorage.getItem("cart")`가 항상 값을 반환하는 것은 아니다.

만약 `"cart"`라는 데이터가 저장되어 있지 않다면:

```tsx
null
```

을 반환할 수 있다.

그래서:

```tsx
const savedCart = localStorage.getItem("cart");

if (savedCart) {
  const parsedCart = JSON.parse(savedCart);
}
```

처럼 확인한다.

흐름은:

```text
cart 데이터가 존재하는가?
│
├─ YES → JSON.parse()
└─ NO  → parse하지 않음
```

이다.

> **팁**
>
> localStorage나 API 같은 외부 데이터는 **항상 존재한다고 가정하지 않는 습관**이 중요하다.

---

# 7. 왜 React state에 넣는가

checkout 화면이 cart 데이터를 기준으로 렌더링되게 만들고 싶기 때문이다.

따라서:

```tsx
const [cart, setCart] = useState([]);
```

로 state를 만들고,

```tsx
setCart(JSON.parse(savedCart));
```

로 저장 데이터를 넣는다.

전체 흐름은:

```text
localStorage
↓
getItem()
↓
문자열
↓
JSON.parse()
↓
JavaScript 배열
↓
setCart()
↓
cart state 변경
↓
React 재렌더링
↓
새 cart 기준으로 화면 출력
```

이다.

> **팁**
>
> `localStorage`는 **보관용 저장소**, `state`는 **현재 화면이 사용하는 데이터**라고 구분한다.

---

# 8. 왜 "use client"가 필요한가

Next.js App Router에서 컴포넌트는 기본적으로 Server Component로 다뤄진다.

그런데 `localStorage`는 브라우저에만 존재한다.

```text
브라우저
→ localStorage 있음

서버
→ localStorage 없음
```

또한 `useState`, `useEffect` 같은 Hook을 사용하는 컴포넌트도 Client Component여야 한다.

그래서 파일 상단에:

```tsx
"use client";
```

를 작성한다.

예:

```tsx
"use client";

import { useEffect, useState } from "react";
```

> **팁**
>
> `localStorage`, `window`, `document`, `useState`, `useEffect`가 등장하면 **이 컴포넌트가 클라이언트에서 실행되어야 하는가?**를 떠올린다.

---

# 9. useEffect란 무엇인가

`useEffect`는 React 컴포넌트의 **렌더링 자체와는 별도로 어떤 작업을 실행할 때** 사용하는 Hook이다.

기본 형태는:

```tsx
useEffect(() => {
  // 실행할 작업
}, []);
```

이번에는:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
}, []);
```

처럼 localStorage를 읽는 작업을 넣을 수 있다.

입문 단계에서는 다음처럼 이해하면 좋다.

```text
컴포넌트 렌더링
↓
화면 반영
↓
useEffect 실행
```

> **팁**
>
> 처음에는 `useEffect`를 **렌더링 이후에 실행하고 싶은 작업을 작성하는 곳**이라고 이해해도 충분하다.

---

# 10. 왜 localStorage 읽기를 useEffect 안에서 하는가

이번 checkout 페이지에서 원하는 것은:

```text
checkout 페이지가 브라우저에 나타남
↓
저장된 cart 읽기
↓
state에 저장
```

이다.

실제 흐름을 조금 더 구체적으로 보면:

```text
CheckoutPage 첫 렌더링
↓
브라우저에 컴포넌트가 나타남
↓
useEffect 실행
↓
localStorage.getItem("cart")
↓
저장된 데이터 읽기
↓
setCart()
↓
cart state 변경
↓
다시 렌더링
```

이다.

이렇게 하면 **화면을 만드는 렌더링 로직**과 **브라우저 저장소를 읽는 작업**을 구분할 수 있다.

> **팁**
>
> `return (...)`은 **화면을 설명**, `useEffect`는 **렌더링과 별개로 필요한 작업 수행**이라고 구분하면 좋다.

---

# 11. useEffect의 두 번째 인자는 무엇인가

`useEffect`는 일반적으로:

```tsx
useEffect(() => {
  // effect
}, [의존값]);
```

형태를 가진다.

두 번째 인자인:

```tsx
[의존값]
```

을 **의존성 배열(Dependency Array)** 이라고 한다.

React는 이 배열을 보고:

```text
이 effect를 언제 다시 실행해야 하는가?
```

를 판단한다.

> **팁**
>
> `[]`를 단순한 문법 장식처럼 보면 안 된다. **effect가 어떤 값의 변화에 의존하는지 React에게 알려주는 자리**다.

---

# 12. 빈 배열 []은 무엇을 의미하는가

이번 코드에서:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

마지막의:

```tsx
[]
```

에는 아무 값도 들어있지 않다.

이는 개념적으로:

```text
이 effect가 다시 실행되도록 감시할 state나 props가 없다
```

라는 뜻이다.

입문 단계에서의 실행 흐름은:

```text
처음 렌더링
↓
컴포넌트 mount
↓
useEffect 실행
↓
이후 일반적인 재렌더링
↓
effect는 다시 실행하지 않음
```

이라고 이해하면 된다.

이번에는 checkout 페이지를 처음 열었을 때 cart를 한 번 읽는 것이 목적이므로 `[]`가 잘 맞는다.

> **팁**
>
> `[] = 한 번`이라고만 외우기보다는 **감시하는 의존값이 없다**라고 이해하면 나중에 `[name]`, `[cart]` 같은 형태를 배울 때 훨씬 쉽다.

---

# 13. mount란 무엇인가

React에서 **mount**는 컴포넌트가 화면에 처음 등장하는 것을 말한다.

예를 들어:

```text
아직 CheckoutPage가 없음
↓
사용자가 /checkout으로 이동
↓
React가 CheckoutPage 생성
↓
화면에 처음 나타남
↓
mount
```

이다.

빈 의존성 배열을 가진 `useEffect`는 이 초기 mount 이후의 작업에 자주 사용된다.

> **팁**
>
> `mount = 컴포넌트가 화면에 처음 등장`으로 기억한다.

---

# 14. []을 아예 작성하지 않으면 어떻게 되는가

다음 코드를 보자.

```tsx
useEffect(() => {
  console.log("effect");
});
```

두 번째 인자가 없다.

이 경우 effect는 **렌더링될 때마다 실행될 수 있다.**

```text
render
↓
effect
↓
render
↓
effect
↓
render
↓
effect
```

무조건 무한 루프라는 뜻은 아니다.

하지만 effect 안에서 state를 변경한다면 문제가 생길 수 있다.

예:

```tsx
useEffect(() => {
  setCart(...);
});
```

그러면:

```text
render
↓
effect
↓
setCart()
↓
state 변경
↓
render
↓
effect
↓
setCart()
↓
...
```

처럼 반복될 가능성이 생긴다.

> **팁**
>
> 의존성 배열을 생략하면 **매 렌더링 이후 effect가 실행되는 형태**라는 점을 기억한다.

---

# 15. []이 있으면 어떻게 되는가

다음은:

```tsx
useEffect(() => {
  console.log("effect");
}, []);
```

일반적인 학습 모델에서:

```text
첫 렌더링
↓
effect 실행
↓
state 변경으로 재렌더링
↓
effect는 보통 다시 실행되지 않음
```

으로 이해한다.

이번 cart 읽기는:

```text
checkout 페이지를 열 때 한 번 읽기
```

가 목적이므로 잘 맞는다.

> **팁**
>
> **초기 데이터 로딩**, **처음 한 번 필요한 준비 작업**에서 빈 배열 `[]`을 자주 보게 된다.

---

# 16. 의존성 배열 안에 값이 있으면?

예를 들어:

```tsx
useEffect(() => {
  console.log(name);
}, [name]);
```

이라고 하면 effect는 `name`에 의존한다.

흐름은:

```text
처음
↓
effect 실행

name 변경
↓
effect 재실행

name 다시 변경
↓
effect 재실행
```

이다.

즉:

```text
[]
→ 감시할 의존값 없음

[name]
→ name 변화 감시
```

라고 볼 수 있다.

> **팁**
>
> 의존성 배열을 **이 effect가 관심 있는 값 목록**이라고 생각하면 쉽다.

---

# 17. 세 가지 패턴 비교

## A. 두 번째 인자가 없음

```tsx
useEffect(() => {
  // ...
});
```

기본 이해:

```text
렌더링될 때마다 실행
```

## B. 빈 배열

```tsx
useEffect(() => {
  // ...
}, []);
```

기본 이해:

```text
초기 mount 후 한 번 실행하는 용도로 사용
```

## C. 값이 들어있음

```tsx
useEffect(() => {
  // ...
}, [name]);
```

기본 이해:

```text
처음 + name이 변할 때
```

| 형태 | 기본 실행 이해 |
|---|---|
| `useEffect(fn)` | 매 렌더링 후 |
| `useEffect(fn, [])` | 초기 mount 후 |
| `useEffect(fn, [name])` | 초기 + `name` 변경 시 |

> **팁**
>
> 이 세 가지를 반드시 나란히 비교해본다. 따로 외우는 것보다 차이가 훨씬 잘 보인다.

---

# 18. 왜 이번 checkout에서는 []인가

이번 목적은 아주 명확하다.

```text
checkout 페이지 열기
↓
localStorage에서 cart 한 번 읽기
↓
state에 넣기
```

cart state가 바뀔 때마다 localStorage에서 다시 읽으려는 것이 아니다.

그래서:

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
```

를 사용하는 것이다.

> **팁**
>
> 항상 **이 effect는 무엇이 바뀌면 다시 실행되어야 하지?**라고 질문한다. 이번 답은 **특별히 없다. 처음 열 때만 읽으면 된다**이다.

---

# 19. setCart()와 재렌더링의 관계

처음 state는:

```tsx
const [cart, setCart] = useState([]);
```

이므로:

```text
cart = []
```

이다.

첫 렌더링 뒤 effect가 실행되고:

```tsx
setCart(JSON.parse(savedCart));
```

가 실행되면 cart state가 바뀐다.

그 결과:

```text
처음
cart = []
↓
render
↓
useEffect
↓
localStorage 읽기
↓
JSON.parse()
↓
setCart(parsedCart)
↓
cart state 변경
↓
재렌더링
↓
새 cart로 화면 생성
```

이 된다.

그리고 effect에 `[]`가 있기 때문에 이 일반적인 재렌더링 때문에 localStorage 읽기를 계속 반복하지 않는다.

> **팁**
>
> 다음 두 규칙을 한 쌍으로 기억한다.
>
> `setState → 재렌더링`
>
> `[] → 그 재렌더링 때 effect를 계속 반복하지 않도록 하는 초기 실행 패턴`

---

# 20. 전체 예제 코드

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <main>
      <h1>주문서</h1>
    </main>
  );
}
```

---

# 21. 코드를 한 줄씩 해석하기

```tsx
"use client";
```

```text
이 컴포넌트는 Client Component
```

```tsx
import { useEffect, useState } from "react";
```

```text
state와 effect Hook 사용
```

```tsx
const [cart, setCart] = useState([]);
```

```text
cart state 생성
초기값은 빈 배열
```

```tsx
useEffect(() => {
```

```text
렌더링과 별도로 실행할 작업 정의
```

```tsx
const savedCart = localStorage.getItem("cart");
```

```text
브라우저 localStorage에서 cart 문자열 읽기
```

```tsx
if (savedCart) {
```

```text
저장된 값이 실제로 존재하는지 확인
```

```tsx
JSON.parse(savedCart)
```

```text
문자열을 JavaScript 배열/객체로 복구
```

```tsx
setCart(...)
```

```text
복구한 데이터를 cart state에 저장
```

```tsx
}, []);
```

```text
감시하는 의존값 없음
→ 초기 mount 후 읽기 작업에 사용
```

> **팁**
>
> 코드를 보지 않고 이 순서를 말로 설명할 수 있으면 개념이 꽤 잘 잡힌 것이다.

---

# 22. 최종 데이터 흐름

```text
Day 4

cart state
↓
JSON.stringify()
↓
localStorage.setItem()
↓
브라우저에 문자열 형태로 저장


Day 5

/checkout mount
↓
useEffect 실행
↓
localStorage.getItem()
↓
savedCart 문자열
↓
JSON.parse()
↓
JavaScript 배열
↓
setCart()
↓
cart state 변경
↓
재렌더링
↓
주문 상품 렌더링
```

> **팁**
>
> 이 흐름을 종이에 직접 한 번 그려보면 `localStorage`, `JSON`, `state`, `useEffect`가 각각 왜 필요한지 훨씬 명확해진다.

---

# 23. 가장 중요한 핵심 요약

```text
localStorage
→ 브라우저의 문자열 저장소

JSON.stringify()
→ JavaScript 데이터를 문자열로 변환

localStorage.getItem()
→ 저장된 문자열 읽기

JSON.parse()
→ 문자열을 JavaScript 데이터로 복원

useState()
→ 현재 UI가 사용할 데이터 보관

useEffect()
→ 렌더링 이후 필요한 작업 실행

[]
→ 감시하는 의존값이 없는 effect
→ 초기 mount 후 한 번 실행하는 패턴에 사용

setCart()
→ state 변경
→ React 재렌더링
```

가장 중요한 흐름을 한 줄로 압축하면:

```text
localStorage 문자열
→ JSON.parse
→ setCart
→ state 변경
→ 재렌더링
```

그리고 이것을 checkout 페이지가 처음 열렸을 때 수행하기 위해:

```tsx
useEffect(..., []);
```

패턴을 사용하는 것이다.

> **팁**
>
> 다음 단계에서 `cart.map()`으로 화면을 그릴 때도 결국 출발점은 **useEffect로 읽은 데이터를 cart state에 넣는 것**이다.
