# Callback Functions in JavaScript & React
## 日本語 → English → 한국어

> 学習テーマ / Learning Topic / 학습 주제  
> 関数の受け渡し・関数呼び出し・コールバック関数・`filter()`・`map()`・`onClick` の関係  
> Function references, function calls, callback functions, `filter()`, `map()`, and `onClick`  
> 함수 전달, 함수 호출, 콜백 함수, `filter()`, `map()`, `onClick`의 관계

---

# 1. 日本語 — JavaScript / React のコールバック関数

## 1.1 コールバック関数とは？

コールバック関数（callback function）とは、**別の関数や仕組みに渡しておき、必要なタイミングで実行してもらう関数**のことです。

まず一番大切なのは、次の2つを区別することです。

```js
handleCancelOrder
```

これは**関数そのもの**です。

一方で:

```js
handleCancelOrder()
```

これは**関数を今すぐ呼び出すこと**です。

つまり:

```text
handleCancelOrder
→ 関数そのもの
→ 渡すことができる

handleCancelOrder()
→ 関数を実行する
→ 戻り値が返る
```

> **ヒント**  
> `()` を「実行ボタン」と考えると分かりやすいです。  
> 関数名の後ろに `()` が付くと、その関数を呼び出します。

---

## 1.2 関数を作っただけでは実行されない

```js
function sayHello() {
  console.log("こんにちは");
}
```

この時点では関数を**定義しただけ**です。

まだ:

```text
こんにちは
```

は表示されません。

実行するには:

```js
sayHello();
```

と書く必要があります。

流れ:

```text
function sayHello() { ... }
        ↓
関数を準備

sayHello()
        ↓
関数を実行

console.log("こんにちは")
        ↓
こんにちは
```

> **ヒント**  
> 関数定義 = 機能を作る  
> 関数呼び出し = その機能を使う  
> と考えてください。

---

## 1.3 JavaScript では関数も「値」として扱える

JavaScript では関数そのものを変数に入れることもできます。

```js
function sayHello() {
  console.log("こんにちは");
}

const myFunction = sayHello;
```

このとき:

```js
sayHello
```

には `()` がありません。

そのため、関数を実行しているのではなく、**関数そのものを `myFunction` に渡しています。**

```text
sayHello 関数
      ↓
myFunction に保存
```

そして:

```js
myFunction();
```

とすると実行されます。

結果:

```text
こんにちは
```

> **ヒント**  
> JavaScript の重要な特徴の1つは、関数を文字列や数値のように「値」として扱えることです。

---

## 1.4 関数そのものと戻り値は違う

次の関数を見てください。

```js
function getNumber() {
  return 100;
}
```

### 関数そのものを保存する

```js
const a = getNumber;
```

この場合 `a` は関数です。

```js
a();
```

とすれば `100` が返ります。

### 関数の実行結果を保存する

```js
const b = getNumber();
```

この場合は `getNumber()` がすぐ実行されます。

```text
getNumber()
    ↓
return 100
    ↓
b = 100
```

> **ヒント**  
> `getNumber` = 関数  
> `getNumber()` = 関数の実行結果  
> この区別は React のイベント処理でも非常に重要です。

---

# 1.5 コールバックの基本イメージ

```js
function sayHello() {
  console.log("こんにちは");
}

setTimeout(sayHello, 1000);
```

ここでは `sayHello` を `setTimeout` に渡しています。

```text
sayHello
   ↓
setTimeout に渡す
   ↓
setTimeout が記憶
   ↓
1秒後
   ↓
sayHello() を実行
```

このように、**今すぐではなく後で実行してもらうために渡す関数**をコールバック関数と呼びます。

> **ヒント**  
> コールバック = 「関数を渡して、あとで呼び返してもらう」と理解すると覚えやすいです。

---

# 1.6 `filter()` とコールバック

Day 8 の注文キャンセルでは次のコードを使います。

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

ここでコールバック関数は:

```tsx
(order) => order.id !== orderId
```

です。

`filter()` はこの関数を受け取り、配列の各要素に対して繰り返し実行します。

例えば:

```tsx
const orders = [
  { id: 1001 },
  { id: 1002 },
  { id: 1003 },
];

const orderId = 1002;
```

であれば:

```text
1001 !== 1002
→ true
→ 残す

1002 !== 1002
→ false
→ 除外

1003 !== 1002
→ true
→ 残す
```

結果:

```tsx
[
  { id: 1001 },
  { id: 1003 }
]
```

> **ヒント**  
> `filter()` のコールバックは **true / false** を返します。  
> `true` なら残り、`false` なら除外されます。

---

## 1.7 `filter()` は削除するのではなく新しい配列を作る

次のコード:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

は、元の `orders` を直接変更しません。

