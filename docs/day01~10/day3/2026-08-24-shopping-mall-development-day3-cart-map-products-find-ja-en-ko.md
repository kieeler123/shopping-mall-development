# cart.map() と products.find() のデータ連携 — Shopping Mall Day 3
# Understanding cart.map() and products.find() Data Flow — Shopping Mall Day 3
# cart.map()과 products.find() 데이터 연결 — Shopping Mall Day 3

---

# 日本語

## 1. 今回理解すること

Day 3の `/cart` ページでは、`localStorage` から読み込んだ `CartItem[]` を画面へ表示する。

しかし `CartItem` には商品名や価格、画像などの商品情報そのものは入っていない。

現在の基本型は次の通り。

```ts
export type CartItem = {
  productId: number;
  quantity: number;
};
```

例えばカートに次のデータがあるとする。

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 3,
    quantity: 1,
  },
];
```

このデータだけで分かるのは、

```text
商品1を2個
商品3を1個
```

という情報である。

一方、商品名や価格などは既存の `products` データに入っている。

```ts
const products = [
  {
    id: 1,
    name: "Keyboard",
    salePrice: 39000,
  },
  {
    id: 2,
    name: "Mouse",
    salePrice: 29000,
  },
  {
    id: 3,
    name: "Monitor",
    salePrice: 199000,
  },
];
```

したがって `/cart` では次の処理が必要になる。

```text
cartを1件ずつ見る
↓
CartItem.productIdを確認
↓
productsから同じidの商品を探す
↓
Product情報を取得
↓
quantityとProduct情報を組み合わせて表示
```

このとき使うのが、

```text
cart.map()
products.find()
```

である。

> **Tip**
> `map()` と `find()` を別々の文法として暗記するのではなく、「カートを1件ずつ処理し、そのIDに対応する商品を探す」という1つのデータフローとして理解する。

---

## 2. `cart` と `products` は別の責任を持つ

まず最も重要なのは、`cart` と `products` を混同しないことである。

### `cart`

`cart` はユーザーが何を何個選んだかを表す。

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 3,
    quantity: 1,
  },
];
```

これはユーザーの選択状態である。

```text
productId
→ どの商品か

quantity
→ 何個か
```

### `products`

一方、`products` は商品そのものの情報を持つ。

```ts
const products = [
  {
    id: 1,
    name: "Keyboard",
    salePrice: 39000,
  },
  {
    id: 2,
    name: "Mouse",
    salePrice: 29000,
  },
  {
    id: 3,
    name: "Monitor",
    salePrice: 199000,
  },
];
```

役割を整理すると、

| データ | 責任 |
|---|---|
| `cart` | ユーザーが何を何個選んだか |
| `products` | 商品名・価格・画像・説明などの商品情報 |

両者をつなぐ共通の値が、

```text
CartItem.productId
↔
Product.id
```

である。

> **Tip**
> `cart` を商品一覧だと思わないこと。`cart` はユーザーの選択記録、`products` は商品情報の元データである。

---

## 3. `cart.map()` の役割

次のコードを見る。

```tsx
cart.map((item) => {
  // ...
})
```

`map()` は配列の各要素を1つずつ取り出し、それぞれに対して処理を行う。

例えば、

```ts
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

なら、最初の繰り返しでは、

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

になる。

次の繰り返しでは、

```ts
item = {
  productId: 3,
  quantity: 1,
};
```

になる。

```text
cart

[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 }
]

↓ map()

1回目
item = { productId: 1, quantity: 2 }

↓ 次

2回目
item = { productId: 3, quantity: 1 }
```

> **Tip**
> `item` は特別なキーワードではない。自分で付けた引数名であり、`cartItem` という名前にしても同じ意味になる。

---

## 4. `item` だけでは商品名や価格が分からない

最初の `map()` で取り出したデータが、

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

だとする。

この状態なら、

```tsx
item.quantity
```

は使える。

しかし、

```tsx
item.name
```

は使えない。

なぜなら `CartItem` 型には `name` が存在しないからである。

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

そこで、

```text
このitemのproductIdは1
↓
productsの中からidが1の商品を探したい
```

という処理が必要になる。

ここで `find()` を使う。

> **Tip**
> `item` から直接商品情報を取ろうとしない。`item` は商品への参照情報と数量を持つだけで、商品詳細は `products` 側から取得する。

---

## 5. `products.find()` の役割

現在のコードは次の形になる。

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

このコードは、

```text
productsの中から
product.idとitem.productIdが同じ商品を1つ探す
```

という意味である。

例えば、

```ts
item.productId = 3;
```

なら、

```tsx
products.find(
  (product) => product.id === 3
);
```

と同じ意味になる。

> **Tip**
> `find()` は条件を満たす最初の要素1つを返す。複数の要素を配列で返す `filter()` とは役割が違う。

---

## 6. `find()` が内部で確認していること

例えば、

```ts
const products = [
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Monitor" },
];
```

があり、

```ts
item.productId = 3;
```

だとする。

すると、

```tsx
products.find(
  (product) => product.id === item.productId
);
```

は概念的に次のように動く。

```text
探したいID
item.productId = 3

