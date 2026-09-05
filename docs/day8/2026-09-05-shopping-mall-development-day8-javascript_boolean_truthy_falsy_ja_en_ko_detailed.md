# JavaScript Boolean, `!`, `!!`, Truthy, Falsy 완전 정리
## 日本語 → English → 한국어

> 学習テーマ / Learning Topic / 학습 주제  
> JavaScript の boolean、`!`、`!!`、Truthy、Falsy、`if` 条件式、Early Return、React / Shopping Mall 実践  
> JavaScript booleans, `!`, `!!`, Truthy, Falsy, `if` conditions, Early Return, and React / shopping mall usage  
> JavaScript boolean, `!`, `!!`, Truthy, Falsy, `if` 조건식, Early Return, React / 쇼핑몰 실전 연결

---

# 1. 日本語 — JavaScript Boolean / Truthy / Falsy

## 1.1 boolean とは？

boolean は、JavaScript で「真か偽か」を表すデータ型です。

boolean の値は2つだけです。

```js
true
false
```

例えば:

```js
const confirmed = true;
```

なら:

```text
confirmed
→ true
→ 確認した
```

と考えられます。

逆に:

```js
const confirmed = false;
```

なら:

```text
confirmed
→ false
→ 確認していない
```

という意味にできます。

> **ヒント**  
> boolean の変数名は `isLoading`、`isLoggedIn`、`hasOrder`、`confirmed` のように、「はい / いいえ」で答えられる名前にすると読みやすくなります。

---

## 1.2 `if` 文は true / false を判断する

基本形:

```js
if (条件) {
  実行するコード
}
```

条件が `true` の場合:

```js
if (true) {
  console.log("実行");
}
```

結果:

```text
実行
```

条件が `false` の場合:

```js
if (false) {
  console.log("実行");
}
```

このコードは実行されません。

> **ヒント**  
> `if` は最終的に「この条件は true か false か？」を見ている、と考えてください。

---

## 1.3 `!` は NOT 演算子

`!` は値の真偽を反転させる論理演算子です。

```js
!true
```

結果:

```js
false
```

```js
!false
```

結果:

```js
true
```

表にすると:

| 元の値 | `!` の結果 |
|---|---|
| `true` | `false` |
| `false` | `true` |

> **ヒント**  
> `!` は「ではない」と読むと理解しやすいです。

---

## 1.4 `!confirmed` の意味

```js
const confirmed = true;
```

なら:

```js
!confirmed
```

は:

```text
!true
↓
false
```

です。

逆に:

```js
const confirmed = false;
```

なら:

```text
!false
↓
true
```

です。

したがって:

```js
if (!confirmed) {
  return;
}
```

は自然な日本語では:

```text
もし確認されていないなら
→ 関数を終了する
```

という意味になります。

> **ヒント**  
> `!confirmed` を「confirmed の反対」と読むより、「確認していない」と読むと実務コードが読みやすくなります。

---

## 1.5 `return` は値を返すだけではない

よくある使い方:

```js
function add(a, b) {
  return a + b;
}
```

ここでは値を返します。

しかし:

```js
function test() {
  console.log("A");

  return;

  console.log("B");
}
```

では:

```text
A
```

だけが表示されます。

`return` に到達した時点で関数が終了するからです。

> **ヒント**  
> `return` には「値を返す」と「関数を終了する」の2つの役割があると覚えてください。

---

## 1.6 `if (!confirmed) return;`

次のコード:

```js
if (!confirmed) return;
```

は省略形です。

完全に書くと:

```js
if (!confirmed) {
  return;
}
```

意味:

```text
confirmed が false
↓
!confirmed が true
↓
if が実行
↓
return
↓
関数終了
```

一方:

```text
confirmed が true
↓
!confirmed が false
↓
if の中は実行しない
↓
次のコードへ進む
```

> **ヒント**  
> この形は Early Return と呼ばれるパターンで、「進めない条件を先に排除する」書き方です。

---

# 1.7 Truthy とは？

JavaScript では `true` そのものではなくても、条件式の中で `true` のように扱われる値があります。

それを Truthy と呼びます。

例:

```js
"hello"
1
-1
100
[]
{}
function () {}
```

例えば:

```js
if ("hello") {
  console.log("実行");
}
```

これは実行されます。

なぜなら `"hello"` は Truthy だからです。

> **ヒント**  
> Truthy = `true` そのもの、ではありません。  
> 「boolean として評価したら true のように扱われる値」です。

---

# 1.8 Falsy とは？

Falsy は、条件式の中で `false` のように扱われる値です。

代表的な値:

```js
false
0
-0
0n
""
null
undefined
NaN
```

例えば:

