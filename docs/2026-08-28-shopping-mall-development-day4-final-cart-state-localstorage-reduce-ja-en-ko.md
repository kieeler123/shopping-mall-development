# Day 4 Final --- Cart State Management, localStorage Sync, and Total Price

# 日本語

## 1. Day 4 の目標

Day 4 では、Day 3 で作ったカート機能を発展させて、次の機能を完成させる。

``` text
カート表示
↓
数量を増やす / 減らす
↓
商品を削除
↓
localStorage と同期
↓
ページ更新後も状態を維持
↓
合計金額を計算
↓
UI に表示
```

今回の中心となる配列メソッドは次の4つである。

  メソッド     主な役割
  ------------ -------------------------------
  `find()`     1件のデータを探す
  `map()`      配列の各要素を更新する
  `filter()`   条件に合う要素だけ残す
  `reduce()`   複数の値を1つの結果にまとめる

> **Tip**
>
> Day 4
> では文法を暗記するより、「どの操作にどの配列メソッドを使うか」を結びつけることが重要。

------------------------------------------------------------------------

## 2. cart state

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

`cart` は現在の React state である。

``` text
cart
→ 現在画面が使っているカート情報

setCart()
→ cart を更新するための関数
```

> **Tip**
>
> `cart` は現在値、`setCart` は次の値に変更するための入口と考える。

------------------------------------------------------------------------

## 3. `setCart((prev) => ...)` を使う理由

数量変更や削除は、現在の cart を基準に次の cart を作る。

そのため：

``` tsx
setCart((prev) => {
  // prev を使って次の cart を作る
});
```

という functional update が自然である。

`prev` は React が渡す直前の state である。

``` tsx
setCart((previousCart) => {
  // `prev` という名前でなくてもよい
});
```

> **Tip**
>
> 次の state が前の state に依存する場合は functional update
> を使う、と覚える。

------------------------------------------------------------------------

## 4. 数量を増やす --- `map()`

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    ),
  );
};
```

`map()` はすべての item を確認する。

対象商品なら新しいオブジェクトを作り、数量を変更する。

対象外ならそのまま返す。

``` text
商品1 → 対象外 → そのまま
商品2 → 対象 → quantity + 1
商品3 → 対象外 → そのまま
```

> **Tip**
>
> `map()`
> は「配列の長さを基本的に変えず、中身を更新したいとき」に向いている。

------------------------------------------------------------------------

## 5. `Math.min()` で最大数量を制限する

``` tsx
Math.min(10, item.quantity + 1)
```

これは2つの値のうち小さい方を返す。

``` text
quantity = 8
Math.min(10, 9)
→ 9

quantity = 10
Math.min(10, 11)
→ 10
```

つまり最大数量を10に制限できる。

> **Tip**
>
> `Math.min()` は上限を守るために使う、と覚える。

------------------------------------------------------------------------

## 6. 数量を減らす --- `map()`

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    ),
  );
};
```

対象商品の quantity だけを減らす。

> **Tip**
>
> 増加と減少はどちらも「既存 item の一部を変更する」ので `map()`
> を使う。

------------------------------------------------------------------------

## 7. `Math.max()` で最小数量を制限する

``` tsx
Math.max(1, item.quantity - 1)
```

これは2つの値のうち大きい方を返す。

``` text
quantity = 3
Math.max(1, 2)
→ 2

quantity = 1
Math.max(1, 0)
→ 1
```

つまり数量が1未満にならない。

> **Tip**
>
> `Math.max()` は下限、`Math.min()` は上限を守ると考えると覚えやすい。

------------------------------------------------------------------------

## 8. 商品削除 --- `filter()`

``` tsx
const handleRemove = (productId: number) => {
  setCart((prev) =>
    prev.filter(
      (item) => item.productId !== productId,
    ),
  );
};
```

`filter()` は条件が `true` の item を残す。

商品 2 を削除する場合：

``` text
1 !== 2 → true  → 残す
2 !== 2 → false → 削除
3 !== 2 → true  → 残す
```

> **Tip**
>
> 削除するときは「削除する item を探す」のではなく、「残したい item
> の条件を書く」と考える。

------------------------------------------------------------------------

## 9. 商品情報を探す --- `find()`

cart には `productId` と `quantity` があり、商品名や価格は `products`
にある場合：

``` tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

で商品情報を取得する。

``` text
item.productId
↓
products.find()
↓
一致する product
↓
name / salePrice を使える
```

> **Tip**
>
> `find()` は複数ではなく、最初に見つかった1件を取得するメソッド。

------------------------------------------------------------------------

## 10. `cart` と `updatedCart` の違い

例えば更新処理の中で：

``` tsx
const updatedCart = prev.filter(
  (item) => item.productId !== productId,
);
```

とすると：

``` text
cart
→ 現在のレンダーが持っている state

prev
→ updater が受け取った直前の state

updatedCart
→ 今回の変更を反映した新しい cart
```

という違いがある。

> **Tip**
>
> 「変更前」「更新元」「変更後」を分けて考えると state
> 更新が理解しやすい。

------------------------------------------------------------------------

## 11. localStorage と JSON

localStorage は文字列として保存する。

保存時：

``` tsx
JSON.stringify(cart)
```

``` text
JavaScript 配列
↓
JSON.stringify()
↓
文字列
↓
localStorage
```

読み込み時：

``` tsx
JSON.parse(savedCart)
```

``` text
localStorage
↓
文字列
↓
JSON.parse()
↓
JavaScript 配列
```

> **Tip**
>
> `stringify` = 文字列化、`parse` = JavaScript データに戻す。

------------------------------------------------------------------------

## 12. 初期データを localStorage から読み込む

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);
```

最初は：

``` text
cart = []
isLoaded = false
```

その後、effect で localStorage を読み込み、React state に復元する。

> **Tip**
>
> 最初の effect は `LOAD effect` と考える。

------------------------------------------------------------------------

## 13. cart を localStorage に自動保存する

``` tsx
useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

これにより handler 内で毎回：

``` tsx
localStorage.setItem(...)
```

を書く必要がなくなる。

``` text
setCart()
↓
cart が変わる
↓
再レンダー
↓
SAVE effect
↓
localStorage 更新
```

> **Tip**
>
> 2つ目の effect は `SAVE effect` と考える。

------------------------------------------------------------------------

## 14. なぜ `isLoaded` が必要なのか

最初の state は：

``` tsx
cart = []
```

である。

もし単純に：

``` tsx
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

だけを書くと、最初の mount 後に空配列が localStorage
に保存され、既存データを上書きする可能性がある。

そのため：

``` tsx
if (!isLoaded) {
  return;
}
```

で、初期復元が終わるまで保存しない。

> **Tip**
>
> 順序は「先に LOAD、その後 SAVE」。

------------------------------------------------------------------------

## 15. 合計金額 --- `reduce()`

``` tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId,
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

役割：

``` text
cart の item を1件ずつ確認
↓
product を find()
↓
salePrice × quantity
↓
現在の total に加える
↓
最後に1つの totalPrice を作る
```

> **Tip**
>
> `reduce()` は複数要素から最終結果1つを作るメソッド。

------------------------------------------------------------------------

## 16. `total` と最後の `0`

``` tsx
cart.reduce((total, item) => {
  // ...
}, 0);
```

最後の `0` は `total` の初期値である。

``` text
初期 total = 0
↓
1件目を加算
↓
2件目を加算
↓
3件目を加算
↓
最終 totalPrice
```

> **Tip**
>
> 合計処理では初期値として `0` を使うことが多い。

------------------------------------------------------------------------

## 17. 商品ごとの金額を合計する

``` tsx
return total + product.salePrice * item.quantity;
```

例：

``` text
商品1
10,000 × 2 = 20,000

商品2
20,000 × 3 = 60,000

合計
20,000 + 60,000 = 80,000
```

> **Tip**
>
> `product.salePrice * item.quantity` は商品単位の小計、`total`
> はそれまでの合計。

------------------------------------------------------------------------

## 18. 合計金額を UI に表示

``` tsx
<p>
  合計: {totalPrice.toLocaleString()}円
</p>
```

韓国ウォン表示の場合は：

``` tsx
<p>
  총액: {totalPrice.toLocaleString()}원
