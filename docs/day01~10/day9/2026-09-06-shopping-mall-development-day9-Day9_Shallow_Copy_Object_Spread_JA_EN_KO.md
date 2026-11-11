# Shallow Copy・Object Spread・Nested Reference
## 日本語 → English → 한국어

---

# 1. 日本語

## Shallow Copy（浅いコピー）と `{ ...order }`

次のコードを考えてみましょう。

```tsx
const updatedOrder = {
  ...order,
  status: "キャンセル完了",
};
```

このコードでは新しいオブジェクトが作られます。

しかし、

> **オブジェクトの中にある配列やネストされたオブジェクトまで、すべて新しく複製されるわけではありません。**

これが **Shallow Copy（浅いコピー）** の重要なポイントです。

**Tip**

Shallow = 浅い。

つまり、**外側の1段階は新しくなるが、内側まで全部新しくなるとは限らない** と覚えると分かりやすいです。

---

## 1. 単純なオブジェクトの場合

```tsx
const order = {
  id: 1001,
  name: "Kim",
  status: "支払い完了",
};
```

そして：

```tsx
const updatedOrder = {
  ...order,
  status: "キャンセル完了",
};
```

このとき：

```tsx
order === updatedOrder
```

は：

```tsx
false
```

です。

外側のオブジェクトは新しく作られているからです。

```text
order
  │
  ▼
┌─────────────────────┐
│ id: 1001            │
│ name: "Kim"         │
│ status: "支払い完了" │
└─────────────────────┘


updatedOrder
  │
  ▼
┌──────────────────────┐
│ id: 1001             │
│ name: "Kim"          │
│ status: "キャンセル完了" │
└──────────────────────┘
```

---

## 2. `Order` の中には配列がある

例えば：

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

ここで重要なのは：

```tsx
items: CartItem[];
```

です。

`items` は単純な文字列や数字ではなく、配列です。

例えば：

```tsx
const order = {
  id: 1001,
  name: "Kim",
  status: "支払い完了",
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 },
  ],
};
```

そして：

```tsx
const updatedOrder = {
  ...order,
  status: "キャンセル完了",
};
```

とします。

---

## 3. 外側のオブジェクトは別物

```tsx
order === updatedOrder
```

は：

```tsx
false
```

です。

しかし：

```tsx
order.items === updatedOrder.items
```

は：

```tsx
true
```

になることがあります。

ここが Shallow Copy の核心です。

```text
order
  │
  ▼
┌─────────────────────┐
│ id: 1001            │
│ status: "支払い完了" │
│ items ───────────────┼────┐
└─────────────────────┘    │
                           │
                           ▼
                    ┌──────────────┐
                    │ CartItem[]   │
                    │ productId: 1 │
                    │ quantity: 2  │
                    └──────────────┘
                           ▲
                           │
┌──────────────────────┐   │
│ id: 1001             │   │
│ status: "キャンセル完了" │   │
│ items ────────────────┼───┘
└──────────────────────┘
  ▲
  │
updatedOrder
```

つまり：

```text
order オブジェクト
updatedOrder オブジェクト
→ 別物

しかし

order.items
updatedOrder.items
→ 同じ配列を参照している可能性がある
```

**Tip**

Spread を使ったからといって、内部の配列やオブジェクトまですべて新しくなるわけではありません。

---

## 4. なぜ同じ `items` を参照するのか

```tsx
{
  ...order
}
```

は `order` の property の値を新しいオブジェクトへコピーします。

例えば：

```tsx
{
  id: 1001,
  name: "Kim",
  items: [...]
}
```

`id` のような数値は値としてコピーされます。

しかし `items` は配列です。

配列はオブジェクト系の値なので、参照（reference）を通して扱われます。

概念的には：

```text
order.items
     │
     ▼
   配列 A
```

spread は配列 A 自体を深く複製するのではなく、
その配列を参照する値をコピーします。

```text
order.items ────────┐
                    ▼
                  配列 A
                    ▲
updatedOrder.items ─┘
```

**Tip**

property の値が配列やオブジェクトの場合、その reference がそのままコピーされる可能性があります。

---

## 5. 内部配列を変更するとどうなるか

