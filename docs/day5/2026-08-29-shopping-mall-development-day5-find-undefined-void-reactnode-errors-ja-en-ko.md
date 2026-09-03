# Day 5 — `product is possibly undefined`와 `void[] is not assignable to ReactNode` 에러 이해하기
## 日本語 → English → 한국어

---

# 1. 日本語

## 1.1 今回起きているエラーは2種類ある

今回のコードでは、主に次の2つのエラーが出ています。

```text
'product' is possibly 'undefined'
```

そして、

```text
Type 'void[]' is not assignable to type 'ReactNode'
```

この2つは原因が違います。

1つ目は `find()` の戻り値に関する問題です。

2つ目は `map()` の callback が JSX を返していないことに関する問題です。

### ポイント

エラーメッセージが長くても、最初に

```text
undefined の問題なのか
return の問題なのか
```

を分けて考えると理解しやすくなります。

---

## 1.2 なぜ `product is possibly undefined` が出るのか

次のコードを見ます。

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

`find()` は条件に一致する要素を見つけるメソッドです。

しかし、必ず見つかるとは限りません。

見つかった場合:

```tsx
{
  id: 1,
  name: "T-shirt",
  price: 20000
}
```

のような Product オブジェクトを返します。

見つからなかった場合:

```tsx
undefined
```

を返します。

そのため TypeScript から見ると、`product` の型は概念的に:

```tsx
Product | undefined
```

です。

つまり、

```text
Product かもしれない
または
undefined かもしれない
```

という状態です。

### ポイント

`find()` の結果は「必ず1件ある」と思わないことが重要です。

---

## 1.3 なぜ `product.name` で怒られるのか

もし次のように書くとします。

```tsx
const product = products.find(
  (product) => product.id === item.productId
);

return (
  <li>
    <h2>{product.name}</h2>
  </li>
);
```

TypeScript はこう考えます。

```text
product は Product かもしれない
でも undefined かもしれない
```

もし `undefined` だったら、

```tsx
product.name
```

は使えません。

そのため、

```text
'product' is possibly 'undefined'
```

というエラーになります。

### ポイント

TypeScript は「実行時に壊れる可能性」を事前に警告してくれています。

---

## 1.4 `if (!product) return null;` でなぜ解決できるのか

次のコードを入れます。

```tsx
if (!product) return null;
```

この時点で、

```text
product が存在しない
↓
null を返して終了
```

となります。

そして、その後のコードに到達した時点では TypeScript は、

```text
product は undefined ではない
```

と判断できます。

そのため、

```tsx
product.name
product.price
```

を安全に使えます。

```tsx
const product = products.find(
  (product) => product.id === item.productId
);

if (!product) return null;

return (
  <li key={item.productId}>
    <h2>{product.name}</h2>
  </li>
);
```

### ポイント

これは TypeScript の「型の絞り込み（narrowing）」です。

`if (!product)` の後では、`product` が存在すると判断されます。

---

## 1.5 では `void[]` エラーは何なのか

次のようなコードを考えます。

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) return;

    <li key={item.productId}>
      <h2>{product.name}</h2>
    </li>;
  })}
</ul>
```

見た目では `<li>` を書いているので、React が表示してくれそうに見えます。

しかし実際には `return` がありません。

```tsx
<li>
  ...
</li>
```

を書いただけでは、その JSX は `map()` の結果として返されません。

### ポイント

波括弧 `{}` を使った callback では、JSX を返すために `return` が必要です。

---

## 1.6 `void` とは何か

例えば次の関数を見ます。

```tsx
function test() {
  console.log("hello");
}
```

この関数は値を返していません。

概念的な戻り値は:

```tsx
void
```

です。

同じように、

```tsx
cart.map((item) => {
  const product = ...
  <li>...</li>;
});
```

と書くと、callback が値を返していないため、1回ごとの結果が `void` になります。

cart に3件あれば概念的には:

```text
[
  void,
  void,
  void
]
```

つまり:

```tsx
void[]
```

になります。

### ポイント

`void[]` というエラーを見たら、まず `map()` の中で `return` を忘れていないか確認してください。

---

## 1.7 なぜ React は `void[]` を表示できないのか

React の JSX では、

```tsx
<ul>
  {何か}
