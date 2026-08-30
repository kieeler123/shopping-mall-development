# Shopping Mall Day 3 --- UNIVERSAL GENERAL

# 今日の総まとめ / Today's Review / 오늘 총정리

[📝 問題・Quiz・문제](2026-08-24-shopping-mall-development-day3-QUIZ_JA_EN_KO.md)\
[✅ 正解・Answers・정답 해설](2026-08-24-shopping-mall-development-day3-ANSWER_JA_EN_KO.md)

---

# 日本語

> **Day 3学習境界:** 今日の実学習はDay 3の仕上げ・深化まで。`+ / - / 削除 / 合計` の実装開始からDay 4とする。

## 0. コンテンツ情報

- **コンテンツ種類:** React / Next.js / TypeScript
  ショッピングモール実習
- **分析範囲:** Day 3完了確認 → Day 4予告 →
  `find / map / filter / reduce` 深掘り
- **学習焦点:** 配列メソッド、React state、不変更新、localStorage同期
- **中心データ:** `CartItem = { productId, quantity }`

> **Tip**
>
> 今日の中心はメソッド名の暗記ではなく、「ユーザー操作がどのようにstateと保存データへ伝わるか」を説明できること。

## 1. 文脈・状況

### 一行要約

Day 3で作ったカートを基盤に、Day
4ではカート内の数量変更・削除・合計計算を実装するためのデータ操作方法を学んだ。

### 今日の流れ

```text
Day 3完了確認
↓
Day 4の目標設定
↓
数量変更 → map()
↓
商品削除 → filter()
↓
合計金額 → reduce()
↓
商品情報取得 → find()
↓
setCart() と localStorage の同期
```

> **Tip**
>
> 「探す・修正・削除・集計」という日本語の動作からメソッドを逆引きできるようにする。

## 2. コンテンツ核心構造

項目 内容

---

核心状況 `/cart` を表示専用から操作可能な画面へ発展させる
核心データ `CartItem.productId`, `CartItem.quantity`
数量変更 `map()`
商品削除 `filter()`
商品検索 `find()`
合計計算 `reduce()`
UI更新 `setCart(updatedCart)`
永続化 `localStorage.setItem("cart", JSON.stringify(updatedCart))`

## 3. 核心コード

<a id="jp-expr01"></a>

### expr01 --- `find()`

```ts
const product = products.find((product) => product.id === item.productId);
```

`CartItem.productId` と `Product.id`
を接続し、商品名・価格・画像などの実データを取得する。

<a id="jp-expr02"></a>

### expr02 --- `map()`

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

対象商品の数量だけ変更した**新しい配列**を作る。

<a id="jp-expr03"></a>

### expr03 --- `{ ...item }`

```ts
{ ...item, quantity: item.quantity + 1 }
```

既存のプロパティを維持し、後ろに書いた `quantity`
だけを新しい値で上書きする。

<a id="jp-expr04"></a>

### expr04 --- `filter()`

```ts
const updatedCart = cart.filter((item) => item.productId !== productId);
```

削除対象と異なるIDだけを残し、対象商品がない新しい配列を作る。

<a id="jp-expr05"></a>

### expr05 --- `reduce()`

```ts
const totalPrice = cart.reduce((total, item) => {
  const product = products.find((product) => product.id === item.productId);

  if (!product) return total;

  return total + product.salePrice * item.quantity;
}, 0);
```

複数商品の `価格 × 数量` を1つの `totalPrice` に累積する。

> **Tip**
>
> `find = 1つ探す / map = 修正 / filter = 残すものを選ぶ / reduce = 1つに集約`
> と整理する。

## 4. 詳細分析

### 4-1. `map()` と不変更新

`map()` は元の `cart` を直接変更するのではなく、新しい配列を作る。

```text
cart
↓
各itemを確認
↓
対象？
├─ Yes → 新しいオブジェクト
└─ No  → 元のitem
↓
updatedCart
```

React
stateでは、既存stateを直接変更するより、新しい値を作ってsetterへ渡す考え方が重要になる。

> **Tip**
>
> `map()`
> を見たら「要素数を基本的に維持しながら、新しい配列を作る」と考える。

### 4-2. `filter()` の true / false

```text
条件 true
→ 新しい配列に残る

条件 false
→ 新しい配列から除外される
```

したがって削除処理は、

```ts
item.productId !== productId;
```

という「削除対象ではないものを残す」条件になる。

