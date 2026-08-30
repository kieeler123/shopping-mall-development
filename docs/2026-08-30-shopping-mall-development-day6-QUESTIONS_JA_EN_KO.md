# Day 6 총정리 문제 / 総復習問題 / Comprehensive Review Questions

> **사용법:** 이 파일에는 문제만 있습니다. GENERAL과 정답 파일을 보지
> 않고 먼저 풀어보세요.

[📖 GENERAL 총정리 보기](2026-08-30-shopping-mall-development-day6-GENERAL_JA_EN_KO.md)  
[✅ 정답·해설 보기](2026-08-30-shopping-mall-development-day6-ANSWERS_JA_EN_KO.md)

---

# 日本語

## 問題 1 --- 型と値

次のコードの空欄に最も適切なものを選んでください。

```ts
const order: Order = {
  items: ______,
};
```

1.  `CartItem[]`
2.  `cart`
3.  `Order[]`
4.  `"cart"`

## 問題 2 --- `Order` と `Order[]`

複数の完了済み注文を表す型として正しいものはどれですか？

1.  `Order`
2.  `CartItem`
3.  `Order[]`
4.  `CartItem[]`

## 問題 3 --- localStorage

`localStorage.getItem("orders")` で取得した JSON 文字列を JavaScript
の値に戻すものはどれですか？

1.  `JSON.stringify()`
2.  `JSON.parse()`
3.  `toISOString()`
4.  `toLocaleString()`

## 問題 4 --- 保存

`updatedOrders` を localStorage
に保存するコードとして適切なものはどれですか？

1.  `localStorage.setItem("orders", updatedOrders)`
2.  `localStorage.setItem("orders", JSON.parse(updatedOrders))`
3.  `localStorage.setItem("orders", JSON.stringify(updatedOrders))`
4.  `localStorage.getItem("orders", updatedOrders)`

## 問題 5 --- cart と orders

注文が正常に保存された後の処理として最も適切なものはどれですか？

1.  `cart` と `orders` の両方を削除する
2.  `orders` だけ削除する
3.  `cart` だけ削除し、`orders` は維持する
4.  何も保存しない

## 問題 6 --- React state

`/orders` ページで `orders` を state にする主な理由は何ですか？

1.  localStorage は state しか保存できないから
2.  注文データを画面に表示し、変更をレンダリングに反映するため
3.  TypeScript が必ず要求するから
4.  `JSON.parse()` が state でしか動かないから

## 問題 7 --- loading

`orders = []` だけでは区別しにくい2つの状態は何ですか？

1.  昇順と降順
2.  未確認と、確認済みだが注文0件
3.  `Order` と `CartItem`
4.  JSON と JavaScript

## 問題 8 --- Truthy / Falsy

次のうち truthy なのはどれですか？

1.  `0`
2.  `""`
3.  `null`
4.  `[]`

## 問題 9 --- 配列の mutation

元の配列を直接変更する組み合わせはどれですか？

1.  `toReversed()` と `toSorted()`
2.  `reverse()` と `sort()`
3.  `map()` と `filter()`
4.  `slice()` と `toSorted()`

## 問題 10 --- 比較関数

数値を昇順に並べる比較関数はどれですか？

1.  `(a, b) => b - a`
2.  `(a, b) => a + b`
3.  `(a, b) => a - b`
4.  `(a, b) => 0`

## 問題 11 --- 比較関数の意味

比較関数が正の値を返したとき、基本的にどちらが前に来ますか？

1.  `a`
2.  `b`
3.  常に同じ
4.  配列が削除される

## 問題 12 --- 最新注文

注文を `createdAt` 基準で最新順にするコードの空欄を埋めてください。

```ts
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return __________;
});
```

## 問題 13 --- コード読解

次のコードが元の `orders` state を直接変更しない理由を説明してください。

```ts
[...orders].reverse();
```

## 問題 14 --- 条件付きレンダリング

