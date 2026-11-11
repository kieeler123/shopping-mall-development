# Day 7 총정리 --- `Number()`, `NaN`, `===`

> 학습 순서: 日本語 → English → 한국어\
> 주제: Next.js Dynamic Route에서 URL의 주문 ID를 안전하게 숫자로
> 변환하고 비교하는 흐름

------------------------------------------------------------------------

## 1. 日本語

### 1.1 全体の流れ

Next.js の Dynamic Route で `/orders/123`
にアクセスすると、`useParams()` から取得する `params.id`
は文字列として扱います。

``` tsx
const params = useParams();

params.id;
// "123"
```

しかし、注文データの `order.id` が `number`
型の場合、次の比較は一致しません。

``` ts
123 === "123";
// false
```

そのため、`Number()` を使って URL の ID を数値に変換します。

``` tsx
const orderId = Number(params.id);
```

これで、

``` ts
order.id === orderId
```

のように、`number` 同士を `===` で比較できます。

### 1.2 `Number()`

`Number()` は値を数値へ変換するために使います。

``` ts
Number("123");
// 123
```

Day 7 では、URL から取得した文字列の ID と `Order.id`
の型を合わせるために使います。

### 1.3 `NaN`

数値に変換できない文字列を `Number()` に渡すと `NaN` になります。

``` ts
Number("abc");
// NaN
```

`NaN` は Not-a-Number
を意味し、変換によって正常な数値を得られなかったことを表します。

``` ts
Number.isNaN(Number("abc"));
// true
```

注意点として、JavaScript では次の結果になります。

``` ts
typeof NaN;
// "number"
```

したがって、正常な数値かどうかを確認するとき、`typeof` だけでは `NaN`
を除外できません。

### 1.4 `===`

`===` は値だけでなく型も含めて厳密に比較します。

``` ts
123 === 123;
// true

"123" === 123;
// false
```

Day 7 では、URL の `"123"` を `Number()` で `123`
に変換してから、注文データの ID と比較します。

### 1.5 `find()` との接続

``` tsx
const orderId = Number(params.id);

const order = orders.find(
  (order) => order.id === orderId
);
```

処理の流れは次のとおりです。

``` text
/orders/123
↓
params.id = "123"
↓
Number(params.id)
↓
123
↓
order.id === orderId
↓
find()
↓
該当する注文
```

もし `/orders/abc` なら、

``` text
"abc"
↓
Number()
↓
NaN
↓
一致する注文が見つからない
↓
order が undefined になる可能性
↓
Not Found UI
```

という流れになります。

> **Tip:** `Number()` を暗記するのではなく、「URL の ID とデータモデルの
> ID の型を合わせるため」と理解すると応用しやすくなります。

------------------------------------------------------------------------

## 2. English

### 2.1 Overall flow

When a user visits `/orders/123` through a Next.js Dynamic Route, the
value obtained from `params.id` is treated as a string.

``` tsx
const params = useParams();

params.id;
// "123"
```

If `order.id` in the order data is a `number`, this comparison does not
match:

``` ts
123 === "123";
// false
```

Therefore, convert the URL parameter to a number:

``` tsx
const orderId = Number(params.id);
```

Now the application can compare two numeric values:

``` ts
order.id === orderId
```

### 2.2 `Number()`

`Number()` converts a value into a JavaScript number.

``` ts
Number("123");
// 123
```

In Day 7, its purpose is to align the type of the URL ID with the type
of `Order.id`.

### 2.3 `NaN`

If JavaScript cannot convert a value into a valid number, `Number()` can
return `NaN`.

``` ts
Number("abc");
// NaN
```

`NaN` means Not-a-Number and represents an invalid numeric result.

``` ts
Number.isNaN(Number("abc"));
// true
```

A notable JavaScript behavior is:

``` ts
typeof NaN;
// "number"
```

So `typeof value === "number"` alone does not guarantee that the value
is a valid number.

### 2.4 `===`

The strict equality operator `===` compares both value and type.

