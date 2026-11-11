# Day 5 — `map()` + `find()`으로 장바구니와 상품 정보 연결하기
## 日本語 → English → 한국어

---

# 1. 日本語

## 1.1 なぜ `map()` と `find()` を一緒に使うのか

今回の checkout では、カートの各項目を注文書に表示する必要があります。

カートデータが次のような形だと考えます。

```tsx
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

このデータには主に、

- どの商品なのかを示す `productId`
- 何個入っているかを示す `quantity`

があります。

しかし注文書には、商品名や価格も必要です。

そこで別の商品データを利用します。

```tsx
const products = [
  { id: 1, name: "T-shirt", price: 20000 },
  { id: 2, name: "Shoes", price: 80000 },
  { id: 3, name: "Jeans", price: 50000 },
];
```

役割を分けると、

```text
map()
= カートの項目を1件ずつ処理する

find()
= 現在のカート項目に対応する商品を1件探す
```

となります。

### ポイント

`map = 複数の項目を順番に処理`、`find = 条件に一致する1件を検索` と覚えると整理しやすいです。

---

## 1.2 `map()` の役割

```tsx
cart.map((item) => {
  // ...
});
```

`map()` は `cart` の要素を1件ずつ取り出します。

最初の処理では、

```tsx
item = {
  productId: 1,
  quantity: 2,
};
```

次の処理では、

```tsx
item = {
  productId: 3,
  quantity: 1,
};
```

というように進みます。

```text
cart
↓
map()
↓
1件目の item
↓
2件目の item
↓
...
```

### ポイント

`map()` の中の `item` は、**現在処理しているカート項目1件**です。

---

## 1.3 `find()` の役割

現在の `item` が次の値だとします。

```tsx
{
  productId: 1,
  quantity: 2
}
```

商品データから `id` が 1 の商品を探します。

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

自然な言葉にすると、

> products の中から、`product.id` と `item.productId` が同じ商品を1件探す

という意味です。

### ポイント

`find()` は **条件に一致する最初の要素1件**を探すメソッドです。

---

## 1.4 `find()` の比較はどう進むのか

`item.productId` が `1` なら、考え方としては、

```tsx
products.find(
  (product) => product.id === 1
);
```

となります。

最初の商品が、

```tsx
{
  id: 1,
  name: "T-shirt",
  price: 20000
}
```

なら、

```tsx
1 === 1
```

は `true` です。

そのため、この商品が返されます。

```tsx
const product = {
  id: 1,
  name: "T-shirt",
  price: 20000,
};
```

### ポイント

`find()` は条件が `true` になる要素を見つけると、その要素を結果として返します。

---

## 1.5 `map()` の中で `find()` を使う

2つを組み合わせると、概念的には次の形になります。

```tsx
cart.map((item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  return (
    <div>
      {/* 注文商品の表示 */}
    </div>
  );
});
```

流れは、

```text
cart の1件目
↓
find()
↓
対応する商品情報を探す
↓
商品名・価格を利用

cart の2件目
↓
find()
↓
対応する商品情報を探す
↓
商品名・価格を利用
```

です。

### ポイント

`map()` を **外側の繰り返し**、`find()` を **その項目に必要な情報の検索** と考えると理解しやすいです。

---

## 1.6 `productId` と `id` が接続キーになる

cart:

```tsx
{ productId: 1, quantity: 2 }
```

products:

```tsx
{ id: 1, name: "T-shirt", price: 20000 }
```

この2つは、

```text
cart.item.productId
        │
        │ 同じ値
        ▼