products[0]
{ id: 1, name: "Keyboard" }

1 === 3
→ false

↓

products[1]
{ id: 2, name: "Mouse" }

2 === 3
→ false

↓

products[2]
{ id: 3, name: "Monitor" }

3 === 3
→ true

↓

見つかったので返す
```

結果として、

```ts
product = {
  id: 3,
  name: "Monitor",
};
```

になる。

> **Tip**
> `find()` を理解するときは「配列を順番に確認し、条件がtrueになった最初の要素を返す」と考える。

---

## 7. `map()` の中で `find()` を使う理由

今回のカートでは、各 `CartItem` ごとに対応するProductを探す必要がある。

例えば、

```ts
cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

なら、1回目の `map()` では、

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

となる。

その中で、

```tsx
products.find(
  (product) => product.id === 1
);
```

を実行し、1番の商品を取得する。

例えば結果が、

```ts
product = {
  id: 1,
  name: "Keyboard",
  salePrice: 39000,
};
```

なら、

```text
item.quantity
→ 2

product.name
→ Keyboard

product.salePrice
→ 39000
```

を同時に使える。

そのため、

```tsx
<h2>{product.name}</h2>
<p>数量: {item.quantity}</p>
<p>価格: {product.salePrice}</p>
```

のようなUIを作れる。

> **Tip**
> `map()` は「カートの行を1つずつ作る」、`find()` は「その行に必要な商品情報を取得する」と考えると理解しやすい。

---

## 8. 2回目の `map()` では別の商品を探す

2回目は、

```ts
item = {
  productId: 3,
  quantity: 1,
};
```

になる。

そのため、

```tsx
products.find(
  (product) => product.id === 3
);
```

が実行される。

結果が、

```ts
product = {
  id: 3,
  name: "Monitor",
  salePrice: 199000,
};
```

なら、

```text
Monitor
数量: 1
価格: 199000
```

という行を作れる。

つまり `map()` が繰り返されるたびに、別の `item.productId` を使って `find()` が実行される。

> **Tip**
> `map()` と `find()` のネストを見たら、「外側はカートの繰り返し、内側は商品検索」と役割を分ける。

---

## 9. 全体のデータフロー

全体を図にすると次のようになる。

```text
cart
│
├─ { productId: 1, quantity: 2 }
│              │
│              └──────────────┐
│                             ▼
│                       products.find()
│                             │
│                             ▼
│                    { id: 1,
│                      name: "Keyboard",
│                      salePrice: 39000 }
│                             │
│             ┌───────────────┘
│             ▼
│       Keyboard / 2 / 39000
│
└─ { productId: 3, quantity: 1 }
               │
               └──────────────┐
                              ▼
                        products.find()
                              │
                              ▼
                     { id: 3,
                       name: "Monitor",
                       salePrice: 199000 }
                              │
              ┌───────────────┘
              ▼
        Monitor / 1 / 199000
```

> **Tip**
> データフローを矢印で書くと、`productId` が2種類のデータをつなぐキーであることが見えやすい。

---

## 10. `product.id === item.productId` を分解して読む

次のコードは最初は長く見える。

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

一番内側から読む。

### `item.productId`

```tsx
item.productId
```

は現在のカート項目の商品IDである。

### `product.id`

```tsx
product.id
```

は `products` の中で今確認している商品のIDである。

### 比較

```tsx
product.id === item.productId
```

は、

```text
今確認している商品のidと
カートに記録されているproductIdは同じか？
```

という質問である。

### `find()`

```tsx
products.find(...)
```

は、その質問が `true` になる商品を探す。