```tsx
const order = {
  id: 1001,
  items: [
    { productId: 1, quantity: 2 }
  ],
};

const updatedOrder = {
  ...order,
};
```

その後：

```tsx
updatedOrder.items.push({
  productId: 3,
  quantity: 1,
});
```

とすると、`order.items` にも影響する可能性があります。

なぜなら：

```tsx
order.items === updatedOrder.items
```

が：

```tsx
true
```

だからです。

```text
updatedOrder.items.push(...)
             │
             ▼
          同じ配列
          /      \
         /        \
order.items    updatedOrder.items
```

**Tip**

spread 後に `push()` や `splice()` などで内部配列を直接変更するときは注意が必要です。

---

## 6. `items` 配列も新しくしたい場合

次のように書きます。

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

ここでは：

```tsx
{
  ...order,
```

で新しい `Order` オブジェクトを作り、

```tsx
items: [...order.items]
```

で新しい `items` 配列を作ります。

そのため：

```tsx
order === updatedOrder
```

は：

```tsx
false
```

そして：

```tsx
order.items === updatedOrder.items
```

も：

```tsx
false
```

になります。

```text
order
 │
 ▼
元のオブジェクト
 │
 └── items ──→ 元の配列


updatedOrder
 │
 ▼
新しいオブジェクト
 │
 └── items ──→ 新しい配列
```

**Tip**

変更したいデータがネストされている場合は、**変更が必要な階層まで新しいオブジェクトや配列を作る** と考えると分かりやすいです。

---

## 7. ただし、配列の中のオブジェクトはまだ共有される

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

これで `items` 配列そのものは新しくなります。

しかし：

```tsx
order.items[0] === updatedOrder.items[0]
```

は：

```tsx
true
```

になることがあります。

なぜなら：

```tsx
[...order.items]
```

も配列に対する Shallow Copy だからです。

```text
元の items 配列              新しい items 配列
┌─────────────┐            ┌─────────────┐
│ [0] ────────┼──────┐ ┌───┼────── [0]   │
└─────────────┘      │ │   └─────────────┘
                     ▼ ▼
                ┌───────────────┐
                │ CartItem object│
                │ productId: 1  │
                │ quantity: 2   │
                └───────────────┘
```

---

## 8. `CartItem` 自体も変更したい場合

例えば `productId === 1` の `quantity` を 3 に変更したいとします。

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 1
      ? {
          ...item,
          quantity: 3,
        }
      : item
  ),
};
```

ここでは：

```text
Order object
↓
{ ...order }
↓
新しい Order object

items array
↓
map()
↓
新しい items array

対象 CartItem
↓
{ ...item }
↓
新しい CartItem object
```

という流れになります。

**Tip**

複雑に見える場合は、

```text
Order → items → CartItem → quantity
```

のように、変更したい property までの経路を先に確認すると理解しやすくなります。

---

## 9. Day 9 ではここまで深くコピーする必要はない

現在の目的は：

```text
Order
├─ id
├─ name
├─ items
├─ totalPrice
└─ status ← ここだけ変更
```

です。

`status` は `Order` の一番外側の property です。

そのため：

```tsx
{
  ...order,
  status: "キャンセル完了",
}
```

だけで十分です。

`items` の中身は変更していないので：

```tsx
items: [...order.items]
```

まで作る必要はありません。

**Tip**

「全部コピーする」ことが目的ではありません。

**実際に変更する経路に必要な階層だけ、新しいオブジェクトや配列を作る** のが重要です。

---

## 10. Shallow Copy と Deep Copy

| 区分 | Shallow Copy | Deep Copy |
|---|---|---|
| 日本語 | 浅いコピー | 深いコピー |
| 外側のオブジェクト | 新しい | 新しい |
| ネストされたオブジェクト | 共有される場合あり | 新しく複製 |
| ネストされた配列 | 共有される場合あり | 新しく複製 |
| `{ ...order }` | ✅ | ❌ |
| `[...items]` | 配列自体のみ新しい | ❌ |

例えば：

```tsx
const copy = {
  ...order,
};
```

では：

```text
order !== copy
```

ですが：

```text
order.items === copy.items
```

になることがあります。

**Tip**

Spread は基本的に Deep Copy ではなく、Shallow Copy です。

---

## Final Mental Model

```text
Shallow Copy
────────────────────────────