> **Tip**
>
> `filter()` を「削除関数」と暗記せず、「生存条件を書く関数」と考える。

### 4-3. `reduce()` の accumulator

例:

```text
初期 total = 0
商品1: 19,900 × 2 = 39,800
total = 39,800
商品2: 29,900 × 1 = 29,900
total = 69,700
```

最終的に複数のCartItemから数字1つが得られる。

> **Tip**
>
> `reduce()` が難しい場合、各反復後の `total` を紙に書いて追跡する。

### 4-4. state と localStorage

```ts
setCart(updatedCart);

localStorage.setItem("cart", JSON.stringify(updatedCart));
```

`setCart()` は現在のReact UI状態を更新し、`localStorage`
は更新後もデータを残す。

```text
updatedCart
├─ React state → setCart()
└─ Browser storage → localStorage
```

> **Tip**
>
> 同じ `updatedCart` を両方に使うと、画面と保存内容の不一致を減らせる。

## 5. 表現比較

---

比較 判別基準

---

`find()` ↔ `filter()` 1つ欲しいか、条件に合う複数要素の配列が欲しいか

`map()` ↔ `filter()` 個数を保って内容を変えるか、要素そのものを除外するか

`map()` ↔ `reduce()` 結果が新しい配列か、1つの集約値か

state ↔ localStorage 現在のUI状態か、ブラウザに残す永続データか

---

> **Tip**
>
> 判別質問:
> 「最終結果として欲しいものは、1要素・新しい配列・要素を減らした配列・1つの値のどれか？」

## 6. Day 4予告（次回実装）

```text
1. /cart に [-] [+] を追加
2. handleIncrease
3. map() で quantity + 1
4. setCart()
5. localStorage 更新
6. handleDecrease
7. 最小数量1
8. 削除ボタン
9. filter() で削除
10. reduce() で合計
11. Empty State確認
12. 更新後の永続化テスト
```

## 7. 最終復習 --- 必ず覚える5つ

項目 意味・機能

---

`find()` 条件に一致する1要素
`map()` 修正結果を持つ新しい配列
`{ ...item }` 既存情報を維持して一部上書き
`filter()` trueの要素だけ残す
`reduce()` 複数要素から1つの結果を作る

### 今日の一行まとめ

> **カート操作では、対象を `productId` で識別し、`map/filter`
> で新しいcartを作り、`setCart/localStorage`へ同期し、`reduce`で合計を求める。**

---

# English

> **Day 3 boundary:** Today's work is classified as Day 3 wrap-up/deepening. Day 4 begins when the actual `+ / - / remove / total` implementation starts.

## 0. Content Information

- **Type:** React / Next.js / TypeScript shopping mall practice
- **Scope:** Day 3 completion review → Day 4 preview → deep dive into
  `find / map / filter / reduce`
- **Focus:** array methods, React state, immutable updates,
  localStorage synchronization
- **Core data:** `CartItem = { productId, quantity }`

> **Tip**
>
> The goal is to explain the data flow, not merely memorize method
> names.

## 1. Context

Day 3 established adding products, persisting the cart, rendering
`/cart`, and merging duplicate quantities. Day 4 extends the cart so
users can modify it directly.

```text
Day 3 complete
↓
Day 4 preview
↓
quantity update → map()
↓
removal → filter()
↓
total → reduce()
↓
product lookup → find()
↓
setCart + localStorage synchronization
```

## 2. Core Structure

Need Tool

---

Find one product `find()`
Change quantity `map()`
Remove product `filter()`
Calculate total `reduce()`
Update React UI state `setCart()`
Persist cart `localStorage`

> **Tip**
>
> Associate each method with an operation: find / modify / remove /
> total.

## 3. Core Code

### `find()`

```ts
const product = products.find((product) => product.id === item.productId);
```

It connects `CartItem.productId` with full product data.

### `map()`

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

It creates a new array where only the target item's quantity changes.

### Spread syntax

```ts
{ ...item, quantity: item.quantity + 1 }
```

Existing properties are preserved and `quantity` is overwritten.

### `filter()`

```ts
const updatedCart = cart.filter((item) => item.productId !== productId);
```

It keeps every item except the target.

### `reduce()`

```ts
const totalPrice = cart.reduce((total, item) => {
  const product = products.find((product) => product.id === item.productId);

  if (!product) return total;

  return total + product.salePrice * item.quantity;
}, 0);
```

It accumulates line totals into one final price.

