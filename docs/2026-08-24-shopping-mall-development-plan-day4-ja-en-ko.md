# ショッピングモール開発計画 — Day 4
# Shopping Mall Development Plan — Day 4
# 쇼핑몰 개발 계획 — Day 4

---

# 日本語

## 1. Day 4の目標

Day 3では、商品詳細ページから商品をカートへ追加し、`localStorage`へ保存し、`/cart`ページで確認できるところまで実装した。

さらに、同じ商品を再度追加した場合は別の行として追加せず、既存の数量へ加算する処理まで完成した。

Day 4ではそのカートを基盤にして、ユーザーがカート内の商品を直接操作できるようにする。

```text
/cart
↓
商品の確認
↓
数量を増減
↓
localStorage更新
↓
商品削除
↓
合計金額計算
↓
更新後も状態を維持
```

Day 3が「商品をカートへ入れる日」なら、Day 4は「カートの中身を変更する日」である。

> **Tip**
> Day 4では新しい保存方式を増やすのではなく、すでに存在する `cart state` を変更し、その変更を `localStorage` と同期することに集中する。

---

## 2. Day 3からDay 4への接続

これまでの流れは次のようになる。

```text
Day 1
プロジェクトの土台

↓
Day 2
商品一覧・商品詳細

↓
Day 3
数量選択
カート追加
localStorage保存
/cart表示
重複商品の数量統合

↓
Day 4
カート内数量変更
商品削除
合計金額
```

Day 4ではDay 3で作った次の状態をそのまま利用する。

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

> **Tip**
> Dayごとに別のコードを書くのではなく、前のDayで作ったデータ構造とユーザーフローをそのまま発展させる。

---

## 3. 最初の機能 — カート内数量変更

現在の `/cart` ページでは数量を表示するだけである。

```tsx
<p>数量: {item.quantity}</p>
```

Day 4ではこれを操作可能なUIへ変える。

```text
[-] 2 [+]
```

ユーザーが `+` を押せば数量を増やし、`-` を押せば数量を減らす。

必要な処理は次のようになる。

```text
どの商品を変更するか
↓
productIdで対象を判断
↓
quantityを変更
↓
新しいcartを作る
↓
setCart()
↓
localStorage更新
```

> **Tip**
> Day 3で使った `productId` をそのまま変更対象を特定するキーとして再利用する。

---

## 4. 数量増加用の関数

最初に数量を増やす関数を考える。

```ts
const handleIncrease = (productId: number) => {
  // 対象商品のquantityを+1
};
```

この関数は、

```text
productIdを受け取る
↓
cartからその商品を見つける
↓
quantityを1増やす
```

という責任だけを持つ。

> **Tip**
> 1つの関数に増加・減少・削除を全部入れず、それぞれの操作を分けると理解しやすくなる。

---

## 5. `map()`で特定の商品だけ変更する

Day 4では `map()` を「表示の繰り返し」だけでなく、配列更新にも使う。

基本形は次のようになる。

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item
);
```

このコードは、

```text
cartを1件ずつ確認
↓
productIdが一致する？
├─ Yes → quantityを+1した新しいオブジェクト
└─ No  → 元のitemをそのまま返す
↓
新しい配列updatedCart
```

という処理である。

> **Tip**
> `map()` は「すべてを変更する」のではなく、「配列全体を1回確認し、必要な要素だけ変更した新しい配列を作る」と理解する。

---

## 6. スプレッド構文 `...item`

次の部分が登場する。

```ts
{
  ...item,
  quantity: item.quantity + 1
}
```

`...item` は既存の `item` のプロパティを新しいオブジェクトへ展開する。

例えば、

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

なら、

```ts
{
  ...item,
  quantity: 3,
}
```

によって、

```ts
{
  productId: 1,
  quantity: 3,
}
```

という新しいオブジェクトが作られる。

> **Tip**
> `...item` を「コピー」とだけ覚えず、「既存情報を引き継ぎつつ、必要な値だけ上書きする」ために使うと理解する。

---

## 7. なぜ新しい配列を作るのか

Day 3では、

```ts
existingItem.quantity += quantity;
```

のように既存オブジェクトを直接変更した。

Day 4ではReact stateを更新するため、できるだけ新しい配列・新しいオブジェクトを作る考え方を学ぶ。

```text
既存cartを直接変更
ではなく

