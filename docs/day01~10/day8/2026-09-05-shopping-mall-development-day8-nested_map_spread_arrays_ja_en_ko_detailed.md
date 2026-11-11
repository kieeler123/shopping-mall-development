# Nested Arrays with `map()` and Spread
## 日本語 → English → 한국어

---

# 1. 日本語

## 1.1 この章の目的

この章では、React / JavaScript でよく出てくる「ネストされた配列とオブジェクトを、元のデータを直接変更せずに更新する方法」を学びます。

ショッピングモールのデータは、単純な配列だけで終わることがほとんどありません。

たとえば注文データは、次のような構造になりやすいです。

```tsx
const order = {
  id: 1002,
  items: [
    {
      productId: 1,
      name: "Keyboard",
      quantity: 1,
    },
    {
      productId: 2,
      name: "Mouse",
      quantity: 2,
    },
  ],
};
```

このデータ構造を上から順番に見ると、

```text
order オブジェクト
↓
items 配列
↓
item オブジェクト
↓
quantity
```

という階層になっています。

ここで `productId = 2` の商品の `quantity` を `3` に変更したいとします。

React では次のように直接変更するのではなく、

```tsx
order.items[1].quantity = 3;
```

新しいオブジェクト・新しい配列を作りながら更新する考え方が重要です。

**ヒント**

変更したい値だけを見るのではなく、「その値に到達するまでに、どの配列・どのオブジェクトを通るのか」を確認してください。

---

## 1.2 なぜ直接変更してはいけないのか

次のコードを見てください。

```tsx
order.items[1].quantity = 3;
```

これは、すでに存在している `order` の中にある `items` 配列、その中の `item` オブジェクトを直接変更しています。

つまり、

```text
既存 order
↓
既存 items 配列
↓
既存 item オブジェクト
↓
quantity を直接変更
```

という流れです。

JavaScript としては可能ですが、React の state を扱う場合は、既存 state を直接変更する mutation を避けるのが基本です。

**ヒント**

`something.something[index].value = ...` のような形を見たら、既存データを直接変更していないかをまず確認してください。

---

## 1.3 外側のオブジェクトだけ spread しても十分ではない

次のようにするとどうでしょうか。

```tsx
const updatedOrder = {
  ...order,
};

updatedOrder.items[1].quantity = 3;
```

`updatedOrder` 自体は新しいオブジェクトです。

そのため、

```tsx
order === updatedOrder
```

は `false` になります。

しかし、`items` はまだ同じ配列を参照している可能性があります。

```tsx
order.items === updatedOrder.items
```

は `true` になることがあります。

参照構造は次のようなイメージです。

```text
order
↓
オブジェクト A
└──→ items 配列 X


updatedOrder
↓
オブジェクト B
└──→ items 配列 X
```

外側のオブジェクトは別ですが、`items` 配列は同じです。

そのため、

```tsx
updatedOrder.items[1].quantity = 3;
```

とすると、元の `order.items[1]` まで影響を受けます。

**ヒント**

`{ ...order }` は外側の `order` オブジェクトを新しくしますが、内側の配列・オブジェクトまで自動的に新しくするわけではありません。

---

## 1.4 `items` 配列まで新しく作る

次に、

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

とします。

すると、

```tsx
order !== updatedOrder
```

であり、

```tsx
order.items !== updatedOrder.items
```

になります。

つまり、

```text
order オブジェクト → 新しいオブジェクト
items 配列 → 新しい配列
```

まではできています。

しかし、ここでもう一段階あります。

`items` 配列の中に入っている `item` オブジェクト自体は、まだ元のものと同じ参照である可能性があります。

**ヒント**

`[...array]` も shallow copy です。配列そのものは新しくなりますが、配列の中のオブジェクトまでは自動的に複製されません。

---

## 1.5 配列の中の item オブジェクトはまだ同じ

例を見ます。

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

この場合、

```tsx
order.items[0] === updatedOrder.items[0]
```

は `true` になる可能性があります。

つまり、

```text
order.items
→ 配列 A

updatedOrder.items
→ 配列 B
```

ではありますが、

```text
配列 A の 0番目
配列 B の 0番目
↓
同じ item オブジェクト
```

ということです。

したがって、

```tsx
updatedOrder.items[1].quantity = 3;
```

