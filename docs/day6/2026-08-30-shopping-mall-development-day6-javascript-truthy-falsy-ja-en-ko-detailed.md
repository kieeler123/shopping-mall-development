# JavaScript Truthy / Falsy 완전 정리

## 日本語 → English → 한국어

------------------------------------------------------------------------

# 日本語

## 1. Truthy / Falsy とは何か

JavaScript の条件式では、値が必ずしも `true` または `false`
そのものである必要はありません。

``` ts
if (value) {
  // ...
}
```

`value`
が数値、文字列、`null`、配列、オブジェクトなどであっても、JavaScript
は条件を評価するときに、その値を Boolean 的に判断します。

-   **truthy**: Boolean として評価すると `true` として扱われる値
-   **falsy**: Boolean として評価すると `false` として扱われる値

``` ts
Boolean(1);       // true
Boolean(0);       // false
Boolean("hello"); // true
Boolean("");      // false
```

> **ヒント**
>
> 値の truthy / falsy が分からないときは、頭の中で `Boolean(value)`
> に置き換えると理解しやすくなります。

## 2. 代表的な falsy 値

JavaScript で代表的な falsy 値は次の通りです。

  値            Boolean 結果   意味
  ------------- -------------- ----------------------------------------------
  `false`       `false`        Boolean の false
  `0`           `false`        数値のゼロ
  `-0`          `false`        負のゼロ
  `0n`          `false`        BigInt のゼロ
  `""`          `false`        空文字列
  `null`        `false`        意図的に「値がない」ことを表す場合によく使う
  `undefined`   `false`        値が設定されていない状態
  `NaN`         `false`        Not-a-Number

例：

``` ts
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
```

> **ヒント**
>
> 最初は特に `0`, `""`, `null`, `undefined` を確実に覚えると、React
> の条件付きレンダリングも理解しやすくなります。

## 3. 数値と truthy / falsy

数値の `0` は falsy です。

``` ts
Boolean(0);
// false
```

一方、ゼロ以外の多くの数値は truthy です。

``` ts
Boolean(1);    // true
Boolean(-1);   // true
Boolean(100);  // true
Boolean(3.14); // true
```

この性質は配列の `length` を条件として使うときに重要です。

``` ts
const orders = [];

orders.length;
// 0

!orders.length;
// true
```

処理の流れ：

``` text
orders.length
↓
0
↓
Boolean(0)
↓
false
↓
!false
↓
true
```

> **ヒント**
>
> `!orders.length` が分かりにくい場合は、空配列なら `!0`
> になると考えましょう。

## 4. 文字列と truthy / falsy

空文字列 `""` は falsy です。

``` ts
Boolean("");
// false
```

しかし、1文字でも入っている文字列は truthy です。

``` ts
Boolean("hello"); // true
Boolean("0");     // true
Boolean("false"); // true
Boolean(" ");     // true
```

重要なのは数値 `0` と文字列 `"0"` の違いです。

``` ts
Boolean(0);   // false
Boolean("0"); // true
```

また、完全な空文字列とスペースを含む文字列も異なります。

``` ts
Boolean("");  // false
Boolean(" "); // true
```

> **ヒント**
>
> `"false"` という文字列も中身が「false」という文字であるだけで、Boolean
> の `false` ではありません。そのため truthy です。

## 5. `null` は falsy

``` ts
Boolean(null);
// false
```

React の state では「まだデータがない」状態を表すために `null`
を使うことがあります。

ショッピングモールの注文完了ページ：

``` tsx
const [order, setOrder] = useState<Order | null>(null);
```

初期状態では：

``` ts
order === null
```

です。

そのため：

``` tsx
{order && (
  <section>
    ...
  </section>
)}
```

では `order` が `null` の間は右側の JSX が表示されません。

実際の `Order` オブジェクトが入ると、そのオブジェクトは truthy なので
JSX が表示されます。

``` text
order = null
↓
falsy
↓
UI を表示しない

order = Order オブジェクト
↓
truthy
↓
UI を表示
```