```js
if ("") {
  console.log("実行");
}
```

は実行されません。

空文字 `""` は Falsy だからです。

> **ヒント**  
> 実務では特に `false`, `0`, `""`, `null`, `undefined`, `NaN` をよく使うので、まずこの6つを覚えると便利です。

---

# 1.9 Truthy / Falsy 一覧

| 値 | 判定 |
|---|---|
| `true` | Truthy |
| `"hello"` | Truthy |
| `" "` | Truthy |
| `"0"` | Truthy |
| `"false"` | Truthy |
| `1` | Truthy |
| `-10` | Truthy |
| `[]` | Truthy |
| `{}` | Truthy |
| `false` | Falsy |
| `0` | Falsy |
| `""` | Falsy |
| `null` | Falsy |
| `undefined` | Falsy |
| `NaN` | Falsy |

> **ヒント**  
> `"0"` は文字列なので Truthy、`0` は数値なので Falsy です。

---

# 1.10 空配列 `[]` は Truthy

これは初心者がよく混乱するポイントです。

```js
Boolean([])
```

結果:

```js
true
```

したがって:

```js
if ([]) {
  console.log("実行");
}
```

は実行されます。

配列が空かどうかを調べたいなら:

```js
if (orders.length === 0) {
  console.log("注文がありません");
}
```

のようにします。

> **ヒント**  
> 「配列が存在する」と「配列の中身が空」は別の質問です。

---

# 1.11 空オブジェクト `{}` も Truthy

```js
Boolean({})
```

結果:

```js
true
```

したがって:

```js
const user = {};

if (user) {
  console.log("実行");
}
```

は実行されます。

> **ヒント**  
> 空オブジェクトでも「オブジェクト自体は存在している」ため Truthy です。

---

# 1.12 空文字と空白文字は違う

```js
Boolean("")
```

結果:

```js
false
```

しかし:

```js
Boolean(" ")
```

結果:

```js
true
```

空白1文字でも文字列としては中身があります。

フォーム入力では:

```js
if (!name.trim()) {
  console.log("名前を入力してください");
}
```

のように `.trim()` を使うことがあります。

> **ヒント**  
> 入力チェックでは `"   "` のような空白だけの入力も考える必要があります。

---

# 1.13 `!value` は Truthy / Falsy を反転する

例:

```js
!"hello"
```

概念的には:

```text
"hello"
↓
Truthy
↓
true のように評価
↓
!
↓
false
```

つまり:

```js
!"hello"
```

の結果は:

```js
false
```

です。

> **ヒント**  
> `!value` は「この値は Falsy か？」というチェックとして読むこともできます。

---

# 1.14 `!null`

`null` は Falsy です。

```js
!null
```

は:

```text
null
↓
Falsy
↓
false のように評価
↓
!false
↓
true
```

結果:

```js
true
```

例えば:

```js
const user = null;

if (!user) {
  console.log("ユーザーがいません");
}
```

> **ヒント**  
> `if (!user)` は「user が存在しないなら」と読むと自然です。

---

# 1.15 `!undefined`

`undefined` も Falsy です。

```js
!undefined
```

結果:

```js
true
```

例えば:

```js
const order = undefined;

if (!order) {
  console.log("注文がありません");
}
```

> **ヒント**  
> `find()` でデータが見つからなかった場合に `undefined` が返るため、このパターンはよく登場します。

---

# 1.16 `find()` と Falsy の関係

```js
const order = orders.find(
  (order) => order.id === orderId
);
```

見つかった場合:

```js
{
  id: 1002,
  productName: "Keyboard"
}
```

オブジェクトは Truthy です。

見つからない場合:

```js
undefined
```

`undefined` は Falsy です。

したがって:

```js
if (!order) {
  return;
}
```

と書けます。

> **ヒント**  
> `find()` と `if (!order)` は非常に相性のいいパターンです。

---

# 1.17 `!!` とは？

`!!` は値を明確な boolean に変換するためによく使われます。

例:

```js
!!"hello"
```

順番に見ると:

```text
"hello"
↓
Truthy
↓
!"hello"
↓
false
↓
!false
↓
true
```

結果:

```js
true
```

> **ヒント**  
> `!!value` = 「この値を true / false に変換して」と理解するとよいです。

---

# 1.18 `Boolean()` と `!!`

次の2つはよく似ています。

```js
Boolean(value)
```

```js
!!value
```

例えば:

```js
Boolean("hello")
```

結果:

```js
true
```

そして:

```js
!!"hello"
```

結果:

```js
true
```

> **ヒント**  
> 初心者は `Boolean(value)` のほうが意味が分かりやすい場合があります。  
> `!!` は「読めるようになる」ことから始めれば十分です。

---

