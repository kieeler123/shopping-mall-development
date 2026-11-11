# Day 7 질문·답변 버전 --- `Number()`, `NaN`, `===`

> 학습 순서: 日本語 → English → 한국어

------------------------------------------------------------------------

## 1. 日本語 --- Q&A

### Q1. `/orders/123` の `params.id` は、なぜ `"123"` ですか？

URL の Dynamic Segment には JavaScript の `number`
型という情報が含まれていません。`[id]`
はパラメータ名を定義するもので、数値型を宣言するものではないため、`params.id`
は文字列として扱います。

### Q2. なぜ `"123" === 123` は `false` ですか？

`===` は値だけでなく型も厳密に比較するからです。`"123"` は
`string`、`123` は `number` なので一致しません。

### Q3. `Number(params.id)` の目的は何ですか？

URL から取得した文字列 ID を数値に変換し、`number` 型の `Order.id`
と同じ型に合わせるためです。

``` ts
Number("123");
// 123
```

### Q4. `Number("abc")` は何になりますか？

`NaN` になります。これは正常な数値へ変換できなかったことを表します。

``` ts
Number.isNaN(Number("abc"));
// true
```

### Q5. なぜ `typeof` だけでは `NaN` を判定できませんか？

JavaScript では `typeof NaN` が `"number"` になるためです。

``` ts
typeof NaN;
// "number"
```

### Q6. `find()` は何をしていますか？

`orders` 配列を先頭から確認し、`order.id === orderId` が最初に `true`
になる注文を返します。

``` tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

### Q7. `/orders/abc` では何が起こりますか？

`params.id` は `"abc"`、`Number("abc")` は `NaN` になります。正常な数値
ID の注文とは一致しないため、`find()` が注文を見つけられず `undefined`
になる可能性があり、その結果を Not Found UI に接続できます。

> **Tip:** `Number()` → `NaN` → `===` → `find()`
> を別々に暗記せず、一つの検索処理として理解しましょう。

------------------------------------------------------------------------

## 2. English --- Q&A

### Q1. Why is `params.id` from `/orders/123` `"123"`?

A URL dynamic segment does not carry JavaScript `number` type
information. `[id]` defines the parameter name; it does not declare the
parameter as a number. Therefore, the route value is treated as a
string.

### Q2. Why is `"123" === 123` false?

Because `===` compares both value and type. `"123"` is a `string`, while
`123` is a `number`.

### Q3. Why use `Number(params.id)`?

It explicitly converts the string ID from the URL into a number so it
can be compared with a numeric `Order.id`.

``` ts
Number("123");
// 123
```

### Q4. What does `Number("abc")` return?

It returns `NaN`, indicating that JavaScript could not produce a valid
numeric result from that value.

``` ts
Number.isNaN(Number("abc"));
// true
```

### Q5. Why is `typeof` insufficient for detecting `NaN`?

Because JavaScript reports the type of `NaN` as `"number"`.

``` ts
typeof NaN;
// "number"
```

### Q6. What does `find()` do here?

It checks the `orders` array and returns the first order for which
`order.id === orderId` is `true`.

``` tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

### Q7. What can happen with `/orders/abc`?

`params.id` becomes `"abc"`, and `Number("abc")` becomes `NaN`. It will
not match a normal numeric order ID, so `find()` may return `undefined`.
The application can then render a Not Found state.

> **Tip:** Read the code as a pipeline: receive URL text → convert the
> type → compare strictly → find the matching order → handle failure.

------------------------------------------------------------------------

## 3. 한국어 --- 질문·답변

### Q1. `/orders/123`의 `params.id`는 왜 `"123"`인가요?

URL의 Dynamic Segment에는 JavaScript의 `number` 타입 정보가 들어 있지
않습니다. `[id]`는 파라미터의 이름을 정의할 뿐 숫자 타입을 선언하는 것이
아니므로 URL에서 얻은 값은 문자열로 다룹니다.

### Q2. 왜 `"123" === 123`은 `false`인가요?

`===`는 값뿐 아니라 타입까지 엄격하게 비교하기 때문입니다. `"123"`은
`string`, `123`은 `number`라서 일치하지 않습니다.

### Q3. 왜 `Number(params.id)`를 사용하나요?

URL에서 받은 문자열 ID를 숫자로 명시적으로 변환하여 `number` 타입인
`Order.id`와 타입을 맞추기 위해서입니다.

``` ts
Number("123");
// 123
```

### Q4. `Number("abc")`는 무엇을 반환하나요?

`NaN`을 반환합니다. 정상적인 숫자로 변환할 수 없었다는 의미입니다.

``` ts
Number.isNaN(Number("abc"));
// true
```

### Q5. 왜 `typeof`만으로 `NaN`을 확인하기 어려운가요?

JavaScript에서는 `typeof NaN`의 결과가 `"number"`이기 때문입니다.

``` ts
typeof NaN;
// "number"
```

따라서 정상적인 숫자인지 확인하려면 `Number.isNaN()` 같은 검사를 함께
고려할 수 있습니다.

### Q6. `find()`는 무엇을 하나요?

`orders` 배열을 확인하면서 `order.id === orderId` 조건이 처음으로
`true`가 되는 주문 하나를 반환합니다.

``` tsx
const order = orders.find(
  (order) => order.id === orderId
);
```

### Q7. `/orders/abc`에서는 어떤 일이 일어날 수 있나요?

`params.id`는 `"abc"`이고 `Number("abc")`는 `NaN`이 됩니다. 정상적인
숫자 주문 ID와 일치하지 않으므로 `find()`가 주문을 찾지 못해
`undefined`를 반환할 수 있습니다. 이후 이 상태를
`주문 정보를 찾을 수 없습니다` 같은 Not Found UI와 연결할 수 있습니다.

> **팁:** 실제 코드에서는 `Number()`, `NaN`, `===`, `find()`를 따로 보지
> 말고 아래 흐름으로 읽으세요.

``` text
/orders/123
↓
params.id = "123"
↓
Number()
↓
123
↓
===
↓
find()
↓
Order 또는 undefined
```