> **ヒント**
>
> `Order | null` と `order && (...)` は、TypeScript の型と JavaScript の
> truthy / falsy が一緒に働いている良い例です。

## 6. `undefined` も falsy

``` ts
Boolean(undefined);
// false
```

例えば空配列から最後の要素を取得しようとすると、実際の要素が存在しないため
`undefined` になる可能性があります。

``` ts
const parsedOrders: Order[] = [];

const lastOrder = parsedOrders[parsedOrders.length - 1];
```

このとき概念的には：

``` text
parsedOrders.length
↓
0

0 - 1
↓
-1

parsedOrders[-1]
↓
undefined
```

となります。

そこで：

``` ts
if (!lastOrder) {
  return;
}
```

とすると、`undefined` は falsy なので処理を終了できます。

> **ヒント**
>
> `if (!value)` は複数の falsy 値をまとめて検出できます。ただし `0` や
> `""` を正常な値として扱いたい場面では注意が必要です。

## 7. 空配列 `[]` は truthy

非常に重要なポイントです。

``` ts
Boolean([]);
// true
```

空配列は中身がなくても truthy です。

そのため：

``` ts
const orders = [];

if (orders) {
  console.log("実行されます");
}
```

この `if` は実行されます。

つまり：

``` ts
!orders
```

では配列が空かどうかを判定できません。

空配列を確認するには：

``` ts
orders.length === 0
```

または：

``` ts
!orders.length
```

を使えます。

比較：

``` ts
const orders = [];

Boolean(orders);        // true
orders.length === 0;    // true
!orders.length;         // true
```

> **ヒント**
>
> 「配列が存在するか」と「配列の中に要素が存在するか」は別の質問です。

## 8. 空オブジェクト `{}` も truthy

空オブジェクトも truthy です。

``` ts
Boolean({});
// true
```

例えば：

``` ts
const user = {};

if (user) {
  console.log("実行されます");
}
```

は実行されます。

したがって、次の2つをセットで覚えると便利です。

``` ts
Boolean([]); // true
Boolean({}); // true
```

> **ヒント**
>
> 「空だから falsy」とは限りません。JavaScript
> では空配列と空オブジェクトは truthy です。

## 9. `!` 論理 NOT 演算子

`!` は値を Boolean 的に評価し、その結果を反転します。

``` ts
!value
```

例：

``` ts
!0;       // true
!1;       // false
!"";      // true
!"hello"; // false
!null;    // true
![];      // false
```

概念：

``` text
元の値
↓
Boolean として評価
↓
true / false
↓
! で反転
```

> **ヒント**
>
> `!value` を「値そのものを反転する」と考えるより、「Boolean
> として判断してから true / false を反転する」と考える方が正確です。

## 10. `!!` による Boolean 変換

`!` を2回使うと、元の truthy / falsy の性質を実際の Boolean
値に変換できます。

``` ts
!!"hello"; // true
!!0;       // false
!![];      // true
!!null;    // false
```

これは次のような `Boolean()` と同じ目的で使われることがあります。

``` ts
Boolean("hello"); // true
Boolean(0);       // false
```

> **ヒント**
>
> 学習中は `Boolean(value)` の方が意味を読み取りやすいです。`!!value`
> はコードを読むときに理解できれば十分です。

## 11. `orders.length === 0` と `!orders.length`

空配列：

``` ts
const orders = [];
```

の場合：

``` ts
orders.length === 0;
// true
```

そして：

``` ts
!orders.length;
// true
```

も同じ結果になります。

比較：

  `orders`               `length`   `length === 0`   `!length`
  -------------------- ---------- ---------------- -----------
  `[]`                          0           `true`      `true`
  `[order1]`                    1          `false`     `false`
  `[order1, order2]`            2          `false`     `false`

ただし：

``` ts
!orders
```

は空配列チェックではありません。

``` ts
Boolean([]); // true
![];         // false
```