# 1.19 注文データと `!!`

```js
const order = orders.find(
  (order) => order.id === orderId
);
```

注文が存在するかを boolean にしたいなら:

```js
const hasOrder = !!order;
```

注文があれば:

```js
true
```

なければ:

```js
false
```

です。

より明示的には:

```js
const hasOrder = Boolean(order);
```

でも同じです。

> **ヒント**  
> `hasOrder`, `isAvailable`, `isLoggedIn` のような変数は boolean にすると意味が分かりやすくなります。

---

# 1.20 `if (value)` と `if (!value)`

値がある場合:

```js
if (user) {
  console.log("ユーザーあり");
}
```

値がない場合:

```js
if (!user) {
  console.log("ユーザーなし");
}
```

> **ヒント**  
> `if (value)` = 値が有効なら  
> `if (!value)` = 値がない / Falsy なら  
> と読むと理解しやすいです。

---

# 1.21 Falsy チェックの注意点

例えば:

```js
const quantity = 0;
```

このとき:

```js
if (!quantity) {
  console.log("数量なし");
}
```

は実行されます。

しかし `0` が「正しい値」である可能性もあります。

より明確に:

```js
if (quantity === 0) {
  console.log("数量が0です");
}
```

と書くほうが良い場合もあります。

> **ヒント**  
> `!value` は `0`, `""`, `null`, `undefined` などを全部まとめて Falsy と判断するため、何を正確に検査したいかを考えることが重要です。

---

# 1.22 `NaN` も Falsy

```js
const orderId = Number("abc");
```

結果:

```js
NaN
```

`NaN` は Falsy です。

しかし数値変換に失敗したかを調べるなら:

```js
Number.isNaN(orderId)
```

のほうが意味が明確です。

> **ヒント**  
> Falsy だからといって、必ず `!value` で検査するのが最善とは限りません。

---

# 1.23 Day 8 注文キャンセルとの接続

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

流れ:

```text
ユーザーがクリック
↓
confirm()
↓
true / false
↓
!confirmed
↓
false の場合だけ return
↓
確認した場合は次へ
↓
filter()
↓
localStorage
↓
setOrders()
↓
router.push()
```

> **ヒント**  
> Day 8 では `confirmed` が元から boolean なので、まずは `!true → false`, `!false → true` を確実に理解すれば十分です。

---

# 1.24 日本語まとめ

```text
true / false
→ boolean

Truthy
→ true のように扱われる値

Falsy
→ false のように扱われる値

!value
→ Truthy / Falsy 判定を反転

!!value
→ 値を boolean に変換

if (value)
→ value が Truthy なら実行

if (!value)
→ value が Falsy なら実行
```

---

# 2. English — JavaScript Boolean / Truthy / Falsy

## 2.1 What Is a Boolean?

A boolean is a JavaScript data type representing a true/false state.

There are only two boolean values:

```js
true
false
```

Example:

```js
const confirmed = true;
```

This can mean:

```text
confirmed
→ true
→ user confirmed
```

If:

```js
const confirmed = false;
```

it can mean:

```text
confirmed
→ false
→ user did not confirm
```

> **Tip**  
> Boolean variables are easier to read when their names sound like yes/no questions: `isLoading`, `hasOrder`, `isLoggedIn`, `confirmed`.

---

## 2.2 `if` Checks Whether a Condition Is True

Basic form:

```js
if (condition) {
  // code
}
```

If the condition is true:

```js
if (true) {
  console.log("run");
}
```

the code runs.

If the condition is false:

```js
if (false) {
  console.log("run");
}
```

the block is skipped.

> **Tip**  
> Think of `if` as ultimately asking: “Does this condition evaluate to true or false?”

---

## 2.3 `!` Is the Logical NOT Operator

```js
!true
```

returns:

```js
false
```

And:

```js
!false
```

returns:

```js
true
```

| Original | With `!` |
|---|---|
| `true` | `false` |
| `false` | `true` |

> **Tip**  
> Read `!` as “not.”

---

## 2.4 Understanding `!confirmed`

If:

```js
const confirmed = true;
```

then:

```js
!confirmed
```

becomes:

```text
!true
↓
false
```

If:

```js
const confirmed = false;
```

then:

```text
!false
↓
true
```

So:

```js
if (!confirmed) {
  return;
}
```

means:

```text
if the user did not confirm
→ exit the function
```

> **Tip**  
> Translate `!confirmed` into natural language: “not confirmed.”

---

## 2.5 `return` Also Ends a Function

A common example:

```js
function add(a, b) {
  return a + b;
}
```

But `return` can also be used without a value:

```js
function test() {
  console.log("A");

  return;

  console.log("B");
}
```