</ul>
```

の `何か` は React がレンダリングできる値でなければなりません。

例えば:

```tsx
<li>商品1</li>
```

や、

```tsx
[
  <li>商品1</li>,
  <li>商品2</li>
]
```

は React が表示できます。

しかし:

```tsx
void[]
```

は「何も返していない関数の結果の配列」なので、React が表示する内容ではありません。

そのため:

```text
Type 'void[]' is not assignable to type 'ReactNode'
```

というエラーになります。

### ポイント

`ReactNode` はざっくり言えば「React が画面に置けるもの」です。

`void` は画面に置くものではありません。

---

## 1.8 正しい書き方 1 — `return` を使う

```tsx
{cart.map((item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  if (!product) return null;

  return (
    <li key={item.productId}>
      <h2>{product.name}</h2>
    </li>
  );
})}
```

この場合、callback は:

```text
product がない
→ null

product がある
→ <li>...</li>
```

を返します。

したがって結果は概念的に:

```tsx
[
  <li>...</li>,
  null,
  <li>...</li>
]
```

のようになります。

React は `null` を「何も表示しない」として扱えるので問題ありません。

### ポイント

`return null` は React では有効な戻り値です。

---

## 1.9 `return;` と `return null;` の違い

次を比較します。

```tsx
if (!product) return;
```

これは値を返さないので:

```tsx
undefined
```

に近い挙動になります。

一方:

```tsx
if (!product) return null;
```

は明示的に React が扱える `null` を返します。

React の JSX callback では:

```tsx
return null;
```

のほうが意図が明確です。

### ポイント

レンダリングしない場合は `return null` と書く習慣をつけると分かりやすいです。

---

## 1.10 波括弧 `{}` と丸括弧 `()` の違い

単純に JSX だけを返す場合は:

```tsx
cart.map((item) => (
  <li key={item.productId}>
    ...
  </li>
))
```

のように書けます。

これは暗黙的に JSX を返しています。

一方:

```tsx
cart.map((item) => {
  const product = ...
  return (
    <li>
      ...
    </li>
  );
})
```

のように `{}` を使う場合は `return` が必要です。

今回のように `find()` や `if` を中に書く場合は `{}` が必要なので、`return` を忘れないことが重要です。

### ポイント

```text
() → その式をそのまま返す
{} → 自分で return を書く
```

という違いを覚えると便利です。

---

## 1.11 今回の正しい構造

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) return null;

    return (
      <li key={item.productId}>
        <h2>{product.name}</h2>
      </li>
    );
  })}
</ul>
```

処理の流れは:

```text
cart.map()
↓
item 1件
↓
products.find()
↓
product が見つかった？
├─ NO → return null
└─ YES
    ↓
    return <li>...</li>
```

です。

### ポイント

`find()` の安全確認と `map()` の JSX return は別問題です。

---

## 1.12 なぜ「一部だけ消す」と undefined エラーだけになるのか

例えば:

```tsx
const product = products.find(...);

return (
  <li>
    <h2>{product.name}</h2>
  </li>
);
```

のように JSX の `return` 自体は存在している場合、`map()` は JSX を返しています。

そのため `void[]` にはなりません。

しかし `product` が undefined の可能性は残っているので:

```text
'product' is possibly 'undefined'
```

だけが表示されます。

一方で、`return` まで消してしまうと:

```tsx
cart.map((item) => {
  const product = ...
  <li>...</li>;
})
```

となり、今度は callback 自体が何も返さなくなります。

その結果:

```tsx
void[]
```

になり、より大きな ReactNode エラーが発生します。

### ポイント

この違いはとても重要です。

```text
find のチェック不足
→ undefined エラー

map の return 不足
→ void[] エラー
```

---

# 2. English

## 2.1 You are seeing two different problems

There are two main errors:

```text
'product' is possibly 'undefined'
```

and:

```text
Type 'void[]' is not assignable to type 'ReactNode'
```

They come from different causes.

The first comes from `find()`.

The second comes from a `map()` callback that does not return JSX.

### Tip

Separate the errors mentally:

```text
undefined problem
vs
return problem
```

---

## 2.2 Why can `product` be undefined?

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

`find()` returns the matching element if one exists.

If nothing matches, it returns:

```tsx
undefined
```

So TypeScript effectively sees:

```tsx
Product | undefined
```

for the `product` variable.

### Tip

Never assume `find()` always succeeds.

---

## 2.3 Why does `product.name` produce an error?

If you write:

```tsx
const product = products.find(...);

return (
  <h2>{product.name}</h2>
);
```

TypeScript knows that `product` could be `undefined`.

Accessing:

```tsx
product.name
```

would crash if `product` were undefined.

So TypeScript reports:

```text
'product' is possibly 'undefined'
```

### Tip

This warning is TypeScript protecting you from a possible runtime error.

---

## 2.4 Why does `if (!product) return null` fix it?

```tsx
if (!product) return null;
```

This creates two branches:

```text
no product
→ return null

product exists
→ continue
```

After this check, TypeScript narrows `product` to a real Product object.

Then:

```tsx
product.name
product.price
```

are safe.

### Tip

This is called type narrowing.

---

## 2.5 What causes `void[]`?

Consider:

```tsx
{cart.map((item) => {
  const product = products.find(...);

  if (!product) return;

  <li key={item.productId}>
    <h2>{product.name}</h2>
  </li>;
})}
```

The JSX exists visually, but it is not being returned.

With `{}` in an arrow function body, you must explicitly write `return`.

Without it, the callback returns no value.

### Tip

JSX written inside a block is not automatically returned.

---

## 2.6 What does `void` mean?

A function like:

```tsx
function test() {
  console.log("hello");
}
```

does not return a meaningful value.

Its return type is conceptually:

```tsx
void
```

If every callback invocation inside `map()` returns nothing, then `map()` produces:

```tsx
void[]
```

Conceptually:

```text
[
  void,
  void,
  void
]
```

### Tip

When you see `void[]` in a `map()` rendering error, check for a missing `return`.

---

## 2.7 Why can't React render `void[]`?

React expects JSX children to be renderable values, broadly represented by `ReactNode`.

React can render things such as:

```tsx
<li>Item</li>
```

or arrays of JSX.

But `void[]` is an array of callbacks that returned nothing.

That is not meaningful UI output.

Therefore TypeScript reports:

```text
Type 'void[]' is not assignable to type 'ReactNode'
```

### Tip

Think of `ReactNode` as "something React knows how to place in the UI."

---

## 2.8 Correct structure

```tsx
{cart.map((item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  if (!product) return null;

  return (
    <li key={item.productId}>
      <h2>{product.name}</h2>
    </li>
  );
})}
```

Each callback now returns either:

```tsx
null
```

or:

```tsx
<li>...</li>
```

Both are acceptable for React rendering.

### Tip

The important part is that every logical branch returns something React can handle.

---

## 2.9 `return;` versus `return null;`

```tsx
return;
```

returns no explicit value.

```tsx
return null;
```

explicitly means "render nothing."

In React rendering code, `return null` usually communicates the intention more clearly.

### Tip

Use `return null` when you intentionally want to skip rendering an item.

---

## 2.10 `{}` versus `()`

This:

```tsx
cart.map((item) => (
  <li>{item.productId}</li>
))
```

uses an implicit return.

But this:

```tsx
cart.map((item) => {
  const product = ...;

  return (
    <li>...</li>
  );
})
```

uses a block body, so it needs an explicit `return`.

### Tip

Remember:

```text
() → implicit return
{} → explicit return needed
```

---

## 2.11 Why removing different lines produces different errors

If the JSX `return` still exists but the product check does not:

```tsx
const product = products.find(...);

return (
  <h2>{product.name}</h2>
);
```

then `map()` still returns JSX, so there is no `void[]`.

Only the possible `undefined` problem remains.