> **ヒント**
>
> 学習段階では `orders.length === 0`
> の方が「注文数が0か」という意図が明確なのでおすすめです。

## 12. ショッピングモール Day 6 との接続

### localStorage の注文データ確認

``` ts
const savedOrders = localStorage.getItem("orders");

if (!savedOrders) {
  return;
}
```

`getItem()` でキーが見つからない場合は `null` になります。

``` text
savedOrders = null
↓
falsy
↓
!savedOrders = true
↓
return
```

### 注文オブジェクトの条件付き表示

``` tsx
{order && (
  <section>...</section>
)}
```

``` text
order = null
→ falsy
→ 表示しない

order = オブジェクト
→ truthy
→ 表示する
```

### 注文履歴が空か確認

明示的：

``` ts
orders.length === 0
```

truthy / falsy を利用：

``` ts
!orders.length
```

> **ヒント**
>
> Day 6 のコードには truthy / falsy
> がすでに何度も登場しています。文法を別々に暗記するのではなく、実際のデータが
> `null`, `0`, `Order`, `Order[]` のどれなのかを追跡してください。

## 13. 最終まとめ

``` text
falsy の代表
false
0
""
null
undefined
NaN

truthy の重要例
1
-1
"hello"
"0"
"false"
" "
[]
{}
```

特に次を比較してください。

``` ts
Boolean(0);       // false
Boolean("0");     // true

Boolean("");      // false
Boolean(" ");     // true

Boolean(null);    // false
Boolean([]);      // true

Boolean({});      // true
```

> **ヒント**
>
> `0` vs `"0"`, `""` vs `" "`, `null` vs `{}`, `[]` vs
> `orders.length === 0` 을 반복해서 비교하면 truthy / falsy 감각이
> 빠르게 잡힙니다.

------------------------------------------------------------------------

# English

## 1. What are truthy and falsy?

In JavaScript conditions, a value does not have to literally be `true`
or `false`.

``` ts
if (value) {
  // ...
}
```

When evaluating the condition, JavaScript interprets values such as
numbers, strings, `null`, arrays, and objects in a Boolean context.

-   **truthy**: a value treated as `true` in a Boolean context
-   **falsy**: a value treated as `false` in a Boolean context

``` ts
Boolean(1);       // true
Boolean(0);       // false
Boolean("hello"); // true
Boolean("");      // false
```

> **Tip**
>
> When you are unsure whether a value is truthy or falsy, mentally wrap
> it with `Boolean(value)`.

## 2. Common falsy values

Common falsy values include:

  -----------------------------------------------------------------------
  Value                   Boolean result          Meaning
  ----------------------- ----------------------- -----------------------
  `false`                 `false`                 Boolean false

  `0`                     `false`                 Numeric zero

  `-0`                    `false`                 Negative zero

  `0n`                    `false`                 BigInt zero

  `""`                    `false`                 Empty string

  `null`                  `false`                 Commonly represents an
                                                  intentional absence of
                                                  a value

  `undefined`             `false`                 A value has not been
                                                  assigned

  `NaN`                   `false`                 Not-a-Number
  -----------------------------------------------------------------------

``` ts
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
```

> **Tip**
>
> For React learning, remember `0`, `""`, `null`, and `undefined` first.
> They appear frequently in conditions and rendering logic.

## 3. Numbers

Numeric `0` is falsy.

``` ts
Boolean(0);
// false
```

Most non-zero numbers are truthy.

``` ts
Boolean(1);    // true
Boolean(-1);   // true
Boolean(100);  // true
Boolean(3.14); // true
```

This matters when checking array lengths.

``` ts
const orders = [];

orders.length;
// 0

!orders.length;
// true
```

Evaluation:

``` text
orders.length
↓
0
↓
Boolean(0)
↓
false
↓
!false
↓
true
```

> **Tip**
>
> If `!orders.length` feels confusing, replace it mentally with `!0`
> when the array is empty.

## 4. Strings

An empty string is falsy.

``` ts
Boolean("");
// false
```

A non-empty string is truthy.