### `const product`

```tsx
const product = ...
```

は、見つかった商品を `product` という変数へ入れる。

全体を日本語で言えば、

```text
productsの中から、
現在のカートitemのproductIdとidが同じ商品を1つ探して、
productという変数へ入れる。
```

となる。

> **Tip**
> 長い式は外側から読むより、`item.productId → 比較条件 → find() → product` の順に内側から読む。

---

## 11. `find()` が商品を見つけられない場合

`find()` は必ず商品を返すとは限らない。

例えば、

```ts
{
  productId: 999,
  quantity: 2,
}
```

がカートに入っているのに、`products` にid 999の商品がない場合、

```tsx
products.find(...)
```

の結果は、

```ts
undefined
```

になる。

そのため、結果の型は概念的に、

```ts
Product | undefined
```

である。

> **Tip**
> `find()` を使ったら「見つからない場合」を必ず考える。存在確認なしで `product.name` を使うとエラーの原因になる。

---

## 12. `if (!product) return null` の意味

次のコードで存在確認する。

```tsx
if (!product) {
  return null;
}
```

これは、

```text
Productが見つかった？
├─ Yes → UIを返す
└─ No  → 何も描画しない
```

という意味である。

Reactでは `return null` によって、その `map()` の要素について何も表示しないことができる。

例えば、

```text
productId: 1 → 商品あり
productId: 999 → 商品なし
productId: 3 → 商品あり
```

なら、

```text
1番の商品 → 表示
999番 → 表示しない
3番の商品 → 表示
```

となる。

> **Tip**
> Day 3では `return null` で十分。後で必要になれば無効なカートデータの削除やエラー表示を追加できる。

---

## 13. `item` と `product` を同時に使う

最終的なUIでは2種類のデータを組み合わせる。

### `item`

```ts
{
  productId: 1,
  quantity: 2,
}
```

ユーザーのカート状態。

### `product`

```ts
{
  id: 1,
  name: "Keyboard",
  salePrice: 39000,
}
```

商品情報。

したがって、

```tsx
<h2>{product.name}</h2>
<p>数量: {item.quantity}</p>
<p>価格: {product.salePrice}</p>
```

となる。

```text
商品名
→ product.name

価格
→ product.salePrice

数量
→ item.quantity
```

> **Tip**
> 商品そのものの値は `product`、ユーザーが選んだ値は `item` と役割で区別する。

---

## 14. 現在の基本コード

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      return null;
    }

    return (
      <li key={item.productId}>
        <h2>{product.name}</h2>
        <p>数量: {item.quantity}</p>
        <p>価格: {product.salePrice.toLocaleString()}</p>
      </li>
    );
  })}
</ul>
```

処理順序は、

```text
cart.map()
↓
CartItemを1つ取得
↓
item.productId
↓
products.find()
↓
Productを取得
↓
存在確認
↓
Product + CartItemでUIを作る
```

である。

> **Tip**
> コードそのものではなく、この7段階の処理順序を説明できるか確認する。

---

## 15. 最終まとめ

今回の中心は3つである。

```text
map
→ カートを1件ずつ処理する

find
→ 対応するProductを探す

productId
→ CartItemとProductをつなぐキー
```

最終的な流れは、

```text
CartItem[]
↓
map
↓
CartItem 1件
{ productId, quantity }
↓
productId
↓
products.find()
↓
Product 1件
{ id, name, price, image ... }
↓
Product情報 + CartItem情報
↓
カートUI
```

となる。

> **Tip**
> 自分の言葉で「mapは繰り返し、findは商品検索、productIdは接続キー」と説明できれば、この部分の基本構造は理解できている。

---

# English

## 1. What We Are Understanding

On the Day 3 `/cart` page, we need to display the `CartItem[]` loaded from `localStorage`.

However, `CartItem` does not contain the full product information.

```ts
export type CartItem = {
  productId: number;
  quantity: number;
};
```

For example:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 3,
    quantity: 1,
  },
];
```

This tells us only:

```text
product 1 → quantity 2
product 3 → quantity 1
```

The actual product information exists in `products`.

```ts
const products = [
  {
    id: 1,
    name: "Keyboard",
    salePrice: 39000,
  },
  {
    id: 2,
    name: "Mouse",
    salePrice: 29000,
  },
  {
    id: 3,
    name: "Monitor",
    salePrice: 199000,
  },
];
```