cart
↓
map()
↓
updatedCart
↓
setCart(updatedCart)
```

という流れにする。

> **Tip**
> React stateでは「同じものを直接変更する」より、「変更結果として新しい値を作って `setState` に渡す」考え方を身につける。

---

## 8. `setCart()`でReact stateを更新する

新しい配列を作ったら、

```ts
setCart(updatedCart);
```

を実行する。

これによって、

```text
以前のcart
↓
updatedCart
↓
setCart(updatedCart)
↓
React state更新
↓
再レンダリング
```

となる。

数量表示も新しい値へ変わる。

> **Tip**
> `updatedCart` を作るだけでは画面は変わらない。React stateへ反映する `setCart()` が必要である。

---

## 9. `localStorage`も同時に更新する

React stateを変更しても `localStorage` は自動では変わらない。

そのため、

```ts
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);
```

を実行する。

全体は、

```text
updatedCartを作る
↓
setCart(updatedCart)
↓
JSON.stringify(updatedCart)
↓
localStorage.setItem()
```

となる。

> **Tip**
> `setCart()` と `localStorage.setItem()` で同じ `updatedCart` を使うと、画面の状態と保存状態をそろえやすい。

---

## 10. 数量減少

減少も基本的には同じ考え方である。

```ts
const handleDecrease = (productId: number) => {
  // quantityを-1
};
```

ただし数量が0以下にならないようにルールを決める必要がある。

Day 4の基本ルールとしては、

```text
最小数量 = 1
```

にする。

例えば、

```ts
Math.max(1, item.quantity - 1)
```

を使う方法がある。

> **Tip**
> 最初は「1から減らしたら削除」にせず、削除は別ボタンとして分離した方が責任が明確になる。

---

## 11. 商品削除

各商品に削除ボタンを追加する。

```text
[削除]
```

削除の考え方は、

```text
削除したいproductId
↓
そのproductId以外を残す
```

である。

ここで `filter()` を使う。

```ts
const updatedCart = cart.filter(
  (item) => item.productId !== productId
);
```

> **Tip**
> `filter()` は「消す」より「条件を満たすものだけ残す」と考えると理解しやすい。

---

## 12. `filter()`の動き

例えば、

```ts
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
  { productId: 3, quantity: 4 },
];
```

から `productId = 2` を削除したい場合、

```ts
cart.filter(
  (item) => item.productId !== 2
);
```

となる。

結果は、

```ts
[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 4 },
]
```

になる。

> **Tip**
> `!==` になっている点に注意する。「削除したいIDと同じものを探す」のではなく、「それ以外だけ残す」条件である。

---

## 13. 削除後もstateと保存を同期する

削除後も数量変更と同じように、

```ts
setCart(updatedCart);

localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);
```

を実行する。

```text
filter()
↓
updatedCart
↓
setCart()
↓
localStorage更新
↓
画面再レンダリング
```

> **Tip**
> Day 4では「状態変更後は必ずstateとlocalStorageの両方を確認する」習慣をつける。

---

## 14. 合計金額を計算する

数量変更と削除ができたら、次にカート全体の合計金額を計算する。

例えば、

```text
商品A
19,900円 × 2

商品B
29,900円 × 1
```

なら、

```text
39,800
+
29,900
=
69,700円
```

となる。

合計計算では `reduce()` を利用する。

---

## 15. `reduce()`の基本的な考え方

基本形は次のようになる。

```ts
const totalPrice = cart.reduce(
  (total, item) => {
    // totalへ金額を足していく
  },
  0
);
```

`reduce()` は複数の要素から1つの結果を作るために使う。

今回なら、

```text
複数のCartItem
↓
各商品の金額を計算
↓
全部足す
↓
1つのtotalPrice
```

となる。

> **Tip**
> `reduce()` を難しい配列メソッドとして覚えず、「たくさんの値を1つにまとめる」と理解する。

---

## 16. 商品価格と数量を組み合わせる

`CartItem` には価格がないので、Day 3と同じように `productId` から商品を探す。

```ts
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

処理は、

```text
CartItem
↓
productId
↓
products.find()
↓
salePrice取得
↓
salePrice × quantity
↓
totalへ加算
```

となる。

> **Tip**
> Day 3で学んだ `productId → products.find()` の流れが、Day 4では表示だけでなく計算にも再利用される。

---

## 17. `reduce()`の流れを例で見る

例えば、

```ts
cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];
```

で、

```text
商品1 salePrice = 19900
商品2 salePrice = 29900
```

なら、