Only `A` is printed.

Once JavaScript reaches `return`, the function stops.

> **Tip**  
> Remember both roles: return a value and terminate the current function.

---

## 2.6 `if (!confirmed) return;`

This:

```js
if (!confirmed) return;
```

is equivalent to:

```js
if (!confirmed) {
  return;
}
```

If `confirmed` is false:

```text
confirmed = false
↓
!confirmed = true
↓
if runs
↓
return
↓
function ends
```

If `confirmed` is true:

```text
confirmed = true
↓
!confirmed = false
↓
if block is skipped
↓
continue
```

> **Tip**  
> This is a common Early Return pattern: stop invalid or unwanted cases first, then let the normal path continue.

---

# 2.7 What Is Truthy?

A Truthy value is a value that behaves like `true` in a boolean context.

Examples:

```js
"hello"
1
-1
100
[]
{}
function () {}
```

For example:

```js
if ("hello") {
  console.log("run");
}
```

runs because `"hello"` is Truthy.

> **Tip**  
> Truthy does not mean the value is literally `true`; it means JavaScript treats it as true in a condition.

---

# 2.8 What Is Falsy?

Falsy values behave like `false` in a boolean context.

Important examples:

```js
false
0
-0
0n
""
null
undefined
NaN
```

For example:

```js
if ("") {
  console.log("run");
}
```

does not run because an empty string is Falsy.

> **Tip**  
> The most common Falsy values to remember are `false`, `0`, `""`, `null`, `undefined`, and `NaN`.

---

# 2.9 Truthy / Falsy Table

| Value | Boolean behavior |
|---|---|
| `true` | Truthy |
| `"hello"` | Truthy |
| `" "` | Truthy |
| `"0"` | Truthy |
| `"false"` | Truthy |
| `1` | Truthy |
| `-10` | Truthy |
| `[]` | Truthy |
| `{}` | Truthy |
| `false` | Falsy |
| `0` | Falsy |
| `""` | Falsy |
| `null` | Falsy |
| `undefined` | Falsy |
| `NaN` | Falsy |

> **Tip**  
> `"0"` is Truthy because it is a non-empty string, while numeric `0` is Falsy.

---

# 2.10 Empty Arrays Are Truthy

```js
Boolean([])
```

returns:

```js
true
```

So:

```js
if ([]) {
  console.log("run");
}
```

runs.

To check whether an array is empty:

```js
if (orders.length === 0) {
  console.log("No orders");
}
```

> **Tip**  
> “Does the array exist?” and “Does the array contain items?” are different checks.

---

# 2.11 Empty Objects Are Also Truthy

```js
Boolean({})
```

returns:

```js
true
```

So:

```js
const user = {};

if (user) {
  console.log("run");
}
```

runs.

> **Tip**  
> An empty object is still an existing object, so it is Truthy.

---

# 2.12 Empty String vs Space

```js
Boolean("")
```

returns:

```js
false
```

But:

```js
Boolean(" ")
```

returns:

```js
true
```

For form validation:

```js
if (!name.trim()) {
  console.log("Please enter a name");
}
```

> **Tip**  
> `.trim()` is useful when whitespace-only input should count as empty.

---

# 2.13 `!value` Reverses Boolean Interpretation

Example:

```js
!"hello"
```

Conceptually:

```text
"hello"
↓
Truthy
↓
treated like true
↓
!
↓
false
```

So:

```js
!"hello"
```

returns:

```js
false
```

> **Tip**  
> You can often read `!value` as “is this value missing or Falsy?”

---

# 2.14 `!null`

`null` is Falsy.

```js
!null
```

becomes:

```text
null
↓
Falsy
↓
false
↓
!false
↓
true
```

Example:

```js
const user = null;

if (!user) {
  console.log("No user");
}
```

> **Tip**  
> `if (!user)` is commonly read as “if there is no user.”

---

# 2.15 `!undefined`

`undefined` is also Falsy.

```js
!undefined
```

returns:

```js
true
```

Example:

```js
const order = undefined;

if (!order) {
  console.log("Order not found");
}
```

> **Tip**  
> This is especially common with methods like `find()`, which return `undefined` when no element matches.

---

# 2.16 `find()` and Falsy Values

```js
const order = orders.find(
  (order) => order.id === orderId
);
```

If an order is found, an object is returned:

```js
{
  id: 1002,
  productName: "Keyboard"
}
```

Objects are Truthy.

If no order is found:

```js
undefined
```

is returned, and `undefined` is Falsy.

So:

```js
if (!order) {
  return;
}
```

is a natural pattern.

> **Tip**  
> `find()` and `if (!result)` are commonly paired.

---

# 2.17 What Does `!!` Mean?