``` ts
123 === 123;
// true

"123" === 123;
// false
```

This is why converting `"123"` to `123` is important before comparing it
with a numeric `order.id`.

### 2.5 Connecting it to `find()`

``` tsx
const orderId = Number(params.id);

const order = orders.find(
  (order) => order.id === orderId
);
```

The complete mental model is:

``` text
/orders/123
↓
params.id = "123"
↓
Number(params.id)
↓
123
↓
order.id === orderId
↓
find()
↓
matching order
```

For an invalid URL such as `/orders/abc`:

``` text
"abc"
↓
Number()
↓
NaN
↓
no matching numeric order ID
↓
order may be undefined
↓
Not Found UI
```

> **Tip:** Think of `Number()` as an explicit type-alignment step before
> strict comparison, not as a function that should be applied to every
> kind of ID.

------------------------------------------------------------------------

## 3. 한국어

### 3.1 전체 흐름

Next.js Dynamic Route에서 `/orders/123`으로 접근하면 `useParams()`로
읽은 `params.id`는 문자열로 다룹니다.

``` tsx
const params = useParams();

params.id;
// "123"
```

그런데 주문 데이터의 `order.id`가 `number`라면:

``` ts
123 === "123";
// false
```

가 됩니다.

따라서 URL에서 얻은 ID를 숫자로 변환합니다.

``` tsx
const orderId = Number(params.id);
```

이제:

``` ts
order.id === orderId
```

처럼 `number`끼리 엄격하게 비교할 수 있습니다.

### 3.2 `Number()`

`Number()`는 값을 JavaScript의 숫자로 변환합니다.

``` ts
Number("123");
// 123
```

Day 7에서는 URL의 ID와 `Order.id`의 타입을 맞추기 위해 사용합니다.

### 3.3 `NaN`

숫자로 변환할 수 없는 값을 `Number()`에 전달하면 `NaN`이 나올 수
있습니다.

``` ts
Number("abc");
// NaN
```

`NaN`은 Not-a-Number라는 뜻이며, 정상적인 숫자 변환 결과를 얻지 못했다는
것을 나타냅니다.

``` ts
Number.isNaN(Number("abc"));
// true
```

주의할 점:

``` ts
typeof NaN;
// "number"
```

이므로 `typeof`만으로 정상적인 숫자인지 판단할 수는 없습니다.

### 3.4 `===`

`===`는 값뿐만 아니라 타입까지 엄격하게 비교합니다.

``` ts
123 === 123;
// true

"123" === 123;
// false
```

따라서 URL에서 얻은 `"123"`을 `Number()`로 `123`으로 변환한 뒤
`order.id`와 비교하는 것입니다.

### 3.5 `find()`와 연결

``` tsx
const orderId = Number(params.id);

const order = orders.find(
  (order) => order.id === orderId
);
```

전체 흐름:

``` text
/orders/123
↓
params.id = "123"
↓
Number(params.id)
↓
123
↓
order.id === orderId
↓
find()
↓
해당 주문 발견
```

잘못된 URL `/orders/abc`라면:

``` text
"abc"
↓
Number()
↓
NaN
↓
일치하는 숫자 주문 ID 없음
↓
order가 undefined일 수 있음
↓
Not Found UI
```

> **팁:** `Number()`의 문법보다 "왜 여기서 타입 변환이 필요한가?"를
> 설명할 수 있는 것이 중요합니다.

------------------------------------------------------------------------

## 핵심 한 줄

**日本語:** URL から取得した `"123"` を `Number()` で `123`
に変換し、`Order.id` と `===` で正確に比較する。変換できない場合は `NaN`
になる可能性がある。

**English:** Convert the URL value `"123"` into the number `123` with
`Number()`, then compare it strictly with `Order.id` using `===`; an
invalid conversion can result in `NaN`.

**한국어:** URL에서 받은 `"123"`을 `Number()`로 `123`으로 바꾼 뒤
`Order.id`와 `===`로 정확하게 비교하며, 변환할 수 없는 값은 `NaN`이 될
수 있다.