とすると、元の `order.items[1]` まで変更される可能性があります。

**ヒント**

「配列を新しくした」ことと「配列の中のオブジェクトを新しくした」ことは別です。

---

## 1.6 特定の item だけ変更するなら `map()`

特定の商品だけ変更したい場合、`map()` がよく使われます。

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? {
          ...item,
          quantity: 3,
        }
      : item
  ),
};
```

ここでは役割がきれいに分かれています。

```text
{ ...order }
→ 新しい order オブジェクト

order.items.map(...)
→ 新しい items 配列

{ ...item }
→ 対象 item の新しいオブジェクト

quantity: 3
→ 対象プロパティだけ変更
```

**ヒント**

配列の特定要素を変更するときは、`map()` で新しい配列を作り、変更対象だけ spread して新しいオブジェクトを返すパターンを覚えてください。

---

## 1.7 参照構造で理解する

変更前:

```text
order
↓
オブジェクト A
└→ items 配列 X
    ├→ item オブジェクト P1
    └→ item オブジェクト P2
```

変更後:

```text
updatedOrder
↓
オブジェクト B
└→ items 配列 Y
    ├→ item オブジェクト P1
    └→ item オブジェクト P3
```

ここで、

```text
order オブジェクト
A → B に新しくなる

items 配列
X → Y に新しくなる

変更対象 item
P2 → P3 に新しくなる

変更されていない item
P1 はそのまま再利用
```

となります。

**ヒント**

React の immutable update は、すべてを無条件に複製するのではなく、「変更対象までの経路に必要な参照だけ新しくする」と理解すると整理しやすいです。

---

## 1.8 実際の `===` 比較

```tsx
const order = {
  id: 1002,
  items: [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 2 },
  ],
};

const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? { ...item, quantity: 3 }
      : item
  ),
};
```

比較すると、

```tsx
order === updatedOrder
```

は `false`。

```tsx
order.items === updatedOrder.items
```

も `false`。

```tsx
order.items[0] === updatedOrder.items[0]
```

は `true`。

```tsx
order.items[1] === updatedOrder.items[1]
```

は `false`。

つまり、変更されていない item は再利用し、変更された item だけ新しいオブジェクトになっています。

**ヒント**

どの階層の参照が変わったかを確認したい場合、`===` 比較を使って追跡すると理解しやすいです。

---

## 1.9 ショッピングカート数量変更

```tsx
const cart = [
  {
    id: 1,
    name: "Keyboard",
    quantity: 1,
  },
  {
    id: 2,
    name: "Mouse",
    quantity: 2,
  },
];
```

`id = 2` の数量を 3 に変更するとします。

```tsx
const updatedCart = cart.map((item) =>
  item.id === 2
    ? {
        ...item,
        quantity: 3,
      }
    : item
);
```

これは、

```text
配列
→ map()

対象オブジェクト
→ spread

変更プロパティ
→ quantity
```

という基本形です。

**ヒント**

カート数量変更は、`map()` + spread を練習する最も分かりやすい例のひとつです。

---

## 1.10 item の中にさらに options オブジェクトがある場合

```tsx
const order = {
  id: 1002,
  items: [
    {
      productId: 1,
      name: "Keyboard",
      quantity: 1,
      options: {
        color: "Black",
      },
    },
    {
      productId: 2,
      name: "Mouse",
      quantity: 2,
      options: {
        color: "White",
      },
    },
  ],
};
```

`productId = 2` の `options.color` を `"Black"` に変更したい場合、

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? {
          ...item,
          options: {
            ...item.options,
            color: "Black",
          },
        }
      : item
  ),
};
```

となります。

階層ごとの役割:

```text
...order
→ 新しい order

map()
→ 新しい items 配列

...item
→ 新しい対象 item

...item.options
→ 新しい options

color
→ 新しい値
```

**ヒント**

変更したい値までに存在する「参照型の階層」を数えると、どこで spread / map が必要か分かりやすくなります。

---

## 1.11 `orders` 配列まである場合

実際のアプリでは、注文ひとつではなく複数の注文が配列に入っていることがあります。

```tsx
const orders = [
  {
    id: 1001,
    items: [],
  },
  {
    id: 1002,
    items: [],
  },
];
```