```text
orders
→ [1001, 1002, 1003]

updatedOrders
→ [1001, 1003]
```

つまり:

```text
既存の配列を削る
×
対象以外を集めた新しい配列を作る
○
```

> **ヒント**  
> React ではこの「新しい配列を作る」という考え方が非常に重要です。  
> これは不変性（Immutability）にもつながります。

---

# 1.8 `filter()` を `for` 文で考える

`filter()` が難しい場合は、次のように考えると分かりやすくなります。

```tsx
const result = [];

for (const order of orders) {
  const shouldKeep = order.id !== orderId;

  if (shouldKeep) {
    result.push(order);
  }
}
```

これを短く書いてくれるのが:

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

です。

> **ヒント**  
> 配列メソッドが難しいときは、一度 `for` 文に戻して考えると内部の動作が見えやすくなります。

---

# 1.9 `map()` とコールバック

`map()` もコールバック関数を受け取ります。

```tsx
const names = orders.map(
  (order) => order.productName
);
```

ここでは:

```tsx
(order) => order.productName
```

がコールバックです。

`map()` は各要素に対してコールバックを実行し、その戻り値で新しい配列を作ります。

```text
order1
↓
productName を返す

order2
↓
productName を返す

order3
↓
productName を返す

↓
新しい配列
```

> **ヒント**  
> `filter()` は「残すかどうか」を決める。  
> `map()` は「何に変えるか」を決める。  
> と区別してください。

---

# 1.10 `map()` で注文内容を更新する

例えば注文そのものは残し、状態だけ変更したい場合:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? { ...order, status: "キャンセル" }
    : order
);
```

処理:

```text
1001
→ 対象ではない
→ 元の order を返す

1002
→ 対象
→ status を変更した新しいオブジェクトを返す

1003
→ 対象ではない
→ 元の order を返す
```

> **ヒント**  
> `map()` は「配列の要素数は変えず、中身を変えたい」ときによく使います。

---

# 1.11 `filter()` と `map()` の return の違い

### `filter()`

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

返すもの:

```text
true / false
```

意味:

```text
true
→ この要素を残す

false
→ この要素を除外する
```

### `map()`

```tsx
orders.map(
  (order) => order.productName
);
```

返すもの:

```text
新しい配列の要素
```

つまり:

```text
filter の return
→ 残すかどうか

map の return
→ 新しい要素を何にするか
```

> **ヒント**  
> 配列メソッドを読むときは「このコールバックは何を return する必要がある？」と考えると理解が早いです。

---

# 1.12 コールバックの引数は誰が入れる？

```tsx
orders.filter((order) => {
  return order.id !== orderId;
});
```

ここで `order` の値は自分で入れていません。

`filter()` が配列の現在の要素を渡してくれます。

イメージ:

```text
filter
↓
callback(order1001)

filter
↓
callback(order1002)

filter
↓
callback(order1003)
```

そのため `order` という名前は自由です。

```tsx
orders.filter((item) => item.id !== orderId);
```

でも同じです。

> **ヒント**  
> コールバックの引数を見るときは「この値は誰が渡しているのか？」を考えてください。

---

# 1.13 React の `onClick` とコールバック

React では:

```tsx
function handleCancelOrder() {
  console.log("注文キャンセル");
}

<button onClick={handleCancelOrder}>
  注文をキャンセル