products.product.id
```

という関係で接続できます。

### ポイント

プロパティ名が `productId` と `id` で異なっていても、同じ商品を識別する値なら比較できます。

---

## 1.7 2つのデータを組み合わせると何が得られるか

cart からは、

```text
quantity
```

を得られます。

products からは、

```text
name
price
```

を得られます。

その結果、

```text
商品名: T-shirt
価格: 20000
数量: 2
```

のような注文情報を作れます。

さらに小計は、

```text
price × quantity
```

なので、

```text
20000 × 2 = 40000
```

と計算できます。

### ポイント

`map()` + `find()` で商品情報を接続できると、次の `price * quantity` に自然につながります。

---

## 1.8 `map()` と `find()` の重要な違い

### `map()`

配列の各要素を処理し、結果を作ります。

```tsx
cart.map(...)
```

React では複数の JSX を表示するときにもよく使います。

### `find()`

条件に一致する要素を1件探します。

```tsx
products.find(...)
```

結果は配列ではなく、

```text
商品オブジェクト1件
```

または、見つからなければ、

```tsx
undefined
```

です。

### ポイント

```text
map  → 複数を処理
find → 1件を探す
```

という違いを覚えてください。

---

## 1.9 `find()` は `undefined` になる可能性がある

例えば cart に、

```tsx
{ productId: 99, quantity: 1 }
```

があるのに、products に `id: 99` が存在しない場合、

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

の結果は、

```tsx
undefined
```

です。

そのため、安全に処理するなら、

```tsx
if (!product) {
  return null;
}
```

のような確認が必要になることがあります。

### ポイント

TypeScript が `product is possibly undefined` と警告した場合、`find()` が商品を見つけられない可能性を考えてください。

---

## 1.10 全体のデータフロー

```text
cart
↓
map()
↓
item 1件
↓
item.productId
↓
products.find()
↓
product 1件
↓
product.name
product.price
item.quantity
↓
price × quantity
↓
注文項目の JSX
```

### ポイント

コードそのものを暗記するより、このデータの流れを頭の中で追えることが重要です。

---

# 2. English

## 2.1 Why use `map()` and `find()` together?

The checkout page needs to display every item in the cart.

Assume the cart contains:

```tsx
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

This data tells us:

- which product is in the cart through `productId`
- how many units are in the cart through `quantity`

But the checkout UI also needs information such as the product name and price.

That information can come from a product list:

```tsx
const products = [
  { id: 1, name: "T-shirt", price: 20000 },
  { id: 2, name: "Shoes", price: 80000 },
  { id: 3, name: "Jeans", price: 50000 },
];
```

Their responsibilities are:

```text
map()
= process the cart items one by one

find()
= find the product corresponding to the current cart item
```

### Tip

Remember: `map` handles multiple items, while `find` searches for one matching item.

---

## 2.2 The role of `map()`

```tsx
cart.map((item) => {
  // ...
});
```

`map()` takes one element from the cart at a time.

First iteration:

```tsx
item = {
  productId: 1,
  quantity: 2,
};
```

Next iteration:

```tsx
item = {
  productId: 3,
  quantity: 1,
};
```

Conceptually:

```text
cart
↓
map()
↓
first item
↓
second item
↓
...
```

### Tip

Inside `map()`, think of `item` as **the cart item currently being processed**.

---

## 2.3 The role of `find()`

Suppose the current item is:

```tsx
{
  productId: 1,
  quantity: 2
}
```

We want the product whose `id` is 1.

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

In plain English:

> Search the products array for the product whose `id` equals the current cart item's `productId`.

### Tip

`find()` searches for the **first element that satisfies the condition**.

---

## 2.4 How the comparison works

If:

```tsx
item.productId === 1
```

then conceptually the search becomes:

```tsx
products.find(
  (product) => product.id === 1
);
```

If the first product is:

```tsx
{
  id: 1,
  name: "T-shirt",
  price: 20000
}
```

then:

```tsx
1 === 1
```

is `true`.

That product is returned.

### Tip

Think of the callback inside `find()` as a yes/no test for each product.

---

## 2.5 Using `find()` inside `map()`

The two methods can be combined like this:

```tsx
cart.map((item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  return (
    <div>
      {/* render order item */}
    </div>
  );
});
```

The conceptual flow is:

```text
first cart item
↓
find matching product
↓
use product name and price

second cart item
↓
find matching product
↓
use product name and price
```

### Tip

Think of `map()` as the outer iteration and `find()` as the lookup performed for the current item.

---

## 2.6 `productId` and `id` are the connection key

Cart data:

```tsx
{ productId: 1, quantity: 2 }
```

Product data:

```tsx
{ id: 1, name: "T-shirt", price: 20000 }
```

The relationship is:

```text
cart item productId
        │
        │ same value
        ▼
product id
```

### Tip

The property names do not have to be identical. What matters is that the values refer to the same product.

---

## 2.7 Combining the data

From the cart we get:

```text
quantity
```

From the product list we get:

```text
name
price
```

Together:

```text
Product: T-shirt
Price: 20000
Quantity: 2
```

The subtotal can then be calculated as:

```text
price × quantity
```

For example:

```text
20000 × 2 = 40000
```

### Tip

Once `map()` and `find()` successfully connect the data, calculating the subtotal is the natural next step.

---

## 2.8 Key difference between `map()` and `find()`

### `map()`

Processes all elements of an array and creates results.

```tsx
cart.map(...)
```

It is commonly used in React to render multiple JSX elements.

### `find()`

Searches for one element that matches a condition.

```tsx
products.find(...)
```

It returns either:

```text
one matching object
```

