# 同じ商品を再追加したときに数量をまとめる — Shopping Mall Day 3
# Merging Quantities When the Same Product Is Added Again — Shopping Mall Day 3
# 같은 상품을 다시 담았을 때 수량 합치기 — Shopping Mall Day 3

---

# 日本語

## 1. 今回の目的

Day 3では、商品をカートへ保存できるところまで実装した。

最初の実装では、新しい商品を追加するときに単純に次の処理を使っていた。

```ts
cart.push(cartItem);
```

この方法は最初の保存確認としては十分だが、同じ商品をもう一度追加した場合に問題が起きる。

例えばすでに次のデータがあるとする。

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

ここで同じ商品1を数量1で再度追加すると、単純な `push()` では、

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 1,
    quantity: 1,
  }
]
```

となる。

しかし今回のDay 3では、同じ商品を別の行として追加するのではなく、

```text
商品1 × 2
+
商品1 × 1
=
商品1 × 3
```

のように数量をまとめる。

最終的に目指す形は、

```ts
[
  {
    productId: 1,
    quantity: 3,
  }
]
```

である。

> **Tip**
> 最初の実装でまず保存を成功させ、その後で重複商品の統合を追加する。最初からすべての条件を同時に処理しようとしない。

---

## 2. なぜ単純な `push()` だけでは不十分なのか

`push()` は配列の最後へ新しい要素を追加する。

例えば、

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

に対して、

```ts
cart.push({
  productId: 1,
  quantity: 1,
});
```

を実行すると、

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 1,
    quantity: 1,
  }
]
```

になる。

`push()` 自体は「同じ商品かどうか」を判断しない。

単純に新しい要素を追加するだけである。

つまり、

```text
push()
→ 配列へ追加する

同じproductIdか確認する
→ push()の責任ではない
```

ということである。

そのため追加前に自分たちで、

```text
すでに同じproductIdがあるか？
```

を確認する必要がある。

> **Tip**
> 配列メソッドが自動的にビジネスルールまで判断してくれると思わないこと。`push()` は追加だけを担当する。

---

## 3. まず既存のカートを読み込む

現在の `handleAddToCart` では、最初に `localStorage` から既存カートを読む。

```ts
const savedCart = localStorage.getItem("cart");
```

結果は、

```text
string | null
```

である。

保存されている場合はJSON文字列なので、

```ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

によってJavaScript配列へ戻す。

```text
localStorage
↓
getItem("cart")
↓
JSON string または null
↓
JSON.parse()
↓
CartItem[]
```

保存データがなければ、

```ts
[]
```

から始める。

> **Tip**
> 重複チェックをする前に、まず `localStorage` の文字列をJavaScript配列へ戻す必要がある。配列になってから `find()` を使う。

---

## 4. 同じ商品が存在するか `find()` で確認する

次のコードを追加する。

```ts
const existingItem = cart.find(
  (item) => item.productId === productId
);
```

これは、

```text
cartの中から
現在追加しようとしているproductIdと
同じproductIdを持つCartItemを探す
```

という意味である。

例えば、

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

で、現在追加しようとしている商品が、

```ts
productId = 1;
```

なら、

```ts
cart.find(
  (item) => item.productId === 1
);
```

となる。

条件が一致するので、

```ts
existingItem = {
  productId: 1,
  quantity: 2,
};
```

が返る。

> **Tip**
> `/cart` ページでは `products.find()` で商品情報を探したが、今回は `cart.find()` で既存のCartItemを探している。同じ `find()` でも検索対象が違う。

---

## 5. `find()` で見つからない場合

例えば現在のカートが、

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

で、追加しようとしている商品が、

```ts
productId = 2;
```

なら、

```ts
cart.find(
  (item) => item.productId === 2
);
```

では一致する要素がない。

その結果、

```ts
existingItem
```

は、

```ts
undefined
```

になる。

つまり、

```text
existingItemあり
→ 同じ商品がすでにある