```text
初期total = 0

1件目
0 + (19900 × 2)
= 39800

2件目
39800 + (29900 × 1)
= 69700

最終totalPrice
= 69700
```

となる。

> **Tip**
> `reduce()` が分かりにくいときは、各ループで `total` がどう変わるか紙に書く。

---

## 18. Empty Stateとの接続

すべての商品を削除すると、

```ts
cart = [];
```

になる。

その場合、Day 3で作った、

```tsx
if (cart.length === 0) {
  return (
    <main>
      <h1>カート</h1>
      <p>カートは空です。</p>
    </main>
  );
}
```

のEmpty Stateが再び表示される。

> **Tip**
> 新機能を追加したときは既存機能が自然に再利用されるか確認する。削除機能とEmpty Stateはつながっている。

---

## 19. Day 4で学ぶ配列メソッド

Day 4では次の4つが中心になる。

| メソッド | 役割 |
|---|---|
| `find()` | 1つの商品を探す |
| `map()` | 特定の要素を変更した新しい配列を作る |
| `filter()` | 不要な要素を除いた新しい配列を作る |
| `reduce()` | 複数の値から1つの合計値を作る |

機能と対応させると、

```text
find
→ 商品検索

map
→ 数量変更

filter
→ 商品削除

reduce
→ 合計金額
```

となる。

> **Tip**
> メソッド名だけを暗記せず、「探す・変更・削除・集計」という実際の機能と対応させる。

---

## 20. Day 4の実装順序

推奨する順序は次の通り。

```text
1. /cartに数量の[-][+]ボタンを追加
↓
2. handleIncreaseを作る
↓
3. map()でquantity変更
↓
4. setCart()でstate更新
↓
5. localStorage更新
↓
6. handleDecreaseを作る
↓
7. 最小数量1を守る
↓
8. 削除ボタン追加
↓
9. filter()で削除
↓
10. 合計金額をreduce()で計算
↓
11. Empty State確認
↓
12. 更新後の永続化テスト
```

> **Tip**
> 1つの処理が動くことを確認してから次へ進む。特に `map`、`filter`、`reduce` を同時に書かない。

---

## 21. Day 4の完了条件

次のユーザーフローが成功すればDay 4完了とする。

```text
/cart
↓
商品1 数量2
↓
+クリック
↓
数量3
↓
ページ更新
↓
数量3を維持
↓
-クリック
↓
数量2
↓
商品削除
↓
一覧から消える
↓
合計金額が自動更新
↓
すべて削除
↓
Empty State表示
```

> **Tip**
> 正常操作だけでなく、「更新後」「削除後」「全商品削除後」の状態を確認する。

---

## 22. Day 4の中心テーマ

Day 4の中心は次の1文でまとめられる。

```text
Reactのcart stateをユーザー操作で変更し、
その変更をlocalStorageと同期する。
```

技術的な流れは、

```text
ユーザー操作
↓
map / filter
↓
updatedCart
↓
setCart()
↓
localStorage.setItem()
↓
再レンダリング
↓
reduce()で合計計算
```

となる。

> **Tip**
> Day 3が「保存された状態を作る・読む」なら、Day 4は「状態を変更し、その変更を保存する」と比較して理解する。

---

# English

## 1. Day 4 Goal

Day 3 completed the flow from product detail to cart persistence and cart-page rendering.

It also improved duplicate handling so that adding the same product again merges its quantity instead of creating a duplicate row.

Day 4 builds on that cart and makes it directly editable by the user.

```text
/cart
↓
view items
↓
increase/decrease quantity
↓
update localStorage
↓
remove items
↓
calculate total
↓
persist changes after refresh
```

If Day 3 was about adding products to the cart, Day 4 is about modifying the cart itself.

> **Tip**
> Day 4 is not mainly about a new persistence mechanism. It is about changing existing `cart` state and keeping `localStorage` synchronized with those changes.

---

## 2. Connecting Day 3 to Day 4

The project progression is:

```text
Day 1
Project foundation

↓
Day 2
Product list and detail

↓
Day 3
Quantity selection
Add to cart
localStorage persistence
/cart rendering
Duplicate quantity merging

↓
Day 4
Cart quantity editing
Item removal
Total price
```

Day 4 continues using:

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

> **Tip**
> Treat Day 4 as an extension of the same data model rather than a separate feature built from scratch.

---

## 3. First Feature — Change Quantity in the Cart

Currently, quantity may only be displayed:

```tsx
<p>Quantity: {item.quantity}</p>
```

Day 4 turns it into an interactive control:

```text
[-] 2 [+]
```

The data flow becomes:

```text
Which item should change?
↓
identify it with productId
↓
change quantity
↓
create a new cart
↓
setCart()
↓
update localStorage
```

> **Tip**
> Reuse `productId` as the key that identifies which `CartItem` should be updated.

---

## 4. Quantity Increase Handler

A simple handler shape is:

```ts
const handleIncrease = (productId: number) => {
  // increase matching quantity by 1
};
```

Its responsibility is narrow:

```text
receive productId
↓
locate matching cart item
↓
increase quantity by 1
```

> **Tip**
> Keep increase, decrease, and removal as separate actions while learning the data flow.

---

## 5. Use `map()` to Update One Item

Day 4 uses `map()` not only for rendering but also for immutable array updates.

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item
);
```

Conceptually:

```text
inspect every cart item
↓
same productId?
├─ Yes → return a new object with quantity + 1
└─ No  → return the original item
↓
new updatedCart array
```

> **Tip**
> Think of `map()` as creating a new array where only the targeted item changes.

---

## 6. Spread Syntax `...item`

This expression appears:

```ts
{
  ...item,
  quantity: item.quantity + 1
}
```

If:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

then the result becomes:

```ts
{
  productId: 1,
  quantity: 3,
}
```

The existing fields are preserved while `quantity` is overwritten.

> **Tip**
> Use spread syntax when you want to preserve the rest of an object and replace only specific fields.

---

## 7. Why Create a New Array?

Day 3 sometimes directly mutated an object:

```ts
existingItem.quantity += quantity;
```

Day 4 is a good place to learn React-friendly immutable updates.

```text
cart
↓
map()
↓
updatedCart
↓
setCart(updatedCart)
```

Instead of directly changing the existing state value, we create a new result.

> **Tip**
> For React state, build a new value and pass it into the setter rather than mutating existing state directly.

---

## 8. Update React State

After creating:

```ts
const updatedCart = ...
```

call:

```ts
setCart(updatedCart);
```

The flow is:

```text
old cart
↓
updatedCart
↓
setCart(updatedCart)
↓
React state update
↓
re-render
```

> **Tip**
> Creating `updatedCart` alone does not update the UI. The new array must be given to `setCart()`.

---

## 9. Update `localStorage` Too

Updating React state does not automatically update browser storage.

Therefore:

```ts
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);
```

The preferred flow is:

```text
create updatedCart
↓
setCart(updatedCart)
↓
JSON.stringify(updatedCart)
↓
localStorage.setItem()
```

> **Tip**
> Use the exact same `updatedCart` value for both state and persistence to reduce synchronization mistakes.

---

## 10. Decrease Quantity

The decrease handler follows the same pattern:

```ts
const handleDecrease = (productId: number) => {
  // decrease matching quantity
};
```

For Day 4, keep the minimum quantity at 1.

A possible rule is:

```ts
Math.max(1, item.quantity - 1)
```

> **Tip**
> Keep deletion separate from decrementing at first. One action should have one clear responsibility.

---

## 11. Remove an Item

Add a button such as:

```text
[Remove]
```

The idea is:

```text
productId to remove
↓
keep every item except that productId
```

Use `filter()`:

```ts
const updatedCart = cart.filter(
  (item) => item.productId !== productId
);
```

> **Tip**
> Think of `filter()` as selecting what remains rather than directly deleting an element.

---

## 12. How `filter()` Works

Given:

```ts
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
  { productId: 3, quantity: 4 },
];
```

To remove product 2:

```ts
cart.filter(
  (item) => item.productId !== 2
);
```

Result:

```ts
[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 4 },
]
```

> **Tip**
> Notice the `!==` condition: we keep items whose ID is not the one being removed.

---

## 13. Synchronize After Removal

After filtering:

```ts
setCart(updatedCart);

localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);
```

The flow is:

```text
filter()
↓
updatedCart
↓
setCart()
↓
localStorage update
↓
re-render
```

> **Tip**
> After every cart mutation, verify both the React state and the persisted storage.

---

## 14. Calculate the Total Price

After quantity editing and removal work, calculate the cart total.

For example:

```text
Product A
19,900 × 2