</button>
```

と書きます。

ここでは:

```tsx
handleCancelOrder
```

という関数そのものを React に渡しています。

```text
レンダリング
↓
React に handleCancelOrder を渡す
↓
まだ実行しない
↓
ユーザーがクリック
↓
React が handleCancelOrder() を実行
```

> **ヒント**  
> `onClick` は「クリックされたら実行する関数を受け取る場所」と考えてください。

---

# 1.14 `onClick={handleCancelOrder}` と `onClick={handleCancelOrder()}`

正しい基本形:

```tsx
onClick={handleCancelOrder}
```

これは関数を渡します。

一方:

```tsx
onClick={handleCancelOrder()}
```

は関数をその場で呼び出します。

概念的には:

```text
handleCancelOrder()
↓
関数を実行
↓
戻り値を onClick に渡す
```

となります。

> **ヒント**  
> React イベントでは通常、**実行結果ではなく実行する関数そのもの**を渡します。

---

# 1.15 なぜ `onClick={() => handleCancelOrder()}` は大丈夫？

```tsx
onClick={() => handleCancelOrder()}
```

この場合 React に渡しているのは:

```tsx
() => handleCancelOrder()
```

という新しい関数そのものです。

```text
レンダリング
↓
() => handleCancelOrder() を React に渡す
↓
まだ handleCancelOrder は実行しない
↓
クリック
↓
矢印関数を実行
↓
handleCancelOrder() 実行
```

> **ヒント**  
> 矢印関数が `handleCancelOrder()` を包むことで、実行タイミングをクリック時まで遅らせています。

---

# 1.16 値を渡したいときは矢印関数が便利

例えば:

```tsx
function handleCancelOrder(orderId: number) {
  console.log(orderId);
}
```

この関数に `1002` を渡したい場合:

```tsx
onClick={() => handleCancelOrder(1002)}
```

と書けます。

注文一覧では:

```tsx
orders.map((order) => (
  <button
    key={order.id}
    onClick={() => handleCancelOrder(order.id)}
  >
    キャンセル
  </button>
))
```

と使えます。

> **ヒント**  
> イベント発生時に ID や値を渡したい場合は、`() => 関数(値)` の形をよく使います。

---

# 1.17 `filter()` / `map()` / `onClick` の共通点

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

```tsx
orders.map(
  (order) => order.productName
);
```

```tsx
<button onClick={handleCancelOrder}>
```

これらはすべて:

```text
関数を用意する
↓
別の仕組みに渡す
↓
必要なタイミングで実行される
```

という共通点があります。

> **ヒント**  
> コールバックを見つけるときは、`=>` だけを見るのではなく「この関数は誰に渡されている？」と考えてください。

---

# 1.18 実行タイミングと回数の違い

| 仕組み | いつ実行される？ | 何回実行される？ |
|---|---|---|
| `filter()` | 配列を絞り込むとき | 各要素ごと |
| `map()` | 配列を変換するとき | 各要素ごと |
| `onClick` | ユーザーがクリックしたとき | クリックするたび |

> **ヒント**  
> コールバックを見るときは、  
> 1. 誰が実行する？  
> 2. いつ実行する？  
> 3. 何回実行する？  
> を確認してください。

---

# 1.19 Day 8 の注文キャンセルとコールバック

最終的な Day 8 の処理:

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

  router.push("/orders");
}
```

ボタン:

```tsx
<button onClick={handleCancelOrder}>
  注文をキャンセル
</button>
```

流れ:

```text
ユーザーがクリック
↓
handleCancelOrder 実行
↓
confirm
↓
filter
↓
filter の callback 実行
↓
対象注文を除外
↓
updatedOrders
↓
localStorage 更新
↓
state 更新
↓
/orders へ移動
```

> **ヒント**  
> Day 8 では、イベントのコールバックと配列メソッドのコールバックが同じ処理の中に登場します。

---

# 1.20 日本語まとめ

```text
関数名
→ 関数そのもの

関数名()
→ 関数を今すぐ実行

callback
→ 他の関数・仕組みに渡して後で実行される関数

filter(callback)
→ true の要素だけ残す

map(callback)
→ callback の戻り値で新しい配列を作る

onClick={callback}
→ クリック時に callback を実行
```

> **ヒント**  
> コールバックを理解すると、React のイベント処理と配列操作が別々の知識ではなく、JavaScript の「関数を値として渡す」という1つの考え方でつながります。

---

# 2. English — Callback Functions in JavaScript and React

## 2.1 What Is a Callback Function?

A callback function is **a function passed to another function or system so that it can be executed later when needed**.

The first distinction to understand is:

```js
handleCancelOrder
```

This refers to the **function itself**.

But:

```js
handleCancelOrder()
```

means **call the function now**.

```text
handleCancelOrder
→ function reference
→ can be passed somewhere

handleCancelOrder()
→ function call
→ executes now
→ produces a return value
```

> **Tip**  
> Think of `()` as an “execute button.” When parentheses are added after a function name, the function is being called.

---

## 2.2 Defining a Function Does Not Execute It

```js
function sayHello() {
  console.log("Hello");
}
```

This only defines the function.

Nothing is printed yet.

To execute it:

```js
sayHello();
```

Flow:

```text
Define sayHello
↓
Function exists

Call sayHello()
↓
Function runs
↓
console.log("Hello")
```

> **Tip**  
> Function definition = create the behavior.  
> Function call = use the behavior.

---

## 2.3 Functions Are Values in JavaScript

JavaScript allows functions to be stored in variables.

```js
function sayHello() {
  console.log("Hello");
}

const myFunction = sayHello;
```

Because there are no parentheses after `sayHello`, the function is not executed.

Instead, the function reference is assigned to `myFunction`.

```text
sayHello function
      ↓
stored in myFunction
```

Then:

```js
myFunction();
```

executes it.

> **Tip**  
> A key JavaScript concept is that functions can be passed around like other values.

---

## 2.4 Function Reference vs Return Value

```js
function getNumber() {
  return 100;
}
```

### Store the function

```js
const a = getNumber;
```

`a` is now a function.

```js
a();
```

returns `100`.

### Store the result