Therefore, the cart page needs this flow:

```text
iterate over cart
↓
read CartItem.productId
↓
find matching Product
↓
combine Product data with quantity
↓
render cart UI
```

That is why we use:

```text
cart.map()
products.find()
```

> **Tip**
> Treat `map()` and `find()` as two parts of one data flow rather than isolated array methods.

---

## 2. `cart` and `products` Have Different Responsibilities

`cart` represents user selection state.

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

It answers:

```text
which product?
how many?
```

`products` represents product information.

```ts
const products = [
  {
    id: 1,
    name: "Keyboard",
    salePrice: 39000,
  },
];
```

Their responsibilities are:

| Data | Responsibility |
|---|---|
| `cart` | What the user added and how many |
| `products` | Product name, price, image, description, etc. |

The shared key is:

```text
CartItem.productId
↔
Product.id
```

> **Tip**
> Think of `cart` as user selection records and `products` as the product catalog.

---

## 3. What `cart.map()` Does

Consider:

```tsx
cart.map((item) => {
  // ...
})
```

`map()` takes each element of an array one at a time.

For:

```ts
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

the first iteration gets:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

The second iteration gets:

```ts
item = {
  productId: 3,
  quantity: 1,
};
```

```text
cart
↓ map()

first item
{ productId: 1, quantity: 2 }

second item
{ productId: 3, quantity: 1 }
```

> **Tip**
> `item` is just a parameter name. You could call it `cartItem` and the behavior would be identical.

---

## 4. `item` Does Not Contain the Product Name

Suppose:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

Then:

```tsx
item.quantity
```

works.

But:

```tsx
item.name
```

does not, because `name` is not part of `CartItem`.

So we need to ask:

```text
item.productId is 1
↓
find the Product whose id is 1
```

This is where `find()` is used.

> **Tip**
> Do not expect `CartItem` to contain product catalog data. Use its `productId` to connect to the product data source.

---

## 5. What `products.find()` Does

The code is:

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

It means:

```text
search products
and return the first Product
whose id equals the current CartItem.productId
```

If:

```ts
item.productId = 3;
```

then the condition is effectively:

```tsx
product.id === 3
```

> **Tip**
> `find()` returns one matching element, while `filter()` returns an array of all matching elements.

---

## 6. How `find()` Checks Products

Assume:

```ts
const products = [
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Monitor" },
];
```

and:

```ts
item.productId = 3;
```

Conceptually, `find()` checks:

```text
product 1
1 === 3
→ false

product 2
2 === 3
→ false

product 3
3 === 3
→ true

→ return this product
```

So:

```ts
product = {
  id: 3,
  name: "Monitor",
};
```

> **Tip**
> Think of `find()` as walking through the array until the condition becomes true.

---

## 7. Why `find()` Is Inside `map()`

Each cart item may refer to a different product.

For:

```ts
cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

the first `map()` iteration gets:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

Then:

```tsx
products.find(
  (product) => product.id === 1
);
```

returns product 1.

Now we have both:

```text
item.quantity
→ 2

product.name
→ Keyboard

product.salePrice
→ 39000
```

So the UI can use both:

```tsx
<h2>{product.name}</h2>
<p>Quantity: {item.quantity}</p>
<p>Price: {product.salePrice}</p>
```

> **Tip**
> Think of `map()` as creating one cart row and `find()` as supplying the product details needed by that row.

---

## 8. The Second `map()` Iteration

The second item is:

```ts
item = {
  productId: 3,
  quantity: 1,
};
```

Then:

```tsx
products.find(
  (product) => product.id === 3
);
```

returns:

```ts
product = {
  id: 3,
  name: "Monitor",
  salePrice: 199000,
};
```

The UI can then render:

```text
Monitor
Quantity: 1
Price: 199000
```

> **Tip**
> Every `map()` iteration runs a product lookup using that item's own `productId`.

---

## 9. Full Data Flow

```text
cart
│
├─ { productId: 1, quantity: 2 }
│              │
│              ▼
│        products.find()
│              │
│              ▼
│   { id: 1, name: "Keyboard", salePrice: 39000 }
│              │
│              ▼
│      Keyboard / 2 / 39000
│
└─ { productId: 3, quantity: 1 }
               │
               ▼
         products.find()
               │
               ▼
    { id: 3, name: "Monitor", salePrice: 199000 }
               │
               ▼
       Monitor / 1 / 199000
```