const copy = {
  ...original
};

        ↓

外側のオブジェクト
original !== copy
        ✅

しかし

内部のオブジェクト / 配列
original.child === copy.child
        あり得る
```

ネストされた値を変更したい場合：

```text
何を変更する？
↓
変更する property までの経路を探す
↓
必要な階層ごとに
新しいオブジェクト / 配列を作る
```

Day 9 では：

```text
Order
└── status
```

なので：

```tsx
{
  ...order,
  status: "キャンセル完了",
}
```

で十分です。

---

# 2. English

## Shallow Copy and `{ ...order }`

Consider:

```tsx
const updatedOrder = {
  ...order,
  status: "Cancelled",
};
```

This creates a new outer object.

However:

> **It does not automatically create brand-new copies of every nested object or array inside it.**

That is the key idea behind a **Shallow Copy**.

**Tip**

Think of "shallow" as:

**the outer layer is copied, but deeper layers may still be shared.**

---

## 1. Simple object example

```tsx
const order = {
  id: 1001,
  name: "Kim",
  status: "Paid",
};
```

Then:

```tsx
const updatedOrder = {
  ...order,
  status: "Cancelled",
};
```

Now:

```tsx
order === updatedOrder
```

is:

```tsx
false
```

because the outer object is newly created.

---

## 2. An `Order` can contain nested data

Example:

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

The important part is:

```tsx
items: CartItem[];
```

`items` is an array.

Example data:

```tsx
const order = {
  id: 1001,
  name: "Kim",
  status: "Paid",
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 },
  ],
};
```

Then:

```tsx
const updatedOrder = {
  ...order,
  status: "Cancelled",
};
```

---

## 3. The outer object is new, but the nested array may be shared

```tsx
order === updatedOrder
```

is:

```tsx
false
```

But:

```tsx
order.items === updatedOrder.items
```

can be:

```tsx
true
```

This is the essence of a shallow copy.

```text
order object
updatedOrder object
→ different objects

but

order.items
updatedOrder.items
→ may point to the same array
```

**Tip**

Object spread does not mean every nested value becomes a completely independent copy.

---

## 4. Why does this happen?

When you write:

```tsx
{
  ...order
}
```

the property values of `order` are copied into a new object.

For primitive-like values such as numbers and strings, the values are copied.

But `items` is an array.

Arrays are reference-based objects.

Conceptually:

```text
order.items
     │
     ▼
   Array A
```

The spread operation copies the reference to Array A:

```text
order.items ────────┐
                    ▼
                  Array A
                    ▲
updatedOrder.items ─┘
```

**Tip**

If a property value is an object or array, its reference may be copied rather than deeply cloning its contents.

---

## 5. Mutating the nested array can affect both objects

```tsx
const order = {
  id: 1001,
  items: [
    { productId: 1, quantity: 2 }
  ],
};

const updatedOrder = {
  ...order,
};
```

Then:

```tsx
updatedOrder.items.push({
  productId: 3,
  quantity: 1,
});
```

may also affect `order.items`.

Why?

Because:

```tsx
order.items === updatedOrder.items
```

can be:

```tsx
true
```

Both properties point to the same array.

**Tip**

Be careful with mutating methods such as `push()` and `splice()` after a shallow copy.

---

## 6. Creating a new `items` array too

If you also want a new array:

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

Now:

```tsx
order === updatedOrder
```

is:

```tsx
false
```

and:

```tsx
order.items === updatedOrder.items
```

is also:

```tsx
false
```

Conceptually:

```text
order
 │
 ▼
original object
 │
 └── items ──→ original array


updatedOrder
 │
 ▼
new object
 │
 └── items ──→ new array
```

**Tip**

When nested data needs to change, create new objects or arrays down to the level that must be updated.

---

## 7. But the objects inside the new array may still be shared

Even after:

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

this can still be true:

```tsx
order.items[0] === updatedOrder.items[0]
```

Why?

Because:

```tsx
[...order.items]
```

is also a shallow copy.

The outer arrays are different, but their element objects can still be shared.

---

## 8. Updating a nested `CartItem`

Suppose you want to change `quantity` for `productId === 1`.

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 1
      ? {
          ...item,
          quantity: 3,
        }
      : item
  ),
};
```