or:

```tsx
undefined
```

if nothing matches.

### Tip

A compact rule:

```text
map  → process many
find → find one
```

---

## 2.9 Why `find()` can return `undefined`

Suppose the cart contains:

```tsx
{ productId: 99, quantity: 1 }
```

but there is no product with `id: 99`.

Then:

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

returns:

```tsx
undefined
```

A defensive check may therefore be necessary:

```tsx
if (!product) {
  return null;
}
```

### Tip

If TypeScript says `product is possibly undefined`, it is usually reminding you that `find()` may fail to find a matching element.

---

## 2.10 Full mental model

```text
cart
↓
map()
↓
one item
↓
item.productId
↓
products.find()
↓
one product
↓
product.name
product.price
item.quantity
↓
price × quantity
↓
order-item JSX
```

### Tip

Understanding this data flow is more useful than memorizing the final code.

---

# 3. 한국어

## 3.1 왜 `map()`과 `find()`를 같이 사용할까?

checkout에서는 장바구니에 들어있는 상품을 하나씩 주문서에 보여줘야 한다.

예를 들어 cart가 다음과 같다고 해보자.

```tsx
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

여기에는 주로:

- 어떤 상품인지 알려주는 `productId`
- 몇 개인지 알려주는 `quantity`

가 들어있다.

그런데 실제 주문서에는 상품명과 가격도 필요하다.

상품 정보가 다음과 같이 별도로 있다고 해보자.

```tsx
const products = [
  { id: 1, name: "티셔츠", price: 20000 },
  { id: 2, name: "운동화", price: 80000 },
  { id: 3, name: "청바지", price: 50000 },
];
```

이때 역할은 다음처럼 나뉜다.

```text
map()
= 장바구니 항목을 하나씩 처리

find()
= 현재 장바구니 항목에 해당하는 실제 상품 하나를 검색
```

### 팁

`map = 여러 개를 하나씩 처리`, `find = 조건에 맞는 하나를 찾기`라고 구분하면 쉽다.

---

## 3.2 `map()`의 역할

```tsx
cart.map((item) => {
  // ...
});
```

`map()`은 cart 배열의 요소를 하나씩 꺼낸다.

첫 번째 반복에서는:

```tsx
item = {
  productId: 1,
  quantity: 2,
};
```

두 번째 반복에서는:

```tsx
item = {
  productId: 3,
  quantity: 1,
};
```

처럼 진행된다.

```text
cart
↓
map()
↓
첫 번째 item
↓
두 번째 item
↓
...
```

### 팁

`map()` 안의 `item`은 항상 **현재 처리하고 있는 장바구니 항목 하나**라고 생각하면 된다.

---

## 3.3 `find()`의 역할

현재 item이:

```tsx
{
  productId: 1,
  quantity: 2
}
```

라고 해보자.

products에서 id가 1인 상품을 찾고 싶다.

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

자연어로 읽으면:

> products 배열에서 `product.id`와 현재 `item.productId`가 같은 상품 하나를 찾아라.

라는 뜻이다.

### 팁

`find()`는 **조건에 맞는 첫 번째 요소 하나**를 찾는 배열 메서드다.

---

## 3.4 `find()` 내부 비교는 어떻게 진행될까?

현재:

```tsx
item.productId
```

가 `1`이라면 개념적으로:

```tsx
products.find(
  (product) => product.id === 1
);
```

을 실행하는 것과 같다.

첫 상품이:

```tsx
{
  id: 1,
  name: "티셔츠",
  price: 20000
}
```

라면:

```tsx
1 === 1
```

이므로 조건은 `true`다.

따라서 해당 상품 객체가 반환된다.

### 팁

`find()` 안의 조건식을 **각 상품에게 던지는 true/false 질문**이라고 생각하면 이해하기 쉽다.

---

## 3.5 `map()` 안에서 `find()` 사용하기

둘을 합치면 기본 구조는 다음과 같다.

```tsx
cart.map((item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  return (
    <div>
      {/* 주문 상품 출력 */}
    </div>
  );
});
```

흐름은:

```text
cart 첫 번째 item
↓
find()
↓
해당 상품 정보 찾기
↓
상품명 / 가격 사용

cart 두 번째 item
↓
find()
↓
해당 상품 정보 찾기
↓
상품명 / 가격 사용
```

이다.

### 팁

`map()`은 **바깥쪽 반복**, `find()`는 **현재 항목에 필요한 정보를 찾는 내부 검색**이라고 생각하면 좋다.

---

## 3.6 `productId`와 `id`가 연결 열쇠다

cart에는:

```tsx
{ productId: 1, quantity: 2 }
```

가 있고 products에는:

```tsx
{ id: 1, name: "티셔츠", price: 20000 }
```

가 있다.

둘은:

```text
cart의 productId
       │
       │ 같은 상품을 나타내는 값
       ▼