Double NOT is often used to convert a value into a real boolean.

```js
!!"hello"
```

Step by step:

```text
"hello"
↓
Truthy
↓
!"hello"
↓
false
↓
!false
↓
true
```

So the result is:

```js
true
```

> **Tip**  
> Read `!!value` as “convert this value into true or false.”

---

# 2.18 `Boolean()` vs `!!`

These serve a similar purpose:

```js
Boolean(value)
```

```js
!!value
```

Example:

```js
Boolean("hello")
```

returns:

```js
true
```

and:

```js
!!"hello"
```

also returns:

```js
true
```

> **Tip**  
> `Boolean(value)` is often clearer for beginners. `!!value` is compact and common in existing codebases.

---

# 2.19 Using `!!` with Order Data

```js
const order = orders.find(
  (order) => order.id === orderId
);
```

To convert order existence into a boolean:

```js
const hasOrder = !!order;
```

If order exists:

```js
true
```

If not:

```js
false
```

Equivalent:

```js
const hasOrder = Boolean(order);
```

> **Tip**  
> Boolean-style variable names such as `hasOrder`, `isAvailable`, and `isLoggedIn` pair well with true/false values.

---

# 2.20 `if (value)` vs `if (!value)`

Value exists / is Truthy:

```js
if (user) {
  console.log("User exists");
}
```

Value is missing / Falsy:

```js
if (!user) {
  console.log("No user");
}
```

> **Tip**  
> Read them as:
> `if (value)` → if value is usable/present  
> `if (!value)` → if value is missing/Falsy

---

# 2.21 Caution with Falsy Checks

Suppose:

```js
const quantity = 0;
```

Then:

```js
if (!quantity) {
  console.log("No quantity");
}
```

runs because `0` is Falsy.

But `0` may be a valid meaningful value.

A clearer check can be:

```js
if (quantity === 0) {
  console.log("Quantity is zero");
}
```

> **Tip**  
> `!value` groups many different Falsy values together. Use explicit comparisons when the distinction matters.

---

# 2.22 `NaN` Is Falsy

```js
const orderId = Number("abc");
```

returns:

```js
NaN
```

`NaN` is Falsy.

But if the goal is to check number conversion failure, use:

```js
Number.isNaN(orderId)
```

> **Tip**  
> Prefer checks that communicate the exact intent of the code.

---

# 2.23 Day 8 Order Cancellation

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

Flow:

```text
click
↓
confirm()
↓
true / false
↓
!confirmed
↓
if false confirmation → return
↓
if confirmed → continue
↓
filter()
↓
localStorage
↓
setOrders()
↓
router.push()
```

> **Tip**  
> In Day 8, `confirmed` is already a boolean, so start with the simple rule: `!true = false`, `!false = true`.

---

# 2.24 English Summary

```text
true / false
→ boolean

Truthy
→ treated like true

Falsy
→ treated like false

!value
→ reverse boolean interpretation

!!value
→ convert value into a boolean

if (value)
→ run when Truthy

if (!value)
→ run when Falsy
```

---

# 3. 한국어 — JavaScript Boolean / Truthy / Falsy 완전 정리

## 3.1 boolean이란?

boolean은 JavaScript에서 참/거짓 상태를 표현하는 자료형입니다.

값은 딱 두 개입니다.

```js
true
false
```

예를 들어:

```js
const confirmed = true;
```

라면:

```text
confirmed
→ true
→ 사용자가 확인했다
```

로 해석할 수 있습니다.

반대로:

```js
const confirmed = false;
```

라면:

```text
confirmed
→ false
→ 사용자가 확인하지 않았다
```

입니다.

> **팁**  
> boolean 변수는 `isLoading`, `isLoggedIn`, `hasOrder`, `confirmed`처럼 예/아니오로 답할 수 있는 이름을 쓰면 읽기 편합니다.

---

## 3.2 `if`는 조건을 true / false로 판단한다

기본 문법:

```js
if (조건) {
  실행할 코드
}
```

조건이 true면:

```js
if (true) {
  console.log("실행");
}
```

실행됩니다.

조건이 false면:

```js
if (false) {
  console.log("실행");
}
```

실행되지 않습니다.

> **팁**  
> `if`는 결국 괄호 안의 값을 true인가 false인가로 판단하는 문법이라고 생각하세요.

---

## 3.3 `!`는 NOT 연산자

`!`는 논리값을 반대로 뒤집습니다.

```js
!true
```

결과:

```js
false
```

```js
!false
```

결과:

```js
true
```

| 원래 값 | `!` 적용 |
|---|---|
| `true` | `false` |
| `false` | `true` |

> **팁**  
> `!`는 자연어로 **아니다**, **반대**라고 읽으면 이해하기 쉽습니다.