The structure is:

```text
Order object
↓
{ ...order }
↓
new Order object

items array
↓
map()
↓
new items array

target CartItem
↓
{ ...item }
↓
new CartItem object
```

**Tip**

For nested updates, trace the path first:

```text
Order → items → CartItem → quantity
```

Then create new data structures along that path.

---

## 9. Day 9 does not need a deep nested update

Current goal:

```text
Order
├─ id
├─ name
├─ items
├─ totalPrice
└─ status ← only this changes
```

`status` is directly on the outer `Order` object.

Therefore:

```tsx
{
  ...order,
  status: "Cancelled",
}
```

is enough.

There is no need to also write:

```tsx
items: [...order.items]
```

because `items` itself is not being changed.

**Tip**

The goal is not to copy everything.

The goal is to create new structures only along the path that is actually being updated.

---

## 10. Shallow Copy vs Deep Copy

| Category | Shallow Copy | Deep Copy |
|---|---|---|
| Outer object | New | New |
| Nested object | May be shared | New copy |
| Nested array | May be shared | New copy |
| `{ ...order }` | ✅ | ❌ |
| `[...items]` | New outer array only | ❌ |

Example:

```tsx
const copy = {
  ...order,
};
```

Then:

```text
order !== copy
```

but:

```text
order.items === copy.items
```

may still be true.

**Tip**

Spread syntax creates a shallow copy, not a general-purpose deep copy.

---

## Final Mental Model

```text
Shallow Copy
────────────────────────────

const copy = {
  ...original
};

        ↓

outer object
original !== copy
        ✅

but

nested object / array
original.child === copy.child
        possible
```

For nested updates:

```text
What value is changing?
↓
Find the path to that value
↓
Create new objects / arrays
for the necessary levels
```

For Day 9:

```text
Order
└── status
```

so:

```tsx
{
  ...order,
  status: "Cancelled",
}
```

is enough.

---

# 3. 한국어

## Shallow Copy(얕은 복사)와 `{ ...order }`

다음 코드를 보자.

```tsx
const updatedOrder = {
  ...order,
  status: "취소완료",
};
```

이 코드는 **새로운 바깥 객체**를 만든다.

하지만:

> **객체 내부의 모든 중첩 객체와 배열까지 전부 새로운 복사본으로 만드는 것은 아니다.**

이게 **Shallow Copy(얕은 복사)**의 핵심이다.

**팁**

Shallow = 얕은.

즉, **가장 바깥쪽 한 단계는 새로 만들지만 안쪽까지 전부 새로 만들어지는 것은 아니다**라고 기억하면 된다.

---

## 1. 단순한 객체부터 보기

```tsx
const order = {
  id: 1001,
  name: "Kim",
  status: "결제완료",
};
```

그리고:

```tsx
const updatedOrder = {
  ...order,
  status: "취소완료",
};
```

이제:

```tsx
order === updatedOrder
```

는:

```tsx
false
```

이다.

왜냐하면 바깥 객체는 새로 만들어졌기 때문이다.

```text
order
  │
  ▼
┌─────────────────────┐
│ id: 1001            │
│ name: "Kim"         │
│ status: "결제완료"   │
└─────────────────────┘


updatedOrder
  │
  ▼
┌─────────────────────┐
│ id: 1001            │
│ name: "Kim"         │
│ status: "취소완료"   │
└─────────────────────┘
```

---

## 2. 실제 `Order`에는 중첩 데이터가 있다

예:

```tsx
export type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
};
```

여기서 중요한 부분:

```tsx
items: CartItem[];
```

`items`는 배열이다.

실제 데이터가:

```tsx
const order = {
  id: 1001,
  name: "Kim",
  status: "결제완료",
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 },
  ],
};
```

라고 해보자.

그리고:

```tsx
const updatedOrder = {
  ...order,
  status: "취소완료",
};
```

를 실행한다.

---

## 3. 바깥 객체는 다르지만 내부 배열은 같을 수 있다

```tsx
order === updatedOrder
```

는:

```tsx
false
```

이다.

하지만:

```tsx
order.items === updatedOrder.items
```

는:

```tsx
true
```

가 될 수 있다.

여기가 Shallow Copy의 핵심이다.

```text
order
  │
  ▼
┌─────────────────────┐
│ id: 1001            │
│ status: "결제완료"   │
│ items ───────────────┼────┐
└─────────────────────┘    │
                           │
                           ▼
                    ┌──────────────┐
                    │ CartItem[]   │
                    │ productId: 1 │
                    │ quantity: 2  │
                    └──────────────┘
                           ▲
                           │
┌─────────────────────┐    │
│ id: 1001            │    │
│ status: "취소완료"   │    │
│ items ───────────────┼────┘
└─────────────────────┘
  ▲
  │
updatedOrder
```

즉:

```text
order 객체
updatedOrder 객체
→ 서로 다름

하지만

order.items
updatedOrder.items
→ 같은 배열을 바라볼 수 있음
```

**팁**

Spread를 사용했다고 해서 내부 배열과 객체까지 전부 독립적인 새 복사본이 되는 것은 아니다.

---

## 4. 왜 같은 `items`를 바라볼까?

```tsx
{
  ...order
}
```

는 `order`의 property 값을 새로운 객체에 복사한다.

예:

```tsx
{
  id: 1001,
  name: "Kim",
  items: [...]
}
```

`id` 같은 숫자는 값 자체가 복사된다.

하지만 `items`는 배열이다.

배열은 객체 계열이므로 reference를 통해 다뤄진다.

개념적으로:

```text
order.items
     │
     ▼
   배열 A
```

spread가 배열 A 자체를 깊게 복사하는 것이 아니라,
그 배열을 가리키는 reference를 복사한다고 이해하면 된다.

```text
order.items ────────┐
                    ▼
                  배열 A
                    ▲
updatedOrder.items ─┘
```

**팁**

property 값이 배열이나 객체라면 그 내부 값 전체가 아니라 reference가 복사될 수 있다.

---

## 5. 내부 배열을 직접 수정하면?

```tsx
const order = {
  id: 1001,
  items: [
    { productId: 1, quantity: 2 }
  ],
};

const updatedOrder = {
  ...order,
};
```

그리고:

```tsx
updatedOrder.items.push({
  productId: 3,
  quantity: 1,
});
```

를 실행하면 `order.items`에도 영향을 줄 수 있다.

왜냐하면:

```tsx
order.items === updatedOrder.items
```

가:

```tsx
true
```

이기 때문이다.

```text
updatedOrder.items.push(...)
             │
             ▼
          같은 배열
          /      \
         /        \
order.items    updatedOrder.items
```

**팁**

Shallow Copy 후 내부 배열에 `push()`, `splice()` 같은 직접 수정 메서드를 사용할 때는 특히 주의해야 한다.

---

## 6. `items` 배열까지 새로 만들고 싶다면

다음처럼 작성한다.

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

여기서는:

```tsx
{
  ...order,
```

로 새로운 `Order` 객체를 만들고,

```tsx
items: [...order.items]
```

로 새로운 `items` 배열을 만든다.

그래서:

```tsx
order === updatedOrder
```

는:

```tsx
false
```

그리고:

```tsx
order.items === updatedOrder.items
```

도:

```tsx
false
```

가 된다.

```text
order
 │
 ▼
원본 객체
 │
 └── items ──→ 원본 배열


updatedOrder
 │
 ▼
새 객체
 │
 └── items ──→ 새 배열
```

**팁**

중첩 데이터가 수정 대상이라면 **수정에 필요한 레벨까지 새로운 객체나 배열을 만든다**고 생각하면 좋다.

---

## 7. 그런데 배열 안의 객체는 아직 공유될 수 있다

```tsx
const updatedOrder = {
  ...order,
  items: [...order.items],
};
```

이렇게 하면 `items` 배열 자체는 새 배열이다.

하지만:

```tsx
order.items[0] === updatedOrder.items[0]
```

는:

```tsx
true
```

가 될 수 있다.

왜냐하면:

```tsx
[...order.items]
```

도 배열에 대한 Shallow Copy이기 때문이다.

즉:

```text
원본 items 배열              새 items 배열
┌─────────────┐            ┌─────────────┐
│ [0] ────────┼──────┐ ┌───┼────── [0]   │
└─────────────┘      │ │   └─────────────┘
                     ▼ ▼
                ┌───────────────┐
                │ CartItem 객체 │
                │ productId: 1  │
                │ quantity: 2   │
                └───────────────┘
```

이다.

---

## 8. `CartItem` 자체를 수정해야 한다면

예를 들어 `productId === 1`인 상품의 `quantity`를 3으로 바꾸고 싶다면:

```tsx
const updatedOrder = {
  ...order,
  items: order.items.map((item) =>
    item.productId === 1
      ? {
          ...item,
          quantity: 3,
        }
      : item
  ),
};
```

라고 할 수 있다.

구조:

```text
Order 객체
↓
{ ...order }
↓
새 Order 객체


items 배열
↓
map()
↓
새 items 배열


수정 대상 CartItem
↓
{ ...item }
↓
새 CartItem 객체
```

**팁**

중첩 업데이트가 복잡해지면 먼저 수정 경로를 찾아라.

```text
Order → items → CartItem → quantity
```

그 다음 그 경로를 따라 필요한 레벨에서 새 객체/배열을 만든다.

---

## 9. 현재 Day 9에서는 이렇게 깊게 복사할 필요가 없다

현재 수정 대상은:

```text
Order
├─ id
├─ name
├─ items
├─ totalPrice
└─ status ← 여기만 수정
```

이다.

`status`는 `Order`의 첫 번째 레벨에 있다.

그래서:

```tsx
{
  ...order,
  status: "취소완료",
}
```

만으로 충분하다.

우리는 `items` 내부를 수정하지 않기 때문에:

```tsx
items: [...order.items]
```

까지 만들 필요는 없다.

**팁**

목표는 모든 데이터를 무조건 새로 복사하는 것이 아니다.

**실제로 변경되는 경로에 필요한 레벨만 새로 만든다**는 것이 핵심이다.

---

## 10. Shallow Copy vs Deep Copy

| 구분 | Shallow Copy | Deep Copy |
|---|---|---|
| 한국어 | 얕은 복사 | 깊은 복사 |
| 바깥 객체 | 새로 생성 | 새로 생성 |
| 중첩 객체 | 공유될 수 있음 | 새로 복제 |
| 중첩 배열 | 공유될 수 있음 | 새로 복제 |
| `{ ...order }` | ✅ | ❌ |
| `[...items]` | 배열 자체만 새로 생성 | ❌ |

예:

```tsx
const copy = {
  ...order,
};
```

이면:

```text
order !== copy
```

이지만:

```text
order.items === copy.items
```

가 될 수 있다.

**팁**

Spread는 기본적으로 Deep Copy가 아니라 Shallow Copy다.

---

## 최종 Mental Model

```text
Shallow Copy
────────────────────────────

const copy = {
  ...original
};

        ↓

바깥 객체
original !== copy
        ✅

하지만

내부 객체 / 배열
original.child === copy.child
        가능
```

중첩 값을 수정해야 한다면:

```text
무엇을 수정하지?
↓
수정 대상까지의 경로를 찾는다
↓
필요한 레벨마다
새 객체 / 새 배열을 만든다
```

Day 9에서는:

```text
Order
└── status
```

이므로:

```tsx
{
  ...order,
  status: "취소완료",
}
```

면 충분하다.

---

## 핵심 공식

```text
Object Spread
{ ...object }
→ 바깥 객체를 새로 만든다

Nested Array Spread
[...array]
→ 바깥 배열을 새로 만든다

하지만
중첩 객체/배열 내부까지 자동 Deep Copy 되지는 않는다
```

```text
React immutable update
→ 수정 대상까지의 경로를 찾는다
→ 필요한 레벨에서 새 객체/배열을 만든다
→ 기존 state를 직접 mutation하지 않는다
```

**팁**

Day 9의 `map()` + `{ ...order }`는 단순한 문법 암기가 아니라,
**어떤 reference를 새로 만들고 어떤 reference를 그대로 유지할지 결정하는 패턴**이라고 이해하면 이후 React state 업데이트가 훨씬 쉬워진다.