Product B
29,900 × 1
```

gives:

```text
39,800
+
29,900
=
69,700
```

This is a good use case for `reduce()`.

---

## 15. Basic `reduce()` Concept

A basic shape is:

```ts
const totalPrice = cart.reduce(
  (total, item) => {
    // accumulate price into total
  },
  0
);
```

`reduce()` turns multiple items into one result.

```text
many CartItems
↓
calculate each line amount
↓
add them together
↓
one totalPrice
```

> **Tip**
> Think of `reduce()` as accumulating many values into one final value.

---

## 16. Combine Product Price and Quantity

Because `CartItem` does not store the price, use the same product lookup from Day 3:

```ts
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

The flow is:

```text
CartItem
↓
productId
↓
products.find()
↓
salePrice
↓
salePrice × quantity
↓
add to total
```

> **Tip**
> Day 3's `productId → products.find()` pattern is reused for calculations, not just rendering.

---

## 17. Example of `reduce()`

Given:

```ts
cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];
```

and:

```text
Product 1 salePrice = 19900
Product 2 salePrice = 29900
```

the accumulation is:

```text
initial total = 0

first item
0 + (19900 × 2)
= 39800

second item
39800 + (29900 × 1)
= 69700

final totalPrice
= 69700
```

> **Tip**
> If `reduce()` feels abstract, manually write how `total` changes after each item.

---

## 18. Connect Back to the Empty State

When every item is removed:

```ts
cart = [];
```

the Empty State from Day 3 should appear again.

```tsx
if (cart.length === 0) {
  return (
    <main>
      <h1>Cart</h1>
      <p>Your cart is empty.</p>
    </main>
  );
}
```

> **Tip**
> New features should naturally connect to existing behavior. Removal should lead back into the Empty State without needing a separate system.

---

## 19. Core Array Methods for Day 4

| Method | Responsibility |
|---|---|
| `find()` | Find one matching product |
| `map()` | Create an updated array |
| `filter()` | Create an array without a removed item |
| `reduce()` | Produce one total value |

Mapped to cart features:

```text
find
→ product lookup

map
→ quantity update

filter
→ item removal

reduce
→ total price
```

> **Tip**
> Connect each array method to an actual user action instead of memorizing syntax in isolation.

---

## 20. Recommended Day 4 Implementation Order

```text
1. Add [-][+] controls to /cart
↓
2. Create handleIncrease
↓
3. Update quantity with map()
↓
4. Update state with setCart()
↓
5. Persist to localStorage
↓
6. Create handleDecrease
↓
7. Enforce minimum quantity of 1
↓
8. Add remove button
↓
9. Remove with filter()
↓
10. Calculate total with reduce()
↓
11. Re-check Empty State
↓
12. Test persistence after refresh
```

> **Tip**
> Finish and test one operation before moving on to the next.

---

## 21. Day 4 Completion Criteria

Day 4 is complete when this flow works:

```text
/cart
↓
Product 1 quantity 2
↓
click +
↓
quantity 3
↓
refresh
↓
quantity still 3
↓
click -
↓
quantity 2
↓
remove item
↓
item disappears
↓
total updates automatically
↓
remove all items
↓
Empty State appears
```

> **Tip**
> Test immediate state changes, persistence after refresh, and the all-items-removed case.

---

## 22. Central Theme of Day 4

Day 4 can be summarized as:

```text
Modify React cart state through user actions
and synchronize those changes with localStorage.
```

The technical flow is:

```text
user action
↓
map / filter
↓
updatedCart
↓
setCart()
↓
localStorage.setItem()
↓
re-render
↓
reduce() for total
```

> **Tip**
> Compare the days directly: Day 3 creates and restores cart state; Day 4 modifies and re-persists that state.

---

# 한국어

## 1. Day 4 목표

Day 3에서는 상품 상세에서 수량을 선택하고 장바구니에 담은 뒤, `localStorage`에 저장하고 `/cart` 페이지에서 확인하는 흐름을 완성했다.

추가로 같은 상품을 다시 담았을 때 중복 줄을 만드는 대신 기존 수량에 합치는 처리까지 구현했다.

Day 4에서는 그 장바구니를 기반으로 사용자가 **장바구니 안에서 직접 상품 상태를 수정할 수 있게 만드는 것**을 목표로 한다.

```text
/cart
↓
상품 확인
↓
수량 증가/감소
↓
localStorage 업데이트
↓
상품 삭제
↓
총액 계산
↓
새로고침 후에도 변경 상태 유지
```