```js
const b = getNumber();
```

Now `getNumber()` runs immediately.

```text
getNumber()
↓
return 100
↓
b = 100
```

> **Tip**  
> `getNumber` is a function.  
> `getNumber()` is the value returned by the function.

---

# 2.5 Basic Callback Mental Model

```js
function sayHello() {
  console.log("Hello");
}

setTimeout(sayHello, 1000);
```

Here, `sayHello` is passed into `setTimeout`.

```text
pass sayHello
↓
setTimeout remembers it
↓
1 second later
↓
setTimeout calls sayHello()
```

That function being passed for later execution is a callback.

> **Tip**  
> A callback is simply a function handed to some other code to be called later.

---

# 2.6 `filter()` and Callbacks

Day 8 uses:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

The callback is:

```tsx
(order) => order.id !== orderId
```

`filter()` executes this callback for every array element.

Example:

```tsx
const orders = [
  { id: 1001 },
  { id: 1002 },
  { id: 1003 },
];

const orderId = 1002;
```

Evaluation:

```text
1001 !== 1002
→ true
→ keep

1002 !== 1002
→ false
→ exclude

1003 !== 1002
→ true
→ keep
```

Result:

```tsx
[
  { id: 1001 },
  { id: 1003 }
]
```

> **Tip**  
> A `filter()` callback should return a truthy/falsy decision. In the common case, think `true = keep`, `false = remove from the result`.

---

## 2.7 `filter()` Creates a New Array

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

does not directly change `orders`.

Instead:

```text
orders
→ [1001, 1002, 1003]

updatedOrders
→ [1001, 1003]
```

This is especially useful in React because state updates often rely on creating new arrays or objects.

> **Tip**  
> Do not think “filter deletes from the original array.”  
> Think “filter creates a new array containing only the items I want to keep.”

---

# 2.8 Thinking About `filter()` as a Loop

A simplified mental model:

```tsx
const result = [];

for (const order of orders) {
  const shouldKeep = order.id !== orderId;

  if (shouldKeep) {
    result.push(order);
  }
}
```

`filter()` packages this pattern into a reusable method:

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

> **Tip**  
> If array methods feel abstract, rewrite them mentally as a loop.

---

# 2.9 `map()` and Callbacks

`map()` also receives a callback.

```tsx
const names = orders.map(
  (order) => order.productName
);
```

The callback is:

```tsx
(order) => order.productName
```

`map()` runs it once for each item and builds a new array from the callback return values.

```text
order1
↓
return productName

order2
↓
return productName

order3
↓
return productName

↓
new array
```

> **Tip**  
> `filter()` asks: “Should this item stay?”  
> `map()` asks: “What should this item become?”

---

# 2.10 Updating an Order with `map()`

If the order should stay in the array but its status should change:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? { ...order, status: "Canceled" }
    : order
);
```

Flow:

```text
1001
→ not target
→ return original order

1002
→ target
→ return a new object with changed status

1003
→ not target
→ return original order
```

> **Tip**  
> `map()` is a strong choice when the array length should remain the same but one or more items need updated values.

---

# 2.11 Return Values: `filter()` vs `map()`

### `filter()`

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

Callback returns:

```text
true / false
```

Meaning:

```text
true
→ keep the item

false
→ exclude the item
```

### `map()`

```tsx
orders.map(
  (order) => order.productName
);
```

Callback returns:

```text
the next value to place in the new array
```

So:

```text
filter callback return
→ keep or remove decision

map callback return
→ transformed value
```

> **Tip**  
> When reading an array method, ask: “What is this callback supposed to return?”

---

# 2.12 Who Supplies the Callback Parameter?

```tsx
orders.filter((order) => {
  return order.id !== orderId;
});
```

You did not manually assign `order`.

`filter()` supplies the current array item each time it invokes the callback.

Conceptually:

```text
callback(order1001)
callback(order1002)
callback(order1003)
```

The variable name is your choice:

```tsx
orders.filter((item) => item.id !== orderId);
```

works the same way.

> **Tip**  
> When you see a callback parameter, ask: “Which function is calling this callback, and what value is it passing in?”

---

# 2.13 React `onClick` and Callbacks

```tsx
function handleCancelOrder() {
  console.log("Cancel order");
}

<button onClick={handleCancelOrder}>
  Cancel order