existingItemなし
→ 初めて追加する商品
```

という分岐ができる。

> **Tip**
> `find()` の結果は `CartItem | undefined` と考える。見つからないケースを前提に条件分岐を作る。

---

## 6. 同じ商品がある場合は数量を足す

同じ商品が見つかった場合、

```ts
if (existingItem) {
  existingItem.quantity += quantity;
}
```

とする。

例えば既存データが、

```ts
existingItem.quantity = 2;
```

で、今回選んだ数量が、

```ts
quantity = 1;
```

なら、

```ts
existingItem.quantity += quantity;
```

は、

```text
2 + 1
↓
3
```

となる。

結果として、

```ts
{
  productId: 1,
  quantity: 3,
}
```

になる。

> **Tip**
> `quantity` は今ユーザーが商品詳細で選んだ数量、`existingItem.quantity` はすでにカートに入っている数量である。2つを区別する。

---

## 7. `+=` の意味

次のコード、

```ts
existingItem.quantity += quantity;
```

は、

```ts
existingItem.quantity =
  existingItem.quantity + quantity;
```

と同じ意味である。

例えば、

```text
existingItem.quantity = 2
quantity = 3
```

なら、

```text
existingItem.quantity
= 2 + 3
= 5
```

になる。

> **Tip**
> `+=` を特殊なカート用文法だと思わないこと。現在の値へ新しい値を加えて再代入するJavaScriptの代入演算子である。

---

## 8. 同じ商品がなければ `push()` する

同じ商品がなかった場合は、新しい `CartItem` として追加する。

```ts
else {
  cart.push({
    productId,
    quantity,
  });
}
```

つまり全体の判断は、

```text
同じproductIdがある？
├─ Yes
│  ↓
│  existingItem.quantity += quantity
│
└─ No
   ↓
   cart.push(...)
```

となる。

> **Tip**
> `find → あれば更新 → なければ追加` というパターンで覚える。この考え方は重複データを扱う場面でよく使う。

---

## 9. 完成した `handleAddToCart`

基本形は次のようになる。

```ts
const handleAddToCart = () => {
  const savedCart = localStorage.getItem("cart");

  const cart: CartItem[] = savedCart
    ? JSON.parse(savedCart)
    : [];

  const existingItem = cart.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};
```

処理順序は、

```text
カート追加ボタン
↓
localStorageを読む
↓
JSON.parse()
↓
CartItem[]
↓
同じproductIdをfind()
↓
既存商品あり？
├─ Yes → quantityを足す
└─ No  → push()
↓
JSON.stringify()
↓
localStorageへ保存
```

である。

> **Tip**
> この関数を丸ごと暗記せず、「読む → 探す → 更新または追加 → 保存」の4段階で覚える。

---

## 10. ケース1 — 初めて商品を追加する

現在のカートが、

```ts
[]
```

だとする。

追加する商品は、

```text
productId = 1
quantity = 2
```

である。

`find()` すると、

```ts
undefined
```

になる。

そのため `else` が実行され、

```ts
cart.push({
  productId: 1,
  quantity: 2,
});
```

となる。

結果は、

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

である。

> **Tip**
> 初回追加では「統合」する相手がいないため、通常の `push()` が実行される。

---

## 11. ケース2 — 同じ商品を再度追加する

現在のカートが、

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

だとする。

同じ商品を、

```text
productId = 1
quantity = 3
```

で追加する。

`find()` すると、

```ts
{
  productId: 1,
  quantity: 2,
}
```

が見つかる。

そのため、

```ts
existingItem.quantity += quantity;
```

が実行される。

```text
2 + 3
↓
5
```

結果は、

```ts
[
  {
    productId: 1,
    quantity: 5,
  }
]
```

となる。

同じ商品が2行にはならない。

> **Tip**
> テストでは「同じ商品を2回追加する」操作を必ず行う。通常追加だけでは重複統合ロジックを確認できない。

---

## 12. ケース3 — 別の商品を追加する

現在のカートが、

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

で、次に、

```text
productId = 2
quantity = 1
```

を追加するとする。

`find()` では `productId = 2` のCartItemが見つからない。

そのため、

```ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

となる。