But if the callback contains JSX without returning it:

```tsx
cart.map((item) => {
  const product = ...;
  <li>...</li>;
})
```

then the callback returns nothing, and `map()` becomes `void[]`.

### Tip

The compact distinction is:

```text
missing find guard
→ possibly undefined

missing map return
→ void[]
```

---

# 3. 한국어

## 3.1 지금 에러는 사실 두 종류야

현재 보이는 에러는 크게 두 가지다.

```text
'product' is possibly 'undefined'
```

그리고:

```text
Type 'void[]' is not assignable to type 'ReactNode'
```

이 두 에러는 같은 원인에서 나오는 것이 아니다.

첫 번째는:

```tsx
find()
```

의 반환값 때문에 발생한다.

두 번째는:

```tsx
map()
```

안에서 JSX를 반환하지 않았을 때 발생한다.

### 팁

에러가 길게 나와도 먼저 이렇게 나눠서 보면 된다.

```text
undefined 문제인가?
return 문제인가?
```

---

## 3.2 왜 `product is possibly undefined`가 나올까?

현재 코드:

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

에서 `find()`는 조건에 맞는 요소 하나를 찾는다.

찾았다면:

```tsx
{
  id: 1,
  name: "티셔츠",
  price: 20000
}
```

같은 상품 객체가 반환된다.

하지만 조건에 맞는 상품이 없다면:

```tsx
undefined
```

가 반환된다.

따라서 TypeScript 입장에서 `product`는 개념적으로:

```tsx
Product | undefined
```

이다.

즉:

```text
Product일 수도 있고
undefined일 수도 있다
```

는 뜻이다.

### 팁

`find()`를 사용할 때는 "무조건 찾는다"가 아니라 **못 찾을 수도 있다**는 사실을 항상 같이 기억하면 좋다.

---

## 3.3 그래서 왜 `product.name`에서 에러가 날까?

다음 코드가 있다고 해보자.

```tsx
const product = products.find(
  (product) => product.id === item.productId
);

return (
  <li>
    <h2>{product.name}</h2>
  </li>
);
```

TypeScript는:

```text
product가 실제 Product일 수도 있지만
undefined일 수도 있는데?
```

라고 판단한다.

만약 정말 `undefined`라면:

```tsx
product.name
```

을 읽을 수 없다.

그래서:

```text
'product' is possibly 'undefined'
```

에러가 발생한다.

### 팁

이 에러는 TypeScript가 괜히 까다롭게 구는 것이 아니라, 실제 런타임 오류 가능성을 미리 잡아주는 것이다.

---

## 3.4 `if (!product) return null;`을 넣으면 왜 해결될까?

다음 코드를 넣어보자.

```tsx
if (!product) return null;
```

이 코드는:

```text
product가 없다
↓
null 반환
↓
현재 map 반복 종료
```

라는 의미다.

그 아래 코드까지 내려왔다는 것은:

```text
product가 존재한다
```

는 뜻이 된다.

그래서 TypeScript는 그 이후의 `product`를 더 이상:

```tsx
Product | undefined
```

로 보지 않고 사실상:

```tsx
Product
```

로 좁혀서 이해한다.

이걸 **타입 좁히기(Type Narrowing)**라고 한다.

```tsx
const product = products.find(
  (product) => product.id === item.productId
);

if (!product) return null;

return (
  <li key={item.productId}>
    <h2>{product.name}</h2>
  </li>
);
```

### 팁

`find()` 다음에 `if (!product)` 같은 존재 여부 검사를 하는 패턴은 아주 자주 쓰인다.

---

## 3.5 그럼 `void[]` 에러는 왜 생길까?

이번에는 이런 코드를 생각해보자.

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) return;

    <li key={item.productId}>
      <h2>{product.name}</h2>
    </li>;
  })}