</button>
```

React receives the function reference:

```tsx
handleCancelOrder
```

Flow:

```text
render
↓
pass handleCancelOrder to React
↓
do not run yet
↓
user clicks
↓
React calls handleCancelOrder()
```

> **Tip**  
> Think of `onClick` as a place where React expects a function to execute later.

---

# 2.14 `onClick={handleCancelOrder}` vs `onClick={handleCancelOrder()}`

Recommended basic form:

```tsx
onClick={handleCancelOrder}
```

This passes the function.

But:

```tsx
onClick={handleCancelOrder()}
```

calls it immediately during evaluation.

Conceptually:

```text
handleCancelOrder()
↓
function runs
↓
return value is produced
↓
that return value is assigned to onClick
```

> **Tip**  
> Event props generally need the function to run later, not the result of running it now.

---

# 2.15 Why `onClick={() => handleCancelOrder()}` Works

```tsx
onClick={() => handleCancelOrder()}
```

React receives this function:

```tsx
() => handleCancelOrder()
```

Flow:

```text
render
↓
pass arrow function to React
↓
do not run handleCancelOrder yet
↓
click
↓
arrow function runs
↓
handleCancelOrder() runs
```

> **Tip**  
> The arrow function delays the inner function call until the event actually happens.

---

# 2.16 Passing Values to an Event Handler

Suppose:

```tsx
function handleCancelOrder(orderId: number) {
  console.log(orderId);
}
```

To pass a value on click:

```tsx
onClick={() => handleCancelOrder(1002)}
```

In an order list:

```tsx
orders.map((order) => (
  <button
    key={order.id}
    onClick={() => handleCancelOrder(order.id)}
  >
    Cancel
  </button>
))
```

> **Tip**  
> When an event handler needs an ID or another value, `() => handler(value)` is a very common pattern.

---

# 2.17 The Common Idea Behind `filter()`, `map()`, and `onClick`

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

```tsx
orders.map(
  (order) => order.productName
);
```

```tsx
<button onClick={handleCancelOrder}>
```

All three follow the same broad pattern:

```text
prepare a function
↓
pass it somewhere
↓
that system executes it at the appropriate time
```

> **Tip**  
> Callback knowledge connects many JavaScript and React concepts that otherwise look unrelated.

---

# 2.18 Different Execution Timing

| Feature | When callback runs | How often |
|---|---|---|
| `filter()` | while filtering the array | once per item |
| `map()` | while transforming the array | once per item |
| `onClick` | when the user clicks | once per click |

> **Tip**  
> For every callback, identify:
> 1. Who calls it?
> 2. When is it called?
> 3. How many times is it called?

---

# 2.19 Day 8 Order Cancellation Flow

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

  router.push("/orders");
}
```

Button:

```tsx
<button onClick={handleCancelOrder}>
  Cancel order
</button>
```

Flow:

```text
User clicks
↓
handleCancelOrder runs
↓
confirm
↓
filter runs
↓
filter callback runs for each order
↓
target order is excluded
↓
updatedOrders created
↓
localStorage updated
↓
React state updated
↓
navigate to /orders
```

> **Tip**  
> Day 8 combines an event callback and an array-method callback in one feature.

---

# 2.20 English Summary

```text
functionName
→ function itself

functionName()
→ call the function now

callback
→ function passed somewhere to be executed later

filter(callback)
→ keep elements for which callback passes

map(callback)
→ build a new array from callback return values

onClick={callback}
→ execute callback when the click happens
```

> **Tip**  
> Once callbacks make sense, React events and JavaScript array methods start to feel like parts of the same idea instead of separate syntax rules.

---

# 3. 한국어 — JavaScript / React 콜백 함수 완전 정리

## 3.1 콜백 함수란?

콜백 함수(callback function)는 **다른 함수나 시스템에 전달해 두었다가, 필요한 시점에 실행되는 함수**입니다.

가장 먼저 다음 둘을 구분해야 합니다.

```js
handleCancelOrder
```

이건 **함수 자체**입니다.

반면:

```js
handleCancelOrder()
```

는 **함수를 지금 호출하는 것**입니다.

정리하면:

```text
handleCancelOrder
→ 함수 자체
→ 다른 곳에 전달 가능

handleCancelOrder()
→ 함수 호출
→ 지금 실행됨
→ return 값이 나옴
```

> **팁**  
> `()`를 함수의 **실행 버튼**이라고 생각하세요.  
> 함수 이름 뒤에 `()`가 붙으면 호출입니다.

---

## 3.2 함수는 만들었다고 자동 실행되지 않는다

```js
function sayHello() {
  console.log("안녕하세요");
}
```

이 코드는 함수의 기능을 **정의만 한 상태**입니다.

아직 실행되지 않습니다.

실행하려면:

```js
sayHello();
```

라고 해야 합니다.

```text
함수 정의
↓
기능 준비

함수 호출
↓
sayHello()
↓
console.log 실행
↓
안녕하세요
```

> **팁**  
> 함수 정의 = 기능 만들기  
> 함수 호출 = 기능 사용하기  
> 로 구분하면 됩니다.

---

## 3.3 JavaScript에서는 함수도 값이다