`orderId = 1002`、`productId = 2` の数量を変更する場合、

```tsx
const updatedOrders = orders.map((order) =>
  order.id === 1002
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === 2
            ? {
                ...item,
                quantity: 3,
              }
            : item
        ),
      }
    : order
);
```

となります。

構造:

```text
orders 配列
↓
map()

対象 order
↓
spread

items 配列
↓
map()

対象 item
↓
spread

quantity
↓
新しい値
```

**ヒント**

コードが長く見えても、同じパターンが階層ごとに繰り返されているだけです。

---

## 1.12 配列の中にさらに配列がある場合

```tsx
const product = {
  id: 1,
  optionGroups: [
    {
      name: "Color",
      options: ["Black", "White"],
    },
  ],
};
```

`"White"` を `"Silver"` に変える場合:

```tsx
const updatedProduct = {
  ...product,
  optionGroups: product.optionGroups.map((group) =>
    group.name === "Color"
      ? {
          ...group,
          options: group.options.map((option) =>
            option === "White"
              ? "Silver"
              : option
          ),
        }
      : group
  ),
};
```

ここでは `options` の要素が文字列なので、オブジェクト spread は必要ありません。

**ヒント**

配列の要素が primitive なのか object なのかで、更新方法が変わります。

---

## 1.13 配列の要素がオブジェクトなら spread が必要

```tsx
const options = [
  {
    id: 1,
    label: "Black",
  },
  {
    id: 2,
    label: "White",
  },
];
```

`id = 2` の `label` を変更する場合:

```tsx
const updatedOptions = options.map((option) =>
  option.id === 2
    ? {
        ...option,
        label: "Silver",
      }
    : option
);
```

`map()` は新しい配列、spread は対象の新しいオブジェクトを作ります。

**ヒント**

「配列は `map()`、配列の中の対象オブジェクトは spread」という役割分担を意識してください。

---

## 1.14 よくある間違い 1: 一番外側だけコピー

```tsx
const updatedOrders = [...orders];

updatedOrders[0].items[1].quantity = 3;
```

このコードでは、

```text
updatedOrders
→ 新しい配列

updatedOrders[0]
→ 既存 order オブジェクト

items
→ 既存 items 配列

item
→ 既存 item オブジェクト
```

となるため、元のデータを変更してしまう可能性があります。

**ヒント**

外側だけ spread しても、内側の参照は共有されたままです。

---

## 1.15 よくある間違い 2: `map()` の中で直接変更

```tsx
const updatedOrders = orders.map((order) => {
  if (order.id === 1002) {
    order.items[0].quantity = 3;
  }

  return order;
});
```

`map()` は新しい配列を作りますが、

```tsx
order.items[0].quantity = 3;
```

の部分で既存オブジェクトを直接変更しています。

つまり、`map()` を使っているだけでは immutability は保証されません。

**ヒント**

`map()` の callback の中で、既存オブジェクトのプロパティに `=` で代入していないか確認してください。

---

## 1.16 正しい中첩更新の基本形

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        ),
      }
    : order
);
```

自然言語で読むと、

「注文配列から対象注文を見つけ、新しい注文オブジェクトを作る。その注文の items 配列から対象商品を見つけ、新しい item オブジェクトを作り、quantity だけ新しい値に変更する」

となります。

**ヒント**

複雑なコードは、まず日本語の文章にして説明してみると理解しやすくなります。

---

## 1.17 最終メンタルモデル

```text
orders 配列
↓
map()
↓
新しい orders 配列

order オブジェクト
↓
spread
↓
新しい order

items 配列
↓
map()
↓
新しい items 配列

item オブジェクト
↓
spread
↓
新しい item

quantity
↓
新しい値
```

覚え方:

```text
配列の層
→ map()

オブジェクトの層
→ spread