``` ts
Boolean("hello"); // true
Boolean("0");     // true
Boolean("false"); // true
Boolean(" ");     // true
```

Numeric zero and the string `"0"` are different:

``` ts
Boolean(0);   // false
Boolean("0"); // true
```

An empty string and a string containing a space are also different:

``` ts
Boolean("");  // false
Boolean(" "); // true
```

> **Tip**
>
> The string `"false"` contains text. It is not the Boolean value
> `false`, so it is truthy.

## 5. `null`

`null` is falsy.

``` ts
Boolean(null);
// false
```

In React state, `null` can represent that data is not currently
available.

``` tsx
const [order, setOrder] = useState<Order | null>(null);
```

Initially:

``` ts
order === null
```

Therefore:

``` tsx
{order && (
  <section>
    ...
  </section>
)}
```

does not render the JSX while `order` is `null`.

After an actual `Order` object is assigned, the object is truthy and the
JSX can render.

``` text
order = null
↓
falsy
↓
do not render

order = Order object
↓
truthy
↓
render
```

> **Tip**
>
> `Order | null` together with `order && (...)` is a useful example of
> TypeScript types and JavaScript truthy/falsy behavior working
> together.

## 6. `undefined`

`undefined` is also falsy.

``` ts
Boolean(undefined);
// false
```

For example, trying to access the last element of an empty array may
produce `undefined`.

``` ts
const parsedOrders: Order[] = [];

const lastOrder = parsedOrders[parsedOrders.length - 1];
```

Conceptually:

``` text
parsedOrders.length
↓
0

0 - 1
↓
-1

parsedOrders[-1]
↓
undefined
```

Therefore:

``` ts
if (!lastOrder) {
  return;
}
```

can stop the function when no order exists.

> **Tip**
>
> `if (!value)` catches several falsy values at once. Be careful when
> `0` or `""` should be considered valid data.

## 7. An empty array `[]` is truthy

This is one of the most important points.

``` ts
Boolean([]);
// true
```

Even an empty array is truthy.

``` ts
const orders = [];

if (orders) {
  console.log("This runs");
}
```

So this does not check whether the array is empty:

``` ts
!orders
```

Use:

``` ts
orders.length === 0
```

or:

``` ts
!orders.length
```

Comparison:

``` ts
const orders = [];

Boolean(orders);     // true
orders.length === 0; // true
!orders.length;      // true
```

> **Tip**
>
> "Does the array exist?" and "Does the array contain elements?" are
> different questions.

## 8. An empty object `{}` is also truthy

``` ts
Boolean({});
// true
```

For example:

``` ts
const user = {};

if (user) {
  console.log("This runs");
}
```

Remember these together:

``` ts
Boolean([]); // true
Boolean({}); // true
```

> **Tip**
>
> Empty does not automatically mean falsy in JavaScript. Empty arrays
> and empty objects are truthy.

## 9. Logical NOT `!`

`!` evaluates a value in a Boolean context and reverses the result.

``` ts
!value
```

Examples:

``` ts
!0;       // true
!1;       // false
!"";      // true
!"hello"; // false
!null;    // true
![];      // false
```

Conceptually:

``` text
original value
↓
Boolean evaluation
↓
true / false
↓
reverse with !
```

> **Tip**
>
> Think of `!value` as "convert conceptually to Boolean, then reverse
> it."

## 10. Boolean conversion with `!!`

Using `!` twice converts the truthy/falsy nature of a value into an
actual Boolean.

``` ts
!!"hello"; // true
!!0;       // false
!![];      // true
!!null;    // false
```

It can serve a similar purpose to:

``` ts
Boolean("hello"); // true
Boolean(0);       // false
```

> **Tip**
>
> While learning, `Boolean(value)` is usually more readable. You mainly
> need to recognize what `!!value` means when you encounter it.

## 11. `orders.length === 0` vs `!orders.length`

For:

``` ts
const orders = [];
```

this is true:

``` ts
orders.length === 0;
```