</p>
```

> **Tip**
>
> `toLocaleString()` を使うと `80000` を `80,000`
> のように読みやすく表示できる。

------------------------------------------------------------------------

## 19. totalPrice を state にしなくてよい理由

次のような state は不要である。

``` tsx
const [totalPrice, setTotalPrice] = useState(0);
```

totalPrice は `cart` から計算できるからである。

``` tsx
const totalPrice = cart.reduce(...);
```

このような値は derived value（派生値）と考えられる。

> **Tip**
>
> 既存 state から毎回計算できる値は、まず「別 state
> にする必要があるか？」を考える。

------------------------------------------------------------------------

## 20. Day 4 の完成データフロー

``` text
ページ開始
↓
localStorage
↓
LOAD useEffect
↓
React cart state
↓
ユーザー操作
├─ map()    → 数量変更
├─ filter() → 削除
└─ reduce() → 合計計算
↓
setCart()
↓
cart 更新
↓
UI 再レンダー
↓
SAVE useEffect
↓
localStorage 更新
```

> **Tip**
>
> Day 4
> は「配列メソッド」「state」「永続化」「UI」が1つの流れとしてつながったことが最も重要。

------------------------------------------------------------------------

## 21. Day 4 完了チェック

-   [x] 数量増加
-   [x] 数量減少
-   [x] 最小数量制限
-   [x] 最大数量制限
-   [x] 商品削除
-   [x] localStorage 初期復元
-   [x] cart と localStorage の自動同期
-   [x] ページ更新後も状態維持
-   [x] `find()` 使用
-   [x] `map()` 使用
-   [x] `filter()` 使用
-   [x] `reduce()` 使用
-   [x] 合計金額計算
-   [x] 合計 UI 表示

> **Tip**
>
> ここまで動作確認できれば Day 4 は完了としてよい。

------------------------------------------------------------------------

# English

## 1. Day 4 Goals

Day 4 extends the cart built on Day 3.

``` text
Render cart
↓
Increase / decrease quantity
↓
Remove products
↓
Synchronize with localStorage
↓
Persist after refresh
↓
Calculate total price
↓
Render total in UI
```

The four key array methods are:

  Method       Main Role
  ------------ ----------------------------------------
  `find()`     Find one matching item
  `map()`      Update elements
  `filter()`   Keep matching elements / remove others
  `reduce()`   Combine many values into one result

> **Tip**
>
> Focus on matching each user action to the right array method instead
> of memorizing syntax alone.

------------------------------------------------------------------------

## 2. Cart State

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

`cart` is the current React state.

``` text
cart
→ current cart data

setCart()
→ function used to update the cart
```

> **Tip**
>
> Think of `cart` as the current value and `setCart` as the entry point
> for changing it.

------------------------------------------------------------------------

## 3. Why Use `setCart((prev) => ...)`

Cart updates depend on the previous cart.

``` tsx
setCart((prev) => {
  // calculate next cart from prev
});
```

`prev` is the previous state value provided by React.

> **Tip**
>
> Use a functional state update when the next value depends on the
> previous one.

------------------------------------------------------------------------

## 4. Increase Quantity with `map()`

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    ),
  );
};
```

`map()` examines every item.

It creates a new object for the target item and leaves the others
unchanged.

> **Tip**
>
> Use `map()` when the array structure stays the same but some values
> need to be updated.

------------------------------------------------------------------------

## 5. Maximum Quantity with `Math.min()`

``` tsx
Math.min(10, item.quantity + 1)
```

This returns the smaller value.

``` text
8 → 9
10 → 10
```

> **Tip**
>
> Use `Math.min()` to enforce an upper bound.

------------------------------------------------------------------------

## 6. Decrease Quantity with `map()`

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    ),
  );
};
```

> **Tip**
>
> Increase and decrease both modify an existing item, so both naturally
> use `map()`.

------------------------------------------------------------------------

## 7. Minimum Quantity with `Math.max()`

``` tsx
Math.max(1, item.quantity - 1)
```

This prevents quantity from going below 1.

> **Tip**
>
> `Math.max()` protects a lower bound, while `Math.min()` protects an
> upper bound.

------------------------------------------------------------------------

## 8. Remove an Item with `filter()`

``` tsx
const handleRemove = (productId: number) => {
  setCart((prev) =>
    prev.filter(
      (item) => item.productId !== productId,
    ),
  );
};
```

`filter()` keeps elements whose condition is `true`.

> **Tip**
>
> When deleting, think in terms of "which items should remain?"

------------------------------------------------------------------------

## 9. Find Product Information with `find()`

``` tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