> **Tip**
>
> Always ask what shape of result you need: one item, a new array, a
> reduced array, or one accumulated value.

## 4. State and Persistence

```ts
setCart(updatedCart);

localStorage.setItem("cart", JSON.stringify(updatedCart));
```

`setCart()` changes the current React state. `localStorage` preserves
the value across refreshes.

> **Tip**
>
> Reuse the same `updatedCart` for both operations.

## 5. Key Comparisons

Comparison Decision

---

`find` vs `filter` one matching item vs an array of matching items
`map` vs `filter` modify values vs remove elements
`map` vs `reduce` new array vs one accumulated result
state vs localStorage current UI state vs persisted browser data

## 6. Day 4 Preview (Next Implementation)

```text
+/- controls
→ map quantity
→ setCart
→ localStorage
→ removal with filter
→ total with reduce
→ Empty State
→ refresh persistence test
```

## 7. Final Five

1.  `find()` --- find one matching item.
2.  `map()` --- create an updated array.
3.  `{ ...item }` --- preserve existing properties and overwrite
    selected ones.
4.  `filter()` --- keep elements that pass the condition.
5.  `reduce()` --- accumulate many elements into one result.

### One-line Summary

> **Identify cart items with `productId`, create updated carts with
> `map/filter`, synchronize them through `setCart/localStorage`, and
> calculate totals with `reduce`.**

---

# 한국어

> **Day 3 학습 경계:** 오늘 실제 학습은 Day 3 마무리·심화까지로 분류한다. `+ / - / 삭제 / 총액` 기능을 실제 구현하기 시작하는 시점부터 Day 4로 본다.

## 0. 콘텐츠 정보

- **콘텐츠 유형:** React / Next.js / TypeScript 쇼핑몰 실습
- **학습 범위:** Day 3 완료 점검 → Day 4 예고 →
  `find / map / filter / reduce` 심화
- **학습 초점:** 배열 메서드, React state, 불변 업데이트, localStorage
  동기화
- **핵심 데이터:** `CartItem = { productId, quantity }`

> **팁**
>
> 오늘은 문법을 많이 외운 날이 아니라, 장바구니 데이터가 어떻게 변경되고
> 저장되는지를 연결한 날이다.

## 1. 맥락·상황

Day 3에서
`상품 상세 → 장바구니 추가 → localStorage 저장 → /cart 출력 → 중복 상품 수량 합치기`까지
완료했다.

Day 4에서는 장바구니를 단순 표시 화면에서 사용자가 직접 수정할 수 있는
화면으로 발전시킨다.

```text
Day 3 완료
↓
Day 4 예고
↓
수량 변경 → map()
↓
상품 삭제 → filter()
↓
총액 계산 → reduce()
↓
상품 정보 찾기 → find()
↓
setCart + localStorage 동기화
```

> **팁**
>
> `찾기 / 수정 / 삭제 / 합계`라는 기능을 보고 해당 배열 메서드를
> 떠올리는 연습을 한다.

## 2. 핵심 구조

필요한 작업 사용하는 것

---

상품 하나 찾기 `find()`
수량 수정 `map()`
상품 삭제 `filter()`
총액 계산 `reduce()`
React 화면 상태 갱신 `setCart()`
새로고침 후 유지 `localStorage`

## 3. 핵심 코드 상세

### 3-1. `find()`

```ts
const product = products.find((product) => product.id === item.productId);
```

`CartItem`은 `productId`와 `quantity`만 가지고 있으므로 실제 상품의
이름과 가격 등이 필요할 때 `products`에서 연결되는 상품을 찾는다.

> **팁**
>
> `CartItem.productId ↔ Product.id`가 장바구니 데이터와 상품 데이터의
> 연결 키다.

### 3-2. `map()`

```ts
const updatedCart = cart.map((item) =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }
    : item,
);
```

`cart` 전체를 순회하면서 대상 상품만 새로운 객체로 교체한다.

```text
대상 맞음
→ quantity가 바뀐 새 객체

대상 아님
→ 기존 item
```

결과는 새로운 `updatedCart` 배열이다.

> **팁**
>
> `개수는 그대로인데 특정 항목의 내용만 수정 → map()`이라고 판단한다.

### 3-3. `{ ...item }`

```ts
{
  ...item,
  quantity: item.quantity + 1
}
```

기존 `item`의 속성을 새 객체에 펼친 다음, 뒤에서 작성한 `quantity`로
해당 값을 덮어쓴다.