> **Tip**
> Notice that `productId` is the connection key between the user-owned cart state and the product catalog.

---

## 10. Reading the Comparison Expression

Consider:

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

Break it down from the inside.

```tsx
item.productId
```

is the ID stored in the current cart item.

```tsx
product.id
```

is the ID of the product currently being checked.

```tsx
product.id === item.productId
```

asks:

```text
Does this product's id match the id stored in the cart item?
```

`products.find(...)` finds the first product where that condition is true.

Finally:

```tsx
const product = ...
```

stores the found Product in the `product` variable.

> **Tip**
> Read complex expressions from the inside outward: `item.productId → comparison → find → product`.

---

## 11. When `find()` Cannot Find a Product

`find()` is not guaranteed to return a Product.

For example, if the cart contains:

```ts
{
  productId: 999,
  quantity: 2,
}
```

but there is no product with `id: 999`, then:

```tsx
products.find(...)
```

returns:

```ts
undefined
```

Conceptually, the result type is:

```ts
Product | undefined
```

> **Tip**
> Whenever you use `find()`, think about the “not found” case before using the result.

---

## 12. Why We Use `if (!product) return null`

We check:

```tsx
if (!product) {
  return null;
}
```

This means:

```text
Product found?
├─ Yes → render the cart row
└─ No  → render nothing for this item
```

In React, returning `null` means that nothing is rendered for that iteration.

> **Tip**
> For Day 3, `return null` is enough. More advanced cleanup or error handling can be added later if needed.

---

## 13. Using `item` and `product` Together

`item` contains cart-state information:

```ts
{
  productId: 1,
  quantity: 2,
}
```

`product` contains product information:

```ts
{
  id: 1,
  name: "Keyboard",
  salePrice: 39000,
}
```

So:

```tsx
<h2>{product.name}</h2>
<p>Quantity: {item.quantity}</p>
<p>Price: {product.salePrice}</p>
```

uses both sources.

```text
product name
→ product.name

price
→ product.salePrice

quantity
→ item.quantity
```

> **Tip**
> Product catalog values come from `product`; user-selected values come from `item`.

---

## 14. Current Basic Code

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      return null;
    }

    return (
      <li key={item.productId}>
        <h2>{product.name}</h2>
        <p>Quantity: {item.quantity}</p>
        <p>Price: {product.salePrice.toLocaleString()}</p>
      </li>
    );
  })}
</ul>
```

The processing order is:

```text
cart.map()
↓
get one CartItem
↓
read item.productId
↓
products.find()
↓
get Product
↓
check existence
↓
render using Product + CartItem
```

> **Tip**
> Practice explaining the processing order instead of memorizing the JSX.

---

## 15. Final Summary

The three key ideas are:

```text
map
→ process cart items one by one

find
→ locate the corresponding Product

productId
→ connection key between CartItem and Product
```

The complete flow is:

```text
CartItem[]
↓
map
↓
one CartItem
{ productId, quantity }
↓
productId
↓
products.find()
↓
one Product
{ id, name, price, image ... }
↓
Product data + CartItem data
↓
cart UI
```

> **Tip**
> If you can explain “map repeats, find connects, productId is the key,” you understand the core structure of this cart rendering flow.

---

# 한국어

## 1. 이번에 이해할 핵심

Day 3의 `/cart` 페이지에서는 `localStorage`에서 읽어온 `CartItem[]`을 화면에 출력한다.

그런데 `CartItem`에는 상품명, 가격, 이미지 같은 상품 자체의 정보가 들어있지 않다.

현재 타입은:

```ts
export type CartItem = {
  productId: number;
  quantity: number;
};
```

이다.

예를 들어:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 3,
    quantity: 1,
  },
];
```

라고 하면 여기서 알 수 있는 것은:

```text
1번 상품을 2개
3번 상품을 1개
```

뿐이다.

상품명, 가격, 이미지 같은 정보는 기존 `products` 데이터에 들어 있다.

```ts
const products = [
  {
    id: 1,
    name: "키보드",
    salePrice: 39000,
  },
  {
    id: 2,
    name: "마우스",
    salePrice: 29000,
  },
  {
    id: 3,
    name: "모니터",
    salePrice: 199000,
  },
];
```

그래서 `/cart`에서는 다음 흐름이 필요하다.