This connects cart data with the actual product data.

> **Tip**
>
> `find()` returns the first matching element, not an array.

------------------------------------------------------------------------

## 10. `cart` vs `updatedCart`

``` text
cart
→ current state from the current render

prev
→ previous state passed to the updater

updatedCart
→ newly calculated cart
```

> **Tip**
>
> Distinguish the old value, the updater input, and the newly calculated
> value.

------------------------------------------------------------------------

## 11. localStorage and JSON

localStorage stores strings.

Saving:

``` tsx
JSON.stringify(cart)
```

Restoring:

``` tsx
JSON.parse(savedCart)
```

> **Tip**
>
> `stringify` converts JavaScript data into a string, while `parse`
> converts the string back into JavaScript data.

------------------------------------------------------------------------

## 12. Initial Restoration from localStorage

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);
```

> **Tip**
>
> Think of this first effect as the `LOAD effect`.

------------------------------------------------------------------------

## 13. Automatically Save cart

``` tsx
useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

Now handlers do not need to call localStorage directly.

> **Tip**
>
> Think of this second effect as the `SAVE effect`.

------------------------------------------------------------------------

## 14. Why `isLoaded` Is Needed

The initial cart is:

``` tsx
[]
```

A save effect also runs after the first mount.

Without a guard, the empty initial array could overwrite previously
persisted cart data.

``` tsx
if (!isLoaded) {
  return;
}
```

prevents this.

> **Tip**
>
> The important order is: LOAD first, SAVE after restoration.

------------------------------------------------------------------------

## 15. Calculate Total with `reduce()`

``` tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId,
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

> **Tip**
>
> `reduce()` combines many cart items into one final result.

------------------------------------------------------------------------

## 16. `total` and the Final `0`

``` tsx
cart.reduce((total, item) => {
  // ...
}, 0);
```

The final `0` is the initial value of `total`.

> **Tip**
>
> Summation logic commonly starts with `0`.

------------------------------------------------------------------------

## 17. Product Subtotal and Running Total

``` tsx
return total + product.salePrice * item.quantity;
```

``` text
product subtotal
= salePrice × quantity

new total
= previous total + product subtotal
```

> **Tip**
>
> Separate "subtotal for this item" from "total accumulated so far".

------------------------------------------------------------------------

## 18. Show Total in the UI

``` tsx
<p>
  총액: {totalPrice.toLocaleString()}원
</p>
```

> **Tip**
>
> `toLocaleString()` makes large numbers easier to read.

------------------------------------------------------------------------

## 19. Why `totalPrice` Does Not Need Its Own State

Avoid unnecessary state like:

``` tsx
const [totalPrice, setTotalPrice] = useState(0);
```

Because total price can be calculated from `cart`.

``` tsx
const totalPrice = cart.reduce(...);
```

This is a derived value.

> **Tip**
>
> If a value can be calculated directly from existing state, consider
> computing it instead of creating another state variable.

------------------------------------------------------------------------

## 20. Complete Day 4 Data Flow

``` text
page starts
↓
localStorage
↓
LOAD useEffect
↓
React cart state
↓
user action
├─ map()    → quantity update
├─ filter() → removal
└─ reduce() → total calculation
↓
setCart()
↓
cart changes
↓
UI re-renders
↓
SAVE useEffect
↓
localStorage updated
```

> **Tip**
>
> The biggest Day 4 lesson is seeing array methods, React state,
> persistence, and UI as one connected data flow.

------------------------------------------------------------------------

## 21. Day 4 Completion Checklist

-   [x] Increase quantity
-   [x] Decrease quantity
-   [x] Minimum quantity
-   [x] Maximum quantity
-   [x] Remove item
-   [x] Restore from localStorage
-   [x] Synchronize cart and localStorage
-   [x] Persist after refresh
-   [x] Use `find()`
-   [x] Use `map()`
-   [x] Use `filter()`
-   [x] Use `reduce()`
-   [x] Calculate total price
-   [x] Render total in UI

> **Tip**
>
> If these behaviors all work in the browser, Day 4 can be considered
> complete.

------------------------------------------------------------------------

# 한국어

## 1. Day 4 목표

Day 4에서는 Day 3에서 만든 장바구니를 실제 장바구니답게 발전시킨다.

``` text
장바구니 표시
↓
수량 증가 / 감소
↓
상품 삭제
↓
localStorage 동기화
↓
새로고침 후 상태 유지
↓
총액 계산
↓
UI에 표시
```

이번 Day에서 중심이 된 배열 메서드는 네 가지다.

  메서드       핵심 역할
  ------------ -----------------------------------
  `find()`     조건에 맞는 하나 찾기
  `map()`      배열의 요소를 수정하기
  `filter()`   조건에 맞는 요소만 남기기
  `reduce()`   여러 값을 최종 결과 하나로 만들기

> **팁**
>
> 문법 자체보다 `수정 = map`, `삭제 = filter`, `하나 찾기 = find`,
> `합계 = reduce`처럼 기능과 메서드를 연결해서 기억하자.

------------------------------------------------------------------------

## 2. cart state

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
```

