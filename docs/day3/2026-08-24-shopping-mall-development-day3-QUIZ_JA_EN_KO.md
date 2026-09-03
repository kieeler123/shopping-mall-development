# Shopping Mall Day 3 --- UNIVERSAL 問題 / Quiz / 문제

[📖 GENERAL](2026-08-24-shopping-mall-development-day3-GENERAL_JA_EN_KO.md)\
[✅ 正解・Answers・정답 해설](2026-08-24-shopping-mall-development-day3-ANSWER_JA_EN_KO.md)

> **学習ルール / Study Rule / 학습 규칙**
>
> GENERALを見ずに解く / Solve without GENERAL / GENERAL을 보지 않고 풀기

---

# 日本語

> **Day 3学習境界:** 今日の実学習はDay 3の仕上げ・深化まで。`+ / - / 削除 / 合計` の実装開始からDay 4とする。 --- 問題

## 学習範囲

ID ポイント 学習タイプ

---

expr01 `find()` 商品検索
expr02 `map()` 不変更新・数量変更
expr03 `{ ...item }` オブジェクト更新
expr04 `filter()` 商品削除
expr05 `reduce()` 合計計算
expr06 `setCart + localStorage` state・永続化

<a id="jp-problem-01"></a>

### 問題 1 特定の`productId`に一致する商品を**1つ**探したい。最も適切なメソッドはどれか。

1.  `map()`
2.  `find()`
3.  `filter()`
4.  `reduce()`

<a id="jp-problem-02"></a>

### 問題 2

特定商品の数量だけを変更し、他の商品を維持した**新しい配列**を作りたい。

1.  `map()`
2.  `find()`
3.  `reduce()`
4.  `JSON.parse()`

<a id="jp-problem-03"></a>

### 問題 3 次の

`{ ...item }` の役割として最も適切なのはどれか。

```ts
{ ...item, quantity: item.quantity + 1 }
```

1.  itemを削除する
2.  既存プロパティを引き継ぐ
3.  配列をJSON文字列にする
4.  localStorageを削除する

<a id="jp-problem-04"></a>

### 問題 4

商品をカートから除外した新しい配列を作る場合、最も適切なのはどれか。

1.  `find()`
2.  `filter()`
3.  `reduce()`
4.  `toLocaleString()`

<a id="jp-problem-05"></a>

### 問題 5 `filter()`

の条件が `true` になった要素はどうなるか。

1.  結果配列に残る
2.  必ず削除される
3.  quantityが0になる
4.  オブジェクトではなくなる

<a id="jp-problem-06"></a>

### 問題 6 次のコードで

`!==` を使う理由として最も適切なのはどれか。

```ts
cart.filter((item) => item.productId !== productId);
```

1.  削除対象と同じIDだけ残すため
2.  削除対象ではないIDを残すため
3.  quantityを増やすため
4.  productを検索するため

<a id="jp-problem-07"></a>

### 問題 7 複数商品の

`salePrice × quantity` を1つの合計値へまとめたい。

1.  `find()`
2.  `map()`
3.  `filter()`
4.  `reduce()`

<a id="jp-problem-08"></a>

### 問題 8 `reduce()`

の最後にある `0` の役割は何か。

```ts
cart.reduce((total, item) => {
  // ...
}, 0);
```

1.  productId
2.  quantityの最大値
3.  totalの初期値
4.  削除対象ID

<a id="jp-problem-09"></a>

### 問題 9 `setCart(updatedCart)`だけを実行し、localStorageを更新しなかった。最も起こり得ることはどれか。

1.  画面も保存データも必ず同時に更新される
2.  画面は更新されても、更新後に古い保存データへ戻る可能性がある
3.  TypeScriptがproductIdを削除する
4.  `map()`が自動的にlocalStorageを更新する

<a id="jp-problem-10"></a>

### 問題 10 数量を1未満にしないための考え方として適切なのはどれか。