and this is also true:

``` ts
!orders.length;
```

  `orders`               `length`   `length === 0`   `!length`
  -------------------- ---------- ---------------- -----------
  `[]`                          0           `true`      `true`
  `[order1]`                    1          `false`     `false`
  `[order1, order2]`            2          `false`     `false`

However, this is not an empty-array check:

``` ts
!orders
```

because:

``` ts
Boolean([]); // true
![];         // false
```

> **Tip**
>
> While learning, `orders.length === 0` is often clearer because it
> explicitly says "the number of orders is zero."

## 12. Connection to Shopping Mall Day 6

### Checking localStorage

``` ts
const savedOrders = localStorage.getItem("orders");

if (!savedOrders) {
  return;
}
```

When the key is not found, `getItem()` returns `null`.

``` text
savedOrders = null
↓
falsy
↓
!savedOrders = true
↓
return
```

### Conditionally rendering an order

``` tsx
{order && (
  <section>...</section>
)}
```

``` text
order = null
→ falsy
→ do not render

order = object
→ truthy
→ render
```

### Checking whether order history is empty

Explicit comparison:

``` ts
orders.length === 0
```

Using truthy/falsy behavior:

``` ts
!orders.length
```

> **Tip**
>
> Truthy/falsy is already present throughout the Day 6 code. Follow the
> actual data type and value---`null`, `0`, `Order`, or
> `Order[]`---instead of memorizing each syntax pattern separately.

## 13. Final summary

``` text
Common falsy values
false
0
""
null
undefined
NaN

Important truthy examples
1
-1
"hello"
"0"
"false"
" "
[]
{}
```

Compare these carefully:

``` ts
Boolean(0);       // false
Boolean("0");     // true

Boolean("");      // false
Boolean(" ");     // true

Boolean(null);    // false
Boolean([]);      // true

Boolean({});      // true
```

> **Tip**
>
> Repeatedly compare `0` vs `"0"`, `""` vs `" "`, `null` vs `{}`, and
> `[]` vs `orders.length === 0`. These pairs build a strong intuition
> for truthy and falsy values.

------------------------------------------------------------------------

# 한국어

## 1. Truthy / Falsy란 무엇인가?

JavaScript의 조건식에는 반드시 `true`, `false`만 들어가야 하는 것이
아닙니다.

``` ts
if (value) {
  // ...
}
```

`value`가 숫자, 문자열, `null`, 배열, 객체여도 JavaScript는 조건을
평가할 때 그 값을 Boolean 관점에서 판단합니다.

-   **truthy**: Boolean 관점에서 `true`처럼 취급되는 값
-   **falsy**: Boolean 관점에서 `false`처럼 취급되는 값

``` ts
Boolean(1);       // true
Boolean(0);       // false
Boolean("hello"); // true
Boolean("");      // false
```

> **팁**
>
> 어떤 값이 truthy인지 falsy인지 헷갈리면 머릿속으로 `Boolean(value)`를
> 붙여보세요.

## 2. 대표적인 falsy 값

JavaScript에서 자주 만나는 falsy 값은 다음과 같습니다.

  값            Boolean 결과   의미
  ------------- -------------- --------------------------------------------
  `false`       `false`        Boolean의 false
  `0`           `false`        숫자 0
  `-0`          `false`        음수 형태의 0
  `0n`          `false`        BigInt의 0
  `""`          `false`        빈 문자열
  `null`        `false`        의도적으로 값이 없음을 나타낼 때 자주 사용
  `undefined`   `false`        값이 설정되지 않은 상태
  `NaN`         `false`        Not-a-Number

``` ts
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
```

> **팁**
>
> 처음에는 특히 `0`, `""`, `null`, `undefined` 네 가지를 확실하게
> 익혀두세요. React 코드에서도 매우 자주 만납니다.

## 3. 숫자의 truthy / falsy

숫자 `0`은 falsy입니다.

``` ts
Boolean(0);
// false
```

반면 0이 아닌 대부분의 숫자는 truthy입니다.