次のコードで `order && (...)` が表している意味を説明してください。

```tsx
{
  order && <section>注文情報</section>;
}
```

## 問題 15 --- 実践

注文履歴ページに必要な3つの UI 状態を答えてください。

---

# English

## Question 1 --- Type vs Value

Choose the correct value for `items`.

```ts
const order: Order = {
  items: ______,
};
```

1.  `CartItem[]`
2.  `cart`
3.  `Order[]`
4.  `"cart"`

## Question 2 --- `Order` vs `Order[]`

Which type represents multiple completed orders?

1.  `Order`
2.  `CartItem`
3.  `Order[]`
4.  `CartItem[]`

## Question 3 --- localStorage

Which operation converts a JSON string read from localStorage back into
a JavaScript value?

1.  `JSON.stringify()`
2.  `JSON.parse()`
3.  `toISOString()`
4.  `toLocaleString()`

## Question 4 --- Saving

Which code correctly stores `updatedOrders` in localStorage?

1.  `localStorage.setItem("orders", updatedOrders)`
2.  `localStorage.setItem("orders", JSON.parse(updatedOrders))`
3.  `localStorage.setItem("orders", JSON.stringify(updatedOrders))`
4.  `localStorage.getItem("orders", updatedOrders)`

## Question 5 --- cart vs orders

After an order is successfully saved, what should happen?

1.  Delete both `cart` and `orders`
2.  Delete only `orders`
3.  Delete only `cart` and preserve `orders`
4.  Save nothing

## Question 6 --- React State

Why is `orders` useful as state on `/orders`?

1.  localStorage only stores state
2.  It is rendered in the UI and changes should participate in rendering
3.  TypeScript requires it
4.  `JSON.parse()` only works with state

## Question 7 --- Loading

Which two states are difficult to distinguish with only `orders = []`?

1.  Ascending and descending
2.  Not checked yet vs checked and zero orders
3.  `Order` and `CartItem`
4.  JSON and JavaScript

## Question 8 --- Truthy / Falsy

Which value is truthy?

1.  `0`
2.  `""`
3.  `null`
4.  `[]`

## Question 9 --- Mutation

Which pair mutates the original array?

1.  `toReversed()` and `toSorted()`
2.  `reverse()` and `sort()`
3.  `map()` and `filter()`
4.  `slice()` and `toSorted()`

## Question 10 --- Comparator

Which comparator sorts numbers ascending?

1.  `(a, b) => b - a`
2.  `(a, b) => a + b`
3.  `(a, b) => a - b`
4.  `(a, b) => 0`

## Question 11 --- Comparator Result

If the comparator returns a positive value, which element generally
comes first?

1.  `a`
2.  `b`
3.  They are always identical
4.  The array is deleted

## Question 12 --- Newest Order

Fill in the blank to sort by `createdAt` newest first.

```ts
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return __________;
});
```

## Question 13 --- Code Reading

Explain why this does not directly mutate the original `orders` state
array.

```ts
[...orders].reverse();
```

## Question 14 --- Conditional Rendering

Explain what `order && (...)` means.

```tsx
{
  order && <section>Order information</section>;
}
```

## Question 15 --- Practice

Name the three UI states needed by the order-history page.

---

# 한국어

## 문제 1 --- 타입과 값

다음 코드의 빈칸에 가장 적절한 값을 고르세요.

```ts
const order: Order = {
  items: ______,
};
```

1.  `CartItem[]`
2.  `cart`
3.  `Order[]`
4.  `"cart"`

## 문제 2 --- `Order`와 `Order[]`

여러 건의 완료된 주문을 나타내는 타입은 무엇인가요?

1.  `Order`
2.  `CartItem`
3.  `Order[]`
4.  `CartItem[]`

## 문제 3 --- localStorage

localStorage에서 읽은 JSON 문자열을 JavaScript 값으로 되돌리는 것은
무엇인가요?