</ul>
```

겉으로 보면 `<li>`를 작성했기 때문에 화면에 나올 것처럼 보인다.

하지만 실제로는:

```tsx
return (
  <li>...</li>
);
```

가 아니다.

그냥 JSX를 코드 중간에 작성했을 뿐이다.

즉 `map()` callback이 값을 반환하지 않는다.

### 팁

화살표 함수에서 `{}`를 사용했다면 JSX를 보여주려면 **직접 `return` 해야 한다.**

---

## 3.6 `void`가 뭘까?

다음 함수를 보자.

```tsx
function test() {
  console.log("hello");
}
```

이 함수는 어떤 값을 반환하지 않는다.

이런 경우 반환 타입을 개념적으로:

```tsx
void
```

라고 한다.

마찬가지로:

```tsx
cart.map((item) => {
  const product = ...;

  <li>...</li>;
});
```

처럼 `return`이 없다면 각 callback 실행 결과가 `void`가 된다.

cart에 상품이 세 개라면 개념적으로:

```text
[
  void,
  void,
  void
]
```

가 된다.

즉:

```tsx
void[]
```

이다.

### 팁

`map()`을 JSX 렌더링에 사용하다가 `void[]`가 보이면 가장 먼저 **return을 빠뜨렸는지** 확인하면 된다.

---

## 3.7 왜 React는 `void[]`를 받을 수 없을까?

JSX에서:

```tsx
<ul>
  {여기}
</ul>
```

의 `{여기}`에는 React가 렌더링할 수 있는 값이 들어가야 한다.

예를 들어:

```tsx
<li>상품 1</li>
```

이나:

```tsx
[
  <li>상품 1</li>,
  <li>상품 2</li>
]
```

는 React가 처리할 수 있다.

하지만:

```tsx
void[]
```

는:

> 아무것도 반환하지 않은 함수 결과들의 배열

이다.

화면에 표시할 UI 값이 아니다.

그래서 TypeScript가:

```text
Type 'void[]' is not assignable to type 'ReactNode'
```

라고 알려주는 것이다.

### 팁

`ReactNode`는 지금 단계에서는 **React가 화면에 렌더링할 수 있는 값** 정도로 이해하면 충분하다.

---

## 3.8 올바른 구조는 이거야

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) return null;

    return (
      <li key={item.productId}>
        <h2>{product.name}</h2>
      </li>
    );
  })}
</ul>
```

이제 각 `map()` 반복은 두 가지 중 하나를 반환한다.

상품을 못 찾으면:

```tsx
null
```

상품을 찾으면:

```tsx
<li>...</li>
```

즉 개념적으로 결과는:

```tsx
[
  <li>...</li>,
  null,
  <li>...</li>
]
```

처럼 될 수 있다.

React는 `null`을:

```text
아무것도 렌더링하지 않음
```

으로 처리할 수 있기 때문에 문제가 없다.

### 팁

렌더링 callback에서는 각 경로가 **React가 이해할 수 있는 값을 반환하도록** 생각하면 좋다.

---

## 3.9 `return;`과 `return null;`의 차이

이 둘을 비교해보자.

```tsx
if (!product) return;
```

이 코드는 명시적인 값 없이 함수를 끝낸다.

반면:

```tsx
if (!product) return null;
```

은 명확하게 `null`을 반환한다.

React에서는 `null`을 정상적인 "렌더링 안 함" 값으로 사용할 수 있다.

따라서 JSX 렌더링에서는:

```tsx
return null;
```

이라고 적는 것이 의도를 이해하기 쉽다.

### 팁

화면에 아무것도 보여주지 않을 때는 `return null`이라고 쓰는 습관을 들이면 좋다.

---

## 3.10 화살표 함수의 `{}`와 `()` 차이도 중요하다

아주 단순한 경우:

```tsx
cart.map((item) => (
  <li key={item.productId}>
    {item.productId}
  </li>
))
```

처럼 작성할 수 있다.

여기서는 `()` 안의 JSX가 자동으로 반환된다.

이를 **암시적 반환**이라고 볼 수 있다.

하지만:

```tsx
cart.map((item) => {
  const product = products.find(...);

  return (
    <li>
      ...
    </li>
  );
})
```

처럼 `{}` 블록을 사용하면:

```tsx
return
```

