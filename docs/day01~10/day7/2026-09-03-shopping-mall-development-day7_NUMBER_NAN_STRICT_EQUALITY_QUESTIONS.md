# Day 7 질문 버전 --- `Number()`, `NaN`, `===`

> 학습 순서: 日本語 → English → 한국어\
> 먼저 스스로 답한 뒤 답변 파일과 비교하세요.

------------------------------------------------------------------------

## 1. 日本語 --- Questions

### Q1

`/orders/123` の `params.id` は、なぜ数値 `123` ではなく文字列 `"123"`
として扱われますか？

### Q2

次の結果はなぜ `false` ですか？

``` ts
"123" === 123
```

### Q3

Day 7 で次のコードを使う目的は何ですか？

``` ts
const orderId = Number(params.id);
```

### Q4

次の結果は何ですか？ また、その意味は何ですか？

``` ts
Number("abc");
```

### Q5

`NaN` を確認するとき、なぜ `typeof` だけでは不十分ですか？

### Q6

次のコードで `find()` は何をしていますか？

``` ts
const order = orders.find(
  (order) => order.id === orderId
);
```

### Q7

URL が `/orders/abc` の場合、`Number(params.id)` から Not Found UI
まで、どのような流れになる可能性がありますか？

> **Tip:** 答えを一行で暗記せず、URL → 型変換 → 比較 →
> 検索の順番で説明してみましょう。

------------------------------------------------------------------------

## 2. English --- Questions

### Q1

Why is `params.id` from `/orders/123` treated as `"123"` rather than the
number `123`?

### Q2

Why does this return `false`?

``` ts
"123" === 123
```

### Q3

What is the purpose of this line in Day 7?

``` ts
const orderId = Number(params.id);
```

### Q4

What does the following expression return, and what does that result
mean?

``` ts
Number("abc");
```

### Q5

Why is `typeof` alone insufficient for checking whether a value is a
valid number when `NaN` is involved?

### Q6

What is `find()` doing here?

``` ts
const order = orders.find(
  (order) => order.id === orderId
);
```

### Q7

If the URL is `/orders/abc`, describe the possible flow from
`Number(params.id)` to the Not Found UI.

> **Tip:** Explain each answer as a data flow: URL parameter →
> conversion → strict comparison → lookup result.

------------------------------------------------------------------------

## 3. 한국어 --- 질문

### Q1

`/orders/123`에서 얻은 `params.id`는 왜 숫자 `123`이 아니라 문자열
`"123"`으로 다룰까요?

### Q2

다음 비교 결과가 왜 `false`일까요?

``` ts
"123" === 123
```

### Q3

Day 7에서 다음 코드의 목적은 무엇일까요?

``` ts
const orderId = Number(params.id);
```

### Q4

다음 코드는 무엇을 반환하며, 그 결과는 어떤 의미일까요?

``` ts
Number("abc");
```

### Q5

`NaN`이 관련된 경우 정상적인 숫자인지 확인할 때 왜 `typeof`만으로는
부족할까요?

### Q6

다음 코드에서 `find()`는 무엇을 하고 있을까요?

``` ts
const order = orders.find(
  (order) => order.id === orderId
);
```

### Q7

URL이 `/orders/abc`라면 `Number(params.id)`부터 Not Found UI까지 어떤
흐름이 발생할 수 있을까요?

> **팁:** 답을 외우기보다 `URL → 타입 변환 → === 비교 → find()` 순서로
> 직접 설명해보세요.