products의 id
```

로 연결된다.

### 팁

프로퍼티 이름이 `productId`와 `id`로 서로 달라도 상관없다. 중요한 것은 **두 값이 같은 상품을 식별하고 있는가**이다.

---

## 3.7 두 데이터를 합치면 주문 정보가 완성된다

cart에서는:

```text
quantity
```

를 얻는다.

products에서는:

```text
name
price
```

를 얻는다.

따라서:

```text
상품명: 티셔츠
가격: 20000
수량: 2
```

를 만들 수 있다.

그리고 소계는:

```text
price × quantity
```

이므로:

```text
20000 × 2 = 40000
```

이 된다.

### 팁

`map()` + `find()`가 끝나면 다음 단계인 `price * quantity` 소계 계산이 자연스럽게 이어진다.

---

## 3.8 `map()`과 `find()`의 중요한 차이

### `map()`

배열 전체의 요소를 하나씩 처리한다.

```tsx
cart.map(...)
```

React에서는 여러 개의 JSX를 렌더링할 때도 자주 사용한다.

### `find()`

배열에서 조건에 맞는 요소 하나를 찾는다.

```tsx
products.find(...)
```

찾으면 객체 하나를 반환하고, 못 찾으면:

```tsx
undefined
```

를 반환한다.

### 팁

다음 한 줄로 기억하면 좋다.

```text
map  → 여러 개를 처리
find → 하나를 찾기
```

---

## 3.9 `find()`는 왜 `undefined`가 될 수 있을까?

cart에:

```tsx
{ productId: 99, quantity: 1 }
```

가 있는데 products에 `id: 99`가 없다면:

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

결과는:

```tsx
undefined
```

다.

그래서 상황에 따라:

```tsx
if (!product) {
  return null;
}
```

처럼 확인해야 한다.

### 팁

TypeScript에서 `product is possibly undefined` 같은 오류가 나오면 **find가 실패할 가능성**을 먼저 떠올리자.

---

## 3.10 전체 데이터 흐름

```text
cart
↓
map()
↓
item 하나
↓
item.productId
↓
products.find()
↓
product 하나
↓
product.name
product.price
item.quantity
↓
price × quantity
↓
주문 항목 JSX 반환
```

### 팁

최종 코드를 통째로 외우는 것보다 **데이터가 어디에서 와서 어디로 이동하는지**를 설명할 수 있는 것이 훨씬 중요하다.

---

## 3.11 현재 Day 5와 연결해서 기억하기

지금까지 checkout에서 localStorage의 cart를 React state로 가져왔다.

그다음 단계는:

```text
localStorage
↓
cart state
↓
cart.map()
↓
각 CartItem
↓
products.find()
↓
실제 Product
↓
상품명 / 가격 / 수량
↓
소계
```

이다.

즉 `map()`과 `find()`는 서로 비슷한 기능이라서 같이 쓰는 것이 아니다.

**서로 역할이 다르기 때문에 조합해서 사용하는 것**이다.

### 팁

`map()`에게는 "누구를 처리할 것인가?", `find()`에게는 "그 사람에게 필요한 정보를 어디서 찾을 것인가?"라고 질문해보면 역할을 쉽게 구분할 수 있다.

---

# 4. 핵심 비교표

| 개념 | `map()` | `find()` |
|---|---|---|
| 주요 목적 | 배열 요소들을 하나씩 처리 | 조건에 맞는 요소 하나 찾기 |
| 현재 프로젝트 대상 | `cart` | `products` |
| callback의 현재 값 | `item` | `product` |
| 결과 관점 | 여러 결과를 만들 수 있음 | 하나 또는 `undefined` |
| React 사용 예 | 주문 항목 여러 개 렌더링 | 해당 상품 정보 조회 |

---

# 5. 최종 핵심 공식

```text
map()
= 장바구니 항목들을 하나씩 처리한다.

find()
= 현재 장바구니 항목의 productId와
  일치하는 실제 상품 정보를 찾는다.
```

둘을 조합하면:

```text
cart의 quantity
+
products의 name / price
↓
주문서에 필요한 상품 정보
```

가 된다.

그리고 다음 단계에서는:

```text
price × quantity
↓
상품별 소계
```

를 계산하고, 이후 `reduce()`를 이용해 전체 주문 금액으로 연결할 수 있다.