JavaScript에서는 함수를 변수에 담을 수도 있습니다.

```js
function sayHello() {
  console.log("안녕하세요");
}

const myFunction = sayHello;
```

여기서 `sayHello` 뒤에 `()`가 없습니다.

즉 실행한 게 아니라 **함수 자체를 `myFunction`에 전달한 것**입니다.

```text
sayHello 함수
      ↓
myFunction에 저장
```

그다음:

```js
myFunction();
```

이라고 하면 실행됩니다.

> **팁**  
> JavaScript에서는 함수도 문자열이나 숫자처럼 다른 곳에 전달할 수 있는 값이라고 생각하세요.

---

## 3.4 함수 자체와 함수의 return 값은 다르다

```js
function getNumber() {
  return 100;
}
```

### 함수 자체 저장

```js
const a = getNumber;
```

`a`에는 함수가 들어갑니다.

```js
a();
```

라고 하면 `100`을 반환합니다.

### 함수 실행 결과 저장

```js
const b = getNumber();
```

이 경우 `getNumber()`가 바로 실행됩니다.

```text
getNumber()
↓
return 100
↓
b = 100
```

> **팁**  
> `getNumber` = 함수 자체  
> `getNumber()` = 함수 실행 결과  
> 이 차이가 React 이벤트 처리의 핵심입니다.

---

# 3.5 콜백 함수의 기본 구조

```js
function sayHello() {
  console.log("안녕하세요");
}

setTimeout(sayHello, 1000);
```

여기서 `sayHello`는 `setTimeout`에게 전달됩니다.

```text
sayHello 함수 전달
↓
setTimeout이 기억
↓
1초 후
↓
sayHello() 실행
```

이처럼 **다른 코드에 넘겨두고 나중에 실행되는 함수**를 콜백 함수라고 합니다.

> **팁**  
> 콜백을 어렵게 생각하지 말고 **함수를 넘겨두고 나중에 호출받는다**라고 이해하세요.

---

# 3.6 `filter()`와 콜백 함수

Day 8 주문 취소에서 사용하는 코드:

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

여기서 콜백 함수는:

```tsx
(order) => order.id !== orderId
```

입니다.

`filter()`는 이 함수를 배열의 각 요소마다 실행합니다.

예:

```tsx
const orders = [
  { id: 1001 },
  { id: 1002 },
  { id: 1003 },
];

const orderId = 1002;
```

검사:

```text
1001 !== 1002
→ true
→ 남김

1002 !== 1002
→ false
→ 제외

1003 !== 1002
→ true
→ 남김
```

결과:

```tsx
[
  { id: 1001 },
  { id: 1003 }
]
```

> **팁**  
> `filter()` 콜백에서는 **true = 남김 / false = 제외**로 기억하세요.

---

## 3.7 `filter()`는 기존 배열에서 직접 삭제하지 않는다

```tsx
const updatedOrders = orders.filter(
  (order) => order.id !== orderId
);
```

이 코드는 기존 `orders`를 직접 수정하지 않습니다.

```text
orders
→ [1001, 1002, 1003]

updatedOrders
→ [1001, 1003]
```

즉:

```text
기존 배열에서 삭제한다
X

남길 데이터만 모아서 새 배열을 만든다
O
```

입니다.

> **팁**  
> `filter()`를 삭제 함수라고만 외우지 마세요.  
> 정확한 의미는 **조건을 통과한 요소로 새로운 배열을 만드는 함수**입니다.

---

# 3.8 `filter()`를 반복문으로 풀어보기

`filter()`가 추상적으로 느껴지면 다음처럼 생각해볼 수 있습니다.

```tsx
const result = [];

for (const order of orders) {
  const shouldKeep =
    order.id !== orderId;

  if (shouldKeep) {
    result.push(order);
  }
}
```

이 반복 과정을 짧게 표현한 것이:

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

입니다.

> **팁**  
> 배열 메서드가 헷갈리면 잠깐 `for` 반복문으로 풀어보면 내부 동작이 훨씬 잘 보입니다.

---

# 3.9 `map()`과 콜백 함수

`map()`도 콜백 함수를 받습니다.

```tsx
const names = orders.map(
  (order) => order.productName
);
```

여기서:

```tsx
(order) => order.productName
```

가 콜백입니다.

`map()`은 배열의 각 요소마다 콜백을 실행하고, 그 return 값으로 새로운 배열을 만듭니다.

```text
order1
↓
productName 반환

order2
↓
productName 반환

order3
↓
productName 반환

↓
새 배열 생성
```

> **팁**  
> `filter()`는 **남길지 판단**, `map()`은 **무엇으로 바꿀지 판단**이라고 비교하세요.

---

# 3.10 `map()`으로 주문 수정하기