結果は、

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  }
]
```

である。

> **Tip**
> 重複処理を追加しても、別商品まで無理に統合しないこと。判定基準は `productId` が同じかどうかである。

---

## 13. なぜ `existingItem` を変更すると `cart` も変わるのか

`find()` で取得した `existingItem` は、配列の中にあるオブジェクトを参照している。

例えば、

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

で、

```ts
const existingItem = cart.find(
  (item) => item.productId === 1
);
```

とすると、`existingItem` は別のコピーではなく、`cart` 内のそのオブジェクトを参照している。

そのため、

```ts
existingItem.quantity = 5;
```

とすると、

```ts
cart
```

の中身も、

```ts
[
  {
    productId: 1,
    quantity: 5,
  }
]
```

になる。

> **Tip**
> 今のDay 3ではこの仕組みを利用してよい。後でReact stateを直接変更する場面ではイミュータブル更新が重要になるため、同じ考え方を無条件にすべてのstate更新へ適用しない。

---

## 14. 最後に再保存が必要な理由

`cart` 配列をJavaScript上で変更しても、それだけでは `localStorage` の内容は更新されない。

そのため最後に、

```ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

を実行する。

流れは、

```text
cartをJavaScript上で変更
↓
JSON.stringify(cart)
↓
新しいJSON文字列
↓
localStorage.setItem()
↓
保存内容を上書き
```

である。

> **Tip**
> JavaScript配列の変更とブラウザ保存は別の責任である。変更後は必ず再度 `setItem()` する。

---

## 15. 最終まとめ

今回のロジックは次の一文で説明できる。

```text
カートを読み込み、
同じproductIdの商品をfind()で探し、
あれば数量を加算し、
なければ新しいCartItemをpush()し、
最後にlocalStorageへ保存し直す。
```

中心となるパターンは、

```text
find
↓
存在する？
├─ Yes → update
└─ No  → push
↓
save
```

である。

> **Tip**
> 復習するときは `find → update or push → save` の3段階をまず説明する。

---

# English

## 1. Goal of This Step

Earlier in Day 3, the cart used a simple implementation:

```ts
cart.push(cartItem);
```

That was enough to verify that saving worked.

However, if the same product is added again, a plain `push()` creates duplicate rows.

For example:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

plus another:

```ts
{
  productId: 1,
  quantity: 1,
}
```

would become:

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 1,
    quantity: 1,
  }
]
```

Instead, the desired behavior is:

```text
Product 1 × 2
+
Product 1 × 1
=
Product 1 × 3
```

So the final cart should be:

```ts
[
  {
    productId: 1,
    quantity: 3,
  }
]
```

> **Tip**
> First make persistence work, then improve duplicate handling. Separating the first implementation from refinements makes debugging easier.

---

## 2. Why `push()` Alone Is Not Enough

`push()` only adds a new element to an array.

It does not know any business rule such as:

```text
Is this the same product?
Should quantities be merged?
```

For example:

```ts
cart.push({
  productId: 1,
  quantity: 1,
});
```

simply appends another item.

Therefore, before pushing, we need to check whether an item with the same `productId` already exists.

> **Tip**
> Array methods perform their defined operation only. Application rules such as duplicate merging must be implemented explicitly.

---

## 3. Read the Existing Cart First

The handler starts by retrieving the stored cart:

```ts
const savedCart = localStorage.getItem("cart");
```

The result is:

```text
string | null
```

Then we restore the JavaScript array:

```ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

The data flow is:

```text
localStorage
↓
getItem()
↓
JSON string or null
↓
JSON.parse()
↓
CartItem[]
```

> **Tip**
> Duplicate detection happens on the JavaScript array, so restore the stored string before calling `find()`.

---

## 4. Find an Existing Item with the Same Product ID

We use:

```ts
const existingItem = cart.find(
  (item) => item.productId === productId
);
```

This means:

```text
Search the cart for a CartItem
whose productId matches
the product currently being added.
```

For:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

and:

```ts
productId = 1;
```

`find()` returns:

```ts
{
  productId: 1,
  quantity: 2,
}
```

> **Tip**
> Earlier, `products.find()` looked for product details. Here, `cart.find()` searches for an existing cart entry. The method is the same; the array being searched is different.

---

## 5. When No Matching Item Exists

If the cart contains:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

and the new product is:

```ts
productId = 2;
```

then:

```ts
cart.find(
  (item) => item.productId === 2
);
```

returns:

```ts
undefined
```

So we can interpret:

```text
existingItem exists
→ duplicate product found

existingItem is undefined
→ new product
```

> **Tip**
> Always remember that `find()` can return `undefined`.

---

## 6. Merge Quantity When the Product Already Exists

If the item exists:

```ts
if (existingItem) {
  existingItem.quantity += quantity;
}
```

For example:

```text
existingItem.quantity = 2
quantity = 1
```

becomes:

```text
2 + 1
↓
3
```

The resulting item is:

```ts
{
  productId: 1,
  quantity: 3,
}
```

> **Tip**
> `quantity` is the amount currently selected on the product-detail page. `existingItem.quantity` is the amount already stored in the cart.

---

## 7. What `+=` Means

This:

```ts
existingItem.quantity += quantity;
```

is equivalent to:

```ts
existingItem.quantity =
  existingItem.quantity + quantity;
```

So:

```text
2 + 3
↓
5
```

updates the stored quantity to 5.

> **Tip**
> `+=` is a standard JavaScript assignment operator, not cart-specific syntax.

---

## 8. Add a New Item When No Duplicate Exists

If no matching item exists:

```ts
else {
  cart.push({
    productId,
    quantity,
  });
}
```

So the complete branching rule is:

```text
Same productId already in cart?
├─ Yes → increase existing quantity
└─ No  → push a new CartItem
```

> **Tip**
> Remember the reusable pattern: `find → update if found → add if missing`.

---

## 9. Complete `handleAddToCart`

```ts
const handleAddToCart = () => {
  const savedCart = localStorage.getItem("cart");

  const cart: CartItem[] = savedCart
    ? JSON.parse(savedCart)
    : [];

  const existingItem = cart.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};
```

The full flow is:

```text
click Add to Cart
↓
read localStorage
↓
JSON.parse()
↓
CartItem[]
↓
find matching productId
↓
duplicate exists?
├─ Yes → merge quantity
└─ No  → push new item
↓
JSON.stringify()
↓
save back to localStorage
```

> **Tip**
> Read this function as four stages: read → find → update/add → save.

---

## 10. Case 1 — First Time Adding a Product

Starting cart:

```ts
[]
```

New selection:

```text
productId = 1
quantity = 2
```

`find()` returns:

```ts
undefined
```

So we push:

```ts
cart.push({
  productId: 1,
  quantity: 2,
});
```

Result:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

> **Tip**
> The first addition has nothing to merge with, so the normal `push()` path is used.

---

## 11. Case 2 — Adding the Same Product Again

Current cart:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

New selection:

```text
productId = 1
quantity = 3
```

`find()` returns the existing item.

Then:

```ts
existingItem.quantity += quantity;
```

becomes:

```text
2 + 3
↓
5
```

Final cart:

```ts
[
  {
    productId: 1,
    quantity: 5,
  }
]
```

> **Tip**
> Test duplicate handling by adding the exact same product twice with different quantities.

---

## 12. Case 3 — Adding a Different Product

Current cart:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

New selection:

```text
productId = 2
quantity = 1
```

No matching `productId` exists, so:

```ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

Result:

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  }
]
```

> **Tip**
> Only items with the same `productId` should be merged.

---

## 13. Why Updating `existingItem` Also Changes `cart`

`find()` returns a reference to the object inside the array, not an independent cloned copy.

For example:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

Then:

```ts
const existingItem = cart.find(
  (item) => item.productId === 1
);
```

`existingItem` refers to that same object in `cart`.

Therefore:

```ts
existingItem.quantity = 5;
```

also means the object inside `cart` now has quantity 5.

```ts
[
  {
    productId: 1,
    quantity: 5,
  }
]
```

> **Tip**
> This is fine for the current Day 3 local variable flow. Do not automatically apply direct mutation to React state objects; immutable updates matter when managing React state.

---

## 14. Why We Must Save Again

Changing the JavaScript array does not automatically update `localStorage`.

We must explicitly persist the new array:

```ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

The flow is:

```text
modify JavaScript cart
↓
JSON.stringify()
↓
new string
↓
localStorage.setItem()
↓
overwrite stored cart
```

> **Tip**
> In-memory data and persisted browser data are separate. Updating one does not automatically update the other.

---

## 15. Final Summary

The logic can be described in one sentence:

```text
Read the cart,
find an item with the same productId,
increase its quantity if it exists,
otherwise push a new CartItem,
then save the updated cart back to localStorage.
```

The core pattern is:

```text
find
↓
exists?
├─ Yes → update
└─ No  → push
↓
save
```

> **Tip**
> For review, remember the short sequence: `find → update or push → save`.

---

# 한국어

## 1. 이번 단계의 목적

Day 3에서 처음에는 장바구니 저장이 되는지만 확인하기 위해 단순하게:

```ts
cart.push(cartItem);
```

을 사용했다.

이 방식은 최초 구현으로는 충분하지만 같은 상품을 다시 담았을 때 중복 항목이 생긴다.

예를 들어 기존 장바구니가:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

인데 같은 1번 상품을 수량 1로 다시 담으면 단순 `push()`에서는:

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 1,
    quantity: 1,
  }
]
```

처럼 두 줄로 생긴다.

하지만 이번 Day 3에서는:

```text
상품 1 × 2
+
상품 1 × 1
=
상품 1 × 3
```

처럼 같은 상품의 수량을 합치도록 개선한다.

최종적으로 원하는 데이터는:

```ts
[
  {
    productId: 1,
    quantity: 3,
  }
]
```

이다.

> **팁**
> 처음부터 중복 처리까지 한꺼번에 구현하지 않고 `일단 저장 성공 → 그다음 중복 수량 합치기` 순서로 개선하면 디버깅이 훨씬 쉽다.

---

## 2. 왜 `push()`만으로는 부족한가

`push()`의 역할은 배열 끝에 새로운 요소 하나를 추가하는 것이다.

예를 들어:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

에서:

```ts
cart.push({
  productId: 1,
  quantity: 1,
});
```

하면 결과는:

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 1,
    quantity: 1,
  }
]
```

이 된다.

`push()`는:

```text
이게 같은 상품인가?
수량을 합쳐야 하나?
```

같은 비즈니스 규칙까지 판단하지 않는다.

즉:

```text
push()
→ 배열에 새 요소 추가

같은 상품인지 판단
→ 우리가 따로 구현해야 하는 로직
```

이다.

> **팁**
> 배열 메서드가 서비스 규칙까지 자동으로 처리해준다고 생각하지 않는다. `push()`는 오직 `추가`만 담당한다.

---

## 3. 기존 장바구니를 먼저 읽는다

중복 상품을 확인하려면 먼저 기존 cart를 가져와야 한다.

```ts
const savedCart = localStorage.getItem("cart");
```

결과는:

```text
string | null
```

이다.

저장된 값이 있다면 JSON 문자열이므로:

```ts
const cart: CartItem[] = savedCart
  ? JSON.parse(savedCart)
  : [];
```

로 JavaScript 배열로 복원한다.

전체 흐름은:

```text
localStorage
↓
getItem("cart")
↓
JSON string 또는 null
↓
JSON.parse()
↓
CartItem[]
```

저장 데이터가 없으면:

```ts
[]
```

로 시작한다.

> **팁**
> 중복 확인은 JavaScript 배열에서 하므로 `find()`를 사용하기 전에 먼저 JSON 문자열을 배열로 복원해야 한다.

---

## 4. 같은 상품이 이미 있는지 `find()`로 찾는다

다음 코드를 사용한다.

```ts
const existingItem = cart.find(
  (item) => item.productId === productId
);
```

말로 풀면:

```text
cart 안에서
현재 추가하려는 productId와
같은 productId를 가진 CartItem을 찾아라
```

라는 뜻이다.

예를 들어 기존 cart가:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

이고 지금 담으려는 상품이:

```ts
productId = 1;
```

이면:

```ts
cart.find(
  (item) => item.productId === 1
);
```

가 된다.

조건이 맞기 때문에 결과는:

```ts
existingItem = {
  productId: 1,
  quantity: 2,
};
```

가 된다.

> **팁**
> `/cart` 페이지에서는 `products.find()`로 실제 상품을 찾았고, 여기서는 `cart.find()`로 기존 CartItem을 찾는다. `find()`는 같지만 검색 대상 배열이 다르다.

---

## 5. 같은 상품이 없으면 `undefined`

예를 들어 현재 cart가:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

이고 새로 담는 상품이:

```ts
productId = 2;
```

라면:

```ts
cart.find(
  (item) => item.productId === 2
);
```

에서 일치하는 항목이 없다.

따라서:

```ts
existingItem
```

은:

```ts
undefined
```

가 된다.

그래서:

```text
existingItem 있음
→ 같은 상품이 이미 장바구니에 있음