```text
{ productId: 2, quantity: 1 }
↓
{ ...item, quantity: 2 }
↓
{ productId: 2, quantity: 2 }
```

React state에서는 기존 객체를 직접 수정하기보다 새 객체/배열을 만들어
업데이트하는 방식이 중요하다.

> **팁**
>
> `{ ...기존객체, 바꿀속성: 새값 }`은 React에서 매우 자주 사용하는
> 패턴이다.

### 3-4. `filter()`

```ts
const updatedCart = cart.filter((item) => item.productId !== productId);
```

`filter()`는 콜백 결과가 `true`인 항목만 남긴다.

```text
true → 남음
false → 제외
```

삭제하려는 상품과 `productId`가 다른 항목만 남기기 때문에 결과적으로
대상 상품이 삭제된다.

> **팁**
>
> `filter = 삭제`라고만 외우지 말고 `남길 조건을 작성한다`고 이해한다.

### 3-5. `reduce()`

```ts
const totalPrice = cart.reduce((total, item) => {
  const product = products.find((product) => product.id === item.productId);

  if (!product) {
    return total;
  }

  return total + product.salePrice * item.quantity;
}, 0);
```

여러 CartItem을 하나씩 보면서 `상품가격 × 수량`을 `total`에 누적한다.

```text
total = 0
↓
+ 상품1 금액
↓
+ 상품2 금액
↓
...
↓
totalPrice
```

> **팁**
>
> `reduce()`가 어렵다면 코드보다 먼저 `0 → 39800 → 69700`처럼
> accumulator 값만 추적한다.

## 4. state와 localStorage 동기화

```ts
setCart(updatedCart);

localStorage.setItem("cart", JSON.stringify(updatedCart));
```

둘의 역할은 다르다.

대상 역할

---

`setCart()` 현재 React UI가 사용하는 state 변경
`localStorage` 새로고침 이후에도 남길 브라우저 저장 데이터 변경

> **팁**
>
> 화면이 정상적으로 바뀌었다고 저장까지 성공한 것은 아니다. 반드시
> 새로고침 테스트까지 한다.

## 5. 핵심 비교

비교 판별 질문

---

`find` ↔ `filter` 하나가 필요한가, 배열이 필요한가?
`map` ↔ `filter` 내용을 수정할까, 항목을 제외할까?
`map` ↔ `reduce` 결과가 배열인가, 하나의 값인가?
state ↔ localStorage 현재 UI용인가, 새로고침 후 보존용인가?

> **팁**
>
> 배열 메서드를 선택하기 전에 먼저 `원하는 최종 결과의 형태`를 생각한다.

## 6. Day 4 예고 (다음 구현)

```text
/cart에 [-][+] 추가
↓
handleIncrease
↓
map()으로 quantity + 1
↓
setCart(updatedCart)
↓
localStorage 저장
↓
handleDecrease
↓
최소 수량 1
↓
삭제 버튼
↓
filter()
↓
reduce() 총액
↓
Empty State
↓
새로고침 유지 테스트
```

## 7. 꼭 기억할 5개

핵심 기억할 내용

---

`find()` 조건에 맞는 하나를 찾는다
`map()` 수정 결과를 담은 새 배열을 만든다
`{ ...item }` 기존 정보를 유지하고 일부 속성을 덮어쓴다
`filter()` true인 항목만 새 배열에 남긴다
`reduce()` 여러 값을 하나의 결과로 누적한다

## 8. 헷갈리기 쉬운 3개

### `map()` ↔ `filter()`

> **판별 질문:** 항목 개수를 유지하며 수정하는가, 아니면 특정 항목을
> 제거하는가?

### `find()` ↔ `filter()`

> **판별 질문:** 결과로 상품 하나가 필요한가, 여러 항목을 담은 배열이
> 필요한가?

### `setCart()` ↔ `localStorage`

> **판별 질문:** 지금 화면의 state를 바꾸려는가, 새로고침 후에도
> 데이터를 남기려는가?

## 9. 오늘 한 줄 요약

> **장바구니의 `productId`로 대상을 식별하고, `map/filter`로 새로운
> cart를 만들며, `setCart/localStorage`로 상태를 동기화하고, `reduce`로
> 총액을 계산하는 흐름을 학습했다.**

> **팁**
>
> 다음 학습 시작 전에 이 한 줄을 보지 않고 직접 설명할 수 있다면 오늘
> 핵심 흐름을 제대로 이해한 것이다.