```text
cart를 하나씩 돌기
↓
CartItem.productId 확인
↓
products에서 같은 id 상품 찾기
↓
Product 정보 얻기
↓
quantity와 Product 정보를 합쳐 화면 출력
```

이때 사용하는 것이:

```text
cart.map()
products.find()
```

이다.

> **팁**
> `map()`과 `find()`를 따로 외우지 말고 `장바구니 항목을 하나씩 처리하고, 그 ID에 맞는 상품 정보를 찾는다`라는 하나의 흐름으로 이해한다.

---

## 2. `cart`와 `products`는 서로 다른 책임을 가진다

가장 먼저 구분해야 하는 것은 `cart`와 `products`다.

### `cart`

`cart`는 사용자가 무엇을 몇 개 담았는지를 나타낸다.

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  },
];
```

즉:

```text
productId
→ 어떤 상품인가

quantity
→ 몇 개인가
```

를 담당한다.

### `products`

`products`는 상품 자체의 정보를 가지고 있다.

```ts
const products = [
  {
    id: 1,
    name: "키보드",
    salePrice: 39000,
  },
];
```

역할을 정리하면:

| 데이터 | 책임 |
|---|---|
| `cart` | 사용자가 어떤 상품을 몇 개 담았는지 |
| `products` | 상품명, 가격, 이미지, 설명 등 상품 자체 정보 |

두 데이터를 연결하는 공통값은:

```text
CartItem.productId
↔
Product.id
```

이다.

> **팁**
> `cart`를 상품 목록이라고 생각하면 헷갈린다. `cart`는 사용자의 선택 기록이고, `products`는 상품 원본 데이터라고 구분한다.

---

## 3. `cart.map()`의 역할

다음 코드를 보자.

```tsx
cart.map((item) => {
  // ...
})
```

`map()`은 배열 안의 요소를 하나씩 꺼내 처리한다.

예를 들어:

```ts
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

이라면 첫 번째 반복에서는:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

두 번째 반복에서는:

```ts
item = {
  productId: 3,
  quantity: 1,
};
```

이 된다.

```text
cart

[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 }
]

↓ map()

첫 번째 반복
item = { productId: 1, quantity: 2 }

↓ 다음

두 번째 반복
item = { productId: 3, quantity: 1 }
```

> **팁**
> `item`은 특별한 문법이 아니다. 우리가 정한 변수 이름일 뿐이며 `cartItem`이라고 해도 똑같다.

---

## 4. `item`만 가지고는 상품명을 알 수 없다

첫 번째 반복에서:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

를 얻었다고 하자.

이 상태에서는:

```tsx
item.quantity
```

는 사용할 수 있다.

하지만:

```tsx
item.name
```

은 사용할 수 없다.

왜냐하면 `CartItem`에는 `name`이 없기 때문이다.

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

그래서 다음 질문이 필요하다.

```text
현재 item의 productId가 1이네
↓
products 안에서 id가 1인 상품을 찾아야겠다
```

이때 `find()`가 등장한다.

> **팁**
> `item`에서 직접 상품명과 가격을 꺼내려고 하지 않는다. `item`은 상품을 가리키는 ID와 수량만 가지고 있다.

---

## 5. `products.find()`의 역할

현재 코드는:

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

이다.

말로 풀면:

```text
products 안에서
product.id와 item.productId가 같은
상품 하나를 찾아라
```

라는 뜻이다.

예를 들어:

```ts
item.productId = 3;
```

이라면 사실상:

```tsx
product.id === 3
```

인 상품을 찾는 것이다.

> **팁**
> `find()`는 조건을 만족하는 첫 번째 요소 하나를 반환한다. 여러 개를 배열로 반환하는 `filter()`와 구분한다.

---

## 6. `find()`가 실제로 확인하는 과정

예를 들어:

```ts
const products = [
  { id: 1, name: "키보드" },
  { id: 2, name: "마우스" },
  { id: 3, name: "모니터" },
];
```

이고:

```ts
item.productId = 3;
```

이라고 하자.

그러면:

```tsx
products.find(
  (product) => product.id === item.productId
);
```

는 개념적으로 다음처럼 움직인다.

```text
찾는 값
item.productId = 3

products[0]
{ id: 1, name: "키보드" }

1 === 3
→ false

↓

products[1]
{ id: 2, name: "마우스" }

2 === 3
→ false

↓

products[2]
{ id: 3, name: "모니터" }

3 === 3
→ true

↓

찾았으므로 반환
```