Day 3가 `상품을 장바구니에 넣는 날`이었다면 Day 4는 `장바구니 안의 데이터를 수정하는 날`이다.

> **팁**
> Day 4에서는 새로운 저장 방식을 추가하기보다 이미 존재하는 `cart state`를 사용자 조작으로 변경하고, 그 변경을 `localStorage`와 동기화하는 데 집중한다.

---

## 2. Day 3에서 Day 4로 연결

전체 흐름을 보면:

```text
Day 1
프로젝트 기반

↓
Day 2
상품 목록 / 상품 상세

↓
Day 3
수량 선택
장바구니 담기
localStorage 저장
/cart 출력
중복 상품 수량 합치기

↓
Day 4
카트 수량 변경
상품 삭제
총액 계산
```

Day 4에서도 기존 `CartItem` 타입을 그대로 사용한다.

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

> **팁**
> Day 4를 새로운 프로젝트처럼 시작하지 않고 Day 3에서 만든 데이터 구조를 그대로 발전시키는 방식으로 진행한다.

---

## 3. 첫 번째 기능 — 장바구니 안에서 수량 변경

현재 `/cart` 페이지에서는:

```tsx
<p>수량: {item.quantity}</p>
```

처럼 수량을 보여주기만 한다.

Day 4에서는 이를:

```text
[-] 2 [+]
```

처럼 직접 조작할 수 있는 UI로 바꾼다.

필요한 흐름은:

```text
어떤 상품을 변경할 것인가?
↓
productId로 대상 식별
↓
quantity 변경
↓
새로운 cart 배열 생성
↓
setCart()
↓
localStorage 업데이트
```

이다.

> **팁**
> Day 3에서 `productId`를 상품 연결 키로 사용했다면, Day 4에서는 `어떤 CartItem을 수정할지` 찾는 키로도 그대로 사용한다.

---

## 4. 수량 증가 함수

예상 형태는:

```ts
const handleIncrease = (productId: number) => {
  // 해당 상품 quantity + 1
};
```

이다.

이 함수는:

```text
productId 받기
↓
해당 CartItem 찾기
↓
quantity 1 증가
```

만 담당하도록 만든다.

> **팁**
> 증가, 감소, 삭제를 한 함수에 전부 넣지 않고 각 동작별 책임을 분리하면 코드 흐름을 이해하기 쉽다.

---

## 5. `map()`으로 특정 항목만 수정

Day 4에서는 `map()`을 화면 반복뿐 아니라 **배열 업데이트**에도 사용한다.

예상 코드는:

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item
);
```

흐름은:

```text
cart 전체를 하나씩 확인
↓
현재 item.productId가 변경 대상인가?
├─ Yes → quantity가 1 증가한 새 객체 반환
└─ No  → 기존 item 그대로 반환
↓
새로운 updatedCart 생성
```

이다.

> **팁**
> `map()`은 모든 항목을 바꾸는 함수가 아니라, 배열 전체를 확인하면서 필요한 항목만 바꾼 새 배열을 만드는 데 사용할 수 있다.

---

## 6. 스프레드 문법 `...item`

다음 부분이 등장한다.

```ts
{
  ...item,
  quantity: item.quantity + 1
}
```

예를 들어:

```ts
item = {
  productId: 1,
  quantity: 2,
};
```

이면:

```ts
{
  ...item,
  quantity: 3,
}
```

결과는:

```ts
{
  productId: 1,
  quantity: 3,
}
```

이다.

기존 `item`의 다른 값은 유지하고 `quantity`만 새로운 값으로 덮어쓴다.

> **팁**
> `...item`을 단순히 `복사`라고만 외우지 말고 `기존 정보는 유지하고 특정 값만 바꾸기 위한 기반`이라고 이해한다.

---

## 7. 왜 새 배열을 만드는가

Day 3에서는 일반 지역 배열에서:

```ts
existingItem.quantity += quantity;
```

처럼 직접 객체를 수정했다.

Day 4에서는 React state를 변경하기 때문에 더 React다운 방식으로:

```text
기존 cart 직접 변경
X