주문 자체를 삭제하지 않고 상태만 바꾸려면:

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? { ...order, status: "주문취소" }
    : order
);
```

동작:

```text
1001
→ 대상 아님
→ 기존 order 반환

1002
→ 대상 맞음
→ status를 변경한 새 객체 반환

1003
→ 대상 아님
→ 기존 order 반환
```

> **팁**  
> `map()`은 배열 개수는 그대로 유지하면서 특정 요소의 내용을 바꾸고 싶을 때 자주 사용합니다.

---

# 3.11 `filter()`와 `map()`의 return 차이

### `filter()`

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

콜백의 return:

```text
true / false
```

의미:

```text
true
→ 남김

false
→ 제외
```

### `map()`

```tsx
orders.map(
  (order) => order.productName
);
```

콜백의 return:

```text
새 배열에 들어갈 값
```

즉:

```text
filter callback return
→ 남길지 여부

map callback return
→ 새 요소의 값
```

> **팁**  
> 배열 메서드를 볼 때 항상 **콜백이 무엇을 return해야 하는가?**를 먼저 확인하세요.

---

# 3.12 콜백의 매개변수는 누가 넣어줄까?

```tsx
orders.filter((order) => {
  return order.id !== orderId;
});
```

여기서 `order`에 직접 값을 넣지 않았습니다.

`filter()`가 현재 배열 요소를 하나씩 넣어줍니다.

개념적으로:

```text
filter가 첫 번째 요소 전달
↓
callback(order1001)

filter가 두 번째 요소 전달
↓
callback(order1002)

filter가 세 번째 요소 전달
↓
callback(order1003)
```

그래서 이름은 자유롭게 바꿀 수 있습니다.

```tsx
orders.filter(
  (item) => item.id !== orderId
);
```

도 같습니다.

> **팁**  
> 콜백의 매개변수를 볼 때는 **이 값은 누가 전달해주고 있지?**를 생각하세요.

---

# 3.13 React `onClick`과 콜백 함수

```tsx
function handleCancelOrder() {
  console.log("주문 취소");
}

<button onClick={handleCancelOrder}>
  주문 취소
</button>
```

여기서 React에게 전달한 것은:

```tsx
handleCancelOrder
```

함수 자체입니다.

흐름:

```text
렌더링
↓
React에게 handleCancelOrder 전달
↓
아직 실행 X
↓
사용자가 클릭
↓
React가 handleCancelOrder() 실행
```

> **팁**  
> `onClick`은 클릭될 때 실행할 **함수를 받는 자리**라고 이해하세요.

---

# 3.14 `onClick={handleCancelOrder}`와 `onClick={handleCancelOrder()}`

기본적으로 사용하는 형태:

```tsx
onClick={handleCancelOrder}
```

이는 함수를 전달합니다.

반면:

```tsx
onClick={handleCancelOrder()}
```

는 함수를 즉시 호출합니다.

개념:

```text
handleCancelOrder()
↓
지금 실행
↓
return 값 생성
↓
그 return 값이 onClick으로 들어감
```

> **팁**  
> 이벤트에서는 보통 **함수 실행 결과가 아니라, 실행할 함수 자체**를 전달해야 합니다.

---

# 3.15 `onClick={() => handleCancelOrder()}`는 왜 되는가?

```tsx
onClick={() => handleCancelOrder()}
```

React에게 전달되는 함수는:

```tsx
() => handleCancelOrder()
```

입니다.

흐름:

```text
렌더링
↓
화살표 함수 전달
↓
아직 handleCancelOrder 실행 X
↓
클릭
↓
화살표 함수 실행
↓
handleCancelOrder() 실행
```

> **팁**  
> 화살표 함수가 안쪽 함수 호출을 감싸서 **실행 시점을 클릭할 때까지 미뤄주는 것**입니다.

---

# 3.16 값을 전달해야 할 때 화살표 함수 사용

예를 들어:

```tsx
function handleCancelOrder(orderId: number) {
  console.log(orderId);
}
```

이 함수에 특정 ID를 넘기려면:

```tsx
onClick={() => handleCancelOrder(1002)}
```

를 사용할 수 있습니다.

주문 목록에서는:

```tsx
orders.map((order) => (
  <button
    key={order.id}
    onClick={() => handleCancelOrder(order.id)}
  >
    주문 취소
  </button>
))
```

처럼 씁니다.

> **팁**  
> 이벤트 핸들러에 `id`, `index`, 상품 정보 등을 넘겨야 한다면 `() => 함수(값)` 패턴을 떠올리세요.

---

# 3.17 `filter()`, `map()`, `onClick`의 공통점

```tsx
orders.filter(
  (order) => order.id !== orderId
);
```

```tsx
orders.map(
  (order) => order.productName
);
```

```tsx
<button onClick={handleCancelOrder}>
```

전부 공통적으로:

```text
함수를 준비
↓
다른 곳에 전달
↓
필요한 시점에 실행
```

이라는 구조입니다.

> **팁**  
> `filter`, `map`, `onClick`을 서로 다른 문법으로만 보지 말고 **함수를 전달한다는 JavaScript 공통 원리**로 묶어서 이해하세요.

---

# 3.18 콜백이 실행되는 시점과 횟수

| 기능 | 콜백 실행 시점 | 실행 횟수 |
|---|---|---|
| `filter()` | 배열을 걸러낼 때 | 요소마다 |
| `map()` | 배열을 변환할 때 | 요소마다 |
| `onClick` | 사용자가 클릭할 때 | 클릭할 때마다 |

> **팁**  
> 콜백을 보면 항상 세 가지를 확인하세요.  
> 1. 누가 실행하는가?  
> 2. 언제 실행하는가?  
> 3. 몇 번 실행하는가?

---

# 3.19 Day 8 주문 취소와 콜백 연결

Day 8 최종 핸들러:

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

  router.push("/orders");
}
```