実際に変更する field
→ 新しい値
```

**ヒント**

「データ構造を上から下までたどり、配列なら `map()`、オブジェクトなら spread」と考えると、深いデータでも整理しやすくなります。

---

# 2. English

## 2.1 Goal of this chapter

This chapter explains how to update nested arrays and objects in React / JavaScript without directly mutating the original data.

Shopping applications rarely use only flat arrays. An order often looks like this:

```tsx
const order = {
  id: 1002,
  items: [
    {
      productId: 1,
      name: "Keyboard",
      quantity: 1,
    },
    {
      productId: 2,
      name: "Mouse",
      quantity: 2,
    },
  ],
};
```

The data path is:

```text
order object
↓
items array
↓
item object
↓
quantity
```

Suppose we want to change the quantity of `productId = 2` to `3`.

Instead of mutating it directly:

```tsx
order.items[1].quantity = 3;
```

React code commonly creates new objects and arrays along the changed path.

**Tip**

Before writing code, identify the full path to the value you want to update.

---

## 2.2 Why direct mutation is a problem

```tsx
order.items[1].quantity = 3;
```

This modifies an existing nested object directly.

Conceptually:

```text
existing order
↓
existing items array
↓
existing item object
↓
directly change quantity
```

JavaScript allows this, but for React state, directly mutating existing state is a pattern to avoid.

**Tip**

When you see code like `something[index].property = value`, check whether it is mutating state directly.

---

## 2.3 Spreading only the outer object is not enough

```tsx
const updatedOrder = {
  ...order,
};

updatedOrder.items[1].quantity = 3;
```

`updatedOrder` is a new object, so:

```tsx
order === updatedOrder
```

is `false`.

However:

```tsx
order.items === updatedOrder.items
```

may still be `true`.

Reference structure:

```text
order
↓
Object A
└──→ items Array X


updatedOrder
↓
Object B
└──→ items Array X
```

The outer object is new, but both objects still reference the same `items` array.

**Tip**

`{ ...order }` creates a new outer object, but it does not recursively clone nested arrays and objects.

---

## 2.4 Creating a new `items` array

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

Now:

```tsx
order !== updatedOrder
```

and:

```tsx
order.items !== updatedOrder.items
```

So both the outer object and the `items` array are new.

But the item objects inside the array may still be shared.

**Tip**

Array spread is also a shallow copy. It creates a new array but reuses references to nested objects.

---

## 2.5 Item objects can still share references

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

Then:

```tsx
order.items[0] === updatedOrder.items[0]
```

may be `true`.

So although the arrays are different, their elements can point to the same objects.

**Tip**

A new array does not automatically mean new objects inside the array.

---

## 2.6 Use `map()` to update one item

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? {
          ...item,
          quantity: 3,
        }
      : item
  ),
};
```

Each part has a different responsibility:

```text
{ ...order }
→ new order object

order.items.map(...)
→ new items array

{ ...item }
→ new object for the target item

quantity: 3
→ updated field
```

**Tip**

For updating one element in an array, a common React pattern is `map()` + object spread.

---

## 2.7 Understanding the references

Before:

```text
order
↓
Object A
└→ items Array X
    ├→ item Object P1
    └→ item Object P2
```

After:

```text
updatedOrder
↓
Object B
└→ items Array Y
    ├→ item Object P1
    └→ item Object P3
```

Only the changed path gets new references.

```text
order object
A → B

items array
X → Y

changed item
P2 → P3

unchanged item
P1 is reused
```

**Tip**

Immutable updates do not necessarily clone everything. They create new references only where changes are needed.

---

## 2.8 Checking with `===`

```tsx
const order = {
  id: 1002,
  items: [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 2 },
  ],
};

const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? { ...item, quantity: 3 }
      : item
  ),
};
```

Results:

```tsx
order === updatedOrder
// false
```

```tsx
order.items === updatedOrder.items
// false
```

```tsx
order.items[0] === updatedOrder.items[0]
// true
```

```tsx
order.items[1] === updatedOrder.items[1]
// false
```

**Tip**

`===` is useful for tracing which references were reused and which were replaced.

---

## 2.9 Shopping cart quantity update

```tsx
const cart = [
  {
    id: 1,
    name: "Keyboard",
    quantity: 1,
  },
  {
    id: 2,
    name: "Mouse",
    quantity: 2,
  },
];
```

To update product `id = 2`:

```tsx
const updatedCart = cart.map((item) =>
  item.id === 2
    ? {
        ...item,
        quantity: 3,
      }
    : item
);
```

Pattern:

```text
array
→ map()

target object
→ spread

target field
→ new value
```

**Tip**

Cart quantity changes are one of the best examples for practicing `map()` + spread.

---

## 2.10 Nested `options` object inside an item