``` ts
Boolean(1);    // true
Boolean(-1);   // true
Boolean(100);  // true
Boolean(3.14); // true
```

이 성질 때문에 다음 코드가 동작합니다.

``` ts
const orders = [];

orders.length;
// 0

!orders.length;
// true
```

평가 과정을 단계별로 보면:

``` text
orders.length
↓
0
↓
Boolean(0)
↓
false
↓
!false
↓
true
```

> **팁**
>
> `!orders.length`가 어렵게 느껴지면 빈 배열일 때 `!0`이 된다고 바꿔서
> 생각하세요.

## 4. 문자열의 truthy / falsy

빈 문자열 `""`은 falsy입니다.

``` ts
Boolean("");
// false
```

문자가 하나라도 들어 있는 문자열은 truthy입니다.

``` ts
Boolean("hello"); // true
Boolean("0");     // true
Boolean("false"); // true
Boolean(" ");     // true
```

숫자 `0`과 문자열 `"0"`은 다릅니다.

``` ts
Boolean(0);   // false
Boolean("0"); // true
```

빈 문자열과 공백 문자열도 다릅니다.

``` ts
Boolean("");  // false
Boolean(" "); // true
```

`" "`에는 눈에 잘 보이지 않지만 공백 문자 하나가 들어 있기 때문에 빈
문자열이 아닙니다.

> **팁**
>
> `"false"`는 글자로 이루어진 문자열일 뿐 Boolean의 `false`가 아닙니다.
> 따라서 truthy입니다.

## 5. `null`은 falsy

``` ts
Boolean(null);
// false
```

React에서는 아직 데이터가 없는 상태를 표현할 때 `null`을 사용할 수
있습니다.

우리 주문완료 페이지에서는:

``` tsx
const [order, setOrder] = useState<Order | null>(null);
```

이라고 했습니다.

처음에는:

``` ts
order === null
```

입니다.

따라서:

``` tsx
{order && (
  <section>
    ...
  </section>
)}
```

에서 `order`가 `null`인 동안에는 오른쪽 JSX가 렌더링되지 않습니다.

실제 `Order` 객체가 들어오면 객체는 truthy이므로 화면이 나타납니다.

``` text
order = null
↓
falsy
↓
화면 출력 안 함

order = Order 객체
↓
truthy
↓
화면 출력
```

> **팁**
>
> `Order | null`과 `order && (...)`는 TypeScript의 타입과 JavaScript의
> truthy/falsy가 함께 작동하는 좋은 예입니다.

## 6. `undefined`도 falsy

``` ts
Boolean(undefined);
// false
```

예를 들어 빈 주문 배열에서 마지막 주문을 가져오려고 해봅시다.

``` ts
const parsedOrders: Order[] = [];

const lastOrder = parsedOrders[parsedOrders.length - 1];
```

과정을 보면:

``` text
parsedOrders.length
↓
0

0 - 1
↓
-1

parsedOrders[-1]
↓
undefined
```

실제 마지막 요소가 없기 때문에 `undefined`가 될 수 있습니다.

그래서:

``` ts
if (!lastOrder) {
  return;
}
```

로 방어할 수 있습니다.

평가 과정:

``` text
lastOrder = undefined
↓
Boolean(undefined)
↓
false
↓
!false
↓
true
↓
return 실행
```

> **팁**
>
> `if (!value)`는 여러 falsy 값을 한 번에 검사할 수 있습니다. 하지만
> `0`이나 `""`도 정상 데이터가 될 수 있는 상황에서는 너무 넓은 검사가 될
> 수 있으므로 주의해야 합니다.

## 7. 빈 배열 `[]`은 truthy

매우 중요한 부분입니다.

``` ts
Boolean([]);
// true
```

배열 안에 아무것도 없어도 배열 자체는 truthy입니다.

따라서:

``` ts
const orders = [];

if (orders) {
  console.log("실행됩니다.");
}
```

는 실행됩니다.

그래서:

``` ts
!orders
```

는 배열이 비어 있는지를 검사하는 코드가 아닙니다.

빈 배열인지 확인하려면:

``` ts
orders.length === 0
```

또는:

``` ts
!orders.length
```

를 사용할 수 있습니다.

비교:

``` ts
const orders = [];

Boolean(orders);     // true
orders.length === 0; // true
!orders.length;      // true
```

> **팁**
>
> **배열이 존재하는가?**와 **배열 안에 데이터가 존재하는가?**는 서로
> 다른 질문입니다.

## 8. 빈 객체 `{}`도 truthy

빈 객체 역시 truthy입니다.

``` ts
Boolean({});
// true
```

예를 들어:

``` ts
const user = {};

if (user) {
  console.log("실행됩니다.");
}
```

는 실행됩니다.

따라서 다음 두 가지를 함께 기억하면 좋습니다.

``` ts
Boolean([]); // true
Boolean({}); // true
```

> **팁**
>
> JavaScript에서는 단순히 "비어 있다"는 이유만으로 falsy가 되는 것이
> 아닙니다. 빈 배열과 빈 객체는 truthy입니다.

## 9. 논리 NOT 연산자 `!`

`!`는 값을 Boolean 관점에서 판단한 뒤 그 결과를 반대로 뒤집습니다.

``` ts
!value
```

예:

``` ts
!0;       // true
!1;       // false
!"";      // true
!"hello"; // false
!null;    // true
![];      // false
```

개념적으로:

``` text
원래 값
↓
Boolean 관점으로 평가
↓
true / false
↓
!로 반전
```

입니다.

> **팁**
>
> `!value`를 볼 때 "값 자체를 뒤집는다"보다 **Boolean으로 판단한 결과를
> 뒤집는다**라고 이해하는 것이 정확합니다.

## 10. `!!`를 이용한 Boolean 변환

`!`를 두 번 사용하면 truthy/falsy 성질을 실제 Boolean 값으로 만들 수
있습니다.

``` ts
!!"hello"; // true
!!0;       // false
!![];      // true
!!null;    // false
```

이는 다음과 비슷한 목적으로 사용됩니다.

``` ts
Boolean("hello"); // true
Boolean(0);       // false
```

첫 번째 `!`:

``` text
원래 Boolean 판단
↓
반전
```

두 번째 `!`:

``` text
다시 반전
↓
원래 truthy/falsy 성질의 Boolean 결과
```

> **팁**
>
> 학습 단계에서는 `Boolean(value)`가 더 읽기 쉽습니다. `!!value`는 다른
> 사람의 코드를 읽을 때 의미를 알아볼 수 있으면 충분합니다.

## 11. `orders.length === 0`과 `!orders.length`

다음 빈 배열이 있다고 해봅시다.

``` ts
const orders = [];
```

명시적으로 검사하면:

``` ts
orders.length === 0;
// true
```

truthy/falsy를 활용하면:

``` ts
!orders.length;
// true
```

입니다.

  ----------------------------------------------------------------------------------
  `orders`                `orders.length`   `orders.length === 0`   `!orders.length`
  -------------------- ------------------ ----------------------- ------------------
  `[]`                                  0                  `true`             `true`

  `[order1]`                            1                 `false`            `false`

  `[order1, order2]`                    2                 `false`            `false`
  ----------------------------------------------------------------------------------

하지만 다음은 완전히 다른 검사입니다.

``` ts
!orders
```

왜냐하면 빈 배열 자체가 truthy이기 때문입니다.

``` ts
Boolean([]); // true
![];         // false
```

> **팁**
>
> 지금 학습 단계에서는 `orders.length === 0`을 추천합니다. 코드를 읽었을
> 때 **주문 개수가 0인가?**라는 의도가 바로 보이기 때문입니다.

## 12. 쇼핑몰 Day 6 코드와 연결

### 12.1 localStorage의 주문 데이터 확인

``` ts
const savedOrders = localStorage.getItem("orders");

if (!savedOrders) {
  return;
}
```