을 직접 적어야 한다.

이번에는 `find()`와 `if` 문을 안에 넣어야 하기 때문에 `{}` 블록을 사용하는 것이 자연스럽다.

### 팁

다음 규칙으로 기억해도 좋다.

```text
() 사용
→ 식을 바로 반환

{} 사용
→ return을 직접 작성
```

---

## 3.11 왜 하나만 없애면 undefined 에러만 나오고, 더 없애면 void[] 에러까지 나올까?

이 부분이 질문의 핵심이다.

### 경우 1: product 안전 검사만 없다

```tsx
const product = products.find(...);

return (
  <li>
    <h2>{product.name}</h2>
  </li>
);
```

여기서는 `return`이 존재한다.

따라서 `map()`은 JSX를 반환한다.

그래서:

```text
void[] 문제는 없음
```

이다.

하지만 `product`가 `undefined`일 수 있으므로:

```text
'product' is possibly 'undefined'
```

만 발생한다.

---

### 경우 2: JSX의 return까지 없다

```tsx
cart.map((item) => {
  const product = products.find(...);

  <li>
    <h2>...</h2>
  </li>;
})
```

여기서는 callback이 아무것도 반환하지 않는다.

따라서:

```text
callback 반환값 = void
```

이고,

`map()` 전체 결과는:

```tsx
void[]
```

가 된다.

그래서 React가:

```text
나는 void[]를 children으로 렌더링할 수 없어
```

라고 판단하며 긴 `ReactNode` 타입 에러가 발생한다.

### 팁

두 에러를 이렇게 구분하면 아주 쉽다.

```text
find() 결과 검사 없음
↓
product possibly undefined

map() JSX return 없음
↓
void[]
↓
not assignable to ReactNode
```

---

## 3.12 지금 코드에서 가장 안정적인 형태

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) return null;

    return (
      <li key={item.productId}>
        <h2>{product.name}</h2>
      </li>
    );
  })}
</ul>
```

데이터 흐름으로 보면:

```text
cart.map()
↓
item 하나
↓
products.find()
↓
product?
├─ 없음
│   ↓
│ return null
│
└─ 있음
    ↓
    product.name 사용 가능
    ↓
    return <li>...</li>
```

### 팁

`find()`의 `undefined` 처리와 `map()`의 `return` 처리는 서로 다른 책임이다. 둘 다 있어야 코드가 타입적으로도 렌더링 측면에서도 안정적이다.

---

# 4. 에러 비교표

| 에러 | 주된 원인 | 확인할 부분 |
|---|---|---|
| `'product' is possibly 'undefined'` | `find()`는 못 찾으면 `undefined` 반환 | `if (!product) return null` 같은 검사 |
| `Type 'void[]' is not assignable to type 'ReactNode'` | `map()` callback에서 JSX를 반환하지 않음 | JSX 앞의 `return` |
| `void` | 함수가 값을 반환하지 않음 | callback의 모든 경로 확인 |
| `ReactNode` 관련 에러 | React children으로 렌더링할 수 없는 값 전달 | map의 반환 결과 확인 |

---

# 5. 최종 핵심 정리

```tsx
const product = products.find(...);
```

의 결과는:

```text
Product 또는 undefined
```

이므로:

```tsx
if (!product) return null;
```

이 필요할 수 있다.

그리고:

```tsx
cart.map((item) => {
```

처럼 `{}` 블록을 사용하는 경우에는 JSX를 반드시:

```tsx
return (
  <li>...</li>
);
```

형태로 반환해야 한다.

따라서 핵심 구조는:

```tsx
cart.map((item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  if (!product) return null;

  return (
    <li key={item.productId}>
      <h2>{product.name}</h2>
    </li>
  );
});
```

이다.

한 줄 공식으로 기억하면:

```text
find()는 실패할 수 있다
→ undefined 검사

map()은 결과를 만들어야 한다
→ JSX return
```

이 두 개를 분리해서 이해하면 이번 긴 TypeScript 에러 메시지도 훨씬 쉽게 읽을 수 있다.