---

## 3.4 `!confirmed` 해석

```js
const confirmed = true;
```

라면:

```js
!confirmed
```

는:

```text
!true
↓
false
```

입니다.

반대로:

```js
const confirmed = false;
```

라면:

```text
!false
↓
true
```

입니다.

그래서:

```js
if (!confirmed) {
  return;
}
```

은 자연스럽게:

```text
만약 확인하지 않았다면
→ 함수를 종료한다
```

입니다.

> **팁**  
> `!confirmed`를 단순히 “confirmed의 반대”가 아니라 **확인하지 않았다면**이라고 읽어보세요.

---

## 3.5 `return`은 값을 반환하는 것뿐 아니라 함수도 종료한다

일반적인 예:

```js
function add(a, b) {
  return a + b;
}
```

하지만:

```js
function test() {
  console.log("A");

  return;

  console.log("B");
}
```

에서는 `A`만 출력됩니다.

```text
A
↓
return
↓
함수 종료
↓
B 실행 안 됨
```

> **팁**  
> `return`은 **값 반환 + 함수 종료** 두 가지 역할이 있습니다.

---

## 3.6 `if (!confirmed) return;`

이 코드는:

```js
if (!confirmed) {
  return;
}
```

의 축약형입니다.

`confirmed = false`라면:

```text
false
↓
!false
↓
true
↓
if 실행
↓
return
↓
함수 종료
```

`confirmed = true`라면:

```text
true
↓
!true
↓
false
↓
if 실행 안 함
↓
다음 코드 진행
```

> **팁**  
> 이 구조는 Early Return 패턴입니다. 진행하면 안 되는 경우를 먼저 종료시키는 방식입니다.

---

# 3.7 Truthy란?

Truthy는 실제 값이 `true`가 아니더라도 조건문에서 `true`처럼 취급되는 값입니다.

예:

```js
"hello"
1
-1
100
[]
{}
function () {}
```

예를 들어:

```js
if ("hello") {
  console.log("실행");
}
```

는 실행됩니다.

`"hello"`가 Truthy이기 때문입니다.

> **팁**  
> Truthy는 **진짜 true**가 아니라 **true처럼 취급되는 값**입니다.

---

# 3.8 Falsy란?

Falsy는 조건문에서 `false`처럼 취급되는 값입니다.

대표적인 값:

```js
false
0
-0
0n
""
null
undefined
NaN
```

예:

```js
if ("") {
  console.log("실행");
}
```

는 실행되지 않습니다.

빈 문자열 `""`은 Falsy이기 때문입니다.

> **팁**  
> 실무에서는 특히 `false`, `0`, `""`, `null`, `undefined`, `NaN`을 많이 만나므로 먼저 기억해두면 좋습니다.

---

# 3.9 Truthy / Falsy 표

| 값 | 판정 |
|---|---|
| `true` | Truthy |
| `"hello"` | Truthy |
| `" "` | Truthy |
| `"0"` | Truthy |
| `"false"` | Truthy |
| `1` | Truthy |
| `-10` | Truthy |
| `[]` | Truthy |
| `{}` | Truthy |
| `false` | Falsy |
| `0` | Falsy |
| `""` | Falsy |
| `null` | Falsy |
| `undefined` | Falsy |
| `NaN` | Falsy |

> **팁**  
> `"0"`은 문자열이라 Truthy이고, `0`은 숫자라 Falsy입니다.

---

# 3.10 빈 배열 `[]`은 Truthy

```js
Boolean([])
```

결과:

```js
true
```

따라서:

```js
if ([]) {
  console.log("실행");
}
```

도 실행됩니다.

배열이 비었는지 확인하려면:

```js
if (orders.length === 0) {
  console.log("주문 없음");
}
```

처럼 검사해야 합니다.

> **팁**  
> 배열이 존재하는지와 배열이 비어 있는지는 다른 문제입니다.

---

# 3.11 빈 객체 `{}`도 Truthy

```js
Boolean({})
```

결과:

```js
true
```

따라서:

```js
const user = {};

if (user) {
  console.log("실행");
}
```

은 실행됩니다.

> **팁**  
> 빈 객체도 객체 자체는 존재하므로 Truthy입니다.

---

# 3.12 빈 문자열과 공백 문자열은 다르다

```js
Boolean("")
```

결과:

```js
false
```

하지만:

```js
Boolean(" ")
```

결과:

```js
true
```

폼 입력 검사에서는:

```js
if (!name.trim()) {
  console.log("이름을 입력하세요.");
}
```

처럼 `.trim()`을 사용하기도 합니다.