그래서:

```ts
product = {
  id: 3,
  name: "모니터",
};
```

가 된다.

> **팁**
> `find()`는 배열을 순서대로 확인하다가 조건이 `true`가 되는 첫 번째 요소를 만나면 그 요소를 반환한다고 이해한다.

---

## 7. 왜 `map()` 안에서 `find()`를 사용하는가

현재 장바구니에서는 각 `CartItem`마다 서로 다른 상품을 가리킬 수 있다.

예를 들어:

```ts
cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];
```

라고 하자.

첫 번째 `map()`에서는:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

가 나온다.

그 안에서:

```tsx
products.find(
  (product) => product.id === 1
);
```

을 실행해서 1번 상품을 찾는다.

결과가:

```ts
product = {
  id: 1,
  name: "키보드",
  salePrice: 39000,
};
```

라면 이제:

```text
item.quantity
→ 2

product.name
→ 키보드

product.salePrice
→ 39000
```

를 동시에 사용할 수 있다.

그래서:

```tsx
<h2>{product.name}</h2>
<p>수량: {item.quantity}</p>
<p>가격: {product.salePrice}</p>
```

처럼 UI를 만들 수 있다.

> **팁**
> `map()`은 `장바구니 한 줄씩 만들기`, `find()`는 `그 줄에 필요한 상품 정보 찾기`라고 이해하면 직관적이다.

---

## 8. 두 번째 `map()`에서는 다른 상품을 찾는다

두 번째 반복에서는:

```ts
item = {
  productId: 3,
  quantity: 1,
};
```

이 된다.

그래서:

```tsx
products.find(
  (product) => product.id === 3
);
```

을 실행한다.

결과가:

```ts
product = {
  id: 3,
  name: "모니터",
  salePrice: 199000,
};
```

라면 화면에서는:

```text
모니터
수량: 1
가격: 199000
```

을 만들 수 있다.

즉 `map()`의 반복마다 현재 `item.productId`가 달라지고, 그에 따라 `find()`가 찾는 상품도 달라진다.

> **팁**
> `map()` 안의 `find()`가 복잡해 보이면 `바깥 = cart 반복`, `안쪽 = 상품 검색`으로 역할을 분리한다.

---

## 9. 전체 데이터 흐름

전체를 그림으로 보면 다음과 같다.

```text
cart
│
├─ { productId: 1, quantity: 2 }
│              │
│              └──────────────┐
│                             ▼
│                       products.find()
│                             │
│                             ▼
│                    { id: 1,
│                      name: "키보드",
│                      salePrice: 39000 }
│                             │
│             ┌───────────────┘
│             ▼
│       키보드 / 2개 / 39000원
│
└─ { productId: 3, quantity: 1 }
               │
               └──────────────┐
                              ▼
                        products.find()
                              │
                              ▼
                     { id: 3,
                       name: "모니터",
                       salePrice: 199000 }
                              │
              ┌───────────────┘
              ▼
        모니터 / 1개 / 199000원
```

여기서 가장 중요한 연결점은:

```text
productId
```

다.

> **팁**
> `productId`가 두 데이터 사이를 연결하는 키라는 점을 이해하면 왜 `CartItem`에 상품 전체 정보를 저장하지 않았는지도 자연스럽게 연결된다.

---

## 10. `product.id === item.productId`를 분해해서 읽기

다음 코드는 처음 보면 길다.

```tsx
const product = products.find(
  (product) => product.id === item.productId
);
```

가장 안쪽부터 읽는다.

### `item.productId`

```tsx
item.productId
```

는 현재 장바구니 항목에 기록된 상품 ID다.

### `product.id`

```tsx
product.id
```

는 `products` 안에서 현재 검사 중인 상품의 ID다.

### 비교

```tsx
product.id === item.productId
```

는:

```text
현재 검사 중인 상품의 id와
장바구니에 기록된 productId가 같은가?
```

라는 질문이다.

### `find()`

```tsx
products.find(...)
```

는 그 조건이 `true`인 상품을 찾는다.

### 변수 저장

```tsx
const product = ...
```

는 찾은 상품을 `product`라는 변수에 저장한다.

전체를 한 문장으로 풀면:

```text
products 안에서
현재 장바구니 item의 productId와
id가 같은 상품 하나를 찾아
product라는 변수에 넣어라.
```

이다.

> **팁**
> 긴 코드는 바깥에서 읽지 말고 `item.productId → 비교 → find → product` 순서로 안쪽부터 읽는다.

---

## 11. `find()`가 상품을 못 찾을 수도 있다

`find()`는 항상 Product를 반환하는 것이 아니다.

예를 들어 장바구니에:

```ts
{
  productId: 999,
  quantity: 2,
}
```

가 있는데 `products`에 999번 상품이 없다면:

```tsx
products.find(...)
```

의 결과는:

```ts
undefined
```

이다.

따라서 개념적으로:

```ts
Product | undefined
```

라고 생각할 수 있다.

> **팁**
> `find()`를 사용하면 항상 `못 찾는 경우`를 함께 생각한다.

---

## 12. `if (!product) return null`의 의미

그래서:

```tsx
if (!product) {
  return null;
}
```

로 먼저 확인한다.

흐름은:

```text
상품을 찾았는가?
├─ Yes → 장바구니 UI 출력
└─ No  → 아무것도 출력하지 않음
```

React에서:

```tsx
return null;
```

은 해당 반복에서 아무것도 렌더링하지 않는다는 뜻이다.

예를 들어:

```text
productId: 1 → 상품 있음
productId: 999 → 상품 없음
productId: 3 → 상품 있음
```

이면:

```text
1번 상품 → 출력
999번 → 출력 안 함
3번 상품 → 출력
```

이 된다.

> **팁**
> Day 3에서는 `return null` 정도면 충분하다. 나중에 필요하면 잘못된 장바구니 데이터를 삭제하거나 에러 메시지를 추가할 수 있다.

---

## 13. `item`과 `product`를 동시에 사용하는 이유

최종적으로 장바구니 UI에서는 두 데이터를 함께 사용한다.

### `item`

```ts
{
  productId: 1,
  quantity: 2,
}
```

사용자가 선택한 상태.

### `product`

```ts
{
  id: 1,
  name: "키보드",
  salePrice: 39000,
}
```

상품 원본 정보.

그래서:

```tsx
<h2>{product.name}</h2>
<p>수량: {item.quantity}</p>
<p>가격: {product.salePrice}</p>
```

처럼 사용한다.

```text
상품명
→ product.name

가격
→ product.salePrice

수량
→ item.quantity
```

> **팁**
> `상품 자체 정보 = product`, `사용자가 선택한 정보 = item`으로 구분하면 코드가 훨씬 잘 읽힌다.

---

## 14. 현재 기본 코드 전체

```tsx
<ul>
  {cart.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      return null;
    }

    return (
      <li key={item.productId}>
        <h2>{product.name}</h2>
        <p>수량: {item.quantity}</p>
        <p>가격: {product.salePrice.toLocaleString()}원</p>
      </li>
    );
  })}
</ul>
```

처리 순서를 다시 정리하면:

```text
cart.map()
↓
CartItem 하나 꺼내기
↓
item.productId 확인
↓
products.find()
↓
해당 Product 찾기
↓
존재 여부 확인
↓
Product + CartItem으로 UI 만들기
```

이다.

> **팁**
> JSX를 통째로 외우지 말고 위의 7단계 흐름을 자신의 말로 설명할 수 있는지 확인한다.

---

## 15. 최종 요약

이번 흐름에서 핵심은 세 가지다.

```text
map
→ 카트를 하나씩 반복

find
→ 각 CartItem에 대응하는 Product 검색

productId
→ CartItem과 Product를 연결하는 키
```

전체 흐름은:

```text
CartItem[]
↓
map
↓
CartItem 하나
{ productId, quantity }
↓
productId
↓
products.find()
↓
Product 하나
{ id, name, price, image ... }
↓
Product 정보 + CartItem 정보
↓
장바구니 UI
```

이다.

한 문장으로 정리하면:

```text
cart.map()으로 사용자가 담은 장바구니 항목을 하나씩 꺼내고,
각 item.productId를 이용해 products.find()로 실제 상품을 찾은 뒤,
상품 정보와 quantity를 합쳐 장바구니 UI를 만든다.
```

> **팁**
> 복습할 때는 `map은 반복`, `find는 연결`, `productId는 연결 키`라는 세 문장부터 설명해본다.