existingItem 없음
→ 처음 담는 상품
```

처럼 판단할 수 있다.

> **팁**
> `find()`는 항상 값을 찾는 것이 아니다. 결과를 `CartItem | undefined`처럼 생각하고 조건 분기를 만든다.

---

## 6. 같은 상품이 있으면 수량을 더한다

같은 상품이 있다면:

```ts
if (existingItem) {
  existingItem.quantity += quantity;
}
```

를 사용한다.

예를 들어 기존 장바구니 수량이:

```ts
existingItem.quantity = 2;
```

이고 현재 상세 페이지에서 선택한 수량이:

```ts
quantity = 1;
```

이라면:

```ts
existingItem.quantity += quantity;
```

결과는:

```text
2 + 1
↓
3
```

이 된다.

즉:

```ts
{
  productId: 1,
  quantity: 3,
}
```

로 바뀐다.

> **팁**
> `existingItem.quantity`는 이미 저장돼 있던 수량이고, `quantity`는 지금 사용자가 상품 상세에서 새로 선택한 수량이다. 두 값의 출처를 구분한다.

---

## 7. `+=`는 무슨 뜻인가

다음 코드:

```ts
existingItem.quantity += quantity;
```

는 사실:

```ts
existingItem.quantity =
  existingItem.quantity + quantity;
```

와 같은 뜻이다.

예를 들어:

```text
existingItem.quantity = 2
quantity = 3
```

이면:

```text
existingItem.quantity
= 2 + 3
= 5
```

가 된다.

> **팁**
> `+=`는 장바구니 전용 문법이 아니라 현재 값에 새로운 값을 더한 뒤 다시 대입하는 JavaScript 연산자다.

---

## 8. 같은 상품이 없으면 새로 `push()`

같은 상품이 없다면:

```ts
else {
  cart.push({
    productId,
    quantity,
  });
}
```

를 실행한다.

전체 판단은:

```text
같은 productId가 있는가?
├─ Yes
│  ↓
│  기존 quantity + 새 quantity
│
└─ No
   ↓
   새로운 CartItem push
```

이다.

> **팁**
> 이 로직은 `find → 있으면 수정 → 없으면 추가` 패턴으로 기억하면 된다.

---

## 9. 완성된 `handleAddToCart`

기본 코드는:

```ts
const handleAddToCart = () => {
  const savedCart = localStorage.getItem("cart");

  const cart: CartItem[] = savedCart
    ? JSON.parse(savedCart)
    : [];

  const existingItem = cart.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};