여기서:

``` text
cart
→ 현재 React가 가지고 있는 장바구니 state

setCart()
→ cart를 새로운 값으로 변경하는 함수
```

다.

> **팁**
>
> `cart`는 현재 상태, `setCart`는 다음 상태를 만드는 통로라고 생각하면
> 좋다.

------------------------------------------------------------------------

## 3. `setCart((prev) => ...)`를 사용하는 이유

수량 증가, 감소, 삭제는 모두 현재 장바구니를 기준으로 다음 장바구니를
만든다.

그래서:

``` tsx
setCart((prev) => {
  // prev를 이용해 새로운 cart 만들기
});
```

처럼 함수형 업데이트를 사용한다.

`prev`는 React가 전달해주는 직전 state다.

이름은 예약어가 아니므로:

``` tsx
setCart((previousCart) => {
  // ...
});
```

라고 해도 된다.

> **팁**
>
> 다음 state가 이전 state를 기준으로 계산된다면
> `setState((prev) => ...)` 패턴을 떠올리자.

------------------------------------------------------------------------

## 4. 수량 증가 --- `map()`

``` tsx
const handleIncrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(10, item.quantity + 1),
          }
        : item,
    ),
  );
};
```

`map()`은 cart의 모든 item을 확인한다.

``` text
대상 상품
→ 새로운 객체 생성
→ quantity 변경

대상이 아닌 상품
→ 기존 item 그대로 반환
```

> **팁**
>
> 배열의 개수는 유지하면서 특정 요소의 내용을 바꾸고 싶다면 `map()`을
> 떠올리자.

------------------------------------------------------------------------

## 5. `Math.min()`으로 최대 수량 제한

``` tsx
Math.min(10, item.quantity + 1)
```

두 값 중 작은 값을 반환한다.

``` text
quantity = 8
Math.min(10, 9)
→ 9

quantity = 10
Math.min(10, 11)
→ 10
```

따라서 최대 수량을 10으로 제한할 수 있다.

> **팁**
>
> `Math.min()`은 상한선을 보호한다고 기억하면 쉽다.

------------------------------------------------------------------------

## 6. 수량 감소 --- `map()`

``` tsx
const handleDecrease = (productId: number) => {
  setCart((prev) =>
    prev.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    ),
  );
};
```

증가와 마찬가지로 기존 item의 일부를 수정하는 것이므로 `map()`을
사용한다.

> **팁**
>
> 증가와 감소의 공통점은
> `상품을 없애는 게 아니라 기존 상품의 quantity를 수정한다`는 점이다.

------------------------------------------------------------------------

## 7. `Math.max()`로 최소 수량 제한

``` tsx
Math.max(1, item.quantity - 1)
```

두 값 중 큰 값을 반환한다.

``` text
quantity = 3
Math.max(1, 2)
→ 2

quantity = 1
Math.max(1, 0)
→ 1
```

따라서 수량이 1 아래로 내려가지 않는다.

> **팁**
>
> `Math.max()`는 하한선, `Math.min()`은 상한선을 보호한다고 연결해서
> 기억하자.

------------------------------------------------------------------------

## 8. 상품 삭제 --- `filter()`

``` tsx
const handleRemove = (productId: number) => {
  setCart((prev) =>
    prev.filter(
      (item) => item.productId !== productId,
    ),
  );
};
```