```tsx
const order = {
  id: 1002,
  items: [
    {
      productId: 2,
      name: "Mouse",
      quantity: 2,
      options: {
        color: "White",
      },
    },
  ],
};
```

To change `options.color`:

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? {
          ...item,
          options: {
            ...item.options,
            color: "Black",
          },
        }
      : item
  ),
};
```

Layer by layer:

```text
...order
→ new order

map()
→ new items array

...item
→ new target item

...item.options
→ new options object

color
→ new value
```

**Tip**

Count the reference-type layers between the root and the property you want to update.

---

## 2.11 When there is an `orders` array too

```tsx
const updatedOrders = orders.map((order) =>
  order.id === 1002
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === 2
            ? {
                ...item,
                quantity: 3,
              }
            : item
        ),
      }
    : order
);
```

Structure:

```text
orders array
↓
map()

target order
↓
spread

items array
↓
map()

target item
↓
spread

quantity
↓
new value
```

**Tip**

Nested update code looks long because the same immutable update rule is repeated at multiple levels.

---

## 2.12 Arrays nested inside arrays

```tsx
const product = {
  id: 1,
  optionGroups: [
    {
      name: "Color",
      options: ["Black", "White"],
    },
  ],
};
```

To replace `"White"` with `"Silver"`:

```tsx
const updatedProduct = {
  ...product,
  optionGroups: product.optionGroups.map((group) =>
    group.name === "Color"
      ? {
          ...group,
          options: group.options.map((option) =>
            option === "White"
              ? "Silver"
              : option
          ),
        }
      : group
  ),
};
```

Because the inner `options` array contains strings, there is no need for object spread at that level.

**Tip**

The update pattern depends on whether the array elements are primitives or objects.

---

## 2.13 If array elements are objects

```tsx
const options = [
  { id: 1, label: "Black" },
  { id: 2, label: "White" },
];
```

Update `id = 2`:

```tsx
const updatedOptions = options.map((option) =>
  option.id === 2
    ? {
        ...option,
        label: "Silver",
      }
    : option
);
```

**Tip**

`map()` creates the new array; spread creates the new target object.

---

## 2.14 Common mistake 1: Copying only the outer array

```tsx
const updatedOrders = [...orders];

updatedOrders[0].items[1].quantity = 3;
```

This only creates a new outer array.

The nested order, items array, and item object may still be shared with the original data.

**Tip**

Do not assume that one top-level spread makes the entire structure independent.

---

## 2.15 Common mistake 2: Mutating inside `map()`

```tsx
const updatedOrders = orders.map((order) => {
  if (order.id === 1002) {
    order.items[0].quantity = 3;
  }

  return order;
});
```

`map()` creates a new array, but the callback directly mutates an existing nested object.

**Tip**

Using `map()` does not automatically guarantee immutability. Check what happens inside the callback.

---

## 2.16 Correct nested update pattern

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        ),
      }
    : order
);
```

In plain English:

Find the target order, create a new order object, create a new `items` array, find the target item, create a new item object, and change only the `quantity`.

**Tip**

If nested code feels difficult, first describe the update in normal language.

---

## 2.17 Final mental model

```text
orders array
↓
map()
↓
new orders array

order object
↓
spread
↓
new order object

items array
↓
map()
↓
new items array

item object
↓
spread
↓
new item object

quantity
↓
new value
```

Simple rule:

```text
array layer
→ map()

object layer
→ spread

field
→ new value
```

**Tip**

Trace the data structure from top to bottom. Use `map()` for array layers and spread for object layers.

---

# 3. 한국어

## 3.1 이 장의 목표

이번 장에서는 React / JavaScript에서 **중첩된 배열과 객체를 기존 데이터 직접 수정 없이 업데이트하는 방법**을 자세히 설명합니다.

쇼핑몰 데이터는 대부분 단순한 1차원 배열로 끝나지 않습니다.

예를 들어 주문 하나가 다음처럼 생길 수 있습니다.

```tsx
const order = {
  id: 1002,
  items: [
    {
      productId: 1,
      name: "Keyboard",
      quantity: 1,
    },
    {
      productId: 2,
      name: "Mouse",
      quantity: 2,
    },
  ],
};
```

이 구조를 층별로 보면:

```text
order 객체
↓
items 배열
↓
item 객체
↓
quantity
```

입니다.

이제 `productId = 2`인 상품의 `quantity`를 `3`으로 바꾼다고 해보겠습니다.

React에서 중요한 것은 단순히 값을 바꾸는 것이 아니라, **변경 경로에 있는 배열과 객체를 새로운 참조로 만들어주는 것**입니다.

**팁**

코드를 쓰기 전에 먼저 바꾸려는 값까지의 경로를 적어보세요.  
예: `order → items → item → quantity`

---

## 3.2 직접 수정은 왜 피해야 할까?

다음 코드를 봅시다.

```tsx
order.items[1].quantity = 3;
```

이 코드는 기존 데이터 안쪽까지 들어가서 값을 직접 바꿉니다.

개념적으로:

```text
기존 order
↓
기존 items 배열
↓
기존 item 객체
↓
quantity 직접 변경
```

입니다.

JavaScript에서는 가능한 코드지만, React state에서는 기존 state를 직접 mutation하는 패턴을 피하는 것이 기본입니다.

**팁**

`something[index].property = value` 형태가 보이면 기존 state를 직접 수정하고 있는지 먼저 확인하세요.

---

## 3.3 바깥 객체만 spread 하면 충분하지 않다

다음 코드:

```tsx
const updatedOrder = {
  ...order,
};

updatedOrder.items[1].quantity = 3;
```

`updatedOrder`는 새로운 객체입니다.

그래서:

```tsx
order === updatedOrder
```

는 `false`입니다.

하지만:

```tsx
order.items === updatedOrder.items
```

는 `true`일 수 있습니다.

구조:

```text
order
↓
객체 A
└──→ items 배열 X


updatedOrder
↓
객체 B
└──→ items 배열 X
```

즉 바깥 객체는 새로 만들었지만 안쪽 `items` 배열은 같은 배열입니다.

그래서:

```tsx
updatedOrder.items[1].quantity = 3;
```

을 실행하면 원본 `order.items[1]`까지 영향을 받을 수 있습니다.

**팁**

`{ ...order }`는 `order` 객체 한 층만 새로 만듭니다. 내부 배열과 객체까지 자동으로 새로 만들지는 않습니다.

---

## 3.4 `items` 배열까지 새로 만들기

다음처럼 작성할 수 있습니다.

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

이제:

```tsx
order !== updatedOrder
```

이고,

```tsx
order.items !== updatedOrder.items
```

입니다.

즉:

```text
order 객체
→ 새 객체

items 배열
→ 새 배열
```

까지는 성공했습니다.

하지만 배열 내부의 item 객체는 아직 같은 참조일 수 있습니다.

**팁**

`[...order.items]`도 얕은 복사입니다. 배열 자체만 새로 만들고 내부 객체 참조는 그대로 가져올 수 있습니다.

---

## 3.5 배열 안 item 객체는 여전히 같을 수 있다

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

이때:

```tsx
order.items[0] === updatedOrder.items[0]
```

는 `true`가 될 수 있습니다.

즉:

```text
order.items
→ 배열 A

updatedOrder.items
→ 배열 B
```

배열은 다르지만,

```text
A의 0번 item
B의 0번 item
↓
같은 객체
```

일 수 있습니다.

그래서:

```tsx
updatedOrder.items[1].quantity = 3;
```

처럼 내부 객체를 직접 수정하면 기존 데이터도 영향을 받을 수 있습니다.

**팁**

새 배열을 만들었다는 사실과 내부 객체까지 새로 만들었다는 사실은 완전히 다른 문제입니다.

---

## 3.6 특정 item 수정에는 `map()`

특정 상품만 수정하고 싶다면 `map()`을 사용합니다.

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? {
          ...item,
          quantity: 3,
        }
      : item
  ),
};
```

각 코드의 역할:

```text
{ ...order }
→ 새 order 객체

order.items.map(...)
→ 새 items 배열

{ ...item }
→ 수정 대상 item의 새 객체

quantity: 3
→ 수정할 필드의 새 값
```

**팁**

배열의 특정 객체를 수정할 때는 `map()`으로 새 배열을 만들고, 수정 대상 객체에서 spread를 사용하는 패턴을 익혀두세요.

---

## 3.7 참조 구조로 보면 더 명확하다

변경 전:

```text
order
↓
객체 A
└→ items 배열 X
    ├→ item 객체 P1
    └→ item 객체 P2