> **팁**  
> `"   "`처럼 공백만 입력된 값은 일반 문자열로는 Truthy이므로 입력 검증에서는 `.trim()`이 중요할 수 있습니다.

---

# 3.13 `!value`는 Truthy / Falsy 판단을 뒤집는다

```js
!"hello"
```

는 개념적으로:

```text
"hello"
↓
Truthy
↓
true처럼 판단
↓
!
↓
false
```

입니다.

결과:

```js
false
```

> **팁**  
> `!value`는 “이 값이 Falsy인가?”라는 검사처럼 읽어도 좋습니다.

---

# 3.14 `!null`

`null`은 Falsy입니다.

```js
!null
```

결과:

```js
true
```

예:

```js
const user = null;

if (!user) {
  console.log("사용자가 없습니다.");
}
```

> **팁**  
> `if (!user)`는 **user가 없다면**으로 자연스럽게 읽으면 됩니다.

---

# 3.15 `!undefined`

`undefined`도 Falsy입니다.

```js
!undefined
```

결과:

```js
true
```

예:

```js
const order = undefined;

if (!order) {
  console.log("주문이 없습니다.");
}
```

> **팁**  
> `find()`가 데이터를 찾지 못하면 `undefined`를 반환하기 때문에 `if (!order)` 패턴을 자주 만나게 됩니다.

---

# 3.16 Day 7 `find()`와 연결

```js
const order = orders.find(
  (order) => order.id === orderId
);
```

주문을 찾으면 객체:

```js
{
  id: 1002,
  productName: "Keyboard"
}
```

를 반환합니다.

객체는 Truthy입니다.

주문을 못 찾으면:

```js
undefined
```

를 반환합니다.

`undefined`는 Falsy이므로:

```js
if (!order) {
  return;
}
```

가 가능합니다.

> **팁**  
> `find()` → 못 찾으면 `undefined` → `!order`가 true라는 흐름을 기억하세요.

---

# 3.17 `!!`란?

`!!`는 값을 명확한 boolean으로 바꾸는 데 자주 사용됩니다.

예:

```js
!!"hello"
```

하나씩 보면:

```text
"hello"
↓
Truthy
↓
!"hello"
↓
false
↓
!false
↓
true
```

결과:

```js
true
```

> **팁**  
> `!!value`는 **이 값을 true / false로 바꿔줘**라고 이해하세요.

---

# 3.18 `Boolean()`과 `!!`

둘은 비슷한 목적을 가집니다.

```js
Boolean(value)
```

```js
!!value
```

예:

```js
Boolean("hello")
```

결과:

```js
true
```

그리고:

```js
!!"hello"
```

결과도:

```js
true
```

입니다.

> **팁**  
> 처음에는 `Boolean(value)`가 더 읽기 편할 수 있습니다. `!!`는 다른 사람의 코드를 읽기 위해 먼저 익혀도 충분합니다.

---

# 3.19 주문 데이터와 `!!`

```js
const order = orders.find(
  (order) => order.id === orderId
);
```

주문 존재 여부를 boolean으로 만들고 싶다면:

```js
const hasOrder = !!order;
```

주문이 있으면:

```js
true
```

없으면:

```js
false
```

같은 의미로:

```js
const hasOrder = Boolean(order);
```

도 가능합니다.

> **팁**  
> `hasOrder`, `isAvailable`, `isLoggedIn`처럼 boolean 의미가 분명한 변수는 실제 boolean 값으로 만들어두면 읽기 좋습니다.

---

# 3.20 `if (value)`와 `if (!value)`

값이 있거나 Truthy라면:

```js
if (user) {
  console.log("사용자 있음");
}
```

값이 없거나 Falsy라면:

```js
if (!user) {
  console.log("사용자 없음");
}
```

> **팁**  
> `if (value)`는 **값이 유효하다면**, `if (!value)`는 **값이 없거나 Falsy라면**으로 읽으면 좋습니다.

---

# 3.21 Falsy 검사에서 생기는 함정

예:

```js
const quantity = 0;
```

그리고:

```js
if (!quantity) {
  console.log("수량 없음");
}
```

은 실행됩니다.

왜냐하면 `0`은 Falsy이기 때문입니다.

하지만 `0`이 의미 있는 정상 값일 수도 있습니다.

그럴 때는:

```js
if (quantity === 0) {
  console.log("수량이 0입니다.");
}
```

가 더 정확합니다.

> **팁**  
> `!value`는 편하지만 여러 Falsy 값을 한꺼번에 묶어 판단합니다. 정확히 무엇을 검사하려는지 생각해야 합니다.

---

# 3.22 `NaN`도 Falsy

```js
const orderId = Number("abc");
```

결과:

```js
NaN
```

`NaN`은 Falsy입니다.