```

이다.

전체 흐름은:

```text
장바구니 담기 클릭
↓
localStorage 읽기
↓
JSON.parse()
↓
CartItem[]
↓
같은 productId 찾기
↓
이미 있는가?
├─ Yes → quantity 합치기
└─ No  → push()
↓
JSON.stringify()
↓
localStorage 다시 저장
```

이다.

> **팁**
> 함수 전체를 외우기보다 `읽기 → 찾기 → 수정 또는 추가 → 저장` 네 단계로 기억한다.

---

## 10. 경우 1 — 처음 담는 상품

현재 cart가:

```ts
[]
```

라고 하자.

새로 담는 값은:

```text
productId = 1
quantity = 2
```

이다.

`find()` 결과는:

```ts
undefined
```

이다.

그래서 `else`로 가서:

```ts
cart.push({
  productId: 1,
  quantity: 2,
});
```

가 실행된다.

결과:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

> **팁**
> 처음 담는 상품은 합칠 대상이 없으므로 기존 방식처럼 `push()`한다.

---

## 11. 경우 2 — 같은 상품을 다시 담기

현재 cart:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

새로 선택한 값:

```text
productId = 1
quantity = 3
```

`find()` 결과:

```ts
{
  productId: 1,
  quantity: 2,
}
```

가 나온다.

그래서:

```ts
existingItem.quantity += quantity;
```

가 실행된다.

```text
2 + 3
↓
5
```

결과는:

```ts
[
  {
    productId: 1,
    quantity: 5,
  }
]
```

이다.

같은 상품이 두 줄로 생기지 않는다.

> **팁**
> 테스트할 때 반드시 동일한 상품을 다른 수량으로 두 번 담아서 실제로 합쳐지는지 확인한다.

---

## 12. 경우 3 — 다른 상품을 담기

현재 cart:

```ts
[
  {
    productId: 1,
    quantity: 2,
  }
]
```

새 상품:

```text
productId = 2
quantity = 1
```

`productId = 2`인 기존 CartItem이 없기 때문에:

```ts
cart.push({
  productId: 2,
  quantity: 1,
});
```

가 실행된다.

결과:

```ts
[
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 1,
  }
]
```

이다.

> **팁**
> 같은 상품만 합치고 다른 상품은 새로운 항목으로 유지한다. 판단 기준은 `productId`다.

---

## 13. 왜 `existingItem`을 바꾸면 `cart`도 바뀌는가

이 부분은 JavaScript 객체 참조와 연결된다.

예를 들어:

```ts
const cart = [
  {
    productId: 1,
    quantity: 2,
  }
];
```

에서:

```ts
const existingItem = cart.find(
  (item) => item.productId === 1
);
```

를 실행하면 `existingItem`은 새로운 복사본이 아니라 `cart` 배열 안에 있는 해당 객체를 참조한다.

그래서:

```ts
existingItem.quantity = 5;
```

를 하면 `cart` 내부 객체도:

```ts
[
  {
    productId: 1,
    quantity: 5,
  }
]
```

가 된다.

> **팁**
> 현재 Day 3에서는 일반 지역 변수인 `cart`를 다루기 때문에 이 방식으로 진행해도 된다. 하지만 React state 객체를 직접 수정하는 것은 별개의 문제이며, 나중에는 불변 업데이트 방식도 배우게 된다.

---

## 14. 왜 마지막에 다시 저장해야 하는가

JavaScript 안의 `cart` 배열을 수정했다고 해서 `localStorage`가 자동으로 바뀌는 것은 아니다.

따라서 마지막에:

```ts
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

를 다시 실행해야 한다.

흐름은:

```text
JavaScript cart 수정
↓
JSON.stringify(cart)
↓
새 JSON 문자열
↓
localStorage.setItem()
↓
저장 데이터 덮어쓰기
```

이다.

> **팁**
> 메모리 속 JavaScript 데이터와 브라우저 저장소의 데이터는 서로 별개다. 하나를 바꿨다고 다른 쪽이 자동으로 바뀌지 않는다.

---

## 15. 최종 요약

이번 로직을 한 문장으로 설명하면:

```text
기존 장바구니를 읽고,
같은 productId의 CartItem을 find()로 찾고,
있으면 기존 수량에 새 수량을 더하고,
없으면 새로운 CartItem을 push()한 뒤,
변경된 cart를 다시 localStorage에 저장한다.
```

핵심 패턴은:

```text
find
↓
존재?
├─ Yes → update
└─ No  → push
↓
save
```

이다.

Day 3 전체 흐름과 연결하면:

```text
상품 상세
↓
quantity 선택
↓
장바구니 담기
↓
기존 cart 읽기
↓
같은 productId 확인
↓
수량 합치기 또는 새 항목 추가
↓
localStorage 저장
↓
/cart
↓
상품 + 최종 quantity 출력
```

이 된다.

> **팁**
> 복습할 때 `find → update or push → save`를 먼저 떠올린 뒤 코드 한 줄씩 연결하면 이해하기 쉽다.