1.  `Math.max(1, item.quantity - 1)`
2.  `Math.min(0, item.quantity - 1)`
3.  `item.quantity = -1`
4.  `JSON.parse(item.quantity)`

<a id="jp-problem-11"></a>

### 問題 11 --- コード復元

対象商品の `quantity` を1増やした新しい `updatedCart` を `map()`
で作りなさい。

<a id="jp-problem-12"></a>

### 問題 12 --- 流れ復元

次を正しい順序に並べなさい。

`localStorage更新 / updatedCart作成 / ユーザーが+をクリック / setCart(updatedCart)`

> **Tip**
>
> 答えだけでなく「なぜ他のメソッドではないのか」を1文で説明してから採点する。

---

# English

> **Day 3 boundary:** Today's work is classified as Day 3 wrap-up/deepening. Day 4 begins when the actual `+ / - / remove / total` implementation starts. --- Quiz

## Study Scope

ID Point Type

---

expr01 `find()` lookup
expr02 `map()` immutable quantity update
expr03 `{ ...item }` object update
expr04 `filter()` removal
expr05 `reduce()` total calculation
expr06 `setCart + localStorage` state and persistence

### Question 1

Which method is best for finding **one** product matching a `productId`?

1.  `map()`
2.  `find()`
3.  `filter()`
4.  `reduce()`

### Question 2

Which method is best for changing one item's quantity while creating a
new array?

1.  `map()`
2.  `find()`
3.  `reduce()`
4.  `JSON.parse()`

### Question 3

What is the main role of `{ ...item }` here?

```ts
{ ...item, quantity: item.quantity + 1 }
```

1.  Delete the item
2.  Preserve existing properties
3.  Convert the array to JSON
4.  Delete localStorage

### Question 4

Which method is best for creating a new cart array without a target
product?

1.  `find()`
2.  `filter()`
3.  `reduce()`
4.  `toLocaleString()`

### Question 5

If a `filter()` callback returns `true`, what happens to that element?

1.  It remains in the result
2.  It is always deleted
3.  Its quantity becomes zero
4.  It stops being an object

### Question 6

Why is `!==` used here?

```ts
cart.filter((item) => item.productId !== productId);
```

1.  Keep only the target ID
2.  Keep IDs other than the target
3.  Increase quantity
4.  Find product data

### Question 7

Which method is best for combining all `salePrice × quantity` values
into one total?

1.  `find()`
2.  `map()`
3.  `filter()`
4.  `reduce()`

### Question 8

What is the role of `0` here?

```ts
cart.reduce((total, item) => {
  // ...
}, 0);
```

1.  productId
2.  maximum quantity
3.  initial accumulator value
4.  removal ID

### Question 9

What can happen if only `setCart(updatedCart)` is called without
updating localStorage?

1.  UI and persistence always update together
2.  UI may update, but a refresh may restore old persisted data
3.  TypeScript deletes productId
4.  `map()` updates localStorage automatically

### Question 10

Which expression can enforce a minimum quantity of 1?

1.  `Math.max(1, item.quantity - 1)`
2.  `Math.min(0, item.quantity - 1)`
3.  `item.quantity = -1`
4.  `JSON.parse(item.quantity)`

### Question 11 --- Code Reconstruction

Use `map()` to create `updatedCart` with the target product's quantity
increased by 1.

### Question 12 --- Flow Reconstruction

Put these in order:

`update localStorage / create updatedCart / user clicks + / setCart(updatedCart)`

> **Tip**
>
> Before checking answers, explain what shape of result each method
> produces.

---

# 한국어

> **Day 3 학습 경계:** 오늘 실제 학습은 Day 3 마무리·심화까지로 분류한다. `+ / - / 삭제 / 총액` 기능을 실제 구현하기 시작하는 시점부터 Day 4로 본다. --- 문제

## 빠른 학습 범위

ID 핵심 학습 유형

---