하지만 숫자 변환 실패를 정확히 확인하려면:

```js
Number.isNaN(orderId)
```

를 사용하는 것이 더 명확합니다.

> **팁**  
> “Falsy인가?”와 “정확히 NaN인가?”는 서로 다른 질문입니다.

---

# 3.23 Day 8 주문 취소 흐름

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

흐름:

```text
사용자 클릭
↓
confirm()
↓
true / false 반환
↓
!confirmed 판단
↓
취소 선택
→ return
→ 함수 종료

확인 선택
→ 계속 진행
↓
filter()
↓
localStorage
↓
setOrders()
↓
router.push()
```

> **팁**  
> Day 8에서는 `confirmed`가 이미 boolean이므로 `!true = false`, `!false = true`부터 확실히 이해하면 됩니다.

---

# 3.24 쇼핑몰에서 자주 만나는 패턴

## 주문이 없다면

```tsx
if (!order) {
  return <p>주문을 찾을 수 없습니다.</p>;
}
```

## 저장된 주문이 있다면

```tsx
if (savedOrders) {
  const parsedOrders = JSON.parse(savedOrders);
}
```

## 장바구니가 비어 있다면

```tsx
if (cart.length === 0) {
  return;
}
```

## 입력값이 비어 있다면

```tsx
if (!name.trim()) {
  return;
}
```

## 로그인 사용자가 없다면

```tsx
if (!user) {
  return;
}
```

> **팁**  
> 앞으로 조건문을 볼 때 “직접 boolean 비교인가?”, “Truthy/Falsy를 이용한 검사인가?”를 구분해보세요.

---

# 3.25 핵심 Mental Model

```text
Truthy
→ true처럼 취급

Falsy
→ false처럼 취급
```

```text
!value
→ boolean 판단을 반대로
```

```text
!!value
→ 값을 실제 boolean으로 변환
```

예:

```text
"hello"
→ Truthy

!"hello"
→ false

!!"hello"
→ true
```

반대 예:

```text
""
→ Falsy

!""
→ true

!!""
→ false
```

> **팁**  
> `!!`는 두 번 뒤집으므로 결과적으로 원래 값의 Truthy/Falsy 성질을 `true` 또는 `false`로 뽑아낸다고 생각하면 됩니다.

---

# 4. Quick Reference / クイックリファレンス / 빠른 복습표

| 표현 | 日本語 | English | 한국어 |
|---|---|---|---|
| `true` / `false` | 真偽値 | boolean values | 불리언 값 |
| Truthy | true のように扱う | treated like true | true처럼 취급 |
| Falsy | false のように扱う | treated like false | false처럼 취급 |
| `!value` | 真偽を反転 | reverse boolean meaning | boolean 의미 반전 |
| `!!value` | boolean 化 | convert to boolean | boolean으로 변환 |
| `if (value)` | Truthy なら実行 | run if Truthy | Truthy면 실행 |
| `if (!value)` | Falsy なら実行 | run if Falsy | Falsy면 실행 |
| `Boolean(value)` | boolean 変換 | boolean conversion | boolean 변환 |

---

# 5. Truthy / Falsy 실전 확인표

## Falsy

```js
false
0
-0
0n
""
null
undefined
NaN
```

## 대표적인 Truthy

```js
true
1
-1
"hello"
"0"
"false"
" "
[]
{}
function () {}
```

> **ヒント / Tip / 팁**  
> 가장 많이 헷갈리는 부분은 `[]`, `{}`, `"0"`, `"false"`가 모두 Truthy라는 점입니다.

---

# 6. Final Mental Model

```text
任意の値 / Any Value / 어떤 값
             ↓
   JavaScript が boolean 的に判断
   JavaScript evaluates it in boolean context
   JavaScript가 boolean처럼 판단
             ↓
      Truthy または Falsy
      Truthy or Falsy
      Truthy 또는 Falsy
             ↓
      ┌──────┴──────┐
      ↓             ↓
   !value         !!value
      ↓             ↓
  判定を反転       boolean に変換
  reverse        convert to boolean
  반대로 뒤집기    boolean으로 변환
```

Day 8:

```text
window.confirm()
↓
true / false
↓
if (!confirmed) return;
↓
false confirmation → stop
true confirmation → continue
↓
filter()
↓
localStorage
↓
setOrders()
↓
router.push()
```

> **ヒント / Tip / 팁**  
> `!`, `!!`, Truthy, Falsy를 따로 암기하기보다 **JavaScript가 값을 boolean처럼 판단하고, `!`가 그 판단을 뒤집고, `!!`가 그 결과를 명확한 boolean으로 만든다**는 하나의 흐름으로 이해하세요.