버튼:

```tsx
<button onClick={handleCancelOrder}>
  주문 취소
</button>
```

전체 흐름:

```text
사용자 클릭
↓
handleCancelOrder 실행
↓
confirm 실행
↓
filter 실행
↓
filter가 callback을 주문마다 실행
↓
취소 대상 제외
↓
updatedOrders 생성
↓
localStorage 저장
↓
React state 갱신
↓
/orders 이동
```

여기에는 두 종류의 함수 전달 흐름이 있습니다.

```text
1. onClick
   ↓
   handleCancelOrder를 이벤트 함수로 전달

2. filter
   ↓
   (order) => order.id !== orderId
   를 콜백으로 전달
```

> **팁**  
> Day 8은 단순히 주문을 지우는 기능이 아니라 **이벤트 콜백 + 배열 콜백 + 상태 갱신**이 한 흐름으로 연결되는 중요한 단계입니다.

---

# 3.20 최종 핵심 정리

```text
함수이름
→ 함수 자체

함수이름()
→ 지금 함수 호출

callback
→ 다른 함수나 시스템에 전달해
  필요한 시점에 실행되는 함수

filter(callback)
→ callback 결과가 true인 요소만 남김

map(callback)
→ callback의 return 값으로 새 배열 생성

onClick={callback}
→ 클릭할 때 callback 실행
```

그리고 Day 8에서는:

```text
button
↓
onClick
↓
handleCancelOrder
↓
confirm
↓
filter(callback)
↓
updatedOrders
↓
localStorage
↓
setOrders
↓
router.push
```

로 이어집니다.

> **팁**  
> 앞으로 `(...) => ...` 형태를 보면 단순히 “화살표 함수네”라고 끝내지 말고,  
> **이 함수는 누구에게 전달되는가? 언제 실행되는가? 무엇을 return해야 하는가?**  
> 를 순서대로 생각해보세요.

---

# 4. Quick Reference / クイックリファレンス / 빠른 복습표

| 개념 | 日本語 | English | 한국어 |
|---|---|---|---|
| `fn` | 関数そのもの | function reference | 함수 자체 |
| `fn()` | 関数呼び出し | function call | 함수 호출 |
| callback | 後で実行される関数 | function executed later | 나중에 실행되는 함수 |
| `filter()` | 条件で残す | keep matching items | 조건에 맞는 요소 남기기 |
| `map()` | 各要素を変換 | transform each item | 각 요소 변환 |
| `onClick` | クリック時に実行 | run on click | 클릭 시 실행 |

---

# 5. Final Mental Model

```text
JavaScript Function
        │
        ├── 関数そのもの / Function Reference / 함수 자체
        │      ↓
        │   handleCancelOrder
        │
        ├── 関数呼び出し / Function Call / 함수 호출
        │      ↓
        │   handleCancelOrder()
        │
        └── Callback
               ↓
        他の仕組みに渡す
        Pass to another system
        다른 곳에 전달
               ↓
        必要な時に実行
        Execute later
        필요할 때 실행
               ↓
      ┌────────┼────────┐
      ↓        ↓        ↓
   filter()   map()   onClick
```

> **ヒント / Tip / 팁**  
> コールバックを理解すると、`filter()`、`map()`、`onClick` を別々に暗記する必要がなくなります。  
> Once callbacks make sense, `filter()`, `map()`, and `onClick` become variations of the same core idea.  
> 콜백을 이해하면 `filter()`, `map()`, `onClick`을 서로 다른 문법으로 외우는 대신 **함수를 전달하고 나중에 실행한다는 하나의 원리**로 이해할 수 있습니다.