expr01 `find()` 상품 찾기
expr02 `map()` 불변 업데이트·수량 변경
expr03 `{ ...item }` 객체 일부 수정
expr04 `filter()` 상품 삭제
expr05 `reduce()` 총액 계산
expr06 `setCart + localStorage` state·영속성

### 문제 1

특정 `productId`와 일치하는 상품을 **하나** 찾으려고 한다. 가장 적절한
메서드는?

1.  `map()`
2.  `find()`
3.  `filter()`
4.  `reduce()`

### 문제 2

특정 상품의 수량만 변경하고 나머지는 유지한 **새 배열**을 만들려고 한다.

1.  `map()`
2.  `find()`
3.  `reduce()`
4.  `JSON.parse()`

### 문제 3

다음 코드에서 `{ ...item }`의 주된 역할은?

```ts
{ ...item, quantity: item.quantity + 1 }
```

1.  item 삭제
2.  기존 속성 유지
3.  배열을 JSON 문자열로 변환
4.  localStorage 삭제

### 문제 4

특정 상품을 제외한 새로운 cart 배열을 만들 때 가장 적절한 메서드는?

1.  `find()`
2.  `filter()`
3.  `reduce()`
4.  `toLocaleString()`

### 문제 5

`filter()`의 조건이 `true`가 된 요소는 어떻게 되는가?

1.  결과 배열에 남는다
2.  무조건 삭제된다
3.  quantity가 0이 된다
4.  객체가 아니게 된다

### 문제 6

다음 코드에서 `!==`를 사용하는 이유는?

```ts
cart.filter((item) => item.productId !== productId);
```

1.  삭제 대상 ID만 남기려고
2.  삭제 대상이 아닌 ID만 남기려고
3.  quantity를 증가시키려고
4.  상품 데이터를 찾으려고

### 문제 7

여러 상품의 `salePrice × quantity`를 하나의 총액으로 합칠 때 가장 적절한
메서드는?

1.  `find()`
2.  `map()`
3.  `filter()`
4.  `reduce()`

### 문제 8

다음 `reduce()` 마지막의 `0`은 무엇인가?

```ts
cart.reduce((total, item) => {
  // ...
}, 0);
```

1.  productId
2.  quantity 최대값
3.  total의 초기값
4.  삭제 대상 ID

### 문제 9

`setCart(updatedCart)`만 실행하고 localStorage를 갱신하지 않았다. 발생할
수 있는 현상은?

1.  화면과 저장 데이터가 항상 함께 바뀐다
2.  화면은 바뀌지만 새로고침 후 이전 저장 데이터로 돌아갈 수 있다
3.  TypeScript가 productId를 삭제한다
4.  `map()`이 localStorage를 자동 갱신한다

### 문제 10

수량이 1 아래로 내려가지 않게 하는 코드로 적절한 것은?

1.  `Math.max(1, item.quantity - 1)`
2.  `Math.min(0, item.quantity - 1)`
3.  `item.quantity = -1`
4.  `JSON.parse(item.quantity)`

### 문제 11 --- 코드 복원

`map()`을 이용해 대상 상품의 `quantity`를 1 증가시킨 `updatedCart`를
작성하시오.

### 문제 12 --- 흐름 복원

다음을 올바른 순서로 배열하시오.

`localStorage 업데이트 / updatedCart 생성 / 사용자가 + 클릭 / setCart(updatedCart)`

## 복습 체크

- [ ] `find()`와 `filter()`의 결과 차이를 설명할 수 있다.
- [ ] `map()`이 왜 수량 변경에 적합한지 설명할 수 있다.
- [ ] `{ ...item }`의 역할을 설명할 수 있다.
- [ ] `filter()`의 `true = 남김`을 설명할 수 있다.
- [ ] `reduce()`의 초기값과 누적값을 설명할 수 있다.
- [ ] state와 localStorage의 역할 차이를 설명할 수 있다.

> **팁**
>
> 확신 없이 맞힌 문제는 정답이어도 `△`로 표시하고 해설에서 다시
> 확인한다.