```

변경 후:

```text
updatedOrder
↓
객체 B
└→ items 배열 Y
    ├→ item 객체 P1
    └→ item 객체 P3
```

정리:

```text
order 객체
A → B 새로 생성

items 배열
X → Y 새로 생성

수정 대상 item
P2 → P3 새로 생성

수정 안 된 item
P1은 기존 객체 그대로 재사용
```

**팁**

React 불변성 업데이트는 모든 것을 무조건 새로 만드는 것이 아니라, 수정 대상 경로에 있는 참조형만 새로 만드는 방식으로 이해하면 좋습니다.

---

## 3.8 `===`로 직접 확인하기

```tsx
const order = {
  id: 1002,
  items: [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 2 },
  ],
};

const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? { ...item, quantity: 3 }
      : item
  ),
};
```

이제:

```tsx
order === updatedOrder
```

→ `false`

```tsx
order.items === updatedOrder.items
```

→ `false`

```tsx
order.items[0] === updatedOrder.items[0]
```

→ `true`

```tsx
order.items[1] === updatedOrder.items[1]
```

→ `false`

입니다.

변경되지 않은 item은 재사용하고, 변경된 item만 새 객체가 된 것입니다.

**팁**

참조 구조가 헷갈릴 때는 `===` 비교를 통해 어느 층이 새 참조가 되었는지 확인하세요.

---

## 3.9 장바구니 수량 변경

```tsx
const cart = [
  {
    id: 1,
    name: "Keyboard",
    quantity: 1,
  },
  {
    id: 2,
    name: "Mouse",
    quantity: 2,
  },
];
```

`id = 2`의 수량을 `3`으로 변경:

```tsx
const updatedCart = cart.map((item) =>
  item.id === 2
    ? {
        ...item,
        quantity: 3,
      }
    : item
);
```

구조:

```text
배열
→ map()

특정 객체
→ spread

특정 필드
→ 새 값
```

**팁**

장바구니 수량 변경은 `map()` + spread 패턴을 연습하기에 가장 좋은 예제 중 하나입니다.

---

## 3.10 item 안에 `options` 객체가 또 있는 경우

```tsx
const order = {
  id: 1002,
  items: [
    {
      productId: 2,
      name: "Mouse",
      quantity: 2,
      options: {
        color: "White",
      },
    },
  ],
};
```

`options.color`을 `"Black"`으로 변경하고 싶다면:

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 2
      ? {
          ...item,
          options: {
            ...item.options,
            color: "Black",
          },
        }
      : item
  ),
};
```

역할:

```text
...order
→ 새 order 객체

map()
→ 새 items 배열

...item
→ 새 대상 item 객체

...item.options
→ 새 options 객체

color
→ 새 값
```

**팁**

변경 대상까지 내려가는 동안 만나는 배열과 객체를 한 층씩 체크하세요.

---

## 3.11 바깥에 `orders` 배열까지 있다면

실제 쇼핑몰은 여러 주문을 배열로 가지고 있을 수 있습니다.

```tsx
const updatedOrders = orders.map((order) =>
  order.id === 1002
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === 2
            ? {
                ...item,
                quantity: 3,
              }
            : item
        ),
      }
    : order
);
```

구조:

```text
orders 배열
↓
map()

대상 order
↓
spread

items 배열
↓
map()

대상 item
↓
spread

quantity
↓
새 값
```

**팁**

코드가 길어 보여도 원리는 동일합니다. 배열 층마다 `map()`, 객체 층마다 spread가 반복됩니다.

---

## 3.12 배열 안에 또 배열이 있는 경우

```tsx
const product = {
  id: 1,
  optionGroups: [
    {
      name: "Color",
      options: ["Black", "White"],
    },
  ],
};
```

`"White"`를 `"Silver"`로 바꾸고 싶다면:

```tsx
const updatedProduct = {
  ...product,
  optionGroups: product.optionGroups.map((group) =>
    group.name === "Color"
      ? {
          ...group,
          options: group.options.map((option) =>
            option === "White"
              ? "Silver"
              : option
          ),
        }
      : group
  ),
};
```