`localStorage.getItem()`에서 해당 key를 찾지 못하면 `null`을 반환합니다.

따라서:

``` text
savedOrders = null
↓
null은 falsy
↓
!savedOrders = true
↓
return 실행
```

이 됩니다.

### 12.2 주문 객체 조건부 렌더링

``` tsx
{order && (
  <section>...</section>
)}
```

`order`가:

``` ts
null
```

이면 falsy이므로 화면을 출력하지 않습니다.

실제:

``` ts
Order 객체
```

가 들어오면 객체는 truthy이므로 화면을 출력합니다.

### 12.3 주문 내역이 비었는지 검사

명시적인 방식:

``` ts
orders.length === 0
```

truthy/falsy를 이용한 방식:

``` ts
!orders.length
```

둘 다 `orders`가 배열이라는 전제에서 주문 개수가 0인 상황을 확인할 수
있습니다.

> **팁**
>
> Day 6 코드에서 truthy/falsy를 발견할 때마다 **현재 값의 실제 타입과
> 값이 무엇인가?**를 먼저 확인하세요.
>
> ``` text
> savedOrders → string | null
> order → Order | null
> orders → Order[]
> orders.length → number
> ```
>
> 타입을 따라가면 조건식의 의미도 자연스럽게 이해됩니다.

## 13. 주의: `if (!value)`가 항상 정답은 아니다

예를 들어 수량이:

``` ts
const quantity = 0;
```

이라고 해봅시다.

``` ts
if (!quantity) {
  ...
}
```

에서는 `0`이 falsy이므로 조건이 참이 됩니다.

하지만 어떤 프로그램에서는 `0`이 정상적으로 허용되는 값일 수도 있습니다.

마찬가지로:

``` ts
const name = "";
```

에서 빈 문자열을 의도적으로 허용해야 하는 상황이라면 `if (!name)`은 너무
넓은 검사가 될 수 있습니다.

따라서 정말 `null`만 확인하고 싶다면:

``` ts
value === null
```

처럼 명시적으로 비교하는 것이 더 정확할 수 있습니다.

> **팁**
>
> `if (!value)`는 짧고 편리하지만 **어떤 falsy 값을 잡고 있는지** 항상
> 생각해야 합니다.

## 14. 핵심 비교표

  값              Boolean 결과 분류
  ------------- -------------- --------
  `false`              `false` falsy
  `0`                  `false` falsy
  `""`                 `false` falsy
  `null`               `false` falsy
  `undefined`          `false` falsy
  `NaN`                `false` falsy
  `1`                   `true` truthy
  `-1`                  `true` truthy
  `"hello"`             `true` truthy
  `"0"`                 `true` truthy
  `"false"`             `true` truthy
  `" "`                 `true` truthy
  `[]`                  `true` truthy
  `{}`                  `true` truthy

## 15. 최종 핵심 정리

특히 다음 네 쌍을 비교해서 기억하세요.

``` ts
Boolean(0);       // false
Boolean("0");     // true
```

``` ts
Boolean("");      // false
Boolean(" ");     // true
```

``` ts
Boolean(null);    // false
Boolean({});      // true
```

``` ts
Boolean([]);              // true
Boolean([].length);       // false
[].length === 0;          // true
```

마지막 예제가 특히 중요합니다.

``` text
[]
↓
배열 자체는 truthy

[].length
↓
0

0
↓
falsy
```

따라서:

``` ts
![]
// false
```

이지만:

``` ts
![].length
// true
```

가 됩니다.

> **팁**
>
> truthy/falsy를 암기 문제로만 공부하지 말고 **값 → Boolean 평가 → 조건
> 결과**의 3단계로 직접 추적하세요.
>
> ``` text
> value
> ↓
> Boolean(value)
> ↓
> if / ! / && / 삼항연산자의 결과
> ```
>
> 이 흐름이 익숙해지면 React의 조건부 렌더링도 훨씬 쉽게 읽을 수
> 있습니다.