cart
↓
map()
↓
updatedCart
↓
setCart(updatedCart)
```

처럼 새로운 배열을 만드는 방식을 익힌다.

> **팁**
> React state에서는 기존 값을 직접 수정하기보다 `변경 결과로 새로운 값 생성 → setter에 전달` 방식에 익숙해지는 것이 좋다.

---

## 8. `setCart()`로 state 업데이트

새로운 배열을 만든 뒤:

```ts
setCart(updatedCart);
```

를 실행한다.

흐름은:

```text
기존 cart
↓
updatedCart 생성
↓
setCart(updatedCart)
↓
React state 변경
↓
재렌더링
↓
수량 UI 변경
```

이다.

> **팁**
> `updatedCart` 변수만 만들어서는 화면이 바뀌지 않는다. React가 사용하는 state에 반영하려면 반드시 `setCart()`가 필요하다.

---

## 9. `localStorage`도 함께 업데이트

React state만 바뀌면 화면은 바뀌지만 새로고침 시 이전 값으로 돌아갈 수 있다.

그래서:

```ts
localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);
```

도 함께 실행한다.

전체 흐름은:

```text
updatedCart 생성
↓
setCart(updatedCart)
↓
JSON.stringify(updatedCart)
↓
localStorage.setItem()
```

이다.

> **팁**
> `setCart()`와 `localStorage.setItem()`에서 같은 `updatedCart`를 사용하면 화면 상태와 저장 상태가 어긋나는 문제를 줄일 수 있다.

---

## 10. 수량 감소

감소도 증가와 같은 구조다.

```ts
const handleDecrease = (productId: number) => {
  // 해당 상품 quantity - 1
};
```

다만 수량이 0 이하로 내려가지 않도록 규칙이 필요하다.

Day 4 기본 규칙은:

```text
최소 수량 = 1
```

로 두는 것이 좋다.

예를 들어:

```ts
Math.max(1, item.quantity - 1)
```

을 사용할 수 있다.

> **팁**
> 처음에는 `1에서 -를 누르면 삭제`까지 연결하지 말고, 삭제는 별도의 버튼으로 분리하는 편이 책임이 명확하다.

---

## 11. 상품 삭제

각 장바구니 상품에:

```text
[삭제]
```

버튼을 만든다.

삭제할 때는:

```text
삭제할 productId
↓
그 productId가 아닌 항목만 남기기
```

방식으로 처리한다.

여기서 `filter()`를 사용한다.

```ts
const updatedCart = cart.filter(
  (item) => item.productId !== productId
);
```

> **팁**
> `filter()`를 `삭제하는 함수`라고만 외우지 말고 `조건을 만족하는 항목만 남겨 새 배열을 만드는 함수`라고 이해한다.

---

## 12. `filter()` 실제 흐름

예를 들어:

```ts
const cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
  { productId: 3, quantity: 4 },
];
```

에서 2번 상품을 삭제하려면:

```ts
cart.filter(
  (item) => item.productId !== 2
);
```

결과는:

```ts
[
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 4 },
]
```

가 된다.

> **팁**
> 조건이 `===`가 아니라 `!==`인 이유를 이해해야 한다. 삭제 대상과 다른 항목만 남기는 방식이기 때문이다.

---

## 13. 삭제 후에도 state와 저장 동기화

삭제 후에도:

```ts
setCart(updatedCart);

localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);
```

를 실행한다.

흐름은:

```text
filter()
↓
updatedCart
↓
setCart()
↓
localStorage 업데이트
↓
재렌더링
```

이다.

> **팁**
> Day 4에서는 어떤 변경이든 끝난 뒤 `state와 localStorage가 둘 다 같은 값을 가지고 있는가`를 확인하는 습관을 만든다.

---

## 14. 총액 계산

수량 변경과 삭제가 완성되면 장바구니 전체 금액을 계산한다.

예를 들어:

```text
상품 A
19,900원 × 2

상품 B
29,900원 × 1
```

이면:

```text
39,800
+
29,900
=
69,700원
```

이다.

여기서는 `reduce()`를 사용한다.

---

## 15. `reduce()` 기본 개념

기본 형태는:

```ts
const totalPrice = cart.reduce(
  (total, item) => {
    // total에 금액을 누적
  },
  0
);
```

이다.

`reduce()`는 여러 값을 하나의 결과로 합칠 때 사용한다.

이번 경우에는:

```text
여러 CartItem
↓
각 상품의 금액 계산
↓
모두 더함
↓
하나의 totalPrice
```

가 된다.

> **팁**
> `reduce()`를 어렵게 외우지 말고 `여러 값을 하나의 누적 결과로 만든다`고 이해한다.

---

## 16. 상품 가격과 수량을 연결

`CartItem`에는 가격이 없기 때문에 Day 3처럼 `productId`로 상품 정보를 찾는다.

```ts
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