1.  `JSON.stringify()`
2.  `JSON.parse()`
3.  `toISOString()`
4.  `toLocaleString()`

## 문제 4 --- 저장

`updatedOrders`를 localStorage에 올바르게 저장하는 코드는 무엇인가요?

1.  `localStorage.setItem("orders", updatedOrders)`
2.  `localStorage.setItem("orders", JSON.parse(updatedOrders))`
3.  `localStorage.setItem("orders", JSON.stringify(updatedOrders))`
4.  `localStorage.getItem("orders", updatedOrders)`

## 문제 5 --- cart와 orders

주문 저장에 성공한 뒤 가장 적절한 처리는 무엇인가요?

1.  `cart`와 `orders` 모두 삭제
2.  `orders`만 삭제
3.  `cart`만 삭제하고 `orders`는 유지
4.  아무것도 저장하지 않음

## 문제 6 --- React state

`/orders` 페이지에서 `orders`를 state로 사용하는 주된 이유는 무엇인가요?

1.  localStorage는 state만 저장할 수 있어서
2.  주문 데이터를 화면에 표시하고 변경을 렌더링에 반영하기 위해
3.  TypeScript가 반드시 요구해서
4.  `JSON.parse()`가 state에서만 동작해서

## 문제 7 --- loading

`orders = []`만으로 구별하기 어려운 두 상태는 무엇인가요?

1.  오름차순과 내림차순
2.  아직 확인 전과 확인했지만 주문 0건
3.  `Order`와 `CartItem`
4.  JSON과 JavaScript

## 문제 8 --- Truthy / Falsy

다음 중 truthy인 값은 무엇인가요?

1.  `0`
2.  `""`
3.  `null`
4.  `[]`

## 문제 9 --- 배열 mutation

원본 배열을 직접 변경하는 메서드 조합은 무엇인가요?

1.  `toReversed()`와 `toSorted()`
2.  `reverse()`와 `sort()`
3.  `map()`과 `filter()`
4.  `slice()`와 `toSorted()`

## 문제 10 --- 비교 함수

숫자를 오름차순으로 정렬하는 비교 함수는 무엇인가요?

1.  `(a, b) => b - a`
2.  `(a, b) => a + b`
3.  `(a, b) => a - b`
4.  `(a, b) => 0`

## 문제 11 --- 비교 함수 반환값

비교 함수가 양수를 반환하면 일반적으로 어느 요소가 앞으로 오나요?

1.  `a`
2.  `b`
3.  항상 동일
4.  배열이 삭제됨

## 문제 12 --- 최신 주문

`createdAt` 기준 최신 주문순으로 정렬하도록 빈칸을 채우세요.

```ts
orders.toSorted((a, b) => {
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  return __________;
});
```

## 문제 13 --- 코드 해석

다음 코드가 원래 `orders` state 배열을 직접 변경하지 않는 이유를
설명하세요.

```ts
[...orders].reverse();
```

## 문제 14 --- 조건부 렌더링

다음 코드에서 `order && (...)`가 의미하는 것을 설명하세요.

```tsx
{
  order && <section>주문 정보</section>;
}
```

## 문제 15 --- 실전

주문 내역 페이지에서 구분해야 하는 3가지 UI 상태를 적으세요.

---

## 복습 체크

- [ ] `Order`와 `Order[]`를 구별할 수 있다.
- [ ] 타입과 실제 값을 구별할 수 있다.
- [ ] localStorage의 읽기/쓰기 흐름을 설명할 수 있다.
- [ ] `cart`와 `orders`의 역할 차이를 설명할 수 있다.
- [ ] state와 일반 변수의 차이를 설명할 수 있다.
- [ ] Truthy/Falsy를 조건부 렌더링과 연결할 수 있다.
- [ ] mutation과 immutability를 설명할 수 있다.
- [ ] 비교 함수의 음수/0/양수 의미를 설명할 수 있다.
- [ ] `createdAt`을 기준으로 최신 주문순을 만들 수 있다.