여기서 내부 `options`의 요소는 문자열이므로 객체 spread가 필요하지 않습니다.

**팁**

배열 요소가 primitive인지 object인지 먼저 확인하세요. primitive는 새 값을 직접 반환하면 되고, object라면 spread가 필요할 수 있습니다.

---

## 3.13 배열 안 요소가 객체라면

```tsx
const options = [
  {
    id: 1,
    label: "Black",
  },
  {
    id: 2,
    label: "White",
  },
];
```

`id = 2`의 `label`을 변경:

```tsx
const updatedOptions = options.map((option) =>
  option.id === 2
    ? {
        ...option,
        label: "Silver",
      }
    : option
);
```

여기서:

```text
map()
→ 새 배열

...option
→ 새 대상 객체
```

입니다.

**팁**

배열은 `map()`, 대상 객체는 spread라는 역할 구분을 기억하세요.

---

## 3.14 흔한 실수 1: 가장 바깥 배열만 복사

```tsx
const updatedOrders = [...orders];

updatedOrders[0].items[1].quantity = 3;
```

이 경우:

```text
updatedOrders
→ 새 배열

updatedOrders[0]
→ 기존 order 객체

items
→ 기존 items 배열

item
→ 기존 item 객체
```

일 수 있습니다.

즉 원본 state 내부 데이터를 직접 수정하는 문제가 생길 수 있습니다.

**팁**

가장 바깥쪽 spread 하나만으로 전체 중첩 구조가 독립적으로 복사되지는 않습니다.

---

## 3.15 흔한 실수 2: `map()` 안에서 직접 수정

```tsx
const updatedOrders = orders.map((order) => {
  if (order.id === 1002) {
    order.items[0].quantity = 3;
  }

  return order;
});
```

`map()`은 새 배열을 만들지만:

```tsx
order.items[0].quantity = 3;
```

에서 기존 객체를 직접 수정합니다.

즉 `map()`을 사용했다는 사실만으로 불변성이 지켜지는 것은 아닙니다.

**팁**

`map()` callback 내부에서 기존 객체의 프로퍼티에 직접 `=` 대입을 하고 있는지 확인하세요.

---

## 3.16 올바른 중첩 업데이트 공식

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        ),
      }
    : order
);
```

자연어로 읽으면:

```text
orders에서 대상 order를 찾는다
↓
새 order 객체를 만든다
↓
그 order의 items에서 대상 item을 찾는다
↓
새 item 객체를 만든다
↓
quantity만 새 값으로 바꾼다
```

입니다.

**팁**

중첩 코드가 복잡하면 먼저 한국어 문장으로 순서를 설명해보세요. 그다음 코드와 한 줄씩 대응시키면 훨씬 이해하기 쉽습니다.

---

## 3.17 최종 Mental Model

```text
orders 배열
↓
map()
↓
새 orders 배열

order 객체
↓
spread
↓
새 order 객체

items 배열
↓
map()
↓
새 items 배열

item 객체
↓
spread
↓
새 item 객체

quantity
↓
새 값
```

가장 간단한 공식:

```text
배열 층
→ map()

객체 층
→ spread

실제 변경 필드
→ 새 값
```

쇼핑몰에서 예를 들면:

```text
주문 목록
→ map()

특정 주문
→ spread

주문 상품 목록
→ map()

특정 상품
→ spread

수량
→ 새 수량
```

입니다.

**팁**

중첩 데이터가 아무리 깊어도, 자료구조를 위에서 아래로 추적하면 됩니다. 배열이면 `map()`, 객체면 spread, 마지막 필드는 새 값을 넣는 구조로 생각하세요.

---

# 4. Quick Reference

| Data layer | Typical update tool | Purpose |
|---|---|---|
| Array | `map()` | Create a new array while replacing selected elements |
| Object | `{ ...obj }` | Create a new object |
| Nested array | nested `map()` | Create a new nested array |
| Nested object | nested spread | Create a new nested object |
| Primitive field | new value | Replace the final field |

```tsx
const updatedOrders = orders.map((order) =>
  order.id === orderId
    ? {
        ...order,
        items: order.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        ),
      }
    : order
);
```

最終的な考え方 / Final mental model / 최종 사고방식:

```text
Array → map()
Object → spread
Field → new value
```