`filter()`는 조건이 `true`인 요소만 남긴다.

2번 상품 삭제:

``` text
1 !== 2 → true  → 남김
2 !== 2 → false → 제거
3 !== 2 → true  → 남김
```

> **팁**
>
> 삭제할 때는 `무엇을 지울까?`보다 `무엇을 남길까?`라는 관점으로
> `filter()` 조건을 생각하면 편하다.

------------------------------------------------------------------------

## 9. 상품 정보 찾기 --- `find()`

cart에는 보통:

``` tsx
{
  productId: 1,
  quantity: 2,
}
```

처럼 상품 ID와 수량만 있다.

가격이나 상품명은 `products`에 있으므로:

``` tsx
const product = products.find(
  (product) => product.id === item.productId,
);
```

로 실제 상품을 찾는다.

> **팁**
>
> `find()`는 조건에 맞는 첫 번째 요소 하나를 반환한다.

------------------------------------------------------------------------

## 10. `cart`, `prev`, `updatedCart` 차이

``` text
cart
→ 현재 렌더가 가지고 있는 state

prev
→ setCart updater가 전달받은 직전 state

updatedCart
→ 이번 변경을 적용해서 새로 계산한 cart
```

예:

``` tsx
const updatedCart = prev.filter(
  (item) => item.productId !== productId,
);
```

> **팁**
>
> 변경 전 데이터와 변경 후 데이터를 구분하는 습관이 React state를
> 이해하는 데 매우 중요하다.

------------------------------------------------------------------------

## 11. localStorage와 JSON

localStorage는 문자열을 저장한다.

저장:

``` tsx
JSON.stringify(cart)
```

``` text
JavaScript 배열
↓
JSON.stringify()
↓
JSON 문자열
↓
localStorage
```

복원:

``` tsx
JSON.parse(savedCart)
```

``` text
localStorage 문자열
↓
JSON.parse()
↓
JavaScript 배열
```

> **팁**
>
> `stringify`는 저장하기 위한 문자열 변환, `parse`는 다시 사용할 수 있는
> JavaScript 데이터로 복원이라고 기억하자.

------------------------------------------------------------------------

## 12. localStorage에서 최초 cart 불러오기

``` tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const parsedCart: CartItem[] = JSON.parse(savedCart);

    setCart(parsedCart);
  }

  setIsLoaded(true);
}, []);
```

처음에는:

``` text
cart = []
isLoaded = false
```

로 시작한다.

그리고 브라우저에서 effect가 실행되면서 localStorage 데이터를 state로
복원한다.

> **팁**
>
> 첫 번째 `useEffect`는 `LOAD effect`라고 생각하면 이해하기 쉽다.

------------------------------------------------------------------------

## 13. cart 변경 시 localStorage 자동 저장

``` tsx
useEffect(() => {
  if (!isLoaded) {
    return;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart),
  );
}, [cart, isLoaded]);
```

이제:

``` tsx
handleIncrease()
handleDecrease()
handleRemove()
```

안에서 매번 localStorage를 저장할 필요가 없다.

``` text
setCart()
↓
cart 변경
↓
컴포넌트 재렌더링
↓
SAVE effect 실행
↓
localStorage 갱신
```

> **팁**
>
> 두 번째 `useEffect`는 `SAVE effect`라고 이름 붙여서 생각하자.

------------------------------------------------------------------------

## 14. `isLoaded`가 필요한 이유

초기 state는:

``` tsx
cart = []
```

이다.

그런데:

``` tsx
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

만 사용하면 최초 mount 후에도 effect가 실행되므로 기존 localStorage를 빈
배열로 덮어쓸 수 있다.

그래서:

``` tsx
if (!isLoaded) {
  return;
}
```

으로 초기 복원이 끝날 때까지 저장을 차단한다.

> **팁**
>
> 핵심 순서는 `LOAD 먼저 → SAVE 허용`이다.

------------------------------------------------------------------------

## 15. 총액 계산 --- `reduce()`

``` tsx
const totalPrice = cart.reduce((total, item) => {
  const product = products.find(
    (product) => product.id === item.productId,
  );

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

전체 흐름:

``` text
cart의 item 하나
↓
productId로 실제 product 찾기
↓
salePrice × quantity
↓
기존 total에 더하기
↓
모든 item 반복
↓
최종 totalPrice
```

> **팁**
>
> `reduce()`는 여러 개의 cart item을 최종 금액 하나로 줄이는 역할이다.

------------------------------------------------------------------------

## 16. `total`과 마지막 `0`

``` tsx
cart.reduce((total, item) => {
  // ...
}, 0);
```

마지막 `0`은 `total`의 시작값이다.

``` text
total = 0
↓
첫 상품 금액 추가
↓
다음 상품 금액 추가
↓
...
↓
최종 총액
```

> **팁**
>
> 숫자를 모두 더하는 reduce는 대부분 `0`에서 시작한다고 생각하면 된다.

------------------------------------------------------------------------

## 17. 상품별 소계와 전체 합계

``` tsx
return total + product.salePrice * item.quantity;
```

예:

``` text
상품 1
10,000 × 2
= 20,000

상품 2
20,000 × 3
= 60,000

최종 합계
20,000 + 60,000
= 80,000
```

> **팁**
>
> `salePrice × quantity`는 현재 상품의 소계이고, `total`은 이전
> 상품까지의 누적 합계다.

------------------------------------------------------------------------

## 18. 총액 UI 출력

``` tsx
<p>
  총액: {totalPrice.toLocaleString()}원
</p>
```

예:

``` text
80000
↓
80,000원
```

> **팁**
>
> `toLocaleString()`은 금액처럼 큰 숫자를 사람이 읽기 쉽게 표시할 때
> 자주 사용한다.

------------------------------------------------------------------------

## 19. totalPrice를 별도 state로 만들지 않는 이유

다음처럼 만들 필요는 없다.

``` tsx
const [totalPrice, setTotalPrice] = useState(0);
```

왜냐하면 totalPrice는 이미 `cart`로 계산할 수 있기 때문이다.

``` tsx
const totalPrice = cart.reduce(...);
```

이를 기존 state에서 계산되는 **파생 값(derived value)**이라고 볼 수
있다.

> **팁**
>
> 다른 state만 있으면 계산 가능한 값이라면 새 state를 추가하기 전에
> `그냥 계산할 수 없는가?`를 먼저 생각하자.

------------------------------------------------------------------------

## 20. Day 4 전체 데이터 흐름

``` text
페이지 시작
↓
localStorage
↓
LOAD useEffect
↓
React cart state
↓
사용자 조작
├─ find()   → 상품 정보 검색
├─ map()    → 수량 변경
├─ filter() → 상품 삭제
└─ reduce() → 총액 계산
↓
setCart()
↓
cart 변경
↓
UI 재렌더링
↓
SAVE useEffect
↓
localStorage 갱신
```

> **팁**
>
> Day 4의 핵심은 각각의 문법을 따로 사용한 것이 아니라
> `배열 메서드 → state 변경 → UI → 저장`이 하나의 데이터 흐름으로
> 연결됐다는 점이다.

------------------------------------------------------------------------

## 21. Day 4 완료 체크리스트

-   [x] 장바구니 상품 표시
-   [x] 수량 증가
-   [x] 수량 감소
-   [x] 최소 수량 1 제한
-   [x] 최대 수량 제한
-   [x] 상품 삭제
-   [x] `find()` 사용
-   [x] `map()` 사용
-   [x] `filter()` 사용
-   [x] `reduce()` 사용
-   [x] localStorage에서 초기 cart 복원
-   [x] cart 변경 시 localStorage 자동 저장
-   [x] 새로고침 후 상태 유지
-   [x] 총액 계산
-   [x] 총액 UI 출력

> **팁**
>
> 이 항목들을 실제 브라우저에서 모두 확인했다면 Day 4는 완료로 봐도
> 된다.

------------------------------------------------------------------------

## 22. Day 4 핵심 한 줄 요약

``` text
find()   → 하나 찾기
map()    → 수정
filter() → 삭제
reduce() → 하나의 결과 만들기

React state
→ UI의 기준 데이터

localStorage
→ 새로고침 이후를 위한 저장 공간

useEffect
→ state와 외부 저장소를 연결하는 동기화 역할
```

> **팁**
>
> Day 5로 넘어가기 전에 이 흐름을 코드 없이 말로 설명할 수 있다면 Day 4
> 학습 내용이 제대로 정리된 것이다.