흐름은:

```text
CartItem
↓
productId
↓
products.find()
↓
salePrice 찾기
↓
salePrice × quantity
↓
total에 누적
```

이다.

> **팁**
> Day 3에서 `productId → products.find()`를 UI 출력에 사용했다면 Day 4에서는 금액 계산에도 같은 패턴을 재사용한다.

---

## 17. `reduce()` 예시

예를 들어:

```ts
cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];
```

이고:

```text
1번 상품 salePrice = 19900
2번 상품 salePrice = 29900
```

이라면:

```text
초기 total = 0

첫 번째 항목
0 + (19900 × 2)
= 39800

두 번째 항목
39800 + (29900 × 1)
= 69700

최종 totalPrice
= 69700
```

이 된다.

> **팁**
> `reduce()`가 어렵다면 각 반복마다 `total` 값이 어떻게 바뀌는지 직접 적어본다.

---

## 18. Empty State와 연결

모든 상품을 삭제하면:

```ts
cart = [];
```

이 된다.

그러면 Day 3에서 만든:

```tsx
if (cart.length === 0) {
  return (
    <main>
      <h1>장바구니</h1>
      <p>장바구니가 비어 있습니다.</p>
    </main>
  );
}
```

가 다시 동작한다.

> **팁**
> 새로운 삭제 기능을 만들 때 기존 Empty State가 자연스럽게 다시 사용되는지 확인한다.

---

## 19. Day 4에서 배우는 배열 메서드

Day 4에서는 다음 네 가지가 핵심이다.

| 메서드 | 역할 |
|---|---|
| `find()` | 특정 상품 하나 찾기 |
| `map()` | 특정 항목을 수정한 새 배열 만들기 |
| `filter()` | 특정 항목을 제외한 새 배열 만들기 |
| `reduce()` | 여러 값을 하나의 합계로 만들기 |

기능과 연결하면:

```text
find
→ 상품 찾기

map
→ 수량 변경

filter
→ 상품 삭제

reduce
→ 총액 계산
```

이다.

> **팁**
> 배열 메서드를 문법 목록으로 외우지 말고 `찾기 / 수정 / 삭제 / 합계`라는 실제 기능과 연결한다.

---

## 20. Day 4 구현 순서

추천 순서는:

```text
1. /cart에 [-][+] 버튼 추가
↓
2. handleIncrease 작성
↓
3. map()으로 수량 증가
↓
4. setCart()로 state 변경
↓
5. localStorage 업데이트
↓
6. handleDecrease 작성
↓
7. 최소 수량 1 처리
↓
8. 삭제 버튼 추가
↓
9. filter()로 삭제
↓
10. reduce()로 총액 계산
↓
11. Empty State 다시 확인
↓
12. 새로고침 유지 테스트
```

이다.

> **팁**
> `map`, `filter`, `reduce`를 한꺼번에 작성하지 말고 각 기능을 하나씩 테스트하면서 진행한다.

---

## 21. Day 4 완료 조건

최종적으로 다음 흐름이 모두 성공하면 Day 4를 완료한다.

```text
/cart
↓
상품1 수량2
↓
+ 클릭
↓
수량3
↓
새로고침
↓
수량3 유지
↓
- 클릭
↓
수량2
↓
상품 삭제
↓
목록에서 제거
↓
총액 자동 변경
↓
모든 상품 삭제
↓
Empty State 출력
```

> **팁**
> `변경 직후`, `새로고침 후`, `전부 삭제 후` 세 가지 상태를 반드시 확인한다.

---

## 22. Day 4 핵심 주제

Day 4를 한 문장으로 정리하면:

```text
사용자 조작으로 React의 cart state를 변경하고,
그 변경을 localStorage와 동기화하는 날
```

이다.

기술 흐름으로 보면:

```text
사용자 클릭
↓
map / filter
↓
updatedCart
↓
setCart()
↓
localStorage.setItem()
↓
재렌더링
↓
reduce()로 총액 계산
```

이다.

Day 3와 비교하면:

```text
Day 3
상태를 만들고 저장하고 다시 읽음

Day 4
상태를 수정하고 다시 저장함
```

이라고 이해할 수 있다.

> **팁**
> Day 4의 핵심은 새 문법 개수를 늘리는 것이 아니라, `사용자 조작 → state 변경 → 저장 동기화 → UI 반영`이라는 실제 애플리케이션 상태 관리 흐름을 경험하는 것이다.
